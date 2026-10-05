export const maxDuration = 60;

function extractJson(text) {
  if (!text || typeof text !== 'string') return null;
  
  // 1. Limpiar markdown
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
      console.log("Fallo parseo directo:", e.message);
    }
  }
  
  // 3. Fallback Regex
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

    console.log('=== API START ===');
    console.log('shortDesc:', shortDesc);
    console.log('price:', price);
    console.log('condition:', condition);
    console.log('hasImage:', !!imageBase64);

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return Response.json({ error: 'API Key faltante' }, { status: 500 });
    }

    const langs = Array.isArray(languages) ? languages : ['es', 'en', 'fr'];
    const langNames = { es: 'Español', en: 'Inglés', fr: 'Francés' };
    const langList = langs.map(l => langNames[l] || l).join(', ');

    // PROMPT OPTIMIZADO PARA GEMMA 4
    const systemPrompt = `Eres un generador de anuncios de segunda mano.
Devuelve SOLO un objeto JSON válido, sin markdown ni explicaciones.
Formato exacto: {"title": "string", "description": "string"}

REGLAS:
- title: Español, máximo 60 caracteres, incluye marca/modelo/color/talla si los conoces
- description: Un solo string con saltos de línea \\n, en idiomas ${langList}. 
  Cada idioma separado por ───────, con estado en MAYÚSCULAS, 3 viñetas ✔ y precio al final.`;

    let userContent = `Genera un anuncio profesional para:
Producto: ${shortDesc || presetText || 'No especificado'}
Precio: ${price || 'No especificado'}
Estado: ${condition || 'No especificado'}

Si faltan datos, infiérelos de forma coherente.`;

    const MAX_RETRIES = 2;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      console.log(`\n=== Intento ${attempt}/${MAX_RETRIES} ===`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('Timeout alcanzado');
        controller.abort();
      }, 40000); // 40 segundos
      
      try {
        const messages = [
          { role: 'system', content: systemPrompt },
        ];

        // Si hay imagen, usar formato multimodal (Gemma 4 lo soporta)
        if (imageBase64) {
          messages.push({
            role: 'user',
            content: [
              { type: 'text', text: userContent },
              { type: 'image_url', image_url: { url: imageBase64 } }
            ]
          });
        } else {
          messages.push({
            role: 'user',
            content: userContent
          });
        }

        console.log('Enviando a OpenRouter con modelo: google/gemma-4-26b-a4b-it:free');
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://flipscale.com',
            'X-Title': 'FlipScale',
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: 'google/gemma-4-26b-a4b-it:free',
            messages: messages,
            temperature: 0.3,
            max_tokens: 1500,
          }),
        });

        clearTimeout(timeoutId);

        console.log('Status:', response.status);

        if (!response.ok) {
          const errText = await response.text();
          console.error('Error API:', errText);
          return Response.json({ 
            error: `API Error: ${response.status}`, 
            rawResponse: errText 
          }, { status: 500 });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        
        console.log('\n=== CONTENIDO DE LA IA ===');
        console.log(content);
        console.log('=== FIN CONTENIDO ===\n');

        if (!content) {
          return Response.json({ 
            error: 'La IA no devolvió contenido', 
            rawResponse: JSON.stringify(data) 
          }, { status: 500 });
        }

        const parsed = extractJson(content);
        
        if (parsed && parsed.title && parsed.description) {
          console.log('✅ JSON válido extraído');
          console.log('Title:', parsed.title);
          console.log('Description length:', parsed.description.length);
          
          return Response.json({
            title: String(parsed.title).trim(),
            description: String(parsed.description).trim()
          });
        } else {
          console.warn('❌ No se pudo extraer JSON válido');
        }

      } catch (error) {
        console.error(`\n❌ Error en intento ${attempt}:`, error.message);
        if (error.name === 'AbortError') {
          console.error('La petición fue abortada por timeout');
        }
        if (attempt === MAX_RETRIES) {
          return Response.json({ 
            error: `Error: ${error.message}`,
            rawResponse: error.message
          }, { status: 500 });
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }

    return Response.json(
      { error: 'La IA no pudo generar una respuesta válida tras varios intentos.' },
      { status: 503 }
    );

  } catch (error) {
    console.error('\n=== ERROR GLOBAL ===', error);
    return Response.json({ error: `Error: ${error.message}` }, { status: 500 });
  }
}