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

// ============ FUNCIONES DE POST-PROCESAMIENTO ============

// Detecta el producto principal del preset
function detectProduct(text) {
  const products = [
    { name: 'gafas', gender: 'f', plural: true },
    { name: 'gorra', gender: 'f', plural: false },
    { name: 'gorras', gender: 'f', plural: true },
    { name: 'camiseta', gender: 'f', plural: false },
    { name: 'camisetas', gender: 'f', plural: true },
    { name: 'zapatillas', gender: 'f', plural: true },
    { name: 'sudadera', gender: 'f', plural: false },
    { name: 'sudaderas', gender: 'f', plural: true },
    { name: 'chaqueta', gender: 'f', plural: false },
    { name: 'chaquetas', gender: 'f', plural: true },
    { name: 'pantalones', gender: 'm', plural: true },
    { name: 'pantalón', gender: 'm', plural: false },
    { name: 'bolsa', gender: 'f', plural: false },
    { name: 'bolsas', gender: 'f', plural: true },
    { name: 'mochila', gender: 'f', plural: false },
    { name: 'mochilas', gender: 'f', plural: true },
    { name: 'falda', gender: 'f', plural: false },
    { name: 'faldas', gender: 'f', plural: true },
    { name: 'vestido', gender: 'm', gender: 'm', plural: false },
    { name: 'vestidos', gender: 'm', plural: true },
    { name: 'abrigo', gender: 'm', plural: false },
    { name: 'abrigos', gender: 'm', plural: true },
    { name: 'reloj', gender: 'm', plural: false },
    { name: 'relojes', gender: 'm', plural: true },
  ];
  const lower = text.toLowerCase();
  for (const p of products) {
    if (lower.includes(p.name)) return p;
  }
  return { name: 'producto', gender: 'm', plural: false };
}

// Detecta marca y modelo del preset
function detectBrandModel(text) {
  const brands = ['Oakley', 'Nike', 'Adidas', 'Gucci', 'Chrome Hearts', 'Ray-Ban', 'Puma', 'Reebok', 'New Balance', 'Vans', 'Converse', 'Supreme', 'Stussy', 'Carhartt'];
  const models = ['Speedcraft', 'Air Max', 'Stan Smith', 'S3', '501', 'Ultraboost', 'Dunk', 'Jordan', 'Yeezy', 'Trucker'];
  
  const lower = text.toLowerCase();
  let brand = '';
  let model = '';
  
  for (const b of brands) {
    if (lower.includes(b.toLowerCase())) { brand = b; break; }
  }
  for (const m of models) {
    if (lower.includes(m.toLowerCase())) { model = m; break; }
  }
  
  return { brand, model };
}

// Detecta color en un texto
function detectColor(text) {
  const colors = ['rojo', 'roja', 'rojos', 'rojas', 'rosa', 'azul', 'azules', 'negro', 'negra', 'negros', 'negras', 'blanco', 'blanca', 'blancos', 'blancas', 'verde', 'verdes', 'gris', 'grises', 'marrón', 'marrones', 'beige', 'camaleón', 'transparente', 'transparentes', 'ahumado', 'ahumada', 'ahumados', 'ahumadas', 'dorado', 'dorada', 'plateado', 'plateada', 'plateados', 'plateadas'];
  const lower = text.toLowerCase();
  for (const c of colors) {
    if (lower.includes(c)) return c;
  }
  return null;
}

// Convierte un color base a su forma correcta según género/número
function adaptColor(baseColor, gender, plural) {
  const colorRoots = {
    'rojo': { m: 'rojo', f: 'roja', mp: 'rojos', fp: 'rojas' },
    'roja': { m: 'rojo', f: 'roja', mp: 'rojos', fp: 'rojas' },
    'rojos': { m: 'rojo', f: 'roja', mp: 'rojos', fp: 'rojas' },
    'rojas': { m: 'rojo', f: 'roja', mp: 'rojos', fp: 'rojas' },
    'rosa': { m: 'rosa', f: 'rosa', mp: 'rosas', fp: 'rosas' },
    'azul': { m: 'azul', f: 'azul', mp: 'azules', fp: 'azules' },
    'azules': { m: 'azul', f: 'azul', mp: 'azules', fp: 'azules' },
    'negro': { m: 'negro', f: 'negra', mp: 'negros', fp: 'negras' },
    'negra': { m: 'negro', f: 'negra', mp: 'negros', fp: 'negras' },
    'negros': { m: 'negro', f: 'negra', mp: 'negros', fp: 'negras' },
    'negras': { m: 'negro', f: 'negra', mp: 'negros', fp: 'negras' },
    'blanco': { m: 'blanco', f: 'blanca', mp: 'blancos', fp: 'blancas' },
    'blanca': { m: 'blanco', f: 'blanca', mp: 'blancos', fp: 'blancas' },
    'blancos': { m: 'blanco', f: 'blanca', mp: 'blancos', fp: 'blancas' },
    'blancas': { m: 'blanco', f: 'blanca', mp: 'blancos', fp: 'blancas' },
    'verde': { m: 'verde', f: 'verde', mp: 'verdes', fp: 'verdes' },
    'verdes': { m: 'verde', f: 'verde', mp: 'verdes', fp: 'verdes' },
    'gris': { m: 'gris', f: 'gris', mp: 'grises', fp: 'grises' },
    'grises': { m: 'gris', f: 'gris', mp: 'grises', fp: 'grises' },
    'marrón': { m: 'marrón', f: 'marrón', mp: 'marrones', fp: 'marrones' },
    'marrones': { m: 'marrón', f: 'marrón', mp: 'marrones', fp: 'marrones' },
    'beige': { m: 'beige', f: 'beige', mp: 'beige', fp: 'beige' },
    'camaleón': { m: 'camaleón', f: 'camaleón', mp: 'camaleón', fp: 'camaleón' },
    'transparente': { m: 'transparente', f: 'transparente', mp: 'transparentes', fp: 'transparentes' },
    'transparentes': { m: 'transparente', f: 'transparente', mp: 'transparentes', fp: 'transparentes' },
    'ahumado': { m: 'ahumado', f: 'ahumada', mp: 'ahumados', fp: 'ahumadas' },
    'ahumada': { m: 'ahumado', f: 'ahumada', mp: 'ahumados', fp: 'ahumadas' },
    'ahumados': { m: 'ahumado', f: 'ahumada', mp: 'ahumados', fp: 'ahumadas' },
    'ahumadas': { m: 'ahumado', f: 'ahumada', mp: 'ahumados', fp: 'ahumadas' },
    'dorado': { m: 'dorado', f: 'dorada', mp: 'dorados', fp: 'doradas' },
    'dorada': { m: 'dorado', f: 'dorada', mp: 'dorados', fp: 'doradas' },
    'plateado': { m: 'plateado', f: 'plateada', mp: 'plateados', fp: 'plateadas' },
    'plateada': { m: 'plateado', f: 'plateada', mp: 'plateados', fp: 'plateadas' },
    'plateados': { m: 'plateado', f: 'plateada', mp: 'plateados', fp: 'plateadas' },
    'plateadas': { m: 'plateado', f: 'plateada', mp: 'plateados', fp: 'plateadas' },
  };
  
  const root = colorRoots[baseColor.toLowerCase()];
  if (!root) return baseColor;
  
  const key = plural ? (gender === 'f' ? 'fp' : 'mp') : (gender === 'f' ? 'f' : 'm');
  return root[key];
}

// Reemplaza colores en un texto manteniendo concordancia
function replaceColorsInText(text, newColors, product) {
  let result = text;
  const allOldColors = ['rojo', 'roja', 'rojos', 'rojas', 'rosa', 'rosas', 'azul', 'azules', 'negro', 'negra', 'negros', 'negras', 'blanco', 'blanca', 'blancos', 'blancas', 'verde', 'verdes', 'gris', 'grises', 'marrón', 'marrones', 'beige', 'transparente', 'transparentes', 'ahumado', 'ahumada', 'ahumados', 'ahumadas', 'dorado', 'dorada', 'dorados', 'doradas', 'plateado', 'plateada', 'plateados', 'plateadas'];
  
  for (const newColor of newColors) {
    const adapted = adaptColor(newColor, product.gender, product.plural);
    for (const oldColor of allOldColors) {
      if (oldColor.toLowerCase() === newColor.toLowerCase()) continue;
      const regex = new RegExp(`\\b${oldColor}\\b`, 'gi');
      result = result.replace(regex, adapted);
    }
  }
  
  return result;
}

// Genera un título específico desde el preset
function buildTitle(presetText, newColors, condition, product, brandModel) {
  const parts = [];
  
  // Producto (capitalizado)
  const productName = product.name.charAt(0).toUpperCase() + product.name.slice(1);
  parts.push(product.plural && !productName.endsWith('s') ? productName + 's' : productName);
  
  // Marca
  if (brandModel.brand) parts.push(brandModel.brand);
  
  // Modelo
  if (brandModel.model) parts.push(brandModel.model);
  
  // Colores nuevos (adaptados)
  if (newColors && newColors.length > 0) {
    const adaptedColors = newColors.map(c => adaptColor(c, product.gender, product.plural));
    parts.push(adaptedColors.join(' y '));
  }
  
  // Estado
  if (condition) {
    parts.push(condition.toUpperCase());
  }
  
  return parts.join(' ').substring(0, 60);
}

// ============ API PRINCIPAL ============

export async function POST(req) {
  try {
    const { imageBase64, shortDesc, price, condition, languages, presetText } = await req.json();
    
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return Response.json({ error: 'Falta GEMINI_API_KEY' }, { status: 500 });
    }

    const langs = Array.isArray(languages) && languages.length > 0 ? languages : ['es', 'en', 'fr'];
    const langNames = { es: '🇪🇸 Español', en: '🇧 English', fr: '🇷 Français' };

    // Detectar qué cambia
    const product = presetText ? detectProduct(presetText) : detectProduct(shortDesc || '');
    const brandModel = presetText ? detectBrandModel(presetText) : { brand: '', model: '' };
    
    // Extraer colores de los cambios
    const newColors = [];
    if (shortDesc) {
      const colorMatches = shortDesc.match(/\b(rojo|rosa|azul|negro|blanco|verde|gris|marrón|beige|camaleón|transparente|ahumado|dorado|plateado)s?\b/gi);
      if (colorMatches) {
        colorMatches.forEach(c => {
          const base = c.toLowerCase().replace(/s$/, '');
          if (!newColors.includes(base)) newColors.push(base);
        });
      }
    }

    console.log('Análisis:', { product: product.name, gender: product.gender, plural: product.plural, brand: brandModel.brand, model: brandModel.model, newColors });

    let prompt = '';
    
    if (presetText && presetText.trim().length > 10) {
      // MODO PRESET
      prompt = `Reescribe el siguiente preset de anuncio aplicando los cambios indicados. Mantén EXACTAMENTE la misma estructura, formato, viñetas y todos los idiomas.

PRESET:
${presetText}

CAMBIOS:
${shortDesc ? `- ${shortDesc}` : '- Ninguno'}
${price ? `- Nuevo precio: ${price}€` : ''}
${condition ? `- Nuevo estado: ${condition}` : ''}

Si hay cambio de color, reemplaza TODAS las menciones del color antiguo por el nuevo en todos los idiomas.
Si no hay cambios, devuelve el preset exactamente igual.

Devuelve SOLO JSON: {"title": "título en español con los cambios", "description": "preset reescrito con los cambios"}`;
    } else {
      const langList = langs.map(l => langNames[l] || l).join(' / ');
      prompt = `Genera un anuncio de segunda mano.

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
      parts.push({ inlineData: { mimeType: "image/jpeg", data: cleanBase64 } });
    }

    const models = ['gemini-1.5-flash-latest', 'gemini-1.5-flash-8b'];
    let aiResult = null;

    for (const model of models) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 2000, responseMimeType: "application/json" }
          })
        });

        const data = await response.json();
        if (!response.ok) {
          if (response.status === 429 || response.status === 503) { await sleep(1500); continue; }
          throw new Error(data.error?.message || `Error ${response.status}`);
        }

        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!content) continue;

        const parsed = extractJson(content);
        if (parsed && parsed.title && parsed.description) {
          aiResult = parsed;
          break;
        }
      } catch (error) {
        console.log(`Error ${model}:`, error.message);
        continue;
      }
    }

    // ============ POST-PROCESAMIENTO (siempre se aplica) ============
    let finalTitle = '';
    let finalDesc = '';

    if (presetText && presetText.trim().length > 10 && aiResult) {
      // MODO PRESET: usar la descripción de la IA pero corregir título y colores
      finalDesc = aiResult.description;
      
      // Si la IA no cambió los colores, el código lo hace
      if (newColors.length > 0) {
        finalDesc = replaceColorsInText(finalDesc, newColors, product);
      }
      
      // Actualizar precio
      if (price) {
        finalDesc = finalDesc.replace(/(\d+[.,]?\d*)\s*[€EUR]/gi, `${price} €`);
        // Si no había precio, añadirlo al final de cada bloque
        if (!finalDesc.includes('€') && !finalDesc.includes('Price') && !finalDesc.includes('Prix')) {
          const priceByLang = { es: `💰 Precio: ${price} €`, en: `💰 Price: €${price}`, fr: `💰 Prix : ${price} €` };
          finalDesc = finalDesc.split('────').map(block => {
            const lang = langs.find(l => block.includes(langNames[l]?.split(' ')[1] || ''));
            return block.trim() + '\n' + (priceByLang[lang] || priceByLang.es);
          }).join('\n──────────\n');
        }
      }
      
      // Actualizar estado
      if (condition) {
        const oldStates = ['NUEVO CON ETIQUETAS', 'NUEVO SIN ETIQUETAS', 'MUY BUENO', 'BUENO', 'SATISFACTORIO', 'NUEVAS', 'NUEVOS', 'NUEVO', 'NEW WITHOUT TAGS', 'NEW WITH TAGS', 'VERY GOOD', 'GOOD', 'NEUF', 'TRÈS BON'];
        oldStates.forEach(s => {
          finalDesc = finalDesc.replace(new RegExp(s, 'gi'), condition.toUpperCase());
        });
      }
      
      // Título: SIEMPRE generado por el código, nunca por la IA
      finalTitle = buildTitle(presetText, newColors.length > 0 ? newColors : null, condition, product, brandModel);
      
    } else if (aiResult) {
      // MODO SIN PRESET: usar lo que devolvió la IA
      finalTitle = aiResult.title;
      finalDesc = aiResult.description;
      
      // Corregir título si es genérico
      if (finalTitle.toLowerCase().includes('producto') || finalTitle.length < 15) {
        finalTitle = buildTitle(shortDesc || '', newColors, condition, product, brandModel);
      }
    } else {
      // FALLBACK TOTAL: sin IA
      console.log('⚠️ Sin respuesta de IA, usando fallback');
      const cond = condition ? condition.toUpperCase() : 'ESTADO NO ESPECIFICADO';
      const productText = shortDesc || presetText || 'Producto';
      finalDesc = langs.map(l => {
        const name = langNames[l] || l;
        const priceText = price ? (l === 'en' ? `💰 Price: €${price}` : (l === 'fr' ? `💰 Prix : ${price} €` : `💰 Precio: ${price} €`)) : '';
        return `${name}\n${cond}\n✔ ${productText}\n✔ Revisar fotos para más detalles\n✔ Envíos rápidos y seguros\n${priceText}`;
      }).join('\n──────────\n');
      finalTitle = buildTitle(shortDesc || presetText || '', newColors, condition, product, brandModel);
    }

    // Última validación: si el título sigue siendo malo, regenerarlo
    if (finalTitle.toLowerCase().startsWith('es la misma') || finalTitle.toLowerCase().startsWith('son las mismas') || finalTitle.toLowerCase().includes('producto en color')) {
      finalTitle = buildTitle(presetText || shortDesc || '', newColors, condition, product, brandModel);
    }

    return Response.json({
      title: finalTitle.substring(0, 60),
      description: finalDesc
    });

  } catch (error) {
    console.error('ERROR:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}