export async function POST(req) {
  try {
    const { productDetails } = await req.json();
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      return Response.json({ error: "Falta la clave de API de OpenRouter" }, { status: 500 });
    }

    const prompt = `Eres un experto en ventas de segunda mano en plataformas como Vinted o Wallapop. 
    Escribe una descripción atractiva, honesta y optimizada para SEO basada en estos datos: ${JSON.stringify(productDetails)}. 
    Incluye: estado, medidas (si las hay), motivo de venta (genérico) y palabras clave relevantes. Usa emojis de forma moderada.`;

    // ✅ CAMBIO 1: Usamos el modelo ":free" para asegurar que funcione sin gastar créditos, 
    // o puedes usar "meta-llama/llama-3-8b-instruct" si prefieres otro.
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://flipscale.com",
        "X-Title": "FlipScale",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b:free",   
        messages: [
          { role: "system", content: "Eres un asistente experto en redacción de anuncios de reventa." },
          { role: "user", content: prompt }
        ],
      }),
    });

    const data = await response.json();
    
    // ✅ CAMBIO 2: Verificar si la respuesta HTTP fue un error (401, 402, 429, etc.)
    if (!response.ok) {
      console.error("❌ ERROR OPENROUTER (HTTP):", data);
      throw new Error(data.error?.message || `Error del servidor: ${response.status}`);
    }

    if (data.error) {
      throw new Error(data.error.message);
    }

    const description = data.choices?.[0]?.message?.content;
    
    if (!description) {
      throw new Error("La IA no devolvió ningún contenido.");
    }

    return Response.json({ description });

  } catch (error) {
    console.error("❌ ERROR AL GENERAR DESCRIPCIÓN:", error.message);
    
    // ✅ CAMBIO 3: Devolver el error REAL al frontend para poder depurarlo
    return Response.json({ error: `Error de IA: ${error.message}` }, { status: 500 });
  }
}