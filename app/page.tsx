import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-ink-950 text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-dark.png" alt="Flipscale" width={34} height={34} className="rounded-md" />
            <span className="font-display text-lg font-bold tracking-widest">
              FLIP<span className="text-accent-500">SCALE</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#producto" className="transition hover:text-white">Producto</a>
            <a href="#como-funciona" className="transition hover:text-white">Cómo funciona</a>
            <Link href="/pricing" className="transition hover:text-white">Precios</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-slate-300 transition hover:text-white">Entrar</Link>
            <Link
              href="/register"
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-ink-950 transition hover:bg-brand-400"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(20,184,166,0.14),transparent)]" />
        <div className="mx-auto grid max-w-6xl gap-16 px-6 pb-24 pt-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              Para revendedores de Vinted, Wallapop y Etsy
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-tight md:text-5xl">
              Tu negocio de reventa, <span className="text-accent-500">bajo control</span>.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-400">
              Registra cada venta y cada gasto en segundos, y conoce tu beneficio real por
              plataforma. Sin hojas de cálculo. Sin suposiciones.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-lg bg-accent-500 px-6 py-3 text-sm font-bold text-ink-950 transition hover:bg-accent-400"
              >
                Empieza gratis
              </Link>
              <a
                href="#como-funciona"
                className="rounded-lg border border-white/10 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
              >
                Ver cómo funciona
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-500">Sin tarjeta · Listo en 2 minutos</p>
          </div>

          {/* MOCK DEL DASHBOARD */}
          <div className="rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-300">Resumen · agosto</p>
              <span className="flex items-center gap-1.5 text-xs text-brand-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
                En vivo
              </span>
            </div>
            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-ink-800 p-3">
                <p className="text-[11px] text-slate-400">Ingresos</p>
                <p className="font-display text-lg font-bold text-brand-400">241,34 €</p>
              </div>
              <div className="rounded-lg bg-ink-800 p-3">
                <p className="text-[11px] text-slate-400">Gastos</p>
                <p className="font-display text-lg font-bold text-red-400">58,20 €</p>
              </div>
              <div className="rounded-lg bg-ink-800 p-3">
                <p className="text-[11px] text-slate-400">Beneficio</p>
                <p className="font-display text-lg font-bold text-accent-500">183,14 €</p>
              </div>
            </div>
            <div className="mb-6 flex h-24 items-end gap-2">
              {[35, 55, 40, 70, 62, 88].map((h, i) => (
                <div key={i} className="flex flex-1 items-end gap-1">
                  <div className="flex-1 rounded-t bg-brand-500" style={{ height: `${h}%` }} />
                  <div className="flex-1 rounded-t bg-ink-700" style={{ height: `${h / 2.4}%` }} />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-ink-800 px-4 py-2.5 text-sm">
                <span className="text-slate-300">Venta · Vinted</span>
                <span className="font-semibold text-brand-400">+45,00 €</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-ink-800 px-4 py-2.5 text-sm">
                <span className="text-slate-300">Gasto · Embalaje</span>
                <span className="font-semibold text-red-400">-2,50 €</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTO */}
      <section id="producto" className="bg-paper py-24 text-ink-950">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-3xl font-bold">
            Todo lo que necesitas para vender con cabeza
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Flipscale no es otra app de finanzas: está construida específicamente para el
            negocio de la reventa de segunda mano.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10">
                <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 7h7v7" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-semibold">Finanzas en tiempo real</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Cada venta y cada gasto actualiza tu beneficio al instante. Ingresos, costes
                y margen por plataforma, siempre al día.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500/10">
                <svg className="h-5 w-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-semibold">Registro en un toque</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Un acceso directo en tu móvil: eliges plataforma, importe y listo en 5
                segundos, mientras empaquetas el pedido.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10">
                <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-semibold">Herramientas pro</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Limpia los metadatos de tus fotos para vender con privacidad y genera
                descripciones con IA que venden más y mejor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-3xl font-bold">Cómo funciona</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {[
              ['01', 'Crea tu cuenta', 'Dos minutos, sin tarjeta. Tu panel queda listo y conectado a tu móvil.'],
              ['02', 'Registra movimientos', 'Ingresos y gastos por plataforma desde el móvil o desde la web, con decimales y notas.'],
              ['03', 'Decide con datos', 'Ve qué plataforma te da beneficio real y detecta a tiempo lo que no funciona.'],
            ].map(([n, t, d]) => (
              <div key={n} className="relative">
                <p className="font-display text-4xl font-extrabold text-brand-500/30">{n}</p>
                <h3 className="mt-2 font-display text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TAGLINE */}
      <section className="border-t border-white/5 bg-ink-900 py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="font-display text-2xl font-bold md:text-3xl">
            Más inteligencia. Más crecimiento.{' '}
            <span className="text-accent-500">Más beneficios.</span>
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-accent-500 px-8 py-3 text-sm font-bold text-ink-950 transition hover:bg-accent-400"
          >
            Empieza gratis hoy
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 md:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/logo-dark.png" alt="Flipscale" width={22} height={22} className="rounded" />
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