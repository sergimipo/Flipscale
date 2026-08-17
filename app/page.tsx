'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export function Logo({ className = 'h-11 w-11' }: { className?: string }) {
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

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = (y / rect.height - 0.5) * -8;
    const ry = (x / rect.width - 0.5) * 8;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
  };
  const handleLeave = () => {
    if (ref.current) {
      ref.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    }
  };
  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className={`tilt-card ${className}`}>
      {children}
    </div>
  );
}

const testimonials = [
  { name: 'Laura M.', role: 'Vendedora en Vinted', text: 'Pasé de intuir a saber. Ahora sé qué me deja beneficio real por plataforma.', rating: 5 },
  { name: 'Marc R.', role: 'Reseller en Wallapop', text: 'El atajo del móvil me ha cambiado la vida. Registro cada venta en 5 segundos.', rating: 5 },
  { name: 'Sofía G.', role: 'Tienda en Etsy', text: 'Por fin una herramienta hecha para revendedores, no para freelancers genéricos.', rating: 5 },
  { name: 'David P.', role: 'Flipper a tiempo completo', text: 'El dashboard en tiempo real me hizo ver gastos que no controlaba. +23% de margen.', rating: 5 },
  { name: 'Elena V.', role: 'Top seller en Vinted', text: 'La IA de descripciones es oro. Vendo más rápido y con menos esfuerzo.', rating: 5 },
  { name: 'Carlos T.', role: 'Reseller multiplataforma', text: 'Llevo 3 años vendiendo online. Flipscale es lo que siempre quise tener.', rating: 5 },
  { name: 'Ana B.', role: 'Vendedora ocasional', text: 'Fácil, rápido y bonito. No hace falta ser contable para usarlo.', rating: 5 },
  { name: 'Jordi S.', role: 'Vintage flipper', text: 'Saber mi beneficio real por plataforma me ayudó a centrar el negocio.', rating: 5 },
];

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <div className="mx-2 flex w-[340px] flex-shrink-0 flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-all duration-300 hover:border-brand-500/50 hover:bg-white/10 md:w-[380px]">
      <div>
        <div className="mb-3 flex gap-0.5">
          {Array.from({ length: t.rating }).map((_, i) => (
            <svg key={i} className="h-4 w-4 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-slate-200">«{t.text}»</p>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="bg-animated-gradient flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white">
          {t.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t.name}</p>
          <p className="text-xs text-slate-400">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const setSpeed = (rate: number) => {
    ref.current?.getAnimations({ subtree: true }).forEach((a) => {
      a.playbackRate = rate;
    });
  };
  return (
    <div
      ref={ref}
      onMouseEnter={() => setSpeed(0.15)}
      onMouseLeave={() => setSpeed(1)}
      className="relative flex overflow-hidden"
    >
      <div className="absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-ink-950 to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-ink-950 to-transparent" />
      <div className={`flex ${reverse ? 'animate-marquee-right' : 'animate-marquee-left'}`}>
        {[...testimonials, ...testimonials].map((t, i) => (
          <TestimonialCard key={`${reverse ? 'r' : 'l'}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      {/* NAV */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'border-b border-white/5 bg-ink-950/80 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 transition-all duration-300 hover:scale-[1.02]">
            <Logo className="h-11 w-11 drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]" />
            <span className="font-serif text-lg font-medium tracking-[0.3em]">
              FLIP<span className="text-accent-500">SCALE</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-10 text-sm text-slate-400 md:flex">
            <a href="#producto" className="relative transition after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-brand-500 after:transition-all after:duration-300 hover:text-white hover:after:w-full">
              Producto
            </a>
            <a href="#como-funciona" className="relative transition after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-brand-500 after:transition-all after:duration-300 hover:text-white hover:after:w-full">
              Cómo funciona
            </a>
            <a href="#testimonios" className="relative transition after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-brand-500 after:transition-all after:duration-300 hover:text-white hover:after:w-full">
              Testimonios
            </a>
            <Link href="/pricing" className="relative transition after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-brand-500 after:transition-all after:duration-300 hover:text-white hover:after:w-full">
              Precios
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden text-sm text-slate-400 transition hover:text-white sm:block">
              Entrar
            </Link>
            <Link href="/register" className="btn-primary">
              Crear cuenta
            </Link>
            <button
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg transition hover:bg-white/5 md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
            >
              <span className={`h-0.5 w-5 bg-white transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`h-0.5 w-5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-5 bg-white transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
        <div className={`overflow-hidden transition-all duration-500 md:hidden ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
          <nav className="border-t border-white/5 bg-ink-950/95 px-6 py-4 backdrop-blur-xl">
            <div className="flex flex-col gap-4 text-sm text-slate-300">
              <a href="#producto" onClick={() => setMenuOpen(false)}>Producto</a>
              <a href="#como-funciona" onClick={() => setMenuOpen(false)}>Cómo funciona</a>
              <a href="#testimonios" onClick={() => setMenuOpen(false)}>Testimonios</a>
              <Link href="/pricing" onClick={() => setMenuOpen(false)}>Precios</Link>
              <Link href="/login" onClick={() => setMenuOpen(false)}>Entrar</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-24 pt-36 md:pt-44">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-accent-500/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="animate-fade-up ad-1 font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            Reventa con <span className="text-gradient">inteligencia.</span>
          </h1>
          <p className="animate-fade-up ad-2 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
            Flipscale convierte cada venta y cada gasto en decisiones. Beneficio real por
            plataforma, en tiempo real, sin hojas de cálculo.
          </p>
          <div className="animate-fade-up ad-3 mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="btn-primary">
              Empieza gratis
            </Link>
            <a href="#como-funciona" className="btn-ghost">
              Ver cómo funciona →
            </a>
          </div>
          <p className="animate-fade-up ad-4 mt-6 text-xs text-slate-500">
            Sin tarjeta · Listo en 2 minutos · Cancela cuando quieras
          </p>
        </div>

        {/* PRODUCTO FLOTANTE */}
        <Reveal className="relative mx-auto mt-24 max-w-5xl">
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-500/20 via-accent-500/10 to-transparent blur-2xl" />
            <div className="animate-float relative rounded-2xl border border-white/10 bg-ink-900/80 p-5 shadow-2xl backdrop-blur-xl md:p-8">
              <div className="mb-6 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Logo className="h-7 w-7" />
                  <p className="font-semibold text-slate-300">Resumen · agosto</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-brand-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
                  </span>
                  En vivo
                </span>
              </div>
              <div className="mb-8 grid grid-cols-3 gap-3 md:gap-4">
                <div className="rounded-xl bg-ink-800/50 p-4 transition-all duration-300 hover:bg-ink-800">
                  <p className="text-xs text-slate-400">Ingresos</p>
                  <p className="mt-1 font-display text-xl font-bold text-brand-400 md:text-2xl">241,34 €</p>
                </div>
                <div className="rounded-xl bg-ink-800/50 p-4 transition-all duration-300 hover:bg-ink-800">
                  <p className="text-xs text-slate-400">Gastos</p>
                  <p className="mt-1 font-display text-xl font-bold text-red-400 md:text-2xl">58,20 €</p>
                </div>
                <div className="rounded-xl bg-ink-800/50 p-4 transition-all duration-300 hover:bg-ink-800">
                  <p className="text-xs text-slate-400">Beneficio</p>
                  <p className="mt-1 font-display text-xl font-bold text-accent-500 md:text-2xl">183,14 €</p>
                </div>
              </div>
              <div className="flex h-28 items-end gap-2 md:h-40">
                {[35, 55, 40, 70, 62, 88, 45, 72].map((h, i) => (
                  <div key={i} className="flex flex-1 items-end gap-1">
                    <div
                      className="flex-1 rounded-t-md bg-gradient-to-t from-brand-700 to-brand-400 transition-all duration-500 hover:from-brand-600 hover:to-brand-300"
                      style={{ height: `${h}%` }}
                    />
                    <div
                      className="flex-1 rounded-t-md bg-ink-700 transition-all duration-500 hover:bg-ink-600"
                      style={{ height: `${h / 2.4}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* MARKETPLACES */}
      <section className="border-t border-white/5 pb-24 pt-8">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
          Compatible con tus marketplaces
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 px-6 text-2xl font-bold text-slate-500 md:gap-16">
          <span className="transition hover:text-white">Vinted</span>
          <span className="transition hover:text-white">Wallapop</span>
          <span className="transition hover:text-white">Etsy</span>
          <span className="text-xl font-semibold text-slate-600 transition hover:text-slate-400">+ otros</span>
        </div>
      </section>

      {/* PRODUCTO */}
      <section
        id="producto"
        className="relative -mt-12 rounded-t-[2.5rem] bg-paper px-6 pb-40 pt-24 text-ink-950 shadow-[0_-24px_60px_-24px_rgba(11,18,32,0.5)] md:rounded-t-[3.5rem]"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Producto</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                Hecho para vender con cabeza.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
                No es otra app de finanzas. Es el sistema operativo de tu reventa.
              </p>
            </div>
          </Reveal>
          <div className="mt-16 grid gap-6 md:grid-cols-6">
            <Reveal className="md:col-span-4">
              <TiltCard className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-card md:p-10">
                <p className="text-sm font-semibold text-brand-600">Finanzas en tiempo real</p>
                <h3 className="mt-2 font-display text-2xl font-bold md:text-3xl">Tu beneficio, siempre al día.</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Cada movimiento actualiza ingresos, gastos y margen al instante. Por
                  plataforma, por categoría, por mes.
                </p>
                <div className="mt-8 flex h-24 items-end gap-2">
                  {[40, 65, 50, 80, 70, 95, 60, 85].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-brand-600 to-brand-400" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </TiltCard>
            </Reveal>
            <Reveal className="md:col-span-2">
              <TiltCard className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-card">
                <p className="text-sm font-semibold text-accent-600">Desde el móvil</p>
                <h3 className="mt-2 font-display text-2xl font-bold">Un toque. Cinco segundos.</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Registra ventas mientras empaquetas, sin salir de tu rutina.
                </p>
                <div className="mt-6 space-y-2">
                  {['Vinted', 'Wallapop', 'Etsy'].map((p) => (
                    <div key={p} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                      <span>{p}</span>
                      <span className="text-brand-600">→</span>
                    </div>
                  ))}
                </div>
              </TiltCard>
            </Reveal>
            <Reveal className="md:col-span-2">
              <TiltCard className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-card">
                <p className="text-sm font-semibold text-brand-600">Privacidad</p>
                <h3 className="mt-2 font-display text-2xl font-bold">Fotos sin rastros.</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Limpia los metadatos de tus imágenes antes de publicarlas.
                </p>
                <div className="mt-6 rounded-lg bg-slate-50 p-4 text-center">
                  <span className="text-4xl">🛡️</span>
                </div>
              </TiltCard>
            </Reveal>
            <Reveal className="md:col-span-4">
              <TiltCard className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-card md:p-10">
                <p className="text-sm font-semibold text-accent-600">IA para vender más</p>
                <h3 className="mt-2 font-display text-2xl font-bold md:text-3xl">Descripciones que convierten.</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Genera descripciones profesionales y multilingües a partir de una foto.
                </p>
                <div className="mt-6 space-y-2.5 rounded-lg bg-slate-50 p-4">
                  <div className="h-2.5 w-full rounded bg-gradient-to-r from-accent-400 to-accent-500" />
                  <div className="h-2.5 w-4/5 rounded bg-gradient-to-r from-accent-300 to-accent-400" />
                  <div className="h-2.5 w-3/5 rounded bg-gradient-to-r from-accent-200 to-accent-300" />
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* BLOQUE OSCURO */}
      <div className="relative -mt-12 rounded-t-[2.5rem] bg-ink-950 shadow-[0_-24px_60px_-24px_rgba(11,18,32,0.5)] md:rounded-t-[3.5rem]">
        {/* CÓMO FUNCIONA */}
        <section id="como-funciona" className="px-6 pb-28 pt-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">Proceso</p>
                <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                  Así de simple.
                </h2>
              </div>
            </Reveal>
            <div className="mt-20 grid gap-8 md:grid-cols-3">
              {[
                ['01', 'Crea tu cuenta', 'Dos minutos, sin tarjeta. Tu panel queda listo y conectado a tu móvil.'],
                ['02', 'Registra movimientos', 'Ingresos y gastos por plataforma, desde el móvil o la web, con decimales y notas.'],
                ['03', 'Decide con datos', 'Descubre qué plataforma te da beneficio real y escala lo que funciona.'],
              ].map(([n, t, d], i) => (
                <Reveal key={n} className={i === 1 ? 'md:translate-y-8' : ''}>
                  <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur transition-all duration-500 hover:border-brand-500/30 hover:bg-white/10">
                    <p className="font-display text-6xl font-extrabold text-brand-500/20 transition-all duration-500 group-hover:text-brand-500/40">
                      {n}
                    </p>
                    <h3 className="mt-4 font-display text-xl font-semibold md:text-2xl">{t}</h3>
                    <p className="mt-3 leading-relaxed text-slate-400">{d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section id="testimonios" className="border-y border-white/5 bg-ink-900/50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="mb-12 text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-accent-400">Testimonios</p>
                <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
                  Revendedores que ya escalan.
                </h2>
              </div>
            </Reveal>
          </div>
          <div className="space-y-4">
            <MarqueeRow />
            <MarqueeRow reverse />
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="px-6 py-28 text-center">
          <Reveal>
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-ink-900/80 p-12 backdrop-blur-xl md:p-20">
              <div className="bg-animated-gradient absolute inset-0 opacity-10" />
              <div className="relative">
                <p className="mx-auto font-display text-3xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
                  Más inteligencia.
                  <br />
                  Más crecimiento.
                  <br />
                  <span className="text-gradient">Más beneficios.</span>
                </p>
                <Link href="/register" className="btn-primary mt-10 inline-block">
                  Empieza gratis hoy
                </Link>
                <p className="mt-4 text-xs text-slate-500">Sin tarjeta · 2 minutos para empezar</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/5 px-6 py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="font-serif text-sm font-medium tracking-[0.25em]">
                FLIP<span className="text-accent-500">SCALE</span>
              </span>
            </div>
            <div className="flex gap-6">
              <Link href="/pricing" className="transition hover:text-slate-300">Precios</Link>
              <Link href="/login" className="transition hover:text-slate-300">Entrar</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}