export const maxDuration = 60;

function extractJson(text) {
  if (!text || typeof text !== 'string') return null;
  
  // 1. Limpiar markdown común
  let clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  
  // 2. Intentar parseo directo
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  
  if (start !== -1 && end !== -1) {
    try {
      const jsonStr = clean.slice(start, end + 1);
      const parsed = JSON.parse(jsonStr);
      if (parsed.title && parsed.description) {
        return parsed;
      }
    } catch (e) {
      console.log("Fallo en parseo directo:", e.message);
    }
  }
  
  // 3. Fallback Regex: Buscar title y description manualmente si el JSON está roto
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

export async function POST(req) {
  try {
    const body = await req.json();
    const { imageBase64, shortDesc, price, condition, languages, presetText } = body;

    console.log('--- API START ---');
    console.log('Datos recibidos:', { shortDesc, price, hasImage: !!imageBase64 });

    // Validación básica
    if (!presetText && (!shortDesc || shortDesc.trim().length < 5)) {
       return Response.json({ error: 'Descripción muy corta' }, { status: 400 });
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return Response.json({ error: 'API Key faltante' }, { status: 500 });
    }

    const langs = Array.isArray(languages) ? languages : ['es', 'en', 'fr'];
    const langNames = { es: 'Español', en: 'Inglés', fr: 'Francés' };
    
    // PROMPT SIMPLIFICADO AL MÁXIMO PARA EVITAR ERRORES DE FORMATO
    const systemPrompt = `Eres un generador de anuncios. 
Devuelve SOLO un objeto JSON válido. No escribas nada más.
Formato: {"title": "string", "description": "string"}
Title: Español, max 60 chars.
Description: Idiomas ${langs.join(', ')}. Usa saltos de línea \\n.`;

    let userContent = `Genera anuncio para:
Producto: ${shortDesc || presetText}
Precio: ${price || 'N/A'}
Estado: ${condition || 'N/A'}`;

    // SI HAY IMAGEN Y NO ES DEMASIADO GRANDE, LA INCLUIMOS
    // Pero si da error en iOS, la quitamos. Por seguridad, vamos a ignorar la imagen en este test
    // Para probar, comenta esta lógica de imagen primero.
    /*
    if (imageBase64 && imageBase64.length < 500000) { // Menos de 500KB aprox
       userContent += "\nAnaliza también la imagen adjunta.";
    }
    */

    const MAX_RETRIES = 2; // Reducido a 2 para ir más rápido
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 segs
      
      try {
        const messages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ];

        // Opcional: Si quieres probar con imagen, descomenta esto:
        // if (imageBase64) {
        //   messages[1].content = [
        //     { type: 'text', text: userContent },
        //     { type: 'image_url', image_url: { url: imageBase64 } }
        //   ];
        // }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: 'meta-llama/llama-3-8b-instruct:free', // CAMBIO CRÍTICO: Usar un modelo específico gratuito estable en vez de 'free' aleatorio
            messages: messages,
            temperature: 0.2,
            max_tokens: 800,
          }),
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`OpenRouter Error: ${errText}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        
        console.log(`Intento ${attempt} Respuesta IA:`, content?.substring(0, 100));

        if (!content) throw new Error('Respuesta vacía');

        const parsed = extractJson(content);
        
        if (parsed && parsed.title && parsed.description) {
           return Response.json({
             title: parsed.title,
             description: parsed.description
           });
        } else {
           console.warn('JSON extraído pero incompleto:', parsed);
        }

      } catch (error) {
        console.error(`Error intento ${attempt}:`, error.message);
        if (attempt === MAX_RETRIES) break;
      } finally {
        clearTimeout(timeoutId);
      }
    }

    return Response.json({ error: 'La IA falló tras varios intentos.' }, { status: 500 });

  } catch (error) {
    console.error('ERROR GLOBAL API:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}