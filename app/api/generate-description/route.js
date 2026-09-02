function extractJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function POST(req) {
  try {
    const { imageBase64, shortDesc, price, condition, presetText } = await req.json();

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return Response.json({ error: 'Falta la clave de API de OpenRouter' }, { status: 500 });
    }

    const jsonFormat = `
FORMATO DE RESPUESTA OBLIGATORIO: devuelve ÚNICAMENTE un JSON válido, sin markdown y sin explicaciones, con esta estructura exacta:
{
  "titles": { "es": "título", "en": "title", "fr": "titre" },
  "descriptions": { "es": "descripción", "en": "description", "fr": "description" }
}`;

    const titleRules = `
REGLAS DE LOS TÍTULOS:
- Máximo 60 caracteres, sin emojis ni signos de exclamación.
- Incluye marca, modelo, color y talla cuando se conozcan.
- Ejemplo: "Sudadera Nike Vintage Negra Talla M"`;

    const descRules = `
REGLAS DE LAS DESCRIPCIONES (dentro del string de cada idioma):
- Primera línea: el estado en MAYÚSCULAS.
- Después, exactamente 3 viñetas con el símbolo ✔.
- Última línea: "💰 Precio: X €" si hay precio; si no, omítela.
- Usa \\n para los saltos de línea dentro de cada string.`;

    let prompt = '';
    if (presetText && presetText.trim().length > 0) {
      prompt = `Eres un editor estricto de anuncios de segunda mano. Tienes una DESCRIPCIÓN BASE y unos CAMBIOS.
Reescribe la base aplicando los cambios y devuelve títulos y descripciones en es/en/fr.
Mantén el mismo formato, estructura y saltos de línea de la base.
Si los cambios incluyen precio o estado nuevos, actualízalos en los 3 idiomas; si no, mantén los de la base.
Adapta también el título si los cambios lo requieren (color, talla, modelo).
${titleRules}
${descRules}
${jsonFormat}

DESCRIPCIÓN BASE:
${presetText}

CAMBIOS:
- Descripción: ${shortDesc || '(sin cambios específicos)'}
- Precio: ${price || '(mantener el de la base)'}
- Estado: ${condition || '(mantener el de la base)'}
${imageBase64 ? '- Analiza la imagen para ajustar los detalles visuales.' : ''}`;
    } else {
      prompt = `Eres un experto en ventas de segunda mano en Vinted, Wallapop y Etsy.
Genera un título atractivo y una descripción completa en es/en/fr a partir de los datos${imageBase64 ? ' y de la imagen' : ''}.
${titleRules}
${descRules}
${jsonFormat}

DATOS:
- Descripción: ${shortDesc || '(sin datos)'}
- Precio: ${price || '(sin especificar)'}
- Estado: ${condition || '(sin especificar)'}`;
    }

    const MAX_RETRIES = 5;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://flipscale.com',
            'X-Title': 'FlipScale',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'openrouter/free',
            messages: [
              {
                role: 'system',
                content: 'Devuelves ÚNICAMENTE JSON válido, sin markdown ni explicaciones.',
              },
              {
                role: 'user',
                content: [
                  { type: 'text', text: prompt },
                  ...(imageBase64 ? [{ type: 'image_url', image_url: { url: imageBase64 } }] : []),
                ],
              },
            ],
            temperature: 0.1,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || `Error: ${response.status}`);
        }
        const content = data.choices?.[0]?.message?.content;
        if (!content) throw new Error('La IA no devolvió contenido.');

        const parsed = extractJson(content);
        if (parsed && parsed.descriptions) {
          return Response.json({
            titles: parsed.titles || null,
            description: parsed.descriptions,
          });
        }
        console.warn(`Intento ${attempt}/${MAX_RETRIES}: JSON no válido`);
      } catch (error) {
        console.error(`Error en intento ${attempt}/${MAX_RETRIES}:`, error.message);
      }
    }

    return Response.json(
      { error: 'La IA no pudo generar una respuesta válida tras varios intentos. Inténtalo de nuevo.' },
      { status: 503 }
    );
  } catch (error) {
    console.error('ERROR GLOBAL:', error.message);
    return Response.json({ error: `Error de IA: ${error.message}` }, { status: 500 });
  }
}