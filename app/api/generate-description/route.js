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
      // MODO PRESET: La IA debe REESCRIBIR el preset aplicando los cambios
      prompt = `Eres un editor de anuncios de segunda mano. Tienes un PRESET (plantilla) y debes EDITARLO aplicando los CAMBIOS indicados.

REGLAS CRÍTICAS:
1. MANTÉN TODAS las líneas del preset que no necesiten cambiar.
2. SOLO modifica las líneas que afecten los cambios (color, talla, modelo, etc.).
3. NUNCA añadas texto genérico como "Revisar fotos", "Envíos rápidos", "Detalles adicionales".
4. El título debe describir el producto REAL (marca, modelo, color nuevo), NO los cambios.
5. Mantén el mismo formato: separadores ──────────, viñetas ✔, estado en MAYÚSCULAS, precio al final.

EJEMPLO:
Si el preset dice "Gafas azules" y el cambio es "en camaleón", el resultado debe ser "Gafas camaleón" (no "Revisar fotos").

PRESET ORIGINAL:
${presetText}

CAMBIOS A APLICAR:
- ${shortDesc || 'Ninguno, mantener todo igual'}
- Precio: ${price || 'Mantener el del preset'}
- Estado: ${condition || 'Mantener el del preset'}

Devuelve SOLO un JSON con:
{
  "title": "título del producto con los cambios aplicados (español, máx 60 chars)",
  "description": "el preset completo reescrito con los cambios aplicados, manteniendo todos los idiomas y formato"
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
   - 3 viñetas con ✔ describiendo el producto REAL (NUNCA texto genérico como "Revisar fotos").
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
              temperature: 0.15, // Más bajo = más fiel al preset
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
        console.log('Respuesta cruda:', content.substring(0, 500));

        const parsed = extractJson(content);
        if (parsed && parsed.title && parsed.description) {
          // Validación básica: si el título es igual al texto de cambios, rechazar
          if (shortDesc && parsed.title.toLowerCase().trim() === shortDesc.toLowerCase().trim()) {
            console.log('⚠️ Título = texto de cambios, rechazando');
            continue;
          }
          
          // Si hay preset, verificar que la descripción mantiene contenido del preset
          if (presetText && presetText.length > 20) {
            // Extraer palabras clave del preset (ignorando conectores)
            const presetWords = presetText.toLowerCase().split(/\s+/).filter(w => w.length > 3 && !['para', 'con', 'las', 'los', 'una', 'uno', 'pero', 'sin', 'muy', 'bueno'].includes(w));
            const descLower = parsed.description.toLowerCase();
            const matchingWords = presetWords.filter(w => descLower.includes(w)).length;
            const matchRatio = matchingWords / presetWords.length;
            
            console.log(`Match preset: ${matchingWords}/${presetWords.length} (${(matchRatio * 100).toFixed(0)}%)`);
            
            // Si coincide menos del 30%, la IA ignoró el preset
            if (matchRatio < 0.3) {
              console.log('⚠️ La IA ignoró el preset, reintentando...');
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

    // FALLBACK LOCAL: Si todo falla, aplicar cambios manualmente al preset
    console.log('⚠️ IA saturada. Aplicando cambios manualmente al preset.');
    
    let fallbackDesc = presetText || '';
    if (shortDesc && fallbackDesc) {
      // Reemplazo simple: si el cambio menciona un color, reemplazar en el preset
      const colorMatch = shortDesc.match(/(azules?|rojas?|negras?|blancas?|verdes?|camaleón|transparentes?|ahumadas?)/i);
      if (colorMatch) {
        // Reemplazar la mención de color anterior por el nuevo
        const colors = ['azules', 'azul', 'rojas', 'rojo', 'negras', 'negro', 'transparentes', 'transparente', 'ahumadas', 'ahumado'];
        colors.forEach(c => {
          const regex = new RegExp(c, 'gi');
          fallbackDesc = fallbackDesc.replace(regex, colorMatch[0]);
        });
      }
    }
    
    // Actualizar precio si cambió
    if (price && fallbackDesc) {
      fallbackDesc = fallbackDesc.replace(/(\d+[.,]?\d*)\s*€/g, `${price} €`);
    }
    
    // Actualizar estado si cambió
    if (condition && fallbackDesc) {
      const oldStates = ['NUEVO CON ETIQUETAS', 'NUEVO SIN ETIQUETAS', 'MUY BUENO', 'BUENO', 'SATISFACTORIO', 'NUEVAS', 'NUEVOS'];
      oldStates.forEach(s => {
        fallbackDesc = fallbackDesc.replace(new RegExp(s, 'gi'), condition.toUpperCase());
      });
    }

    return Response.json({
      title: shortDesc ? shortDesc.substring(0, 60) : (presetText ? presetText.split('\n')[0].substring(0, 60) : 'Producto en venta'),
      description: fallbackDesc || 'Sin descripción disponible',
      _warning: "Generado con plantilla local"
    });

  } catch (error) {
    console.error('ERROR GLOBAL:', error);
    return Response.json({ error: `Error de IA: ${error.message}` }, { status: 500 });
  }
}