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

// VALIDACIÓN Y LIMPIEZA POST-PROCESAMIENTO
function validateAndClean(title, description, langs, langNames, condition, price) {
  let cleanTitle = String(title || '').trim();
  let cleanDesc = String(description || '').trim();
  
  // Título: máximo 60 caracteres, sin emojis
  if (cleanTitle.length > 60) {
    cleanTitle = cleanTitle.substring(0, 57) + '...';
  }
  cleanTitle = cleanTitle.replace(/[✨🔥💥]/g, '').trim();
  
  // Descripción: asegurar que tiene los separadores y viñetas correctas
  const langList = langs.map(l => langNames[l] || l);
  
  // Si no tiene separadores ────────, los añadimos entre bloques de idioma
  if (!cleanDesc.includes('──────')) {
    // Intento de reconstruir con separadores
    let parts = [];
    langList.forEach((langName, idx) => {
      // Buscar el bloque correspondiente a este idioma
      const regex = new RegExp(`${langName.replace(/[🇸🇬🇫🇷]/g, '').trim()}[\\s\\S]*?(?=────────|${langList[idx+1]?.replace(/[🇪🇸🇬🇫🇷]/g, '').trim()}|$)`, 'g');
      const match = cleanDesc.match(regex);
      if (match) {
        parts.push(match[0].trim());
      }
    });
    if (parts.length > 1) {
      cleanDesc = parts.join('\n────────\n');
    }
  }
  
  // Asegurar que hay al menos 3 viñetas ✔ por bloque de idioma
  const blocks = cleanDesc.split('────────');
  const fixedBlocks = blocks.map(block => {
    const checkmarks = (block.match(/✔/g) || []).length;
    if (checkmarks < 3) {
      // Añadir viñetas faltantes
      const extra = 3 - checkmarks;
      const extras = Array(extra).fill('✔ Detalle adicional del producto').join('\n');
      return block + '\n' + extras;
    }
    return block;
  });
  cleanDesc = fixedBlocks.join('\n────────\n');
  
  // Asegurar que el estado está en MAYÚSCULAS en cada bloque
  if (condition) {
    const condUpper = condition.toUpperCase();
    cleanDesc = cleanDesc.replace(/(NUEVO CON ETIQUETAS|NUEVO SIN ETIQUETAS|MUY BUENO|BUENO|SATISFACTORIO|ESTADO NO ESPECIFICADO)/gi, condUpper);
  }
  
  // Asegurar que el precio está al final de cada bloque
  if (price) {
    const pricePatterns = {
      'es': `💰 Precio: ${price} €`,
      'en': `💰 Price: €${price}`,
      'fr': `💰 Prix : ${price} €`
    };
    
    const fixedPriceBlocks = fixedBlocks.map((block, idx) => {
      const lang = langs[idx];
      const priceText = pricePatterns[lang] || `💰 Precio: ${price} €`;
      // Si ya tiene precio, no añadirlo
      if (block.includes('')) return block;
      return block + '\n' + priceText;
    });
    cleanDesc = fixedPriceBlocks.join('\n────────\n');
  }
  
  return { title: cleanTitle, description: cleanDesc };
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
    const langNames = { es: '🇸 Español', en: '🇧 English', fr: '🇫🇷 Français' };
    const langList = langs.map(l => langNames[l] || l).join(', ');

    // EJEMPLO DE SALIDA ESPERADA (para que Gemini sea estricto)
    const exampleOutput = `{
  "title": "Pantalones Vaqueros Levi's 501 Azules Talla M",
  "description": "🇸 Español\\nMUY BUENO\\n✔ Pantalones vaqueros clásicos Levi's 501\\n✔ Color azul medio, talla M (cintura 82cm)\\n✔ Sin desperfectos, lavado reciente\\n💰 Precio: 25 €\\n────────\\n🇬🇧 English\\nVERY GOOD\\n✔ Classic Levi's 501 jeans\\n✔ Medium blue, size M (waist 82cm)\\n✔ No flaws, recently washed\\n Price: €25\\n────────\\n🇷 Français\\nTRÈS BON ÉTAT\\n✔ Jean classique Levi's 501\\n✔ Bleu moyen, taille M (tour de taille 82cm)\\n✔ Sans défauts, lavé récemment\\n💰 Prix : 25 €"
}`;

    // PROMPT DIFERENCIADO: con preset o desde cero
    let prompt = '';
    if (presetText && presetText.trim().length > 10) {
      // MODO PRESET: usar el preset como base y aplicar cambios
      prompt = `Eres un editor experto de anuncios de segunda mano.
Tienes una DESCRIPCIÓN BASE (preset) y unos CAMBIOS a aplicar.

REGLAS ESTRICTAS:
1. Mantén la estructura, formato y estilo de la DESCRIPCIÓN BASE.
2. Aplica los CAMBIOS indicados (precio, estado, descripción adicional).
3. Si los cambios incluyen nuevo estado, actualízalo en MAYÚSCULAS en todos los idiomas.
4. Si los cambios incluyen nuevo precio, actualízalo al final de cada bloque de idioma.
5. Devuelve SOLO un JSON válido, sin markdown.

FORMATO EXACTO DE SALIDA (ejemplo):
${exampleOutput}

DESCRIPCIÓN BASE (preset):
${presetText}

CAMBIOS A APLICAR:
- Descripción adicional: ${shortDesc || 'ninguno, mantener la base'}
- Precio: ${price || 'mantener el de la base'}
- Estado: ${condition || 'mantener el de la base'}

Responde SOLO con el JSON.`;
    } else {
      // MODO DESDE CERO: generar todo nuevo
      prompt = `Eres un experto en ventas de segunda mano (Vinted/Wallapop).
Genera un anuncio profesional y limpio.

REGLAS ESTRICTAS:
1. title: SIEMPRE en español, máximo 60 caracteres. Incluye marca, modelo, color y talla. SIN emojis.
2. description: Un ÚNICO string con saltos de línea (\\n). Debe contener los idiomas: ${langList}.
   - Cada bloque empieza con su bandera y nombre (🇪 Español / 🇬🇧 English / 🇫🇷 Français).
   - Segunda línea del bloque: el ESTADO EN MAYÚSCULAS (ej: MUY BUENO, NUEVO SIN ETIQUETAS).
   - Después, exactamente 3 viñetas con el símbolo ✔ (una por línea).
   - Última línea del bloque con el precio: "💰 Precio: X €" / "💰 Price: €X" / "💰 Prix : X €". Omítela si no hay precio.
   - Separa los bloques de idioma con una línea exacta: ──────── (10 guiones).

FORMATO EXACTO DE SALIDA (ejemplo):
${exampleOutput}

DATOS DEL PRODUCTO:
- Producto: ${shortDesc || 'No especificado'}
- Precio: ${price || 'No especificado'}
- Estado: ${condition || 'No especificado'}

Si faltan datos, infiérelos de forma coherente y profesional.
Responde SOLO con el JSON, sin markdown ni explicaciones.`;
    }

    const parts = [{ text: prompt }];
    if (imageBase64) {
      const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      parts.push({
        inlineData: { mimeType: "image/jpeg", data: cleanBase64 }
      });
    }

    // Lista de modelos gratuitos estables
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
              temperature: 0.2, // Más bajo = más estricto y predecible
              maxOutputTokens: 2000,
              responseMimeType: "application/json",
              // Esquema forzado para garantizar la estructura
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

        const parsed = extractJson(content);
        if (parsed && parsed.title && parsed.description) {
          // VALIDACIÓN Y LIMPIEZA POST-PROCESAMIENTO
          const cleaned = validateAndClean(
            parsed.title, 
            parsed.description, 
            langs, 
            langNames, 
            condition, 
            price
          );
          
          console.log('✅ Descripción validada y limpiada');
          return Response.json({
            title: cleaned.title,
            description: cleaned.description
          });
        }

      } catch (error) {
        if (error.message.includes('API key not valid') || error.message.includes('not found')) {
          throw error;
        }
        console.log(`️ Error con ${model}:`, error.message);
        continue;
      }
    }

    // 🛡️ FALLBACK LOCAL
    console.log('⚠️ IA saturada. Fallback local.');
    const fallbackDesc = langs.map((l, idx) => {
      const name = langNames[l] || l;
      const cond = condition ? condition.toUpperCase() : 'ESTADO NO ESPECIFICADO';
      const priceText = price ? (l === 'en' ? ` Price: €${price}` : (l === 'fr' ? `💰 Prix : ${price} €` : `💰 Precio: ${price} €`)) : '';
      const product = shortDesc || presetText || 'Producto en buen estado';
      return `${name}\n${cond}\n✔️ ${product}\n✔️ Revisar fotos para más detalles\n✔️ Envíos rápidos y seguros\n${priceText}`;
    }).join('\n────────\n');

    return Response.json({
      title: (shortDesc || presetText || "Producto en venta").substring(0, 60),
      description: fallbackDesc,
      _warning: "Generado con plantilla local"
    });

  } catch (error) {
    console.error('ERROR GLOBAL:', error);
    return Response.json({ error: `Error de IA: ${error.message}` }, { status: 500 });
  }
}