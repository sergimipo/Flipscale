'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function Logo({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 1024 1024" fill="none" className={className} aria-label="Flipscale">
      <path
        d="M 196.59 712.97 C189.30,715.48 186.78,715.52 184.65,713.17 C183.15,711.50 183.00,704.89 183.00,638.74 C183.00,592.74 183.39,563.28 184.07,558.32 C185.36,548.88 189.99,534.51 194.17,527.00 C207.43,503.13 228.27,486.12 254.50,477.77 L 261.50 475.54 L 366.92 475.24 C448.78,475.01 472.52,475.22 473.10,476.16 C474.02,477.66 473.47,478.75 454.14,514.00 C437.10,545.05 433.93,549.27 424.20,553.83 L 418.50 556.50 L 342.31 557.00 L 266.13 557.50 L 262.96 560.50 C261.22,562.15 259.29,564.62 258.67,566.00 C257.90,567.69 257.37,584.01 257.02,616.56 L 256.50 664.61 L 252.72 672.26 C248.11,681.58 241.09,689.45 232.02,695.49 C224.29,700.62 205.45,709.92 196.59,712.97 ZM 188.49 496.25 C186.85,498.86 185.16,501.00 184.75,501.00 C183.61,501.00 183.86,422.63 185.03,412.97 C187.33,394.01 194.26,379.66 207.47,366.50 C217.71,356.30 224.17,352.13 236.74,347.63 L 245.50 344.50 L 399.25 344.23 C527.92,344.01 553.00,344.18 553.00,345.32 C553.00,346.70 544.23,363.22 526.10,396.00 C518.13,410.41 514.67,415.65 510.43,419.71 C508.95,421.13 507.93,422.31 506.74,423.29 C500.98,428.03 491.32,428.03 405.73,428.02 C399.00,428.02 391.78,428.01 384.07,428.02 C276.91,428.03 273.25,428.09 265.50,430.03 C247.63,434.49 228.73,446.88 212.87,464.52 C205.31,472.93 193.53,488.27 188.49,496.25 ZM 390.03 710.95 C380.25,712.16 352.16,712.15 343.81,710.92 C329.90,708.88 317.61,704.11 310.74,698.08 C308.90,696.46 306.07,692.74 304.45,689.82 L 301.50 684.50 L 300.91 604.71 L 303.71 606.57 C340.30,630.90 378.65,638.37 428.50,630.88 C466.27,625.20 504.22,611.80 541.65,590.93 C580.14,569.46 613.48,544.60 647.16,512.25 C653.60,506.06 659.16,501.00 659.51,501.00 C660.23,501.00 643.46,525.77 635.13,537.00 C603.91,579.10 573.69,611.27 537.50,640.92 C488.77,680.85 437.92,705.00 390.03,710.95 ZM 595.02 519.99 C593.92,520.58 584.25,521.00 571.74,521.00 C569.38,521.00 567.24,521.02 565.29,521.04 C555.85,521.12 550.98,521.17 548.49,518.76 C545.84,516.19 545.88,510.85 545.97,499.82 C545.98,497.68 546.00,495.33 546.00,492.74 C546.00,469.46 546.03,469.09 548.22,467.56 C550.07,466.26 554.16,466.00 572.57,466.00 C592.39,466.00 594.85,466.18 596.21,467.75 C597.42,469.14 597.86,473.79 598.35,490.50 C599.01,512.68 598.39,518.19 595.02,519.99 Z"
        fill="#09868b"
      />
      <path
        d="M 533.41 684.05 C516.46,687.97 510.70,688.82 512.55,687.14 C513.07,686.66 517.10,683.88 521.50,680.95 C573.28,646.48 632.69,585.39 690.18,507.50 C712.00,477.95 736.93,439.88 758.95,402.50 C769.31,384.93 774.68,375.43 787.53,352.00 C799.87,329.51 801.06,327.15 800.29,326.69 C799.86,326.42 796.35,325.90 792.50,325.53 C788.65,325.16 780.33,324.25 774.00,323.50 C767.67,322.75 759.01,321.85 754.75,321.49 C750.49,321.12 747.00,320.44 747.00,319.96 C747.00,319.15 759.95,311.32 828.00,270.99 C843.12,262.02 865.96,248.46 878.75,240.85 C891.54,233.23 902.45,227.00 903.00,227.00 C903.66,227.00 903.99,258.83 903.96,320.75 L 903.92 414.50 L 901.07 411.18 C899.51,409.35 896.49,405.30 894.37,402.18 C882.18,384.25 872.63,371.00 871.90,371.00 C871.45,371.00 865.44,382.14 858.56,395.75 C825.16,461.80 796.13,506.29 757.94,550.00 C724.08,588.74 687.82,618.13 643.87,642.48 C609.79,661.35 575.07,674.42 533.41,684.05 ZM 675.37 431.93 C672.87,433.89 671.50,434.00 648.82,434.00 L 624.91 434.00 L 622.45 431.55 L 620.00 429.09 L 620.00 376.90 L 622.70 374.40 L 625.40 371.90 L 649.79 372.20 C674.05,372.50 674.19,372.51 676.09,374.86 C677.86,377.05 678.00,379.12 678.00,403.54 L 678.00 429.85 Z"
        fill="#f9a712"
      />
    </svg>
  );
}

const ALL_LANGUAGES = [
  { code: 'es', label: 'Espanol' },
  { code: 'en', label: 'Inglés' },
  { code: 'fr', label: 'Francés' },
];

const CONDITIONS = [
  'Nuevo con etiquetas',
  'Nuevo sin etiquetas',
  'Muy bueno',
  'Bueno',
  'Satisfactorio',
];

export default function DescriptionToolPage() {
  const [theme, setTheme] = useState('dark');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [shortDesc, setShortDesc] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [languages, setLanguages] = useState(['es', 'en', 'fr']);
  const [presetText, setPresetText] = useState('');

  const [generating, setGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState(null);
  const [generateError, setGenerateError] = useState('');
  const [copied, setCopied] = useState(false);

  const [savedPresets, setSavedPresets] = useState([]);
  const [loadingPresets, setLoadingPresets] = useState(false);
  const [savingPreset, setSavingPreset] = useState(false);
  const [presetName, setPresetName] = useState('');

  // Auth + usage
  const [userId, setUserId] = useState(null);
  const [plan, setPlan] = useState('free');
  const [remaining, setRemaining] = useState(5);
  const [usageCount, setUsageCount] = useState(0);
  const [usageLimit, setUsageLimit] = useState(5);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem('fs-theme') === 'light') setTheme('light');
  }, []);

  // Auth + usage
  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoadingAuth(false); return; }
        setUserId(user.id);
        const res = await fetch(`/api/usage?userId=${user.id}&tool=generate_description`);
        const data = await res.json();
        setPlan(data.plan || 'free');
        setRemaining(data.remaining ?? 5);
        setUsageCount(data.count ?? 0);
        setUsageLimit(data.limit ?? 5);
      } catch (e) {
        console.error('Error cargando uso:', e);
      } finally {
        setLoadingAuth(false);
      }
    })();
  }, []);

  useEffect(() => {
    fetchPresets();
  }, []);

  const dark = theme === 'dark';
  const isPro = plan === 'pro';
  const blocked = !isPro && remaining <= 0;

  const c = {
    page: dark ? 'bg-ink-950 text-white' : 'bg-paper text-ink-950',
    header: dark ? 'border-white/10 bg-ink-950/80' : 'border-slate-200 bg-white/80',
    card: dark ? 'border-white/10 bg-ink-900' : 'border-slate-200 bg-white',
    sub: dark ? 'text-slate-400' : 'text-slate-600',
    faint: dark ? 'text-slate-500' : 'text-slate-400',
    row: dark ? 'border-white/10' : 'border-slate-200',
    input: dark
      ? 'border-white/10 bg-ink-800 text-white placeholder:text-slate-500 focus:border-brand-500'
      : 'border-slate-200 bg-white text-ink-950 placeholder:text-slate-400 focus:border-brand-500',
    chip: dark
      ? 'border-white/10 bg-ink-800/60 text-slate-300 hover:bg-ink-800'
      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100',
    chipActive: 'border-brand-500 bg-brand-500/10 text-brand-500',
  };

  const registerUsage = async () => {
    if (!userId || isPro) return;
    try {
      await fetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'generate_description' }),
      });
      setUsageCount((p) => p + 1);
      setRemaining((p) => Math.max(0, p - 1));
    } catch (e) {
      console.error('Error registrando uso:', e);
    }
  };

  async function fetchPresets() {
    setLoadingPresets(true);
    try {
      const res = await fetch('/api/presets');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSavedPresets(data.items || []);
    } catch (err) {
      console.error('Error fetchPresets:', err);
    } finally {
      setLoadingPresets(false);
    }
  }

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const MAX_SIZE = 800;
          if (width > height && width > MAX_SIZE) {
            height = (height * MAX_SIZE) / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width = (width * MAX_SIZE) / height;
            height = MAX_SIZE;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    try {
      const compressed = await compressImage(file);
      setImageBase64(compressed);
    } catch (err) {
      console.error('Error al comprimir imagen:', err);
      setGenerateError('Error al procesar la imagen.');
    }
    setShortDesc('');
    setPrice('');
    setCondition('');
  }

  function toggleLanguage(code) {
    setLanguages((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    );
  }

  function loadSavedPreset(preset) {
    setPresetText(preset.template_text);
    setShortDesc('');
    setPrice('');
    setCondition('');
  }

  async function handleSavePreset() {
    if (!presetText.trim()) return;
    if (!presetName.trim()) return;
    setSavingPreset(true);
    try {
      const res = await fetch('/api/presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: presetName.trim(),
          template_text: presetText,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSavedPresets((prev) => [data.item, ...prev]);
      setPresetName('');
    } catch (err) {
      console.error('Error saving preset:', err);
    } finally {
      setSavingPreset(false);
    }
  }

  async function handleDeletePreset(id) {
    try {
      const res = await fetch(`/api/presets?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al borrar');
      setSavedPresets((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('No se pudo borrar', err);
    }
  }

  async function handleGenerate() {
    // Comprobar límite
    if (blocked) {
      setGenerateError('Has alcanzado el límite gratuito de este mes. Pásate a Pro para seguir generando.');
      return;
    }
    if (!presetText.trim() && !shortDesc.trim()) {
      setGenerateError('Pega un preset o escribe una descripción.');
      return;
    }
    if (languages.length === 0) {
      setGenerateError('Selecciona al menos un idioma.');
      return;
    }
    setGenerating(true);
    setGenerateError('');
    setGeneratedDescription(null);
    try {
      const res = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageBase64,
          shortDesc,
          price: price || null,
          condition: condition || null,
          languages,
          presetText: presetText || '',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Error ${res.status}: ${res.statusText}`);
      setGeneratedDescription(data.description);
      // Registrar uso SOLO si tuvo éxito
      await registerUsage();
    } catch (err) {
      console.error('Error completo:', err);
      setGenerateError(err.message || 'No se pudo generar la descripción.');
    } finally {
      setGenerating(false);
    }
  }

  function copyToClipboard() {
    if (!generatedDescription) return;
    const text =
      typeof generatedDescription === 'string'
        ? generatedDescription
        : Object.values(generatedDescription).join('\n\n────────\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`min-h-screen ${c.page}`}>
      {/* HEADER */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-xl ${c.header}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-3 transition hover:opacity-80">
              <Logo className="h-8 w-8" />
              <span className="hidden font-display text-base font-semibold tracking-wide sm:block">
                FLIP<span className="text-accent-500">SCALE</span>
              </span>
            </Link>
            <div className={`mx-1 h-8 w-px ${dark ? 'bg-white/10' : 'bg-slate-200'}`} />
            <span className={`text-sm font-medium ${c.sub}`}>Descripciones IA</span>
          </div>
          <div className="flex items-center gap-4">
            {!loadingAuth && (
              <span className={`hidden rounded-full border px-3 py-1 text-xs font-semibold sm:inline-flex ${
                isPro
                  ? 'border-accent-500/30 bg-accent-500/10 text-accent-500'
                  : blocked
                    ? 'border-red-500/30 bg-red-500/10 text-red-500'
                    : 'border-brand-500/30 bg-brand-500/10 text-brand-500'
              }`}>
                {isPro ? 'Pro · Ilimitado' : `${remaining} de ${usageLimit} usos este mes`}
              </span>
            )}
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition ${dark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-ink-950'}`}
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* TÍTULO */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Descripciones IA</h1>
          <p className={`mt-2 max-w-2xl ${c.sub}`}>
            Genera descripciones profesionales y multilingues a partir de una foto. La IA analiza
            el producto, aplica tu preset y te devuelve textos listos para copiar y pegar en
            Vinted, Wallapop o Etsy.
          </p>
        </div>

        {/* AVISO DE LÍMITE */}
        {blocked && (
          <div className={`mb-6 flex items-center justify-between rounded-xl border p-5 ${
            dark ? 'border-red-500/30 bg-red-500/5' : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-red-500">Has alcanzado el limite gratuito</p>
                <p className={`text-xs ${c.sub}`}>Has usado tus {usageLimit} usos gratuitos de este mes.</p>
              </div>
            </div>
            <Link href="/pricing" className="btn-primary !px-5 !py-2.5 text-sm">
              Desbloquear Pro
            </Link>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-5">
          {/* FORMULARIO */}
          <section className={`rounded-2xl border p-6 lg:col-span-3 ${c.card} ${blocked ? 'pointer-events-none opacity-50' : ''}`}>
            <h2 className="mb-5 font-display text-xl font-semibold">Datos del producto</h2>

            {/* PRESETS */}
            <div className="mb-6">
              <label className={`mb-1.5 block text-sm font-semibold ${dark ? 'text-white' : 'text-ink-950'}`}>
                Descripción base (preset)
              </label>
              <p className={`mb-3 text-xs ${c.faint}`}>
                Pega la descripción de un producto similar o selecciona un preset guardado.
              </p>

              {loadingPresets && (
                <p className={`mb-2 text-xs ${c.faint}`}>Cargando presets...</p>
              )}
              {!loadingPresets && savedPresets.length > 0 && (
                <div className="mb-3">
                  <label className={`mb-2 block text-xs font-semibold ${c.sub}`}>
                    Mis presets guardados
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {savedPresets.map((preset) => (
                      <div
                        key={preset.id}
                        className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition ${c.chip}`}
                      >
                        <button onClick={() => loadSavedPreset(preset)} className="hover:text-brand-500">
                          {preset.name}
                        </button>
                        <button
                          onClick={() => handleDeletePreset(preset.id)}
                          className="text-red-500 hover:text-red-400"
                          title="Borrar"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <textarea
                value={presetText}
                onChange={(e) => setPresetText(e.target.value)}
                rows={4}
                placeholder={"Ej: Sudadera Nike Vintage\nTalla M, color negro\nNUEVO SIN ETIQUETAS..."}
                className={`w-full rounded-lg border px-3 py-2.5 font-mono text-sm outline-none transition ${c.input}`}
              />

              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Nombre del preset (ej: Zapatillas Nike)"
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm outline-none transition ${c.input}`}
                />
                <button
                  onClick={handleSavePreset}
                  disabled={savingPreset || !presetText.trim() || !presetName.trim()}
                  className="btn-primary disabled:opacity-40 !px-4 !py-2 text-sm"
                >
                  {savingPreset ? 'Guardando...' : 'Guardar preset'}
                </button>
              </div>
            </div>

            {/* IMAGEN */}
            <div className="mb-5">
              <label className={`mb-1.5 block text-sm font-semibold ${dark ? 'text-white' : 'text-ink-950'}`}>
                Foto del producto{' '}
                <span className={`font-normal ${c.faint}`}>(opcional si hay preset)</span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition ${
                  dark
                    ? 'border-white/15 bg-ink-800/40 hover:border-brand-500/50'
                    : 'border-slate-300 bg-slate-50 hover:border-brand-500/60'
                }`}
              >
                {imagePreview ? (
                  <div className="flex w-full items-center gap-4">
                    <img src={imagePreview} alt="Vista previa" className="h-20 w-20 shrink-0 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-ink-950'}`}>Imagen cargada</p>
                      <p className={`text-xs ${c.faint}`}>Haz clic para cambiar</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10">
                      <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                    <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-ink-950'}`}>Haz clic para subir</p>
                    <p className={`mt-0.5 text-xs ${c.faint}`}>JPG, PNG, WEBP</p>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>

            {/* DESCRIPCIÓN BREVE */}
            <div className="mb-5">
              <label className={`mb-1.5 block text-sm font-semibold ${dark ? 'text-white' : 'text-ink-950'}`}>
                Descripción breve / cambios{' '}
                <span className={`font-normal ${c.faint}`}>(opcional si hay preset)</span>
              </label>
              <textarea
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                rows={3}
                placeholder={
                  presetText
                    ? 'Ej: Es la misma pero en color rojo y talla M'
                    : 'Ej: Gafas de sol azules, marca Ray-Ban...'
                }
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${c.input}`}
              />
            </div>

            {/* PRECIO Y ESTADO */}
            <div className="mb-5 grid grid-cols-2 gap-4">
              <div>
                <label className={`mb-1.5 block text-sm font-semibold ${dark ? 'text-white' : 'text-ink-950'}`}>
                  Precio (EUR) <span className={`font-normal ${c.faint}`}>(opcional)</span>
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ej: 45,99"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${c.input}`}
                />
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-semibold ${dark ? 'text-white' : 'text-ink-950'}`}>
                  Estado <span className={`font-normal ${c.faint}`}>(opcional)</span>
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${c.input}`}
                >
                  <option value="">-- Seleccionar --</option>
                  {CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* IDIOMAS */}
            <div className="mb-6">
              <label className={`mb-2 block text-sm font-semibold ${dark ? 'text-white' : 'text-ink-950'}`}>
                Idiomas
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_LANGUAGES.map((lang) => {
                  const active = languages.includes(lang.code);
                  return (
                    <button
                      key={lang.code}
                      onClick={() => toggleLanguage(lang.code)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        active ? c.chipActive : c.chip
                      }`}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ERROR */}
            {generateError && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
                {generateError}
              </div>
            )}

            {/* BOTÓN GENERAR */}
            <button
              onClick={handleGenerate}
              disabled={generating || blocked}
              className="btn-primary w-full disabled:opacity-50"
            >
              {generating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Generando...
                </span>
              ) : blocked ? (
                'Limite alcanzado'
              ) : (
                'Generar descripción'
              )}
            </button>
          </section>

          {/* RESULTADO */}
          <section className={`rounded-2xl border p-6 lg:col-span-2 ${c.card}`}>
            <h2 className="mb-5 font-display text-xl font-semibold">Descripción generada</h2>

            {!generatedDescription && !generating && (
              <div className={`flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center ${dark ? 'border-white/10' : 'border-slate-200'}`}>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/10">
                  <svg className="h-6 w-6 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <p className={`text-sm ${c.sub}`}>
                  Rellena el formulario y pulsa <strong>Generar descripción</strong> para ver el resultado aquí.
                </p>
              </div>
            )}

            {generating && (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`h-20 animate-pulse rounded-xl ${dark ? 'bg-ink-800' : 'bg-slate-100'}`} />
                ))}
              </div>
            )}

            {generatedDescription && (
              <div className="space-y-4">
                {typeof generatedDescription === 'string' ? (
                  <div className={`whitespace-pre-wrap rounded-xl border p-4 text-sm leading-relaxed ${
                    dark ? 'border-white/10 bg-ink-800/50' : 'border-slate-200 bg-slate-50'
                  }`}>
                    {generatedDescription}
                  </div>
                ) : (
                  languages.map((code) => {
                    const lang = ALL_LANGUAGES.find((l) => l.code === code);
                    const text = generatedDescription[code];
                    if (!text) return null;
                    return (
                      <div key={code} className={`rounded-xl border p-4 ${dark ? 'border-white/10 bg-ink-800/50' : 'border-slate-200 bg-slate-50'}`}>
                        <p className={`mb-2 text-xs font-bold uppercase tracking-wider ${c.faint}`}>
                          {lang?.label || code}
                        </p>
                        <p className={`whitespace-pre-wrap text-sm leading-relaxed ${dark ? 'text-white' : 'text-ink-950'}`}>
                          {text}
                        </p>
                      </div>
                    );
                  })
                )}

                <button
                  onClick={copyToClipboard}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
                    copied
                      ? 'bg-brand-500 text-white'
                      : dark
                        ? 'bg-white text-ink-950 hover:bg-slate-100'
                        : 'bg-ink-950 text-white hover:bg-ink-900'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Copiado
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copiar descripción
                    </>
                  )}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}