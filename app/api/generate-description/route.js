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

export async function POST(req) {
  try {
    const { imageBase64, shortDesc, price, condition, languages, presetText } = await req.json();
    
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return Response.json({ error: 'Falta la variable de entorno GEMINI_API_KEY en Vercel' }, { status: 500 });
    }

    const langs = Array.isArray(languages) ? languages : ['es', 'en', 'fr'];
    const langNames = { es: '🇪🇸 Español', en: '🇧 English', fr: '🇷 Français' };
    const langList = langs.map(l => langNames[l] || l).join(', ');

    const prompt = `Eres un experto en ventas de segunda mano (Vinted/Wallapop).
Devuelve SOLO un objeto JSON válido, sin markdown, sin explicaciones.
Formato exacto: {"title": "string", "description": "string"}

REGLAS OBLIGATORIAS:
1. title: SIEMPRE en español, máximo 60 caracteres. Incluye marca, modelo, color y talla si los conoces.
2. description: Un ÚNICO string con saltos de línea (\\n). Debe contener los idiomas: ${langList}.
   - Cada bloque de idioma empieza con su nombre (ej: 🇪🇸 Español).
   - Primera línea del bloque: el ESTADO EN MAYÚSCULAS.
   - Después, exactamente 3 viñetas con el símbolo ✔.
   - Última línea del bloque con el precio (ej: "💰 Precio: X €"). Omítela si no hay precio.
   - Separa los bloques de idioma con una línea: ────────

DATOS DEL PRODUCTO:
- Producto: ${shortDesc || presetText || 'No especificado'}
- Precio: ${price || 'No especificado'}
- Estado: ${condition || 'No especificado'}

Si faltan datos, infiérelos de forma coherente y profesional.`;

    const parts = [{ text: prompt }];
    
    if (imageBase64) {
      const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64
        }
      });
    }

    console.log('Enviando petición a Google Gemini 2.0 Flash...');

    // MODELO ACTUALIZADO: gemini-2.0-flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        contents: [{ parts: parts }],
        generationConfig: { 
          temperature: 0.3, 
          maxOutputTokens: 1500,
          responseMimeType: "application/json"
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error de Gemini:', data);
      return Response.json({ 
        error: `Error de IA: ${data.error?.message || 'Desconocido'}` 
      }, { status: 500 });
    }

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      return Response.json({ error: 'La IA no devolvió contenido' }, { status: 500 });
    }

    console.log('✅ Respuesta de Gemini 2.0 Flash recibida correctamente');

    const parsed = extractJson(content);
    
    if (parsed && parsed.title && parsed.description) {
      return Response.json({
        title: String(parsed.title).trim(),
        description: String(parsed.description).trim()
      });
    }

    return Response.json({ 
      error: 'Formato no válido', 
      rawResponse: content 
    }, { status: 500 });

  } catch (error) {
    console.error('ERROR GLOBAL:', error);
    return Response.json({ error: `Error del servidor: ${error.message}` }, { status: 500 });
  }
}