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

// Función para corregir concordancia gramatical básica
function fixGenderAgreement(text, product, newColor) {
  // Detectar si el producto es femenino
  const feminineProducts = ['gafas', 'camiseta', 'zapatillas', 'sudadera', 'chaqueta', 'falda', 'bolsa', 'mochila'];
  const isFeminine = feminineProducts.some(p => product.toLowerCase().includes(p));
  
  // Mapa de colores con concordancia
  const colorMap = {
    'rojo': isFeminine ? 'rojas' : 'rojos',
    'azul': isFeminine ? 'azules' : 'azules',
    'negro': isFeminine ? 'negras' : 'negros',
    'blanco': isFeminine ? 'blancas' : 'blancos',
    'verde': isFeminine ? 'verdes' : 'verdes',
    'transparente': isFeminine ? 'transparentes' : 'transparentes',
    'ahumado': isFeminine ? 'ahumadas' : 'ahumados',
    'camaleón': 'camaleón'
  };
  
  const correctColor = colorMap[newColor.toLowerCase()] || newColor;
  
  // Reemplazar colores antiguos por el nuevo con concordancia
  const oldColors = ['azules', 'azul', 'rojas', 'rojos', 'rojo', 'negras', 'negros', 'negro', 'blancas', 'blancos', 'blanco', 'transparentes', 'transparente', 'ahumadas', 'ahumados', 'ahumado'];
  
  let result = text;
  oldColors.forEach(oldColor => {
    const regex = new RegExp(`\\b${oldColor}\\b`, 'gi');
    result = result.replace(regex, correctColor);
  });
  
  return result;
}

// Función para generar un título específico
function generateSpecificTitle(presetText, newColor, condition) {
  // Extraer marca y modelo del preset
  const brandMatch = presetText.match(/\b(Oakley|Nike|Adidas|Gucci|Chrome Hearts|Ray-Ban|Puma|Reebok)\b/i);
  const modelMatch = presetText.match(/\b(Speedcraft|Air Max|Stan Smith|S3|501|Ultraboost)\b/i);
  const productMatch = presetText.match(/\b(gafas|pantalones|camiseta|zapatillas|sudadera|chaqueta|falda|bolsa)\b/i);
  
  const product = productMatch ? productMatch[0] : 'Producto';
  const brand = brandMatch ? brandMatch[0] : '';
  const model = modelMatch ? modelMatch[0] : '';
  const color = newColor || '';
  const state = condition ? condition.toUpperCase() : '';
  
  // Construir título
  const parts = [product, brand, model, color, state].filter(p => p);
  return parts.join(' ').substring(0, 60);
}

export async function POST(req) {
  try {
    const { imageBase64, shortDesc, price, condition, languages, presetText } = await req.json();
    
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return Response.json({ error: 'Falta GEMINI_API_KEY en Vercel' }, { status: 500 });
    }

    const langs = Array.isArray(languages) && languages.length > 0 ? languages : ['es', 'en', 'fr'];
    const langNames = { es: '🇸 Español', en: ' English', fr: '🇷 Français' };

    let prompt = '';
    
    if (presetText && presetText.trim().length > 10) {
      // MODO PRESET: Simple y directo
      prompt = `Eres un editor de anuncios de segunda mano. Reescribe el siguiente preset aplicando los cambios indicados.

REGLAS:
1. Mantén TODA la estructura y formato del preset original.
2. Solo modifica lo que te piden en los cambios.
3. Si te piden cambiar el color, reemplaza TODAS las menciones del color antiguo por el nuevo.
4. El título debe describir el producto con los cambios aplicados (marca, modelo, color nuevo, estado).

PRESET ORIGINAL:
${presetText}

CAMBIOS:
- ${shortDesc || 'Ninguno'}
- Precio: ${price || 'Mantener'}
- Estado: ${condition || 'Mantener'}

Devuelve SOLO JSON:
{
  "title": "título del producto con cambios (español, máx 60 chars)",
  "description": "preset reescrito con los cambios aplicados"
}`;
    } else {
      // MODO SIN PRESET
      const langList = langs.map(l => langNames[l] || l).join(' / ');
      prompt = `Genera un anuncio de segunda mano profesional.

REGLAS:
1. title: Español, máx 60 chars. Marca, modelo, color, estado.
2. description: String con saltos de línea en: ${langList}.
   - Bloques por idioma separados por ──────────
   - Estado en MAYÚSCULAS
   - 3-6 viñetas con ✔
   - Precio al final

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
      'gemini-1.5-flash-8b'
    ];

    for (const model of models) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: parts }],
            generationConfig: { 
              temperature: 0.2,
              maxOutputTokens: 2000,
              responseMimeType: "application/json"
            }
          })
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 429 || response.status === 503) {
            await sleep(1500);
            continue;
          }
          throw new Error(data.error?.message || `Error ${response.status}`);
        }

        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!content) continue;

        const parsed = extractJson(content);
        if (parsed && parsed.title && parsed.description) {
          // POST-PROCESAMIENTO: Corregir título y concordancia
          let finalTitle = parsed.title;
          let finalDesc = parsed.description;
          
          // Si hay preset y cambios de color, aplicar correcciones
          if (presetText && shortDesc) {
            const colorMatch = shortDesc.match(/(rojo|azul|negro|blanco|verde|camaleón|transparente|ahumado)/i);
            const productMatch = presetText.match(/\b(gafas|pantalones|camiseta|zapatillas|sudadera|chaqueta)\b/i);
            
            if (colorMatch && productMatch) {
              // Corregir concordancia en la descripción
              finalDesc = fixGenderAgreement(finalDesc, productMatch[0], colorMatch[0]);
              
              // Generar título específico si el actual es genérico
              if (finalTitle.toLowerCase().includes('producto') || finalTitle.length < 20) {
                finalTitle = generateSpecificTitle(presetText, colorMatch[0], condition);
              }
            }
          }
          
          // Actualizar precio si cambió
          if (price) {
            finalDesc = finalDesc.replace(/(\d+[.,]?\d*)\s*€/g, `${price} €`);
          }
          
          // Actualizar estado si cambió
          if (condition) {
            const oldStates = ['NUEVO CON ETIQUETAS', 'NUEVO SIN ETIQUETAS', 'MUY BUENO', 'BUENO', 'SATISFACTORIO', 'NUEVAS', 'NUEVOS', 'NUEVO'];
            oldStates.forEach(s => {
              finalDesc = finalDesc.replace(new RegExp(s, 'gi'), condition.toUpperCase());
            });
          }
          
          return Response.json({
            title: finalTitle.substring(0, 60),
            description: finalDesc
          });
        }

      } catch (error) {
        console.log(`Error con ${model}:`, error.message);
        continue;
      }
    }

    // FALLBACK: Aplicar cambios manualmente al preset
    let fallbackDesc = presetText || '';
    let fallbackTitle = '';
    
    if (shortDesc && fallbackDesc) {
      const colorMatch = shortDesc.match(/(rojo|azul|negro|blanco|verde|camaleón|transparente|ahumado)/i);
      const productMatch = fallbackDesc.match(/\b(gafas|pantalones|camiseta|zapatillas|sudadera|chaqueta)\b/i);
      
      if (colorMatch && productMatch) {
        fallbackDesc = fixGenderAgreement(fallbackDesc, productMatch[0], colorMatch[0]);
        fallbackTitle = generateSpecificTitle(fallbackDesc, colorMatch[0], condition);
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
      description: fallbackDesc || 'Sin descripción',
      _warning: "Generado localmente"
    });

  } catch (error) {
    console.error('ERROR:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}