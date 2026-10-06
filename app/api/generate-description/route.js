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
    const langNames = { es: '🇪🇸 Español', en: '🇧 English', fr: '🇷 Français' };

    let prompt = '';
    
    if (presetText && presetText.trim().length > 10) {
      // MODO PRESET: Análisis gramatical + sustitución inteligente
      prompt = `Eres un editor profesional de anuncios de segunda mano. Tu tarea es EDITAR un preset aplicando cambios con concordancia gramatical correcta.

ANÁLISIS GRAMATICAL OBLIGATORIO:
1. Identifica el género del producto (gafas = femenino, pantalones = masculino, etc.)
2. Ajusta los adjetivos de color al género correcto (gafas rojas, no "gafas rojos")
3. Mantén la concordancia en plural/singular (gafas rojas, no "gafa roja")

REGLAS CRÍTICAS:
1. TÍTULO: Debe ser [Producto] [Marca] [Modelo] [Color nuevo] [Estado]. NUNCA uses "Producto en color X".
   Ejemplo correcto: "Gafas Oakley Speedcraft S3 Rojas Nuevas"
   Ejemplo incorrecto: "Producto en color rojo"
2. COLOR: Si el cambio dice "en rojo", reemplaza TODAS las menciones de color manteniendo concordancia:
   - "azules y transparentes" → "rojas y transparentes" (gafas = femenino)
   - "1 plateada" → "1 roja" (lente = femenino)
3. MANTÉN toda la estructura del preset: viñetas, formato, separadores, todos los idiomas.
4. Si no hay cambios de color, mantén el color original del preset.

EJEMPLO COMPLETO:
PRESET: "Gafas Oakley Speedcraft S3 azules y transparentes. NUEVAS, sin uso. ✓ Modelo Speedcraft S3 ✓ Azules y transparentes ✓ Incluye 1 plateada efecto espejo"
CAMBIO: "en rojo"
RESULTADO CORRECTO:
- Título: "Gafas Oakley Speedcraft S3 Rojas Nuevas"
- Descripción: "Gafas Oakley Speedcraft S3 rojas y transparentes. NUEVAS, sin uso. ✓ Modelo Speedcraft S3 ✓ Rojas y transparentes ✓ Incluye 1 roja efecto espejo"

PRESET A EDITAR:
${presetText}

CAMBIOS A APLICAR:
- ${shortDesc || 'Ninguno, mantener todo igual'}
- Precio: ${price || 'Mantener el actual'}
- Estado: ${condition || 'Mantener el actual'}

Devuelve SOLO un JSON:
{
  "title": "título específico con marca, modelo, color y estado (español, máx 60 chars)",
  "description": "preset completo con cambios aplicados manteniendo concordancia gramatical en todos los idiomas"
}`;
    } else {
      // MODO SIN PRESET: Generar desde cero
      const langList = langs.map(l => langNames[l] || l).join(' / ');
      prompt = `Eres un experto en ventas de segunda mano. Genera un anuncio profesional.

REGLAS:
1. title: Español, máx 60 caracteres. [Producto] [Marca] [Modelo] [Color] [Estado]. SIN "Producto en color X".
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
              temperature: 0.1,
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
        console.log('Respuesta:', content.substring(0, 1000));

        const parsed = extractJson(content);
        if (parsed && parsed.title && parsed.description) {
          // VALIDACIÓN 1: El título NO debe ser genérico
          if (parsed.title.toLowerCase().includes('producto en color') || 
              parsed.title.toLowerCase().includes('producto en')) {
            console.log('⚠️ Título genérico, rechazando');
            continue;
          }
          
          // VALIDACIÓN 2: El título debe tener al menos 3 palabras específicas
          const titleWords = parsed.title.split(' ').filter(w => w.length > 2);
          if (titleWords.length < 3) {
            console.log('️ Título demasiado corto o genérico, rechazando');
            continue;
          }
          
          // VALIDACIÓN 3: No debe haber errores gramaticales obvios como "rojoes"
          if (parsed.description.match(/rojoes|azuleses|negroses/i)) {
            console.log('⚠️ Errores gramaticales detectados, rechazando');
            continue;
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

    // FALLBACK LOCAL: Aplicar cambios con concordancia
    console.log('⚠️ IA saturada. Aplicando cambios manualmente con concordancia.');
    
    let fallbackDesc = presetText || '';
    let fallbackTitle = '';
    
    if (shortDesc && fallbackDesc) {
      // Detectar el producto y su género
      const productMatch = fallbackDesc.match(/(gafas|pantalones|camiseta|zapatillas|sudadera|chaqueta)/i);
      const isFeminine = productMatch && ['gafas', 'camiseta', 'zapatillas', 'sudadera', 'chaqueta'].includes(productMatch[0].toLowerCase());
      
      // Detectar color nuevo
      const colorMatch = shortDesc.match(/(rojo|azul|negro|blanco|verde|camaleón|transparente|ahumado)/i);
      
      if (colorMatch && productMatch) {
        const newColor = colorMatch[0];
        // Ajustar concordancia
        const colorAdjective = isFeminine ? 
          (newColor === 'rojo' ? 'rojas' : newColor === 'azul' ? 'azules' : newColor + 's') : 
          newColor;
        
        // Reemplazar colores manteniendo concordancia
        const oldColors = ['azules', 'azul', 'rojas', 'rojo', 'negras', 'negro', 'transparentes', 'transparente'];
        oldColors.forEach(c => {
          const regex = new RegExp(c, 'gi');
          fallbackDesc = fallbackDesc.replace(regex, colorAdjective);
        });
        
        // Generar título específico
        const brandMatch = fallbackDesc.match(/(Oakley|Nike|Adidas|Gucci|Chrome Hearts)/i);
        const modelMatch = fallbackDesc.match(/(Speedcraft|Air Max|Stan Smith|S3)/i);
        const stateMatch = fallbackDesc.match(/(NUEVAS|NUEVO|MUY BUENO|BUENO)/i);
        
        fallbackTitle = `${productMatch[0]} ${brandMatch ? brandMatch[0] : ''} ${modelMatch ? modelMatch[0] : ''} ${colorAdjective} ${stateMatch ? stateMatch[0] : ''}`.trim().substring(0, 60);
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