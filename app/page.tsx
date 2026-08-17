'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Logo } from '../components/Logo';

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