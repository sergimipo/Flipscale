export async function POST(req) {
  try {
    const { productDetails } = await req.json();
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      return Response.json({ error: "Falta la clave de API de OpenRouter" }, { status: 500 });
    }

    // ✅ PROMPT ULTRA-ESTRICTO PARA EL FORMATO TRILINGÜE
    const prompt = `Eres un experto en redacción de anuncios de reventa multilingüe para plataformas como Vinted o Wallapop.

Tu ÚNICA tarea es generar la descripción del producto EXACTAMENTE en el siguiente formato trilingüe, sin añadir NINGÚN texto de conversación, saludo o explicación antes o después.

DATOS DEL PRODUCTO:
${JSON.stringify(productDetails, null, 2)}

FORMATO OBLIGATORIO DE SALIDA:

🇪🇸 Español

[Título o nombre del producto]

[Estado del producto, ej: NUEVO, sin uso ✨ o USADO, buen estado]

[Breve frase sobre el uso o categoría del producto]

✔ [Característica o detalle 1 extraído de los datos]
✔ [Característica o detalle 2 extraído de los datos]
✔ [Característica o detalle 3 extraído de los datos]
✔ [Cualquier otro detalle relevante, medidas, accesorios incluidos, etc. extraído de los datos]

💰 Precio: [Precio] €

────────

🇬🇧 English

[Product title or short description in English]

[Product condition in English]

[Brief phrase about use/category in English]

✔ [Feature 1 in English]
✔ [Feature 2 in English]
✔ [Feature 3 in English]
✔ [Other relevant details in English]

💰 Price: €[Price]

────────

🇫🇷 Français

[Titre ou description courte en français]

[État du produit en français]

[Brève phrase sur l'utilisation/catégorie en français]

✔ [Caractéristique 1 en français]
✔ [Caractéristique 2 en français]
✔ [Caractéristique 3 en français]
✔ [Autres détails pertinents en français]

💰 Prix : [Price] €

INSTRUCCIONES CRÍTICAS:
1. Usa EXACTAMENTE este formato, con los separadores "────────" y los emojis de bandera.
2. No incluyas frases como "Aquí tienes la descripción" o "Espero que te sirva". Empieza directamente con "🇪🇸 Español".
3. Adapta las características (los puntos con ✔) basándote ÚNICAMENTE en los datos proporcionados en "DATOS DEL PRODUCTO".
4. Mantén un tono profesional, atractivo y optimizado para la venta.`;

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
          { 
            role: "system", 
            content: "Eres un copywriter profesional multilingüe. Tu única tarea es generar la descripción final en el formato exacto solicitado. NUNCA añadas texto de conversación, saludos o explicaciones. Empieza directamente con la bandera 🇪🇸." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7, // Un poco de creatividad, pero controlada
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
    
    if (!description) {
      throw new Error("La IA no devolvió ningún contenido.");
    }

    return Response.json({ description });

  } catch (error) {
    console.error("❌ ERROR AL GENERAR DESCRIPCIÓN:", error.message);
    return Response.json({ error: `Error de IA: ${error.message}` }, { status: 500 });
  }
}