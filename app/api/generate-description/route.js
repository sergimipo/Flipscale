export const maxDuration = 60;

export async function POST(req) {
  try {
    const body = await req.json();
    // Ignoramos imageBase64 temporalmente para diagnosticar el error de texto
    const { shortDesc, price, condition, languages, presetText } = body;

    console.log('=== DIAGNÓSTICO START ===');
    console.log('shortDesc:', shortDesc);
    console.log('price:', price);
    console.log('condition:', condition);

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return Response.json({ error: 'API Key faltante' }, { status: 500 });
    }

    // PROMPT ULTRA-SIMPLE Y DIRECTO
    const prompt = `Genera un anuncio de segunda mano en formato JSON estricto.

Datos del producto:
- Producto: ${shortDesc || presetText || 'No especificado'}
- Precio: ${price || 'No especificado'}
- Estado: ${condition || 'No especificado'}

Responde SOLO con este formato JSON, sin texto adicional, sin markdown:
{
  "title": "título en español, máximo 60 caracteres",
  "description": "descripción en español con detalles del producto"
}`;

    console.log('Enviando petición a OpenRouter...');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://flipscale.com',
        'X-Title': 'FlipScale',
      },
      body: JSON.stringify({
        // Usamos Llama 3 porque es el más fiable para JSON en modo gratuito
        model: 'meta-llama/llama-3-8b-instruct:free',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    console.log('Status API:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error API:', errorText);
      return Response.json({ error: `API Error: ${response.status}`, rawResponse: errorText }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log('=== CONTENIDO DE LA IA ===');
    console.log(content);
    console.log('=== FIN CONTENIDO ===');

    if (!content) {
      return Response.json({ error: 'La IA no devolvió contenido', rawResponse: JSON.stringify(data) }, { status: 500 });
    }

    // Intentar parsear JSON
    try {
      // Limpiar markdown si la IA lo añade
      const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanContent);
      
      if (parsed.title && parsed.description) {
        console.log('✅ JSON válido parseado correctamente');
        return Response.json({
          title: String(parsed.title).trim(),
          description: String(parsed.description).trim()
        });
      }
    } catch (e) {
      console.error('❌ Error al parsear JSON:', e.message);
    }

    // Si no es JSON válido, devolvemos el texto crudo para diagnóstico
    return Response.json({
      error: 'La IA no devolvió un JSON válido. Respuesta cruda:',
      rawResponse: content
    }, { status: 500 });

  } catch (error) {
    console.error('ERROR GLOBAL:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}