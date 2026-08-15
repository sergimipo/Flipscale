import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { description } = await request.json();

    if (!description) {
      return NextResponse.json({ error: 'Falta la descripción' }, { status: 400 });
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'Falta la clave de API' }, { status: 500 });
    }

    const prompt = `Analiza esta descripción trilingüe de producto y extrae los atributos clave que pueden variar entre diferentes unidades del mismo producto (colores, tallas, modelos, materiales).

DESCRIPCIÓN:
${description}

INSTRUCCIONES:
1. Identifica los atributos principales (color, modelo, material, talla, etc.)
2. Para cada atributo, identifica el valor en cada idioma (ES, EN, FR)
3. Devuelve SOLO un JSON válido con este formato exacto:

{
  "attributes": [
    {
      "type": "color",
      "values": {
        "es": ["azul", "transparente"],
        "en": ["blue", "transparent"],
        "fr": ["bleu", "transparent"]
      }
    },
    {
      "type": "model",
      "values": {
        "es": ["Speedcraft S3"],
        "en": ["Speedcraft S3"],
        "fr": ["Speedcraft S3"]
      }
    }
  ]
}

REGLAS:
- Solo extrae atributos que aparecen en los 3 idiomas
- Los valores deben ser específicos (no genéricos como "producto" o "incluye")
- Si un atributo no tiene traducción obvia (ej: modelo), usa el mismo valor en los 3 idiomas
- No incluyas explicaciones, solo el JSON válido
- Si no hay atributos claros, devuelve: {"attributes": []}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://flipscale.com',
        'X-Title': 'FlipScale',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en análisis de texto multilingüe. Tu única tarea es extraer atributos de productos y devolver un JSON válido.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `Error del servidor: ${response.status}`);
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('La IA no devolvió contenido');
    }

    // Extraer el JSON del contenido (a veces viene con markdown)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se encontró JSON válido en la respuesta');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error detect-attributes:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}