export async function POST(req) {
  try {
    const { productDetails } = await req.json();

    // Lee la clave de forma segura desde tu archivo .env.local
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      return Response.json({ error: "Falta la clave de API de OpenRouter" }, { status: 500 });
    }

    const prompt = `Eres un experto en ventas de segunda mano en plataformas como Vinted o Wallapop. 
    Escribe una descripción atractiva, honesta y optimizada para SEO basada en estos datos: ${JSON.stringify(productDetails)}. 
    Incluye: estado, medidas (si las hay), motivo de venta (genérico) y palabras clave relevantes. Usa emojis de forma moderada.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://flipscale.com", // Actualizado a FlipScale
        "X-Title": "FlipScale",                  // Actualizado a FlipScale
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct", // O el modelo que estés usando
        messages: [
          { role: "system", content: "Eres un asistente experto en redacción de anuncios de reventa." },
          { role: "user", content: prompt }
        ],
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const description = data.choices[0].message.content;
    return Response.json({ description });

  } catch (error) {
    console.error("❌ ERROR AL GENERAR DESCRIPCIÓN:", error.message);
    return Response.json({ error: "No se pudo generar la descripción" }, { status: 500 });
  }
}
