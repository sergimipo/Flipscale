export const maxDuration = 60;

function extractJson(text) {
  if (!text || typeof text !== 'string') return null;
  
  let clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  
  if (start !== -1 && end !== -1) {
    try {
      const parsed = JSON.parse(clean.slice(start, end + 1));
      if (parsed.title && parsed.description) return parsed;
    } catch (e) {}
  }
  
  const titleMatch = clean.match(/"title"\s*:\s*"([^"]*)"/i);
  const descMatch = clean.match(/"description"\s*:\s*"((?:[^"\\]|\\.)*)"/i);
  
  if (titleMatch && descMatch) {
    return {
      title: titleMatch[1],
      description: descMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
    };
  }
  
  return null;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST(req) {
  try {
    const { imageBase64, shortDesc, price, condition, languages, presetText } = await req.json();
    
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return Response.json({ error: 'Falta GEMINI_API_KEY en Vercel' }, { status: 500 });
    }

    const langs = Array.isArray(languages) ? languages : ['es', 'en', 'fr'];
    const langNames = { es: '🇪🇸 Español', en: '🇬🇧 English', fr: '🇫🇷 Français' };
    const langList = langs.map(l => langNames[l] || l).join(', ');

    const prompt = `Eres un experto en ventas de segunda mano.
Devuelve SOLO un objeto JSON válido, sin markdown.
Formato: {"title": "string", "description": "string"}

REGLAS:
1. title: Español, máx 60 caracteres. Incluye marca, modelo, color, talla.
2. description: Un string con saltos de línea (\\n) en: ${langList}.
   - Cada bloque empieza con su nombre (ej: 🇪🇸 Español).
   - Primera línea: ESTADO EN MAYÚSCULAS.
   - 3 viñetas con ✔.
   - Última línea: precio (ej: "💰 Precio: X €"). Omítela si no hay.
   - Separa bloques con: ────────

DATOS:
- Producto: ${shortDesc || presetText || 'No especificado'}
- Precio: ${price || 'No especificado'}
- Estado: ${condition || 'No especificado'}`;

    const parts = [{ text: prompt }];
    if (imageBase64) {
      const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      parts.push({
        inlineData: { mimeType: "image/jpeg", data: cleanBase64 }
      });
    }

    // LISTA DE MODELOS GRATUITOS ESTABLES DE GOOGLE (en orden de prioridad)
    const models = [
      'gemini-1.5-flash',       // El más estable y fiable
      'gemini-1.5-flash-8b',    // Ultrarrápido, límites muy altos
      'gemini-2.0-flash-exp'    // Experimental, pool de servidores diferente
    ];

    for (const model of models) {
      console.log(`\n🔄 Probando modelo: ${model}`);
      
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: parts }],
            generationConfig: { 
              temperature: 0.3, 
              maxOutputTokens: 1500,
              responseMimeType: "application/json"
            }
          })
        });

        const data = await response.json();

        // Si el modelo está saturado, pasamos al siguiente de la lista
        if (!response.ok) {
          const errorMsg = data.error?.message || '';
          if (errorMsg.includes('high demand') || errorMsg.includes('resource_exhausted') || response.status === 429 || response.status === 503) {
            console.log(`⚠️ ${model} está saturado. Probando el siguiente...`);
            await sleep(1000); // Pequeña pausa antes del siguiente intento
            continue;
          }
          
          // Si es otro error (ej: clave inválida), lo lanzamos
          throw new Error(data.error?.message || `Error HTTP ${response.status}`);
        }

        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!content) continue;

        console.log(`✅ Éxito con ${model}`);

        const parsed = extractJson(content);
        if (parsed && parsed.title && parsed.description) {
          return Response.json({
            title: String(parsed.title).trim(),
            description: String(parsed.description).trim()
          });
        }

      } catch (error) {
        // Si es un error de configuración (no de saturación), lo paramos
        if (error.message.includes('API key not valid') || error.message.includes('not found')) {
          throw error;
        }
        console.log(`⚠️ Error con ${model}:`, error.message);
        continue;
      }
    }

    // Si todos los modelos de Google fallan, usamos un fallback local para no dejar al usuario colgado
    console.log('⚠️ Todos los modelos de IA están saturados. Usando fallback local.');
    const fallbackDesc = langs.map(l => {
      const name = langNames[l] || l;
      const cond = condition ? condition.toUpperCase() : 'ESTADO NO ESPECIFICADO';
      const priceText = price ? (l === 'en' ? `💰 Price: €${price}` : (l === 'fr' ? `💰 Prix : ${price} €` : `💰 Precio: ${price} €`)) : '';
      return `${name}\n${cond}\n✔️ ${shortDesc || 'Producto en buen estado'}\n✔️ Revisar fotos para más detalles\n✔️ Envíos rápidos y seguros\n${priceText}`;
    }).join('\n────────\n');

    return Response.json({
      title: shortDesc ? shortDesc.substring(0, 60) : "Producto en venta",
      description: fallbackDesc,
      _warning: "Generado con plantilla local por saturación temporal de la IA"
    });

  } catch (error) {
    console.error('ERROR GLOBAL:', error);
    return Response.json({ error: `Error de IA: ${error.message}` }, { status: 500 });
  }
}