'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('dark');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('fs-theme') === 'light') setTheme('light');
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  const dark = theme === 'dark';

  const c = {
    page: dark ? 'bg-ink-950 text-white' : 'bg-paper text-ink-950',
    header: dark ? 'border-white/10 bg-ink-950/80' : 'border-slate-200 bg-white/80',
    card: dark ? 'border-white/10 bg-ink-900' : 'border-slate-200 bg-white',
    sub: dark ? 'text-slate-400' : 'text-slate-600',
    faint: dark ? 'text-slate-500' : 'text-slate-400',
  };

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login?redirect=/pricing');
      return;
    }
    setProcessing(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: window.location.origin,
          userId: user.id,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Error al crear la sesión de pago');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${c.page}`}>
        <p className={c.sub}>Cargando...</p>
      </div>
    );
  }

  const features = [
    { title: 'Dashboard avanzado', desc: 'Gráficos por día, semana, mes y año con análisis por plataforma.' },
    { title: 'Borrado de metadatos', desc: 'Limpia tus fotos de GPS y datos ocultos sin subirlas a ningún servidor.' },
    { title: 'Descripciones IA', desc: 'Genera descripciones profesionales multilingües con un clic.' },
    { title: 'Registro rápido', desc: 'Añade ventas en 5 segundos desde el móvil sin salir de tu rutina.' },
    { title: 'Licencia de por vida', desc: 'Un solo pago. Sin suscripciones, sin renovaciones, sin sorpresas.' },
    { title: 'Funciones futuras', desc: 'Cada nueva herramienta que lancemos, la tendrás incluida.' },
  ];

  return (
    <div className={`min-h-screen ${c.page}`}>
      <header className={`sticky top-0 z-30 border-b backdrop-blur-xl ${c.header}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
            <svg viewBox="0 0 1024 1024" fill="none" className="h-8 w-8" aria-label="Flipscale">
              <path d="M 196.59 712.97 C189.30,715.48 186.78,715.52 184.65,713.17 C183.15,711.50 183.00,704.89 183.00,638.74 C183.00,592.74 183.39,563.28 184.07,558.32 C185.36,548.88 189.99,534.51 194.17,527.00 C207.43,503.13 228.27,486.12 254.50,477.77 L 261.50 475.54 L 366.92 475.24 C448.78,475.01 472.52,475.22 473.10,476.16 C474.02,477.66 473.47,478.75 454.14,514.00 C437.10,545.05 433.93,549.27 424.20,553.83 L 418.50 556.50 L 342.31 557.00 L 266.13 557.50 L 262.96 560.50 C261.22,562.15 259.29,564.62 258.67,566.00 C257.90,567.69 257.37,584.01 257.02,616.56 L 256.50 664.61 L 252.72 672.26 C248.11,681.58 241.09,689.45 232.02,695.49 C224.29,700.62 205.45,709.92 196.59,712.97 ZM 188.49 496.25 C186.85,498.86 185.16,501.00 184.75,501.00 C183.61,501.00 183.86,422.63 185.03,412.97 C187.33,394.01 194.26,379.66 207.47,366.50 C217.71,356.30 224.17,352.13 236.74,347.63 L 245.50 344.50 L 399.25 344.23 C527.92,344.01 553.00,344.18 553.00,345.32 C553.00,346.70 544.23,363.22 526.10,396.00 C518.13,410.41 514.67,415.65 510.43,419.71 C508.95,421.13 507.93,422.31 506.74,423.29 C500.98,428.03 491.32,428.03 405.73,428.02 C399.00,428.02 391.78,428.01 384.07,428.02 C276.91,428.03 273.25,428.09 265.50,430.03 C247.63,434.49 228.73,446.88 212.87,464.52 C205.31,472.93 193.53,488.27 188.49,496.25 ZM 390.03 710.95 C380.25,712.16 352.16,712.15 343.81,710.92 C329.90,708.88 317.61,704.11 310.74,698.08 C308.90,696.46 306.07,692.74 304.45,689.82 L 301.50 684.50 L 300.91 604.71 L 303.71 606.57 C340.30,630.90 378.65,638.37 428.50,630.88 C466.27,625.20 504.22,611.80 541.65,590.93 C580.14,569.46 613.48,544.60 647.16,512.25 C653.60,506.06 659.16,501.00 659.51,501.00 C660.23,501.00 643.46,525.77 635.13,537.00 C603.91,579.10 573.69,611.27 537.50,640.92 C488.77,680.85 437.92,705.00 390.03,710.95 ZM 595.02 519.99 C593.92,520.58 584.25,521.00 571.74,521.00 C569.38,521.00 567.24,521.02 565.29,521.04 C555.85,521.12 550.98,521.17 548.49,518.76 C545.84,516.19 545.88,510.85 545.97,499.82 C545.98,497.68 546.00,495.33 546.00,492.74 C546.00,469.46 546.03,469.09 548.22,467.56 C550.07,466.26 554.16,466.00 572.57,466.00 C592.39,466.00 594.85,466.18 596.21,467.75 C597.42,469.14 597.86,473.79 598.35,490.50 C599.01,512.68 598.39,518.19 595.02,519.99 Z" fill="#09868b" />
              <path d="M 533.41 684.05 C516.46,687.97 510.70,688.82 512.55,687.14 C513.07,686.66 517.10,683.88 521.50,680.95 C573.28,646.48 632.69,585.39 690.18,507.50 C712.00,477.95 736.93,439.88 758.95,402.50 C769.31,384.93 774.68,375.43 787.53,352.00 C799.87,329.51 801.06,327.15 800.29,326.69 C799.86,326.42 796.35,325.90 792.50,325.53 C788.65,325.16 780.33,324.25 774.00,323.50 C767.67,322.75 759.01,321.85 754.75,321.49 C750.49,321.12 747.00,320.44 747.00,319.96 C747.00,319.15 759.95,311.32 828.00,270.99 C843.12,262.02 865.96,248.46 878.75,240.85 C891.54,233.23 902.45,227.00 903.00,227.00 C903.66,227.00 903.99,258.83 903.96,320.75 L 903.92 414.50 L 901.07 411.18 C899.51,409.35 896.49,405.30 894.37,402.18 C882.18,384.25 872.63,371.00 871.90,371.00 C871.45,371.00 865.44,382.14 858.56,395.75 C825.16,461.80 796.13,506.29 757.94,550.00 C724.08,588.74 687.82,618.13 643.87,642.48 C609.79,661.35 575.07,674.42 533.41,684.05 ZM 675.37 431.93 C672.87,433.89 671.50,434.00 648.82,434.00 L 624.91 434.00 L 622.45 431.55 L 620.00 429.09 L 620.00 376.90 L 622.70 374.40 L 625.40 371.90 L 649.79 372.20 C674.05,372.50 674.19,372.51 676.09,374.86 C677.86,377.05 678.00,379.12 678.00,403.54 L 678.00 429.85 Z" fill="#f9a712" />
            </svg>
            <span className="hidden font-display text-base font-semibold tracking-wide sm:block">
              FLIP<span className="text-accent-500">SCALE</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard" className={`text-sm font-medium transition ${dark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-ink-950'}`}>
                Ir al dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className={`text-sm font-medium transition ${dark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-ink-950'}`}>
                  Entrar
                </Link>
                <Link href="/register" className="btn-primary">
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-500">
            Oferta de lanzamiento
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">
            Un solo pago.
            <br />
            <span className="text-gradient">Acceso para siempre.</span>
          </h1>
          <p className={`mx-auto mt-5 max-w-2xl text-lg ${c.sub}`}>
            Olvídate de cuotas mensuales. Paga una vez y accede a todas las herramientas de Flipscale de por vida.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          <div className={`lg:col-span-2 rounded-2xl border p-8 shadow-2xl relative overflow-hidden ${c.card}`}>
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent-500/10 blur-3xl" />

            <div className="relative">
              <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-accent-500/10 px-3 py-1 text-xs font-bold text-accent-500">
                FLIPSCALE PRO
              </div>
              <h2 className="font-display text-2xl font-bold">Acceso de por vida</h2>
              <p className={`mt-1 text-sm ${c.sub}`}>
                Todo lo que un reseller necesita.
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-6xl font-extrabold">5€</span>
                <span className={`text-sm ${c.sub}`}>· pago único</span>
              </div>
              <p className={`mt-1 text-xs ${c.faint}`}>Sin cuotas. Sin renovaciones.</p>

              <div className={`my-6 h-px ${dark ? 'bg-white/10' : 'bg-slate-200'}`} />

              {error && (
                <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-500">
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={processing || !user}
                className="btn-primary w-full disabled:opacity-50"
              >
                {processing ? 'Redirigiendo a Stripe…' : !user ? 'Inicia sesión para comprar' : 'Comprar por 5 €'}
              </button>

              <div className={`mt-4 flex items-center justify-center gap-2 text-xs ${c.faint}`}>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Pago seguro con Stripe
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className={`mb-5 text-sm font-semibold uppercase tracking-wider ${c.faint}`}>
              Todo incluido
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((f) => (
                <div
                  key={f.title}
                  className={`rounded-xl border p-4 transition hover:border-brand-500/40 ${c.card}`}
                >
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-display text-sm font-bold">{f.title}</p>
                  <p className={`mt-1 text-xs leading-relaxed ${c.sub}`}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-center font-display text-2xl font-bold md:text-3xl">
            Preguntas frecuentes
          </h2>
          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {[
              { q: '¿Tengo que pagar cada mes?', a: 'No. Pagas 5€ una sola vez y accedes para siempre a todas las funciones actuales y futuras.' },
              { q: '¿Qué pasa si ya tengo cuenta gratuita?', a: 'Tu cuenta se actualizará automáticamente a Pro tras el pago. No pierdes nada de lo que ya hayas guardado.' },
              { q: '¿Qué métodos de pago aceptáis?', a: 'Tarjeta de crédito/débito a través de Stripe. Pago 100% seguro.' },
              { q: '¿Puedo pedir un reembolso?', a: 'Sí, tienes 14 días para pedir un reembolso completo sin preguntas.' },
            ].map((item) => (
              <details
                key={item.q}
                className={`group rounded-xl border p-4 transition open:border-brand-500/40 ${c.card}`}
              >
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold">
                  {item.q}
                  <svg className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className={`mt-3 text-sm leading-relaxed ${c.sub}`}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}