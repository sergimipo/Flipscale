export async function POST(req) {
  try {
    const { imageBase64, shortDescription, price, condition, languages } = await req.json();
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      return Response.json({ error: "Falta la clave de API de OpenRouter" }, { status: 500 });
    }

    const langMap = {
      es: { flag: '🇪🇸', name: 'Español', priceLabel: 'Precio' },
      en: { flag: '🇬🇧', name: 'English', priceLabel: 'Price' },
      fr: { flag: '🇫🇷', name: 'Français', priceLabel: 'Prix' }
    };

    let formatInstructions = "FORMATO OBLIGATORIO DE SALIDA (SOLO para los idiomas seleccionados):\n";
    languages.forEach(lang => {
      const l = langMap[lang];
      if (l) {
        formatInstructions += `${l.flag} ${l.name}\n`;
        formatInstructions += `[Nombre del producto visto en la imagen o en la descripción breve]\n`;
        formatInstructions += `[Estado: ${condition} + detalle visual de la imagen, ej: ✨]\n`;
        formatInstructions += `[Breve frase sobre el uso basada en la descripción breve]\n`;
        formatInstructions += `✔ [Detalle visual 1 extraído de la imagen]\n`;
        formatInstructions += `✔ [Detalle visual 2 extraído de la imagen]\n`;
        formatInstructions += `✔ [Detalle visual 3 extraído de la imagen o descripción]\n`;
        formatInstructions += `💰 ${l.priceLabel}: ${price} €\n`;
        formatInstructions += `────────\n`;
      }
    });

    const prompt = `Eres un experto en redacción de anuncios de reventa multilingüe con visión por computadora.
    
    TU TAREA: Analiza la imagen adjunta y los datos proporcionados. Genera la descripción de venta EXACTAMENTE en el formato solicitado.
    
    REGLAS DE ORO ABSOLUTAS:
    1. NUNCA uses corchetes [ ]. Debes reemplazarlos con la información real que ves en la imagen o en los datos.
    2. Si un detalle no se ve claramente en la imagen, usa la "Descripción breve" proporcionada.
    3. Empieza DIRECTAMENTE con la primera bandera de idioma. No añadas saludos, introducciones ni explicaciones.
    4. Usa emojis de forma moderada y profesional.

    DATOS DEL PRODUCTO:
    - Descripción breve: ${shortDescription}
    - Estado declarado: ${condition}
    - Precio: ${price} €
    - Idiomas solicitados: ${languages.join(', ')}

    ${formatInstructions}

    ¡Genera la descripción AHORA siguiendo estrictamente el formato!`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://flipscale.com",
        "X-Title": "FlipScale",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/free", // ✅ EL ROUTER INTELIGENTE QUE ELIGE EL MEJOR MODELO GRATUITO CON VISIÓN
        messages: [
          { 
            role: "system", 
            content: "Eres un copywriter profesional multilingüe con capacidad de visión. Tu única tarea es generar la descripción final reemplazando los corchetes con datos reales de la imagen y el texto. NUNCA devuelvas corchetes [ ]. Empieza directamente con la bandera del primer idioma." 
          },
          { 
            role: "user", 
            content: [
              { type: "text", text: prompt },
              ...(imageBase64 ? [{ type: "image_url", image_url: { url: imageBase64 } }] : [])
            ]
          }
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("❌ ERROR OPENROUTER (HTTP):", data);
      throw new Error(data.error?.message || `Error del servidor: ${response.status}`);
    }

    if (data.error) {
      throw new Error(data.error.message);
    }

    const description = data.choices?.[0]?.message?.content;
    if (!description) throw new Error("La IA no devolvió ningún contenido.");

    return Response.json({ description });

  } catch (error) {
    console.error("❌ ERROR AL GENERAR DESCRIPCIÓN:", error.message);
    return Response.json({ error: `Error de IA: ${error.message}` }, { status: 500 });
  }
}