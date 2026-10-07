export const maxDuration = 60;

/* ============================================================
   CONFIGURACIÓN
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
   EDICIÓN LOCAL Y CORRECCIONES DETERMINISTAS
   ============================================================ */
function detectLang(line) {
  const l = String(line);
  if (l.length > 40 || /[✔✅]/.test(l)) return null;
  if (/🇪🇸|español/i.test(l)) return 'es';
  if (/🇬🇧|english/i.test(l)) return 'en';
  if (/🇫🇷|fran[cç]ais/i.test(l)) return 'fr';
  return null;
}

function findState(condition) {
  const c = stripAccents(String(condition || '').toLowerCase()).trim();
  if (!c) return null;
  
  // Mapeo de variantes comunes a la key estándar para ser 100% robustos
  const aliasMap = {
    'buen estado': 'bueno',
    'bueno': 'bueno',
    'muy buen estado': 'muy bueno',
    'muy bueno': 'muy bueno',
    'nuevo con etiquetas': 'nuevo con etiquetas',
    'nuevo': 'nuevo sin etiquetas',
    'nuevo sin etiquetas': 'nuevo sin etiquetas',
    'satisfactorio': 'satisfactorio',
    'aceptable': 'satisfactorio'
  };

  for (const [alias, key] of Object.entries(aliasMap)) {
    if (c.includes(alias)) {
      return STATES.find((s) => s.key === key) || null;
    }
  }
  
  return STATES.find((s) => c.includes(s.key)) || null;
}

function stateText(condition, lang) {
  const found = findState(condition);
  return found ? found[lang] || found.es : String(condition).toUpperCase();
}

/* Sobrescribe la línea de estado con la traducción correcta, ignorando a la IA */
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
        // Forzamos que sea el estado correcto en el idioma del bloque
        return stateText(condition, lang);
      }
      return line;
    })
    .join('\n');
}

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

function localNewTemplate({ langs, shortDesc, price, condition }) {
  const num = cleanPrice(price);
  const desc = langs
    .map((l) => {
      const name = LANG_NAMES[l] || l;
      const cond = condition ? stateText(condition, l) : '';
      const priceLine = num
        ? l === 'en' ? `💰 Price: €${num}`
        : l === 'fr' ? `💰 Prix : ${num} €`
        : `💰 Precio: ${num} €`
        : '';
      const bullets =
        l === 'en' ? [shortDesc || 'Item in good condition', 'Check the photos for more details', 'Fast and safe shipping']
        : l === 'fr' ? [shortDesc || 'Article en bon état', 'Voir les photos pour plus de détails', 'Envoi rapide et sécurisé']
        : [shortDesc || 'Producto en buen estado', 'Revisa las fotos para más detalles', 'Envíos rápidos y seguros'];
      return [name, cond, ...bullets.map((b) => `✔ ${b}`), priceLine].filter(Boolean).join('\n');
    })
    .join('\n────────\n');

  return { title: cleanTitle(shortDesc) || 'Producto En Venta', description: desc };
}

/* ============================================================
   PROMPTS
   ============================================================ */
const STATES_PROMPT_TABLE = `
- Nuevo con etiquetas: EN = NEW WITH TAGS, FR = NEUF AVEC ÉTIQUETTE
- Nuevo sin etiquetas: EN = NEW WITHOUT TAGS, FR = NEUF SANS ÉTIQUETTE
- Muy bueno: EN = VERY GOOD, FR = TRÈS BON ÉTAT
- Bueno: EN = GOOD, FR = BON ÉTAT
- Satisfactorio: EN = SATISFACTORY, FR = SATISFAISANT
`;

function buildPresetPrompt({ presetText, shortDesc, price, condition }) {
  const changes = [];
  if (shortDesc && String(shortDesc).trim()) changes.push(`- Cambio pedido: ${String(shortDesc).trim()}`);
  if (cleanPrice(price)) changes.push(`- Nuevo precio: ${cleanPrice(price)} €`);
  if (condition && String(condition).trim()) changes.push(`- Nuevo estado: ${String(condition).trim()}`);
  const changesText = changes.length ? changes.join('\n') : '- Ninguno';

  return `Eres un editor de anuncios de segunda mano. Recibes un ANUNCIO BASE y una lista de CAMBIOS.

REGLAS PARA "description":
1. Conserva EXACTAMENTE la estructura: mismos bloques, orden, emojis, viñetas y separadores.
2. Aplica SOLO los cambios indicados.
3. Si cambia el COLOR: sustituye TODAS las menciones del color antiguo por el nuevo, adaptando género y número.
4. Si cambia el PRECIO o ESTADO: cámbialo solo en su línea correspondiente, usando estas traducciones EXACTAS:
${STATES_PROMPT_TABLE}
¡ADVERTENCIA CRÍTICA! NUNCA pongas "BON ÉTAT", "BON ESTAT" o "TRÈS BON" en el bloque de 🇪🇸 Español. El bloque de Español debe estar 100% en español (ej: "BUENO" o "MUY BUENO").

ANUNCIO BASE:
<<<
${presetText}
>>>

CAMBIOS:
${changesText}

Devuelve SOLO un objeto JSON: {"title": "...", "description": "..."}.`;
}

function buildNewPrompt({ langs, shortDesc, price, condition }) {
  const langList = langs.map((l) => LANG_NAMES[l] || l).join(', ');
  return `Eres un experto en ventas de segunda mano. Genera un anuncio profesional.

REGLAS PARA "title":
- En español, MÁXIMO 60 caracteres.
- Formato: Tipo de producto + Marca + Modelo + Color + Talla. Ej: "Zapatillas Nike Air Max 90 Blancas Talla 42".
- La primera letra de cada palabra debe ser MAYÚSCULA. Sin emojis ni comillas.

REGLAS PARA "description":
- Un único string con saltos de línea (\\n), con un bloque por idioma: ${langList}.
- Cada bloque empieza con el nombre del idioma (ej: 🇪🇸 Español).
- Segunda línea: el ESTADO EN MAYÚSCULAS, traducido CORRECTAMENTE:
${STATES_PROMPT_TABLE}
¡ADVERTENCIA CRÍTICA! NUNCA pongas "BON ÉTAT" o "BON ESTAT" en el bloque de 🇪🇸 Español.
- Después, 3 a 6 viñetas con "✔" con información real del producto.
- Última línea: el precio ("💰 Precio: X €", "💰 Price: €X", "💰 Prix : X €").
- Separa los bloques con: ────────

DATOS:
- Producto: ${shortDesc || 'No especificado'}
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
    try { data = await res.json(); } catch (e) {}
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

    const models = (process.env.GEMINI_MODELS || DEFAULT_MODELS).split(',').map((m) => m.trim()).filter(Boolean);
    const temperature = presetMode ? 0.2 : 0.4;
    const errors = [];

    for (const model of models) {
      for (const useSchema of [true, false]) {
        try {
          const { ok, status, data } = await callGemini({ model, apiKey: GEMINI_API_KEY, parts, temperature, useSchema });

          if (!ok) {
            const msg = data?.error?.message || `HTTP ${status}`;
            errors.push(`${model} [schema=${useSchema}] → ${status}: ${msg}`);
            if (status === 400 && /api key/i.test(msg)) return Response.json({ error: 'La GEMINI_API_KEY no es válida' }, { status: 500 });
            if (status === 400 && useSchema) continue;
            if (status === 429 || status === 503) await sleep(800);
            break;
          }

          const parsed = extractJson(candidateText(data));
          if (!parsed || !String(parsed.title).trim() || !String(parsed.description).trim()) {
            errors.push(`${model}: respuesta sin JSON válido`);
            break;
          }

          let description = String(parsed.description).trim();

          if (presetMode && description.length < presetText.trim().length * 0.5) {
            errors.push(`${model}: descripción demasiado corta`);
            break;
          }

          // ==========================================
          // BLINDAJE DETERMINISTA (Corrige a la IA)
          // ==========================================
          description = applyPrice(description, price);
          description = applyCondition(description, condition); // <-- ESTO FALTABA Y ERA LA CAUSA DEL ERROR

          // Red de seguridad extra: si por algún motivo el bloque español tiene "BON ÉTAT", lo machacamos
          if (description.includes('🇪🇸 Español') || description.includes('🇪🇸 Espanol')) {
            description = description.replace(/(🇪🇸\s*Español\n)([^\n]*)(\n)/gi, (match, prefix, stateLine, suffix) => {
              const upper = stateLine.toUpperCase().trim();
              if (upper.includes('BON') || upper.includes('ÉTAT') || upper.includes('ESTAT')) {
                const fallbackState = condition ? stateText(condition, 'es') : 'BUENO';
                return `${prefix}${fallbackState}${suffix}`;
              }
              return match;
            });
          }

          console.log(`✅ OK con ${model}`);
          return Response.json({
            title: cleanTitle(parsed.title) || 'Producto En Venta',
            description,
            _model: model,
          });
        } catch (e) {
          const msg = e && e.name === 'AbortError' ? 'timeout' : e?.message || String(e);
          errors.push(`${model}: ${msg}`);
          break;
        }
      }
    }

    // ===== PLAN B: edición local sin IA =====
    console.error('⚠️ Todos los modelos fallaron. Usando plan B local.', errors);
    const local = presetMode
      ? localPresetEdit({ presetText, shortDesc, price, condition })
      : localNewTemplate({ langs, shortDesc, price, condition });

    return Response.json({
      title: local.title,
      description: local.description || 'Sin descripción',
      _warning: 'Generado localmente (la IA no respondió). Revisa el resultado.',
    });

  } catch (error) {
    console.error('ERROR GLOBAL:', error);
    return Response.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}