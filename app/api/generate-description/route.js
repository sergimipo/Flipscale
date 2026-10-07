export const maxDuration = 60;

/* ============================================================
   CONFIGURACIÓN
   ============================================================
   Modelos: se leen de la variable de entorno GEMINI_MODELS en Vercel
   (separados por comas). Si no existe, se usa esta lista por defecto.
   Si Google retira un modelo, solo cambias la variable y redespliegas.
   ============================================================ */
const DEFAULT_MODELS = 'gemini-3.1-flash-lite,gemini-3-flash-preview,gemini-2.5-flash';
const REQUEST_TIMEOUT_MS = 18000;

const LANG_NAMES = { es: '🇪🇸 Español', en: '🇬🇧 English', fr: '🇫🇷 Français' };

const SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    description: { type: 'STRING' },
  },
  required: ['title', 'description'],
};

/* Estados de Vinted en cada idioma */
const STATES = [
  { key: 'nuevo con etiquetas', es: 'NUEVO CON ETIQUETAS', en: 'NEW WITH TAGS', fr: 'NEUF AVEC ÉTIQUETTE' },
  { key: 'nuevo sin etiquetas', es: 'NUEVO SIN ETIQUETAS', en: 'NEW WITHOUT TAGS', fr: 'NEUF SANS ÉTIQUETTE' },
  { key: 'muy bueno', es: 'MUY BUENO', en: 'VERY GOOD', fr: 'TRÈS BON ÉTAT' },
  { key: 'bueno', es: 'BUENO', en: 'GOOD', fr: 'BON ÉTAT' },
  { key: 'satisfactorio', es: 'SATISFACTORIO', en: 'SATISFACTORY', fr: 'SATISFAISANT' },
];

/* Colores: formas es [masc sing, fem sing, masc plural, fem plural], en, fr [igual] */
const COLORS = [
  { es: ['rojo', 'roja', 'rojos', 'rojas'], en: 'red', fr: ['rouge', 'rouge', 'rouges', 'rouges'] },
  { es: ['azul', 'azul', 'azules', 'azules'], en: 'blue', fr: ['bleu', 'bleue', 'bleus', 'bleues'] },
  { es: ['negro', 'negra', 'negros', 'negras'], en: 'black', fr: ['noir', 'noire', 'noirs', 'noires'] },
  { es: ['blanco', 'blanca', 'blancos', 'blancas'], en: 'white', fr: ['blanc', 'blanche', 'blancs', 'blanches'] },
  { es: ['verde', 'verde', 'verdes', 'verdes'], en: 'green', fr: ['vert', 'verte', 'verts', 'vertes'] },
  { es: ['amarillo', 'amarilla', 'amarillos', 'amarillas'], en: 'yellow', fr: ['jaune', 'jaune', 'jaunes', 'jaunes'] },
  { es: ['gris', 'gris', 'grises', 'grises'], en: 'grey', fr: ['gris', 'grise', 'gris', 'grises'] },
  { es: ['rosa', 'rosa', 'rosas', 'rosas'], en: 'pink', fr: ['rose', 'rose', 'roses', 'roses'] },
  { es: ['morado', 'morada', 'morados', 'moradas'], en: 'purple', fr: ['violet', 'violette', 'violets', 'violettes'] },
  { es: ['naranja', 'naranja', 'naranjas', 'naranjas'], en: 'orange', fr: ['orange', 'orange', 'oranges', 'oranges'] },
  { es: ['marrón', 'marrón', 'marrones', 'marrones'], en: 'brown', fr: ['marron', 'marron', 'marron', 'marron'] },
  { es: ['beige', 'beige', 'beiges', 'beiges'], en: 'beige', fr: ['beige', 'beige', 'beiges', 'beiges'] },
  { es: ['dorado', 'dorada', 'dorados', 'doradas'], en: 'gold', fr: ['doré', 'dorée', 'dorés', 'dorées'] },
  { es: ['plateado', 'plateada', 'plateados', 'plateadas'], en: 'silver', fr: ['argenté', 'argentée', 'argentés', 'argentées'] },
  { es: ['transparente', 'transparente', 'transparentes', 'transparentes'], en: 'transparent', fr: ['transparent', 'transparente', 'transparents', 'transparentes'] },
  { es: ['ahumado', 'ahumada', 'ahumados', 'ahumadas'], en: 'smoked', fr: ['fumé', 'fumée', 'fumés', 'fumées'] },
];

/* ============================================================
   UTILIDADES GENERALES
   ============================================================ */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripAccents(s) {
  return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function cleanPrice(p) {
  if (p === null || p === undefined) return '';
  const m = String(p).match(/\d+(?:[.,]\d+)?/);
  return m ? m[0] : '';
}

function cleanTitle(title) {
  let t = String(title || '')
    .replace(/["“”«»]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Aplica mayúscula a la primera letra de cada palabra
  t = t.split(' ').map(word => {
    if (!word) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');

  if (t.length > 60) {
    const cut = t.slice(0, 60);
    const lastSpace = cut.lastIndexOf(' ');
    t = (lastSpace > 30 ? cut.slice(0, lastSpace) : cut).trim();
  }
  return t;
}

function parseImage(b64) {
  if (!b64 || typeof b64 !== 'string') return null;
  let mime = 'image/jpeg';
  let data = b64;
  const m = b64.match(/^data:(image\/[a-z0-9.+-]+);base64,/i);
  if (m) {
    mime = m[1].toLowerCase();
    data = b64.slice(m[0].length);
  } else if (b64.includes(',')) {
    data = b64.split(',')[1];
  }
  return data ? { mime, data } : null;
}

function extractJson(text) {
  if (!text || typeof text !== 'string') return null;

  const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');

  if (start !== -1 && end !== -1) {
    try {
      const parsed = JSON.parse(clean.slice(start, end + 1));
      if (parsed.title && parsed.description) return parsed;
    } catch (e) {}
  }

  const titleMatch = clean.match(/"title"\s*:\s*"((?:[^"\\]|\\.)*)"/i);
  const descMatch = clean.match(/"description"\s*:\s*"((?:[^"\\]|\\.)*)"/i);
  if (titleMatch && descMatch) {
    return {
      title: titleMatch[1].replace(/\\"/g, '"'),
      description: descMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
    };
  }
  return null;
}

/* ============================================================
   EDICIÓN LOCAL (precio, estado, color) — usada para reforzar
   el precio y como plan B si la IA no responde
   ============================================================ */
function detectLang(line) {
  const l = String(line);
  if (l.length > 40 || /[✔✅]/.test(l)) return null;
  if (/🇪🇸|español/i.test(l)) return 'es';
  if (/🇬🇧|english/i.test(l)) return 'en';
  if (/🇫🇷|fran[cç]ais/i.test(l)) return 'fr';
  return null;
}

/* Cambia el número SOLO en la línea del precio, respetando el formato de cada idioma */
function applyPrice(text, price) {
  const num = cleanPrice(price);
  if (!num || !text) return text;
  return text
    .split('\n')
    .map((line) => {
      const isPriceLine = /💰/.test(line) || /^\s*(precio|price|prix)\b/i.test(line);
      if (isPriceLine && /\d/.test(line)) return line.replace(/\d+(?:[.,]\d+)?/, num);
      return line;
    })
    .join('\n');
}

function findState(condition) {
  const c = stripAccents(String(condition || '').toLowerCase()).trim();
  if (!c) return null;
  return STATES.find((s) => c.includes(s.key)) || null;
}

function stateText(condition, lang) {
  const found = findState(condition);
  return found ? found[lang] || found.es : String(condition).toUpperCase();
}

/* Sustituye la línea de estado (la primera línea en MAYÚSCULAS tras la cabecera de idioma) */
function applyCondition(text, condition) {
  if (!condition || !String(condition).trim() || !text) return text;
  let lang = 'es';
  let expectState = true;
  return text
    .split('\n')
    .map((line) => {
      const l = detectLang(line);
      if (l) {
        lang = l;
        expectState = true;
        return line;
      }
      if (!line.trim()) return line;
      if (expectState) {
        expectState = false;
        const isStateLine = line === line.toUpperCase() && /\p{L}/u.test(line) && !/[✔✅💰]/.test(line);
        if (isStateLine) return stateText(condition, lang);
      }
      return line;
    })
    .join('\n');
}

function escapeRegex(w) {
  return w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function wordRegex(words) {
  const alt = [...new Set(words)]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegex)
    .join('|');
  return new RegExp('(?<![\\p{L}])(?:' + alt + ')(?![\\p{L}])', 'giu');
}

function entryWords(entry, lang) {
  if (lang === 'en') return [entry.en];
  return entry[lang];
}

function findColorInText(text) {
  let best = null;
  for (const entry of COLORS) {
    for (const lang of ['es', 'en', 'fr']) {
      const re = wordRegex(entryWords(entry, lang));
      let m;
      while ((m = re.exec(text))) {
        if (!best || m.index >= best.index) best = { entry, index: m.index };
      }
    }
  }
  return best ? best.entry : null;
}

function matchCase(original, out) {
  if (original.length > 1 && original === original.toUpperCase()) return out.toUpperCase();
  if (original[0] === original[0].toUpperCase() && original[0] !== original[0].toLowerCase()) {
    return out.charAt(0).toUpperCase() + out.slice(1);
  }
  return out;
}

function convertWord(match, before, from, to, lang) {
  if (lang === 'en') return to.en;
  const f = from[lang];
  const t = to[lang];
  const lower = match.toLowerCase();
  const plural = lower === f[2] || lower === f[3];
  const masc = plural ? f[2] : f[0];
  const fem = plural ? f[3] : f[1];
  let isFem;
  if (masc !== fem) {
    isFem = lower === fem;
  } else {
    // color invariable (azul, verde...): deducimos el género por la palabra anterior
    const prev = (before.trim().split(/\s+/).pop() || '').toLowerCase();
    isFem = lang === 'es' ? /as?$/.test(prev) : /es?$/.test(prev);
  }
  return t[(plural ? 2 : 0) + (isFem ? 1 : 0)];
}

function recolor(text, from, to) {
  let lang = 'es';
  return text
    .split('\n')
    .map((line) => {
      const l = detectLang(line);
      if (l) lang = l;
      const re = wordRegex(entryWords(from, lang));
      return line.replace(re, (match, offset, whole) => {
        const out = convertWord(match, whole.slice(0, offset), from, to, lang);
        return matchCase(match, out);
      });
    })
    .join('\n');
}

/* Color dominante del preset (el que más se repite), distinto del nuevo */
function dominantColor(text, exclude) {
  let best = null;
  let bestCount = 0;
  for (const entry of COLORS) {
    if (entry === exclude) continue;
    let count = 0;
    let lang = 'es';
    for (const line of text.split('\n')) {
      const l = detectLang(line);
      if (l) lang = l;
      const m = line.match(wordRegex(entryWords(entry, lang)));
      if (m) count += m.length;
    }
    if (count > bestCount) {
      best = entry;
      bestCount = count;
    }
  }
  return best;
}

function titleFromPreset(text) {
  const lines = String(text || '').split('\n');
  for (const line of lines) {
    if (/^\s*[✔✅]\uFE0F?\s*/u.test(line)) {
      const t = line.replace(/^\s*[✔✅]\uFE0F?\s*/u, '').trim();
      if (t.length > 3) return cleanTitle(t);
    }
  }
  for (const line of lines) {
    const t = line.trim();
    if (t && !detectLang(t) && !/^[─\-—_=]{3,}$/.test(t) && !/💰/.test(t)) return cleanTitle(t);
  }
  return '';
}

/* Plan B para el modo preset: aplica los cambios sin IA */
function localPresetEdit({ presetText, shortDesc, price, condition }) {
  let desc = presetText;

  const newColor = shortDesc ? findColorInText(shortDesc) : null;
  if (newColor) {
    const oldColor = dominantColor(desc, newColor);
    if (oldColor) desc = recolor(desc, oldColor, newColor);
  }
  desc = applyCondition(desc, condition);
  desc = applyPrice(desc, price);

  const title = titleFromPreset(desc) || cleanTitle(shortDesc) || 'Producto En Venta';
  return { title, description: desc };
}

/* Plan B para el modo sin preset */
function localNewTemplate({ langs, shortDesc, price, condition }) {
  const num = cleanPrice(price);
  const desc = langs
    .map((l) => {
      const name = LANG_NAMES[l] || l;
      const cond = condition ? stateText(condition, l) : '';
      const priceLine = num
        ? l === 'en'
          ? `💰 Price: €${num}`
          : l === 'fr'
          ? ` Prix : ${num} €`
          : `💰 Precio: ${num} €`
        : '';
      const bullets =
        l === 'en'
          ? [shortDesc || 'Item in good condition', 'Check the photos for more details', 'Fast and safe shipping']
          : l === 'fr'
          ? [shortDesc || 'Article en bon état', 'Voir les photos pour plus de détails', 'Envoi rapide et sécurisé']
          : [shortDesc || 'Producto en buen estado', 'Revisa las fotos para más detalles', 'Envíos rápidos y seguros'];
      return [name, cond, ...bullets.map((b) => `✔ ${b}`), priceLine].filter(Boolean).join('\n');
    })
    .join('\n────────\n');

  return { title: cleanTitle(shortDesc) || 'Producto En Venta', description: desc };
}

/* ============================================================
   PROMPTS
   ============================================================ */
const STATES_PROMPT_TABLE = STATES.map((s) => `  · ${s.es} → EN: ${s.en} → FR: ${s.fr}`).join('\n');

function buildPresetPrompt({ presetText, shortDesc, price, condition }) {
  const changes = [];
  if (shortDesc && String(shortDesc).trim()) changes.push(`- Cambio pedido por el usuario: ${String(shortDesc).trim()}`);
  if (cleanPrice(price)) changes.push(`- Nuevo precio: ${cleanPrice(price)} €`);
  if (condition && String(condition).trim()) changes.push(`- Nuevo estado: ${String(condition).trim()}`);
  const changesText = changes.length ? changes.join('\n') : '- Ninguno';

  return `Eres un editor de anuncios de segunda mano para Vinted. Recibes un ANUNCIO BASE ya escrito y una lista de CAMBIOS. Debes devolver el MISMO anuncio con los cambios aplicados, más un título nuevo.

REGLAS PARA "description":
1. Conserva EXACTAMENTE la estructura: mismos bloques de idioma, mismo orden, mismos emojis, viñetas, separadores y saltos de línea. No añadas ni quites bloques ni líneas.
2. Aplica SOLO los cambios indicados. Todo lo que no se menciona se queda tal cual.
3. Si cambia el COLOR: sustituye TODAS las menciones del color antiguo, en TODOS los idiomas, por el nuevo, adaptando género y número a cada idioma. Ejemplos: "gafas rojas" → "gafas azules"; "zapatillas negras" → "zapatillas blancas"; "sudadera roja" → "sudadera azul"; "pantalón negro" → "pantalón blanco"; "red" → "blue"; "rouges" → "bleues". Si hay otros colores que no cambian (detalles, logo, montura), déjalos.
4. Si cambia el PRECIO: cámbialo solo en la línea del precio de cada bloque, manteniendo el formato de cada idioma (ej: "💰 Precio: 25 €", " Price: €25", "💰 Prix : 25 €").
5. Si cambia el ESTADO: sustituye la línea de estado en MAYÚSCULAS de cada bloque, traducida al idioma del bloque:
${STATES_PROMPT_TABLE}
6. Si el cambio es de otro tipo (talla, modelo, defecto, accesorios...), aplícalo donde corresponda y corrige cualquier viñeta que quede contradictoria.
7. Si los cambios son "Ninguno", devuelve el anuncio base sin modificar.

REGLAS PARA "title":
- En español, MÁXIMO 60 caracteres.
- Describe el producto del anuncio base CON los cambios ya aplicados.
- Formato: tipo de producto + marca + modelo + color (el NUEVO, con concordancia) + talla si aparece. Ejemplo: "Gafas De Sol Oakley Speedcraft Azules".
- La primera letra de cada palabra debe ser MAYÚSCULA.
- Sin emojis, sin comillas, sin precio, sin la palabra "Producto", no todo en mayúsculas.

ANUNCIO BASE:
<<<
${presetText}
>>>

CAMBIOS:
${changesText}

Si hay una imagen adjunta, úsala solo para confirmar datos que el texto no aclare; los cambios del usuario siempre mandan.

Devuelve SOLO un objeto JSON: {"title": "...", "description": "..."}. En "description" usa saltos de línea reales (\\n).`;
}

function buildNewPrompt({ langs, shortDesc, price, condition }) {
  const langList = langs.map((l) => LANG_NAMES[l] || l).join(', ');
  return `Eres un experto en ventas de segunda mano en Vinted. Genera un anuncio profesional.

REGLAS PARA "title":
- En español, MÁXIMO 60 caracteres.
- Formato: tipo de producto + marca + modelo + color + talla si se conoce. Ejemplo: "Zapatillas Nike Air Max 90 Blancas Talla 42".
- La primera letra de cada palabra debe ser MAYÚSCULA.
- Sin emojis, sin comillas, sin precio, no todo en mayúsculas.

REGLAS PARA "description":
- Un único string con saltos de línea (\\n), con un bloque por idioma en este orden: ${langList}.
- Cada bloque empieza con el nombre del idioma tal cual (ej: ${LANG_NAMES.es}).
- Segunda línea del bloque: el ESTADO EN MAYÚSCULAS, traducido al idioma del bloque:
${STATES_PROMPT_TABLE}
- Después, 3 a 6 viñetas que empiezan por "✔" con información útil y veraz (marca, modelo, color, material, talla, detalles visibles en la foto). No inventes datos que no se vean ni se hayan dado.
- Última línea del bloque: el precio ("💰 Precio: X €", "💰 Price: €X", "💰 Prix : X €"). Omítela si no hay precio.
- Separa los bloques con una línea que contenga solo: ───────

DATOS:
- Producto: ${shortDesc || 'No especificado (deducir de la imagen)'}
- Precio: ${cleanPrice(price) || 'No especificado'}
- Estado: ${condition || 'No especificado'}

Devuelve SOLO un objeto JSON: {"title": "...", "description": "..."}.`;
}

/* ============================================================
   LLAMADA A GEMINI
   ============================================================ */
async function callGemini({ model, apiKey, parts, temperature, useSchema }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const generationConfig = {
      temperature,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    };
    if (useSchema) generationConfig.responseSchema = SCHEMA;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({ contents: [{ parts }], generationConfig }),
        signal: controller.signal,
      }
    );
    let data = {};
    try {
      data = await res.json();
    } catch (e) {}
    return { ok: res.ok, status: res.status, data };
  } finally {
    clearTimeout(timer);
  }
}

function candidateText(data) {
  const ps = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(ps)) return '';
  return ps.map((p) => (typeof p.text === 'string' ? p.text : '')).join('');
}

/* ============================================================
   ENDPOINT
   ============================================================ */
export async function POST(req) {
  try {
    const body = await req.json();
    const { imageBase64, shortDesc, price, condition, languages, presetText } = body || {};

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return Response.json({ error: 'Falta GEMINI_API_KEY en Vercel' }, { status: 500 });
    }

    const langs = Array.isArray(languages) && languages.length > 0 ? languages : ['es', 'en', 'fr'];
    const presetMode = typeof presetText === 'string' && presetText.trim().length > 10;

    const input = { presetText: presetMode ? presetText : '', shortDesc, price, condition, langs };

    const prompt = presetMode ? buildPresetPrompt(input) : buildNewPrompt(input);
    const parts = [{ text: prompt }];
    const img = parseImage(imageBase64);
    if (img) parts.push({ inlineData: { mimeType: img.mime, data: img.data } });

    const models = (process.env.GEMINI_MODELS || DEFAULT_MODELS)
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    const temperature = presetMode ? 0.2 : 0.4;
    const errors = [];

    for (const model of models) {
      for (const useSchema of [true, false]) {
        try {
          const { ok, status, data } = await callGemini({
            model,
            apiKey: GEMINI_API_KEY,
            parts,
            temperature,
            useSchema,
          });

          if (!ok) {
            const msg = data?.error?.message || `HTTP ${status}`;
            errors.push(`${model} [schema=${useSchema}] → ${status}: ${msg}`);
            console.error(`❌ ${model} (${status}): ${msg}`);

            if (status === 400 && /api key/i.test(msg)) {
              return Response.json({ error: 'La GEMINI_API_KEY no es válida' }, { status: 500 });
            }
            if (status === 400 && useSchema) continue; // reintenta el mismo modelo sin responseSchema
            if (status === 429 || status === 503) await sleep(800);
            break; // siguiente modelo
          }

          const parsed = extractJson(candidateText(data));
          const finishReason = data?.candidates?.[0]?.finishReason;

          if (!parsed || !String(parsed.title).trim() || !String(parsed.description).trim()) {
            errors.push(`${model}: respuesta sin JSON válido (finishReason: ${finishReason})`);
            console.error(`⚠️ ${model}: respuesta inválida (finishReason: ${finishReason})`);
            break;
          }

          let description = String(parsed.description).trim();

          // En modo preset, si el resultado es mucho más corto que el original, algo salió mal
          if (presetMode && description.length < presetText.trim().length * 0.5) {
            errors.push(`${model}: descripción demasiado corta (${description.length} vs ${presetText.trim().length})`);
            console.error(`⚠️ ${model}: descripción demasiado corta, probando siguiente modelo`);
            break;
          }

          // Refuerzo determinista: el precio siempre es el que puso el usuario
          description = applyPrice(description, price);

          console.log(`✅ OK con ${model}`);
          return Response.json({
            title: cleanTitle(parsed.title) || 'Producto En Venta',
            description,
            _model: model,
          });
        } catch (e) {
          const msg = e && e.name === 'AbortError' ? 'timeout' : e?.message || String(e);
          errors.push(`${model}: ${msg}`);
          console.error(`⚠️ ${model}: ${msg}`);
          break;
        }
      }
    }

    // ===== PLAN B: edición local sin IA =====
    console.error('⚠️ Todos los modelos fallaron. Usando plan B local.', errors);
    const local = presetMode
      ? localPresetEdit({ presetText, shortDesc, price, condition })
      : localNewTemplate({ langs, shortDesc, price, condition });

    const out = {
      title: local.title,
      description: local.description || 'Sin descripción',
      _warning: 'Generado localmente (la IA no respondió). Revisa el resultado.',
    };
    if (process.env.DEBUG_AI === '1') out._debug = errors;
    return Response.json(out);
  } catch (error) {
    console.error('ERROR GLOBAL:', error);
    return Response.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}