export async function POST(req) {
  try {
    const { imageBase64, shortDesc, price, condition, languages, presetText } = await req.json();
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      return Response.json({ error: "Falta la clave de API de OpenRouter" }, { status: 500 });
    }

    const MAX_RETRIES = 5;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      let prompt = "";

      if (presetText && presetText.trim().length > 0) {
        prompt = `Eres un editor de texto estricto. Tienes una DESCRIPCIÓN BASE y unos CAMBIOS que el usuario quiere aplicar.

REGLAS ABSOLUTAS:
1. Reescribe la DESCRIPCIÓN BASE aplicando los CAMBIOS.
2. Mantén EXACTAMENTE el mismo formato, saltos de línea y estructura.
3. Traduce los cambios a los 3 idiomas de forma coherente con la base.
4. Si los cambios incluyen un nuevo precio, actualízalo en los 3 idiomas. Si no, mantén el precio de la base.
5. Si los cambios incluyen un nuevo estado, actualízalo en los 3 idiomas. Si no, mantén el estado de la base.
6. NO añadas texto extra, introducciones ni explicaciones.

DESCRIPCIÓN BASE:
${presetText}

CAMBIOS A APLICAR:
- Descripción de cambios: ${shortDesc || '(sin cambios específicos)'}
- Precio: ${price || '(mantener el de la base)'}
- Estado: ${condition || '(mantener el de la base)'}
${imageBase64 ? '- Analiza la imagen para ver los detalles visuales de los cambios.' : ''}

Genera la descripción editada AHORA.`;
      } else {
        prompt = `Eres un sistema estricto de formateo de texto. Tu ÚNICA tarea es devolver el texto EXACTAMENTE con este formato.

REGLAS ABSOLUTAS:
1. Empieza cada sección con la bandera del idioma seguida del nombre del idioma.
2. El estado debe ir SIEMPRE en MAYÚSCULAS.
3. Usa exactamente 3 viñetas con el símbolo de check.
4. Separa cada idioma con una línea de guiones.

FORMATO EXACTO:

🇪🇸 Español
[Título]
[ESTADO EN MAYÚSCULAS]
[Beneficios]
✔ [Caract. 1]
✔ [Caract. 2]
✔ [Caract. 3]
💰 Precio: ${price || '___'} €
────────

🇧 English
[Title]
[CONDITION IN UPPERCASE]
[Benefits]
✔ [Feature 1]
✔ [Feature 2]
✔ [Feature 3]
💰 Price: €${price || '___'}
────────

🇷 Français
[Titre]
[ÉTAT EN MAJUSCULES]
[Bénéfices]
✔ [Caract. 1]
✔ [Caract. 2]
✔ [Caract. 3]
💰 Prix : ${price || '___'} €

DATOS:
- Descripción: ${shortDesc}
- Precio: ${price || '(sin especificar)'}
- Estado: ${condition || '(sin especificar)'}
${imageBase64 ? '- Analiza la imagen.' : ''}`;
      }

      try {
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
                content: "Eres un sistema estricto. Devuelves ÚNICAMENTE el texto formateado, sin explicaciones." 
              },
              { 
                role: "user", 
                content: [
                  { type: "text", text: prompt },
                  ...(imageBase64 ? [{ type: "image_url", image_url: { url: imageBase64 } }] : [])
                ]
              }
            ],
            temperature: 0.1,
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error?.message || `Error: ${response.status}`);
        }
        if (data.error) {
          throw new Error(data.error.message);
        }

        const description = data.choices?.[0]?.message?.content;
        if (!description) {
          throw new Error("La IA no devolvió contenido.");
        }

        // ✅ VALIDACIÓN MÍNIMA: solo rechazar si es claramente un error
        const isSafetyMessage = description.toLowerCase().includes('user safety');
        const isTooShort = description.length < 30;
        const isErrorMessage = description.toLowerCase().includes('error') || description.toLowerCase().includes('no puedo');

        if (isSafetyMessage || isTooShort || isErrorMessage) {
          console.warn(`Intento ${attempt}/${MAX_RETRIES}: respuesta inválida (safety=${isSafetyMessage}, corta=${isTooShort}, error=${isErrorMessage})`);
          if (attempt < MAX_RETRIES) {
            continue;
          }
        } else {
          // ✅ Respuesta válida
          const cleanDescription = description.replace(/^```[\s\S]*?\n/, '').replace(/```$/, '').trim();
          return Response.json({ description: cleanDescription });
        }

      } catch (error) {
        console.error(`Error en intento ${attempt}/${MAX_RETRIES}:`, error.message);
        if (attempt < MAX_RETRIES) {
          continue;
        }
      }
    }

    return Response.json({ 
      error: `La IA no pudo generar una descripción válida tras ${MAX_RETRIES} intentos. Por favor, inténtalo de nuevo.` 
    }, { status: 503 });

  } catch (error) {
    console.error("ERROR GLOBAL:", error.message);
    return Response.json({ error: `Error de IA: ${error.message}` }, { status: 500 });
  }
}