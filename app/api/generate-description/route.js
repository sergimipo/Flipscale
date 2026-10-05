export const maxDuration = 60;

function extractJson(text) {
  if (!text || typeof text !== 'string') return null;
  
  let clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  
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
    const body = await req.json();
    const { imageBase64, shortDesc, price, condition, languages, presetText } = body;

    console.log('=== API START ===');
    console.log('shortDesc:', shortDesc);

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return Response.json({ error: 'API Key faltante' }, { status: 500 });
    }

    const langs = Array.isArray(languages) ? languages : ['es', 'en', 'fr'];
    const langNames = { es: 'Español', en: 'Inglés', fr: 'Francés' };
    const langList = langs.map(l => langNames[l] || l).join(', ');

    const systemPrompt = `Eres un generador de anuncios de segunda mano.
Devuelve SOLO un objeto JSON válido, sin markdown ni explicaciones.
Formato exacto: {"title": "string", "description": "string"}

REGLAS:
- title: Español, máximo 60 caracteres
- description: Un solo string con saltos de línea \\n, en idiomas ${langList}. 
  Cada idioma separado por ───────, con estado en MAYÚSCULAS, 3 viñetas ✔ y precio al final.`;

    let userContent = `Genera un anuncio profesional para:
Producto: ${shortDesc || presetText || 'No especificado'}
Precio: ${price || 'No especificado'}
Estado: ${condition || 'No especificado'}`;

    // MODELOS DISPONIBLES en orden de prioridad
    const models = [
      'google/gemma-4-31b-it:free',           // El más potente (31B)
      'google/gemma-4-26b-a4b-it:free',       // Gemma 4 A4B (26B)
      'nvidia/nemotron-3-nano-omni:free',     // Nemotron 30B multimodal
      'liquid/lfm2.5-2.6b:free',              // LiquidAI 2.6B (más estable)
      'openrouter/free'                       // Router automático (último recurso)
    ];

    const MAX_RETRIES_PER_MODEL = 2;
    const BASE_DELAY = 3000; // 3 segundos

    for (const model of models) {
      console.log(`\n=== Probando: ${model} ===`);
      
      for (let attempt = 1; attempt <= MAX_RETRIES_PER_MODEL; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        
        try {
          const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: imageBase64 
              ? [{ type: 'text', text: userContent }, { type: 'image_url', image_url: { url: imageBase64 } }]
              : userContent
            }
          ];

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
              model: model,
              messages: messages,
              temperature: 0.3,
              max_tokens: 1500,
            }),
          });

          clearTimeout(timeoutId);

          if (response.status === 429) {
            const delay = BASE_DELAY * Math.pow(2, attempt - 1);
            console.log(`⏳ Rate limited (${model}). Esperando ${delay}ms...`);
            await sleep(delay);
            continue;
          }

          if (!response.ok) {
            const errText = await response.text();
            console.error(`❌ Error ${model}:`, errText);
            break; // Probar siguiente modelo
          }

          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          
          console.log(`✅ ${model} respondió`);
          
          if (!content) continue;

          const parsed = extractJson(content);
          
          if (parsed && parsed.title && parsed.description) {
            console.log('✅ JSON válido');
            return Response.json({
              title: String(parsed.title).trim(),
              description: String(parsed.description).trim()
            });
          }

        } catch (error) {
          console.error(`Error ${model}:`, error.message);
          if (error.name === 'AbortError') console.error('Timeout');
        } finally {
          clearTimeout(timeoutId);
        }
      }
    }

    return Response.json(
      { error: 'Todos los modelos gratuitos están saturados. Inténtalo en unos minutos.' },
      { status: 503 }
    );

  } catch (error) {
    console.error('ERROR GLOBAL:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}