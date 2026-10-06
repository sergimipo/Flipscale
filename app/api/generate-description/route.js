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

    const langs = Array.isArray(languages) && languages.length > 0 ? languages : ['es', 'en', 'fr'];
    const langNames = { es: '🇪🇸 Español', en: '🇬🇧 English', fr: '🇫🇷 Français' };

    let prompt = '';
    
    if (presetText && presetText.trim().length > 10) {
      // MODO PRESET: Análisis + Sustitución
      prompt = `Eres un editor de anuncios de segunda mano. Tu tarea es EDITAR un preset aplicando cambios específicos.

PASO 1: ANALIZA el preset e identifica estos elementos:
- Marca y modelo del producto
- Color actual
- Estado (NUEVO, MUY BUENO, etc.)
- Precio actual
- Características específicas (talla, material, etc.)

PASO 2: APLICA los cambios indicando qué elementos del análisis anterior deben modificarse.

PASO 3: REESCRIBE el preset completo manteniendo TODA la estructura y formato, pero sustituyendo los elementos cambiados.

REGLAS CRÍTICAS:
1. NUNCA uses el texto de "cambios" como título. El título debe ser: [Marca] [Modelo] [Color nuevo] [Estado].
2. Si el cambio dice "en rojo", busca el color actual en el preset y reemplázalo por "rojo" en TODOS los idiomas.
3. Mantén TODAS las demás líneas del preset exactamente igual (viñetas, descripciones, formato).
4. El título debe estar en español y describir el producto REAL con los cambios aplicados.

EJEMPLO CORRECTO:
Preset: "Gafas Oakley Speedcraft S3 azules"
Cambio: "en rojo"
Resultado: "Gafas Oakley Speedcraft S3 rojas" (NO "son las mismas pero en rojo")

PRESET A EDITAR:
${presetText}

CAMBIOS A APLICAR:
- ${shortDesc || 'Ninguno'}
- Precio: ${price || 'Mantener el actual'}
- Estado: ${condition || 'Mantener el actual'}

Devuelve SOLO un JSON:
{
  "title": "título del producto con cambios aplicados (español, máx 60 chars)",
  "description": "preset completo reescrito con los cambios aplicados, manteniendo todos los idiomas y formato original"
}`;
    } else {
      // MODO SIN PRESET: Generar desde cero
      const langList = langs.map(l => langNames[l] || l).join(' / ');
      prompt = `Eres un experto en ventas de segunda mano. Genera un anuncio profesional.

REGLAS:
1. title: Español, máx 60 caracteres. Marca, modelo, color. SIN emojis.
2. description: Un string con saltos de línea (\\n) en: ${langList}.
   - Cada bloque: bandera + nombre del idioma.
   - Segunda línea: ESTADO EN MAYÚSCULAS.
   - 3-6 viñetas con ✔ describiendo el producto REAL.
   - Última línea: precio (💰 Precio: X € / 💰 Price: €X / 💰 Prix : X €).
   - Separa bloques con: ──────────

DATOS:
- Producto: ${shortDesc || 'No especificado'}
- Precio: ${price || 'No especificado'}
- Estado: ${condition || 'No especificado'}

Devuelve SOLO JSON: {"title": "...", "description": "..."}`;
    }

    const parts = [{ text: prompt }];
    if (imageBase64) {
      const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      parts.push({
        inlineData: { mimeType: "image/jpeg", data: cleanBase64 }
      });
    }

    const models = [
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash-8b',
      'gemini-2.0-flash-exp'
    ];

    for (const model of models) {
      console.log(`\n🔄 Probando: ${model}`);
      
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: parts }],
            generationConfig: { 
              temperature: 0.1, // Muy bajo para ser fiel al preset
              maxOutputTokens: 2000,
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  title: { type: "STRING" },
                  description: { type: "STRING" }
                },
                required: ["title", "description"]
              }
            }
          })
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMsg = data.error?.message || '';
          if (response.status === 404 || response.status === 429 || response.status === 503 || 
              errorMsg.includes('high demand') || errorMsg.includes('resource_exhausted')) {
            console.log(`⚠️ ${model} no disponible. Siguiente...`);
            await sleep(1500);
            continue;
          }
          throw new Error(data.error?.message || `Error HTTP ${response.status}`);
        }

        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!content) continue;

        console.log(`✅ Éxito con ${model}`);
        console.log('Respuesta:', content.substring(0, 800));

        const parsed = extractJson(content);
        if (parsed && parsed.title && parsed.description) {
          // VALIDACIÓN 1: El título NO debe ser igual al texto de cambios
          if (shortDesc && parsed.title.toLowerCase().trim() === shortDesc.toLowerCase().trim()) {
            console.log('⚠️ Título = texto de cambios, rechazando');
            continue;
          }
          
          // VALIDACIÓN 2: El título NO debe empezar con "son las mismas"
          if (parsed.title.toLowerCase().startsWith('son las mismas') || parsed.title.toLowerCase().startsWith('es el mismo')) {
            console.log('⚠️ Título genérico, rechazando');
            continue;
          }
          
          // VALIDACIÓN 3: Si hay preset, verificar que se mantuvo la estructura
          if (presetText && presetText.length > 20) {
            // Contar líneas del preset vs descripción generada
            const presetLines = presetText.split('\n').filter(l => l.trim().length > 0).length;
            const descLines = parsed.description.split('\n').filter(l => l.trim().length > 0).length;
            
            console.log(`Líneas preset: ${presetLines}, Líneas descripción: ${descLines}`);
            
            // Si la descripción tiene menos del 50% de líneas que el preset, la IA resumió demasiado
            if (descLines < presetLines * 0.5) {
              console.log('⚠️ Descripción demasiado corta, rechazando');
              continue;
            }
          }
          
          return Response.json({
            title: String(parsed.title).trim().substring(0, 60),
            description: String(parsed.description).trim()
          });
        }

      } catch (error) {
        if (error.message.includes('API key not valid') || error.message.includes('not found')) {
          throw error;
        }
        console.log(`⚠️ Error con ${model}:`, error.message);
        continue;
      }
    }

    // FALLBACK LOCAL: Aplicar cambios manualmente al preset
    console.log('️ IA saturada. Aplicando cambios manualmente.');
    
    let fallbackDesc = presetText || '';
    let fallbackTitle = '';
    
    if (shortDesc && fallbackDesc) {
      // Detectar qué tipo de cambio es
      const colorMatch = shortDesc.match(/(rojo|azul|negro|blanco|verde|camaleón|transparente|ahumado|dorado|plateado)/i);
      const sizeMatch = shortDesc.match(/(talla\s+[smxl]|size\s+[smxl])/i);
      
      if (colorMatch) {
        // Reemplazar colores en el preset
        const colors = ['azul', 'azules', 'rojo', 'rojos', 'negro', 'negros', 'blanco', 'blancos', 'transparente', 'transparentes', 'ahumado', 'ahumados', 'camaleón'];
        const newColor = colorMatch[0];
        colors.forEach(c => {
          const regex = new RegExp(c, 'gi');
          fallbackDesc = fallbackDesc.replace(regex, newColor);
        });
        fallbackTitle = `Producto en color ${newColor}`;
      }
    }
    
    if (price && fallbackDesc) {
      fallbackDesc = fallbackDesc.replace(/(\d+[.,]?\d*)\s*€/g, `${price} €`);
    }
    
    if (condition && fallbackDesc) {
      const oldStates = ['NUEVO CON ETIQUETAS', 'NUEVO SIN ETIQUETAS', 'MUY BUENO', 'BUENO', 'SATISFACTORIO', 'NUEVAS', 'NUEVOS', 'NUEVO'];
      oldStates.forEach(s => {
        fallbackDesc = fallbackDesc.replace(new RegExp(s, 'gi'), condition.toUpperCase());
      });
    }
    
    if (!fallbackTitle) {
      fallbackTitle = shortDesc ? shortDesc.substring(0, 60) : (presetText ? presetText.split('\n')[0].substring(0, 60) : 'Producto en venta');
    }

    return Response.json({
      title: fallbackTitle,
      description: fallbackDesc || 'Sin descripción disponible',
      _warning: "Generado con plantilla local"
    });

  } catch (error) {
    console.error('ERROR GLOBAL:', error);
    return Response.json({ error: `Error de IA: ${error.message}` }, { status: 500 });
  }
}