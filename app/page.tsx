'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// Logo real de Flipscale (inline, no depende de archivos externos)
function Logo({ className = 'h-7 w-7' }: { className?: string }) {
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

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('visible');
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo className="h-7 w-7" />
            <span className="font-display text-sm font-bold tracking-[0.2em]">
              FLIP<span className="text-accent-500">SCALE</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#producto" className="transition hover:text-white">Producto</a>
            <a href="#como-funciona" className="transition hover:text-white">Cómo funciona</a>
            <Link href="/pricing" className="transition hover:text-white">Precios</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm text-slate-400 transition hover:text-white sm:block">
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-brand-500 px-4 py-1.5 text-sm font-semibold text-ink-950 transition hover:bg-brand-400"
            >
              Crear cuenta
            </Link>
            <button
              className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
            >
              <span className={`h-0.5 w-5 bg-white transition ${menuOpen ? 'translate-y-1 rotate-45' : ''}`} />
              <span className={`h-0.5 w-5 bg-white transition ${menuOpen ? '-translate-y-1 -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-white/5 bg-ink-950 px-6 py-4 md:hidden">
            <div className="flex flex-col gap-4 text-sm text-slate-300">
              <a href="#producto" onClick={() => setMenuOpen(false)}>Producto</a>
              <a href="#como-funciona" onClick={() => setMenuOpen(false)}>Cómo funciona</a>
              <Link href="/pricing" onClick={() => setMenuOpen(false)}>Precios</Link>
              <Link href="/login" onClick={() => setMenuOpen(false)}>Entrar</Link>
            </div>
          </nav>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-28 pt-40 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_0%,rgba(20,184,166,0.16),transparent)]" />
        <div className="relative mx-auto max-w-3xl">
          <p className="animate-fade-up ad-1 mb-6 text-sm font-medium tracking-wide text-brand-400">
            Para revendedores de Vinted, Wallapop y Etsy
          </p>
          <h1 className="animate-fade-up ad-2 font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
            Reventa con inteligencia.
          </h1>
          <p className="animate-fade-up ad-3 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            Flipscale convierte cada venta y cada gasto en decisiones. Beneficio real por
            plataforma, en tiempo real, sin hojas de cálculo.
          </p>
          <div className="animate-fade-up ad-4 mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-accent-500 px-7 py-3 text-sm font-bold text-ink-950 transition hover:scale-105 hover:bg-accent-400"
            >
              Empieza gratis
            </Link>
            <a
              href="#como-funciona"
              className="rounded-full border border-white/10 px-7 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
            >
              Ver cómo funciona
            </a>
          </div>
        </div>

        {/* PRODUCTO FLOTANTE */}
        <Reveal className="relative mx-auto mt-20 max-w-4xl">
          <div className="animate-float rounded-2xl border border-white/10 bg-ink-900/90 p-6 shadow-2xl backdrop-blur md:p-8">
            <div className="mb-6 flex items-center justify-between text-sm">
              <p className="font-semibold text-slate-300">Resumen · agosto</p>
              <span className="flex items-center gap-1.5 text-xs text-brand-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
                En vivo
              </span>
            </div>
            <div className="mb-8 grid grid-cols-3 gap-3 md:gap-4">
              <div className="rounded-xl bg-ink-800 p-4">
                <p className="text-xs text-slate-400">Ingresos</p>
                <p className="font-display text-xl font-bold text-brand-400 md:text-2xl">241,34 €</p>
              </div>
              <div className="rounded-xl bg-ink-800 p-4">
                <p className="text-xs text-slate-400">Gastos</p>
                <p className="font-display text-xl font-bold text-red-400 md:text-2xl">58,20 €</p>
              </div>
              <div className="rounded-xl bg-ink-800 p-4">
                <p className="text-xs text-slate-400">Beneficio</p>
                <p className="font-display text-xl font-bold text-accent-500 md:text-2xl">183,14 €</p>
              </div>
            </div>
            <div className="flex h-28 items-end gap-2 md:h-36">
              {[35, 55, 40, 70, 62, 88].map((h, i) => (
                <div key={i} className="flex flex-1 items-end gap-1">
                  <div
                    className="flex-1 rounded-t-md bg-gradient-to-t from-brand-700 to-brand-400 transition-all duration-700 hover:opacity-80"
                    style={{ height: `${h}%` }}
                  />
                  <div className="flex-1 rounded-t-md bg-ink-700" style={{ height: `${h / 2.4}%` }} />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* BENTO PRODUCTO */}
      <section id="producto" className="bg-paper px-6 py-28 text-ink-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              Hecho para vender con cabeza.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              No es otra app de finanzas. Es el sistema operativo de tu reventa.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <Reveal className="md:col-span-2">
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <p className="text-sm font-semibold text-brand-600">Finanzas en tiempo real</p>
                <h3 className="mt-2 font-display text-2xl font-bold">Tu beneficio, siempre al día.</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Cada movimiento actualiza ingresos, gastos y margen al instante. Por
                  plataforma, por categoría, por mes.
                </p>
                <div className="mt-6 flex h-20 items-end gap-2">
                  {[40, 65, 50, 80, 70, 95, 60].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t bg-brand-500/80" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <p className="text-sm font-semibold text-accent-600">Desde el móvil</p>
                <h3 className="mt-2 font-display text-2xl font-bold">Un toque. Cinco segundos.</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Registra ventas mientras empaquetas, sin salir de tu rutina.
                </p>
                <div className="mt-6 space-y-2">
                  {['Vinted', 'Wallapop', 'Etsy'].map((p) => (
                    <div key={p} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <p className="text-sm font-semibold text-brand-600">Privacidad</p>
                <h3 className="mt-2 font-display text-2xl font-bold">Fotos sin rastros.</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Limpia los metadatos de tus imágenes antes de publicarlas en los marketplaces.
                </p>
              </div>
            </Reveal>
            <Reveal className="md:col-span-2">
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <p className="text-sm font-semibold text-accent-600">IA para vender más</p>
                <h3 className="mt-2 font-display text-2xl font-bold">Descripciones que convierten.</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Genera descripciones profesionales y multilingües a partir de una foto.
                </p>
                <div className="mt-6 space-y-2">
                  <div className="h-3 w-full rounded bg-slate-200" />
                  <div className="h-3 w-4/5 rounded bg-slate-200" />
                  <div className="h-3 w-3/5 rounded bg-slate-200" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-center font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              Así de simple.
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {[
              ['01', 'Crea tu cuenta', 'Dos minutos, sin tarjeta. Tu panel queda listo y conectado.'],
              ['02', 'Registra movimientos', 'Ingresos y gastos por plataforma, desde el móvil o la web.'],
              ['03', 'Decide con datos', 'Descubre qué plataforma te da beneficio real y escala lo que funciona.'],
            ].map(([n, t, d], i) => (
              <Reveal key={n} className={i === 1 ? 'md:translate-y-6' : ''}>
                <p className="font-display text-5xl font-extrabold text-brand-500/25">{n}</p>
                <h3 className="mt-3 font-display text-xl font-semibold">{t}</h3>
                <p className="mt-2 leading-relaxed text-slate-400">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TAGLINE */}
      <section className="border-t border-white/5 px-6 py-24 text-center">
        <Reveal>
          <p className="mx-auto max-w-3xl font-display text-3xl font-extrabold leading-snug md:text-5xl">
            Más inteligencia.
            <br />
            Más crecimiento.
            <br />
            <span className="text-accent-500">Más beneficios.</span>
          </p>
          <Link
            href="/register"
            className="mt-10 inline-block rounded-full bg-accent-500 px-8 py-3 text-sm font-bold text-ink-950 transition hover:scale-105 hover:bg-accent-400"
          >
            Empieza gratis hoy
          </Link>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
          <div className="flex items-center gap-2">
            <Logo className="h-5 w-5" />
            <span>© 2026 Flipscale</span>
          </div>
          <div className="flex gap-6">
            <Link href="/pricing" className="transition hover:text-slate-300">Precios</Link>
            <Link href="/login" className="transition hover:text-slate-300">Entrar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}