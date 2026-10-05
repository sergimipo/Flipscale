export const maxDuration = 60;

// Parser de JSON ultra-tolerante
function extractJson(text) {
  if (!text || typeof text !== 'string') return null;
  
  // Intento 1: JSON limpio
  const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    try {
      const parsed = JSON.parse(clean.slice(start, end + 1));
      if (parsed.title && parsed.description) return parsed;
    } catch {}
  }
  
  // Intento 2: Buscar JSON con regex más amplio
  const jsonRegex = /\{[\s\S]*?"title"[\s\S]*?["']([^"']*)["'][\s\S]*?"description"[\s\S]*?["']([\s\S]*?)["'][\s\S]*?\}/;
  const match = text.match(jsonRegex);
  if (match) {
    try {
      return { title: match[1], description: match[2] };
    } catch {}
  }
  
  // Intento 3: Extraer title y description con regex individuales
  const titleMatch = text.match(/["']title["']\s*:\s*["']([^"']*)["']/i);
  const descMatch = text.match(/["']description["']\s*:\s*["']([\s\S]*?)["']/i);
  if (titleMatch && descMatch) {
    return { title: titleMatch[1], description: descMatch[1] };
  }
  
  return null;
}

export async function POST(req) {
  try {
    const { imageBase64, shortDesc, price, condition, languages, presetText } = await req.json();

    console.log('=== INICIO DE PETICIÓN ===');
    console.log('shortDesc:', shortDesc);
    console.log('price:', price);
    console.log('condition:', condition);
    console.log('languages:', languages);
    console.log('presetText:', presetText?.substring(0, 100));
    console.log('imageBase64:', imageBase64 ? 'Presente' : 'Ausente');

    // Validación temprana
    if (!presetText && (!shortDesc || shortDesc.trim().length < 15)) {
      return Response.json(
        { error: 'La descripción es demasiado corta. Añade marca, tipo de prenda o color (mín. 15 caracteres).' },
        { status: 400 }
      );
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return Response.json({ error: 'Falta la clave de API de OpenRouter' }, { status: 500 });
    }

    const langs = Array.isArray(languages) && languages.length > 0 ? languages : ['es', 'en', 'fr'];
    const langNames = { es: 'Español', en: 'Inglés', fr: 'Francés' };
    const langList = langs.map((l) => langNames[l] || l).join(', ');

    // Prompt SIMPLIFICADO para máxima compatibilidad
    const systemPrompt = `Eres un asistente que genera anuncios de segunda mano. SIEMPRE respondes con un JSON válido con estas dos claves:
{
  "title": "título en español, máximo 60 caracteres",
  "description": "descripción multilingüe"
}

REGLAS DEL TÍTULO:
- Siempre en español
- Máximo 60 caracteres
- Incluye marca, modelo, color y talla si los conoces

REGLAS DE LA DESCRIPCIÓN:
- Un solo string con saltos de línea (\\n)
- Bloques en orden: ${langList}
- Cada bloque empieza con: ${langs.map(l => langNames[l]).join(' / ')}
- Primera línea: ESTADO EN MAYÚSCULAS
- 3 viñetas con ✔
- Última línea: precio (omítela si no hay)
- Separa bloques con: ────────

IMPORTANTE: Responde SOLO con el JSON, sin markdown, sin explicaciones.`;

    let userPrompt = '';
    if (presetText && presetText.trim().length > 0) {
      userPrompt = `DESCRIPCIÓN BASE:
${presetText}

CAMBIOS A APLICAR:
- Descripción: ${shortDesc || 'sin cambios'}
- Precio: ${price || 'mantener el de la base'}
- Estado: ${condition || 'mantener el de la base'}

Genera el JSON con el título y la descripción actualizada.`;
    } else {
      userPrompt = `DATOS DEL PRODUCTO:
- Descripción: ${shortDesc}
- Precio: ${price || 'no especificado'}
- Estado: ${condition || 'no especificado'}

Genera el JSON con el título y la descripción.`;
    }

    const MAX_RETRIES = 3;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      console.log(`\n=== INTENTO ${attempt}/${MAX_RETRIES} ===`);
      
      const controller = new AbortController();
      const timer = setTimeout(() => {
        console.log('⏰ Timeout alcanzado');
        controller.abort();
      }, 50000); // 50 segundos
      
      try {
        const messages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ];

        // Si hay imagen, añadirla al mensaje del usuario
        if (imageBase64) {
          messages[1].content = [
            { type: 'text', text: userPrompt },
            { type: 'image_url', image_url: { url: imageBase64 } }
          ];
        }

        console.log('Enviando petición a OpenRouter...');
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://flipscale.com',
            'X-Title': 'FlipScale',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'openrouter/free',
            messages,
            temperature: 0.3,
            max_tokens: 2000,
          }),
        });

        console.log('Status de respuesta:', response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error de API:', errorData);
          throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('Respuesta completa de la API:', JSON.stringify(data, null, 2));

        const content = data.choices?.[0]?.message?.content;
        console.log('\nContenido recibido de la IA:');
        console.log(content);

        if (!content) {
          console.error(' La IA no devolvió contenido');
          throw new Error('La IA no devolvió contenido');
        }

        const parsed = extractJson(content);
        
        if (parsed && parsed.title && parsed.description) {
          console.log('\n✅ JSON parseado correctamente:');
          console.log('Title:', parsed.title);
          console.log('Description length:', parsed.description.length);
          
          return Response.json({
            title: String(parsed.title).trim(),
            description: String(parsed.description).trim(),
          });
        }
        
        console.warn(`\n❌ Intento ${attempt}: No se pudo extraer JSON válido`);
        console.warn('Contenido recibido:', content.substring(0, 500));
        
      } catch (error) {
        console.error(`\n❌ Error en intento ${attempt}:`, error.message);
        if (error.name === 'AbortError') {
          console.error('La petición fue abortada por timeout');
        }
      } finally {
        clearTimeout(timer);
      }
    }

    console.log('\n=== TODOS LOS INTENTOS FALLARON ===');
    return Response.json(
      { error: 'La IA no pudo generar una respuesta válida tras varios intentos. Inténtalo de nuevo.' },
      { status: 503 }
    );
  } catch (error) {
    console.error('\n=== ERROR GLOBAL ===', error);
    return Response.json({ error: `Error de IA: ${error.message}` }, { status: 500 });
  }
}