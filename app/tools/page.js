'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import exifr from 'exifr';
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

const fmtSize = (bytes) => {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / 1024).toFixed(0) + ' KB';
};

const outName = (f) =>
  f.type === 'image/png'
    ? f.name.replace(/\.png$/i, '') + '-clean.png'
    : f.name.replace(/\.[^.]+$/, '') + '-clean.jpg';

const stripImage = (file) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve(blob);
          else reject(new Error('sin blob'));
        },
        file.type === 'image/png' ? 'image/png' : 'image/jpeg',
        0.92
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('error de imagen'));
    };
    img.src = url;
  });

export default function ToolsPage() {
  const [theme, setTheme] = useState('dark');
  const [items, setItems] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [savingGallery, setSavingGallery] = useState(false);
  const inputRef = useRef(null);

  // Auth + uso
  const [userId, setUserId] = useState(null);
  const [plan, setPlan] = useState('free');
  const [remaining, setRemaining] = useState(5);
  const [usageCount, setUsageCount] = useState(0);
  const [usageLimit, setUsageLimit] = useState(5);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('fs-theme') === 'light') setTheme('light');
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoadingAuth(false); return; }
        setUserId(user.id);
        const res = await fetch(`/api/usage?userId=${user.id}&tool=remove_metadata`);
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

  const dark = theme === 'dark';
  const isPro = plan === 'pro';

  const c = {
    page: dark ? 'bg-ink-950 text-white' : 'bg-paper text-ink-950',
    header: dark ? 'border-white/10 bg-ink-950/80' : 'border-slate-200 bg-white/80',
    card: dark ? 'border-white/10 bg-ink-900' : 'border-slate-200 bg-white',
    sub: dark ? 'text-slate-400' : 'text-slate-600',
    faint: dark ? 'text-slate-500' : 'text-slate-400',
    row: dark ? 'border-white/10' : 'border-slate-200',
    drop: dark
      ? dragging
        ? 'border-brand-500 bg-brand-500/10'
        : 'border-white/15 bg-ink-900/60 hover:border-brand-500/50'
      : dragging
        ? 'border-brand-500 bg-brand-500/5'
        : 'border-slate-300 bg-white hover:border-brand-500/60',
  };

  const registerUsage = async () => {
    if (!userId || isPro) return;
    try {
      await fetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'remove_metadata' }),
      });
      setUsageCount((p) => p + 1);
      setRemaining((p) => Math.max(0, p - 1));
    } catch (e) {
      console.error('Error registrando uso:', e);
    }
  };

  const addFiles = async (fileList) => {
    const arr = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    const newItems = await Promise.all(
      arr.map(async (file) => {
        let metaCount = 0;
        try {
          const meta = await exifr.parse(file);
          metaCount = meta ? Object.keys(meta).length : 0;
        } catch (e) {
          metaCount = 0;
        }
        return {
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          metaCount,
          status: 'pending',
          preview: URL.createObjectURL(file),
          cleanUrl: null,
          cleanBlob: null,
        };
      })
    );
    setItems((prev) => [...prev, ...newItems]);
  };

  const cleanOne = async (item) => {
    if (!isPro && remaining <= 0) return;
    setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: 'cleaning' } : it)));
    try {
      const blob = await stripImage(item.file);
      const cleanUrl = URL.createObjectURL(blob);
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, status: 'clean', cleanUrl, cleanBlob: blob } : it))
      );
      await registerUsage();
    } catch (e) {
      setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: 'error' } : it)));
    }
  };

  const cleanAll = async () => {
    setProcessing(true);
    const pending = items.filter((i) => i.status === 'pending' || i.status === 'error');
    for (const it of pending) {
      if (!isPro && remaining <= 0) break;
      await cleanOne(it);
    }
    setProcessing(false);
  };

  // GUARDAR UNA EN LA GALERÍA (share sheet de iOS / Android)
  const saveOne = async (it) => {
    if (!it.cleanBlob) return;
    const file = new File([it.cleanBlob], outName(it.file), { type: it.cleanBlob.type });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Flipscale' });
        return;
      } catch (e) {
        if (e.name === 'AbortError') return; // canceló el menú
      }
    }
    // Fallback: descarga normal
    const a = document.createElement('a');
    a.href = it.cleanUrl;
    a.download = outName(it.file);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // GUARDAR TODAS EN LA GALERÍA
  const saveAll = async () => {
    setSavingGallery(true);
    const cleaned = items.filter((i) => i.status === 'clean' && i.cleanBlob);
    const files = cleaned.map((i) => new File([i.cleanBlob], outName(i.file), { type: i.cleanBlob.type }));
    if (navigator.canShare && navigator.canShare({ files })) {
      try {
        await navigator.share({ files, title: 'Flipscale' });
        setSavingGallery(false);
        return;
      } catch (e) {
        if (e.name === 'AbortError') { setSavingGallery(false); return; }
      }
    }
    // Fallback: descargas secuenciales
    cleaned.forEach((it, i) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = it.cleanUrl;
        a.download = outName(it.file);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, i * 300);
    });
    setSavingGallery(false);
  };

  const removeItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id));

  const totalMeta = items.reduce((s, it) => s + it.metaCount, 0);
  const cleanCount = items.filter((it) => it.status === 'clean').length;
  const pendingCount = items.filter((it) => it.status === 'pending' || it.status === 'error').length;
  const blocked = !isPro && remaining <= 0;

  return (
    <div className={`min-h-screen ${c.page}`}>
      {/* HEADER */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-xl ${c.header}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-3 transition hover:opacity-80">
              <Logo className="h-8 w-8" />
              <span className="hidden font-display text-base font-semibold tracking-wide sm:block">
                FLIP<span className="text-accent-500">SCALE</span>
              </span>
            </Link>
            <div className={`mx-1 h-8 w-px ${dark ? 'bg-white/10' : 'bg-slate-200'}`} />
            <span className={`text-sm font-medium ${c.sub}`}>Borrado de metadatos</span>
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

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Fotos sin rastros</h1>
          <p className={`mt-2 max-w-2xl ${c.sub}`}>
            Elimina la información oculta de tus imágenes (GPS, dispositivo, fechas) antes de
            subirlas a Vinted, Wallapop o Etsy. Todo ocurre en tu navegador: tus fotos nunca se
            suben a ningún servidor.
          </p>
        </div>

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
                <p className="text-sm font-bold text-red-500">Has alcanzado el límite gratuito</p>
                <p className={`text-xs ${c.sub}`}>Has usado tus {usageLimit} usos gratuitos de este mes.</p>
              </div>
            </div>
            <Link href="/pricing" className="btn-primary !px-5 !py-2.5 text-sm">
              Desbloquear Pro
            </Link>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* COLUMNA PRINCIPAL */}
          <div className="lg:col-span-2">
            {/* DROPZONE */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
              onClick={() => inputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-all duration-300 ${c.drop} ${blocked ? 'pointer-events-none opacity-50' : ''}`}
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10">
                <svg className="h-7 w-7 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="font-display text-lg font-semibold">Arrastra tus fotos aquí</p>
              <p className={`mt-1 text-sm ${c.faint}`}>o haz clic para seleccionarlas · JPG, PNG, WEBP</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
              />
            </div>

            {/* BARRA DE ACCIÓN */}
            {items.length > 0 && (
              <div className={`mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 ${c.card}`}>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className={c.sub}>
                    <span className="font-semibold">{items.length}</span> fotos
                  </span>
                  <span className={c.sub}>
                    <span className="font-semibold text-accent-500">{totalMeta}</span> datos detectados
                  </span>
                  <span className={c.sub}>
                    <span className="font-semibold text-brand-500">{cleanCount}</span> limpias
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cleanCount > 0 && (
                    <button
                      onClick={saveAll}
                      disabled={savingGallery}
                      className="btn-primary disabled:opacity-50"
                    >
                      {savingGallery ? 'Preparando…' : `Guardar en galería (${cleanCount})`}
                    </button>
                  )}
                  <button
                    onClick={() => setItems([])}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      dark ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Vaciar lista
                  </button>
                  <button
                    onClick={cleanAll}
                    disabled={processing || pendingCount === 0 || blocked}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      dark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-ink-950 hover:bg-slate-200'
                    } disabled:opacity-50`}
                  >
                    {processing ? 'Limpiando…' : `Limpiar todo (${pendingCount})`}
                  </button>
                </div>
              </div>
            )}

            {cleanCount > 0 && (
              <p className={`mt-3 text-xs ${c.faint}`}>
                «Guardar en galería» abre el menú de compartir de tu móvil: elige «Guardar imagen»
                y las fotos limpias van directas a tu galería.
              </p>
            )}

            {/* LISTA DE ARCHIVOS */}
            <div className="mt-4 space-y-3">
              {items.map((it) => (
                <div key={it.id} className={`flex items-center gap-4 rounded-xl border p-3 ${c.card}`}>
                  <img src={it.preview} alt={it.file.name} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{it.file.name}</p>
                    <p className={`mt-0.5 text-xs ${c.faint}`}>
                      {fmtSize(it.file.size)} ·{' '}
                      {it.metaCount > 0 ? (
                        <span className="text-accent-500">{it.metaCount} datos ocultos</span>
                      ) : (
                        <span>sin datos ocultos</span>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {it.status === 'clean' ? (
                      <>
                        <button
                          onClick={() => saveOne(it)}
                          className="btn-primary !px-4 !py-2 text-xs"
                          title="Guardar en la galería"
                        >
                          Guardar
                        </button>
                        <a
                          href={it.cleanUrl}
                          download={outName(it.file)}
                          className={`rounded-lg p-2 transition ${
                            dark ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-100'
                          }`}
                          title="Descargar archivo"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                      </>
                    ) : it.status === 'cleaning' ? (
                      <span className={`text-xs font-medium ${c.faint}`}>Limpiando…</span>
                    ) : it.status === 'error' ? (
                      <button
                        onClick={() => cleanOne(it)}
                        disabled={blocked}
                        className="rounded-lg bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-500/20 disabled:opacity-50"
                      >
                        Reintentar
                      </button>
                    ) : (
                      <button
                        onClick={() => cleanOne(it)}
                        disabled={blocked}
                        className="rounded-lg bg-brand-500/10 px-4 py-2 text-xs font-semibold text-brand-500 transition hover:bg-brand-500/20 disabled:opacity-50"
                      >
                        Limpiar
                      </button>
                    )}
                    <button
                      onClick={() => removeItem(it.id)}
                      className={`rounded-lg p-2 transition ${
                        dark ? 'text-slate-500 hover:bg-white/5 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-ink-950'
                      }`}
                      aria-label="Quitar"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PANEL INFORMATIVO */}
          <div className="space-y-4">
            {!loadingAuth && !isPro && (
              <div className={`rounded-xl border p-6 ${c.card}`}>
                <h3 className="font-display text-lg font-semibold">Tu plan</h3>
                <div className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span className={c.sub}>Usos este mes</span>
                    <span className="font-semibold">{usageCount} / {usageLimit}</span>
                  </div>
                  <div className={`mt-2 h-2 rounded-full ${dark ? 'bg-white/5' : 'bg-slate-100'}`}>
                    <div
                      className={`h-2 rounded-full transition-all ${usageCount >= usageLimit ? 'bg-red-500' : 'bg-brand-500'}`}
                      style={{ width: `${Math.min(100, (usageCount / usageLimit) * 100)}%` }}
                    />
                  </div>
                  <Link
                    href="/pricing"
                    className={`mt-4 block rounded-lg py-2.5 text-center text-sm font-semibold transition ${
                      dark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-ink-950 hover:bg-slate-200'
                    }`}
                  >
                    Desbloquear uso ilimitado
                  </Link>
                </div>
              </div>
            )}

            <div className={`rounded-xl border p-6 ${c.card}`}>
              <h3 className="font-display text-lg font-semibold">Qué se elimina</h3>
              <div className="mt-4 space-y-3">
                {[
                  ['Ubicación GPS', 'Coordenadas de dónde se hizo la foto'],
                  ['Dispositivo', 'Modelo de cámara o móvil y ajustes'],
                  ['Fechas y software', 'Cuándo y con qué se editó la imagen'],
                ].map(([t, d]) => (
                  <div key={t} className="flex gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                      <svg className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t}</p>
                      <p className={`text-xs ${c.faint}`}>{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-xl border p-6 ${c.card}`}>
              <h3 className="font-display text-lg font-semibold">Por qué importa</h3>
              <p className={`mt-3 text-sm leading-relaxed ${c.sub}`}>
                Al publicar fotos con metadatos si ya la has publicado una vez te eliminaran el anuncio, esta herramienta lo que hace es ahorrarte tiempo haciendo fotos a cada producto.
              </p>
            </div>

            <div className={`rounded-xl border p-6 ${c.card}`}>
              <h3 className="font-display text-lg font-semibold">100% privado</h3>
              <p className={`mt-3 text-sm leading-relaxed ${c.sub}`}>
                El procesamiento ocurre en tu navegador con tecnología local. Ninguna imagen
                sale de tu dispositivo.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-brand-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Sin subidas a servidores
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}