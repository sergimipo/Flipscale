export async function POST(req) {
  try {
    const { imageBase64, shortDescription, price, condition, languages } = await req.json();
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      return Response.json({ error: "Falta la clave de API de OpenRouter" }, { status: 500 });
    }

    const langMap = {
      es: { flag: '🇪🇸', name: 'Español', priceLabel: 'Precio' },
      en: { flag: '🇧', name: 'English', priceLabel: 'Price' },
      fr: { flag: '🇫🇷', name: 'Français', priceLabel: 'Prix' }
    };

    let formatInstructions = "FORMATO OBLIGATORIO DE SALIDA (SOLO para los idiomas seleccionados):\n";
    languages.forEach(lang => {
      const l = langMap[lang];
      if (l) {
        formatInstructions += `${l.flag} ${l.name}\n`;
        formatInstructions += `[Título atractivo del producto]\n`;
        formatInstructions += `[Estado: ${condition} + emoji apropiado]\n`;
        formatInstructions += `[Breve frase sobre el uso o categoría del producto]\n`;
        formatInstructions += `✔ [Característica visual del PRODUCTO: color, material, marca, diseño]\n`;
        formatInstructions += `✔ [Característica visual del PRODUCTO: estado, acabados, detalles]\n`;
        formatInstructions += `✔ [Accesorios o extras incluidos (si los hay)]\n`;
        formatInstructions += `💰 ${l.priceLabel}: ${price} €\n`;
        formatInstructions += `────────\n`;
      }
    });

    const prompt = `Eres un experto en redacción de anuncios de reventa multilingüe con visión por computadora.
    
    TU TAREA: Analiza la imagen y genera la descripción de venta EXACTAMENTE en el formato solicitado.
    
    REGLAS DE ORO ABSOLUTAS:
    1. NUNCA uses corchetes [ ]. Reemplázalos con información real.
    2. IGNORA COMPLETAMENTE el fondo, entorno, superficie donde está el producto, sombras, iluminación del lugar. Solo describe el PRODUCTO en sí.
    3. Si hay texto visible en el producto (marca, modelo), inclúyelo.
    4. Empieza DIRECTAMENTE con la primera bandera de idioma. Sin saludos ni explicaciones.
    5. Usa emojis de forma moderada y profesional.
    6. El precio debe aparecer UNA SOLA VEZ con el símbolo € al final (ej: "35,99 €", NO "35,99€ €").

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
        model: "openrouter/free",
        messages: [
          { 
            role: "system", 
            content: "Eres un copywriter profesional multilingüe especializado en productos de segunda mano. Tu única tarea es generar la descripción final del PRODUCTO, ignorando completamente el fondo o entorno de la foto. NUNCA devuelvas corchetes [ ]. Empieza directamente con la bandera del primer idioma." 
          },
          { 
            role: "user", 
            content: [
              { type: "text", text: prompt },
              ...(imageBase64 ? [{ type: "image_url", image_url: { url: imageBase64 } }] : [])
            ]
          }
        ],
        temperature: 0.3,
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