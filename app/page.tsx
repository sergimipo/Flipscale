'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Logo from '../components/Logo';

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