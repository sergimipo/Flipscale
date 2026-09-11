// Permite que la función viva hasta 60s en Vercel (evita cortes = "load failed")
export const maxDuration = 60;

function extractJson(text) {
  const clean = text.replace(/```json/gi, '').replace(/```/g, '');
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(clean.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function POST(req) {
  try {
    const { imageBase64, shortDesc, price, condition, languages, presetText } = await req.json();

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return Response.json({ error: 'Falta la clave de API de OpenRouter' }, { status: 500 });
    }

    const langs = Array.isArray(languages) && languages.length > 0 ? languages : ['es', 'en', 'fr'];
    const langNames = { es: '🇪🇸 Español', en: '🇬🇧 English', fr: '🇫🇷 Français' };
    const langList = langs.map((l) => langNames[l] || l).join(', ');

    const jsonFormat = `
FORMATO DE RESPUESTA OBLIGATORIO: devuelve ÚNICAMENTE un JSON válido, sin markdown y sin explicaciones:
{
  "title": "título del anuncio",
  "description": "texto único de la descripción"
}
Si tu respuesta no es exactamente ese JSON, será rechazada.`;

    const titleRules = `
REGLAS DEL TÍTULO:
- SIEMPRE en español, aunque la descripción incluya otros idiomas.
- Máximo 60 caracteres, sin emojis ni signos de exclamación.
- Incluye marca, modelo, color y talla cuando se conozcan.
- Ejemplo: "Sudadera Nike Vintage Negra Talla M"`;

    const descRules = `
REGLAS DE LA DESCRIPCIÓN (un ÚNICO string que contiene los idiomas: ${langList}):
- Un bloque por idioma, en este orden: ${langList}.
- Cada bloque empieza con su bandera y nombre (${langNames.es} / ${langNames.en} / ${langNames.fr}).
- Primera línea del bloque: el estado en MAYÚSCULAS.
- Después, exactamente 3 viñetas con el símbolo ✔.
- Última línea del bloque con el precio en el idioma correspondiente: "💰 Precio: X €" / "💰 Price: €X" / "💰 Prix : X €" (omítela si no hay precio).
- Separa los bloques de idioma con una línea de guiones: ────────
- Usa \\n para los saltos de línea dentro del string.`;

    let basePrompt = '';
    if (presetText && presetText.trim().length > 0) {
      basePrompt = `Eres un editor estricto de anuncios de segunda mano. Tienes una DESCRIPCIÓN BASE y unos CAMBIOS.
Reescribe la base aplicando los cambios y devuelve el título (siempre en español) y la descripción en un único texto.
Mantén el mismo formato, estructura y saltos de línea de la base.
Si los cambios incluyen precio o estado nuevos, actualízalos en todos los idiomas; si no, mantén los de la base.
Adapta el título en español si los cambios lo requieren (color, talla, modelo).
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
      basePrompt = `Eres un experto en ventas de segunda mano en Vinted, Wallapop y Etsy.
Genera el título del anuncio (siempre en español) y una descripción única en los idiomas: ${langList}, a partir de los datos${imageBase64 ? ' y de la imagen' : ''}.
${titleRules}
${descRules}
${jsonFormat}

DATOS:
- Descripción: ${shortDesc || '(sin datos)'}
- Precio: ${price || '(sin especificar)'}
- Estado: ${condition || '(sin especificar)'}`;
    }

    const MAX_RETRIES = 3;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const prompt =
        attempt > 1
          ? `IMPORTANTE: tu respuesta anterior fue RECHAZADA por no ser un JSON válido o no seguir el formato.\n${basePrompt}`
          : basePrompt;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 25000);
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          signal: controller.signal,
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
                content:
                  'Devuelves ÚNICAMENTE un JSON válido con las claves "title" y "description". Sin markdown, sin bloques de código, sin explicaciones. Cualquier otro formato será rechazado.',
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
        if (parsed && typeof parsed.description === 'string' && parsed.description.trim().length > 20) {
          return Response.json({
            title: typeof parsed.title === 'string' && parsed.title.trim() ? parsed.title.trim() : null,
            description: parsed.description.trim(),
          });
        }
        console.warn(`Intento ${attempt}/${MAX_RETRIES}: JSON o formato no válido`);
      } catch (error) {
        console.error(`Error en intento ${attempt}/${MAX_RETRIES}:`, error.message);
      } finally {
        clearTimeout(timer);
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