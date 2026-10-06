export const maxDuration = 60;

function extractJson(text) {
  if (!text || typeof text !== 'string') return null;
  
  // Intento 1: JSON directo
  let clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  
  if (start !== -1 && end !== -1) {
    try {
      const parsed = JSON.parse(clean.slice(start, end + 1));
      if (parsed.title && parsed.description) return parsed;
    } catch (e) {}
  }
  
  // Intento 2: Regex para title y description
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
function validateAndClean(title, description, langs, langNames, condition, price, presetText) {
  let cleanTitle = String(title || '').trim();
  let cleanDesc = String(description || '').trim();
  
  // Título: máximo 60 caracteres, sin emojis
  if (cleanTitle.length > 60) {
    cleanTitle = cleanTitle.substring(0, 57) + '...';
  }
  cleanTitle = cleanTitle.replace(/[✨🔥⭐]/g, '').trim();
  
  // Normalizar separadores: cualquier secuencia de guiones o líneas → ──────────
  cleanDesc = cleanDesc.replace(/[-─_]{3,}/g, '──────────');
  
  // Dividir en bloques por separador
  const blocks = cleanDesc.split('──────────').map(b => b.trim()).filter(b => b.length > 0);
  
  // Si no hay bloques, reconstruir desde cero
  if (blocks.length === 0) {
    const cond = condition ? condition.toUpperCase() : (presetText && presetText.match(/(NUEVO|MUY BUENO|BUENO|SATISFACTORIO)/i) ? presetText.match(/(NUEVO|MUY BUENO|BUENO|SATISFACTORIO)/i)[0].toUpperCase() : 'ESTADO NO ESPECIFICADO');
    const priceText = price ? '💰 Precio: ' + price + ' €' : '';
    const product = presetText || 'Producto en buen estado';
    
    cleanDesc = langs.map(l => {
      const name = langNames[l] || l;
      return `${name}\n${cond}\n✔ ${product}\n${priceText}`;
    }).join('\n──────────\n');
    
    return { title: cleanTitle, description: cleanDesc };
  }
  
  // Procesar cada bloque
  const fixedBlocks = blocks.map((block, idx) => {
    const lang = langs[idx] || 'es';
    const langName = langNames[lang] || lang;
    
    // Asegurar que empieza con el nombre del idioma
    let lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // Si la primera línea no es el nombre del idioma, añadirlo
    if (!lines[0]?.includes(langName.replace(/[🇪🇸🇬🇫🇷]/g, '').trim())) {
      lines.unshift(langName);
    }
    
    // Buscar el estado (línea en MAYÚSCULAS después del nombre del idioma)
    let hasCondition = false;
    const condPatterns = ['NUEVO CON ETIQUETAS', 'NUEVO SIN ETIQUETAS', 'MUY BUENO', 'BUENO', 'SATISFACTORIO', 'ESTADO NO ESPECIFICADO'];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].toUpperCase() === lines[i] && lines[i].length > 3 && lines[i].length < 50) {
        hasCondition = true;
        // Si hay condición nueva, reemplazar
        if (condition) {
          lines[i] = condition.toUpperCase();
        }
        break;
      }
    }
    
    // Si no hay estado y hay condición nueva, añadirlo
    if (!hasCondition && condition) {
      lines.splice(1, 0, condition.toUpperCase());
    }
    
    // Si no hay estado y no hay condición nueva, buscar en el preset
    if (!hasCondition && !condition && presetText) {
      const presetCond = presetText.match(/(NUEVO CON ETIQUETAS|NUEVO SIN ETIQUETAS|MUY BUENO|BUENO|SATISFACTORIO)/i);
      if (presetCond) {
        lines.splice(1, 0, presetCond[0].toUpperCase());
      } else {
        lines.splice(1, 0, 'ESTADO NO ESPECIFICADO');
      }
    }
    
    // Asegurar que hay viñetas con ✔
    const checkmarkLines = lines.filter(l => l.startsWith('✔'));
    if (checkmarkLines.length === 0) {
      // Si no hay viñetas, convertir las líneas de texto en viñetas
      const contentLines = lines.filter(l => 
        !l.includes('💰') && 
        !l.toUpperCase().match(/^(NUEVO|MUY BUENO|BUENO|SATISFACTORIO|ESTADO)/) &&
        !l.includes('🇪') && !l.includes('🇬') && !l.includes('')
      );
      const newLines = contentLines.map(l => '✔ ' + l.replace(/^[✔✓-]\s*/, ''));
      // Reemplazar las líneas de contenido con viñetas
      lines = lines.filter(l => 
        l.includes('💰') || 
        l.toUpperCase().match(/^(NUEVO|MUY BUENO|BUENO|SATISFACTORIO|ESTADO)/) ||
        l.includes('') || l.includes('🇬') || l.includes('🇫')
      );
      lines.splice(2, 0, ...newLines);
    }
    
    // Asegurar que el precio está al final
    const pricePatterns = {
      'es': `💰 Precio: ${price} €`,
      'en': `💰 Price: €${price}`,
      'fr': `💰 Prix : ${price} €`
    };
    
    if (price) {
      const priceText = pricePatterns[lang] || pricePatterns['es'];
      // Eliminar cualquier línea de precio existente
      lines = lines.filter(l => !l.includes('💰') && !l.toLowerCase().includes('price') && !l.toLowerCase().includes('prix'));
      // Añadir precio al final
      lines.push(priceText);
    } else {
      // Si no hay precio, eliminar líneas de precio
      lines = lines.filter(l => !l.includes('💰') && !l.toLowerCase().includes('price') && !l.toLowerCase().includes('prix'));
    }
    
    return lines.join('\n');
  });
  
  cleanDesc = fixedBlocks.join('\n──────────\n');
  
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
    const langNames = { es: '🇪 Español', en: '🇬 English', fr: '🇫🇷 Français' };
    const langList = langs.map(l => langNames[l] || l).join(' / ');

    // EJEMPLO DE SALIDA PERFECTA
    const exampleOutput = `{
  "title": "Gafas Oakley Speedcraft S3 Ahumadas Nuevas",
  "description": "🇪🇸 Español\\nNUEVO SIN ETIQUETAS\\n✔ Gafas Oakley Speedcraft S3 con lentes ahumadas\\n✔ 100% originales, sin uso\\n✔ Incluye estuche original\\n Precio: 44.99 €\\n──────────\\n🇬🇧 English\\nNEW WITHOUT TAGS\\n✔ Oakley Speedcraft S3 sunglasses with smoked lenses\\n✔ 100% authentic, unused\\n✔ Includes original case\\n💰 Price: €44.99\\n──────────\\n🇫🇷 Français\\nNEUF SANS ÉTIQUETTE\\n✔ Lunettes Oakley Speedcraft S3 avec verres fumés\\n✔ 100% authentiques, non utilisées\\n✔ Étui original inclus\\n Prix : 44.99 €"
}`;

    // PROMPT DIFERENCIADO
    let prompt = '';
    if (presetText && presetText.trim().length > 10) {
      prompt = `Eres un editor experto de anuncios de segunda mano.
Tienes una DESCRIPCIÓN BASE (preset) y unos CAMBIOS a aplicar.

REGLAS ESTRICTAS:
1. MANTÉN la estructura, formato y estilo de la DESCRIPCIÓN BASE.
2. MANTÉN el estado del preset (ej: NUEVO SIN ETIQUETAS) a menos que se especifique uno nuevo en los CAMBIOS.
3. Aplica los CAMBIOS indicados modificando el texto del preset.
4. Si los cambios incluyen nuevo precio, actualízalo al final de cada bloque.
5. Cada bloque de idioma debe tener exactamente 3 viñetas con ✔.
6. Devuelve SOLO un JSON válido, sin markdown.

FORMATO EXACTO DE SALIDA:
${exampleOutput}

DESCRIPCIÓN BASE (preset):
${presetText}

CAMBIOS A APLICAR:
- Descripción: ${shortDesc || 'ninguno, mantener la base'}
- Precio: ${price || 'mantener el de la base'}
- Estado: ${condition || 'mantener el del preset'}

Responde SOLO con el JSON.`;
    } else {
      prompt = `Eres un experto en ventas de segunda mano (Vinted/Wallapop).
Genera un anuncio profesional y limpio.

REGLAS ESTRICTAS:
1. title: SIEMPRE en español, máximo 60 caracteres. Incluye marca, modelo, color. SIN emojis.
2. description: Un ÚNICO string con saltos de línea (\\n). Debe contener los idiomas: ${langList}.
   - Cada bloque empieza con su bandera y nombre (🇪 Español / 🇬🇧 English / 🇫🇷 Français).
   - Segunda línea: el ESTADO EN MAYÚSCULAS (ej: NUEVO SIN ETIQUETAS, MUY BUENO).
   - Después, exactamente 3 viñetas con el símbolo ✔ (una por línea, describiendo el producto).
   - Última línea del bloque con el precio: "💰 Precio: X €" / "💰 Price: €X" / "💰 Prix : X €".
   - Separa los bloques con exactamente: ────────── (10 guiones).

FORMATO EXACTO DE SALIDA:
${exampleOutput}

DATOS DEL PRODUCTO:
- Producto: ${shortDesc || 'No especificado'}
- Precio: ${price || 'No especificado'}
- Estado: ${condition || 'No especificado'}

Responde SOLO con el JSON, sin markdown.`;
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
              temperature: 0.2,
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

        const parsed = extractJson(content);
        if (parsed && parsed.title && parsed.description) {
          const cleaned = validateAndClean(
            parsed.title, 
            parsed.description, 
            langs, 
            langNames, 
            condition, 
            price,
            presetText
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
        console.log(`⚠️ Error con ${model}:`, error.message);
        continue;
      }
    }

    // FALLBACK LOCAL
    console.log('⚠️ IA saturada. Fallback local.');
    const fallbackDesc = langs.map((l, idx) => {
      const name = langNames[l] || l;
      const cond = condition ? condition.toUpperCase() : 'ESTADO NO ESPECIFICADO';
      const priceText = price ? (l === 'en' ? `💰 Price: €${price}` : (l === 'fr' ? `💰 Prix : ${price} €` : `💰 Precio: ${price} €`)) : '';
      const product = shortDesc || presetText || 'Producto en buen estado';
      return `${name}\n${cond}\n✔ ${product}\n✔ Revisar fotos para más detalles\n✔ Envíos rápidos y seguros\n${priceText}`;
    }).join('\n──────────\n');

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