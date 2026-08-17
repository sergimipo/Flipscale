'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function Logo({ className = 'h-10 w-10' }) {
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

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(
        error.message.includes('already')
          ? 'Ya existe una cuenta con ese email.'
          : 'No se pudo crear la cuenta. Prueba de nuevo.'
      );
      return;
    }
    if (!data.session) {
      setMagicSent(true);
      return;
    }
    router.push('/dashboard');
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Escribe tu email para enviarte el enlace.');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) {
      setError('No se pudo enviar el enlace. Prueba de nuevo.');
      return;
    }
    setMagicSent(true);
  };

  const handleGoogle = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-6 py-16 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-accent-500/5 blur-3xl" />
      </div>

      <div className="animate-fade-up relative w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3 transition hover:scale-[1.02]">
          <Logo />
          <span className="font-display text-lg font-semibold tracking-wide">
            FLIP<span className="text-accent-500">SCALE</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-ink-900/80 p-8 shadow-2xl backdrop-blur-xl">
          {magicSent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10 text-2xl">
                📬
              </div>
              <h1 className="font-display text-2xl font-bold">Revisa tu correo</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Te hemos enviado un enlace a <span className="font-semibold text-brand-400">{email}</span> para
                activar tu cuenta o entrar directamente.
              </p>
              <button
                onClick={() => setMagicSent(false)}
                className="btn-primary mt-6 inline-block"
              >
                Volver
              </button>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold">Crea tu cuenta</h1>
              <p className="mt-1 text-sm text-slate-400">Empieza a controlar tu reventa en 2 minutos.</p>

              {/* BOTÓN GOOGLE */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-ink-950 transition hover:bg-slate-100 disabled:opacity-60"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continuar con Google
              </button>

              {/* DIVIDER */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-slate-500">o</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* FORMULARIO EMAIL */}
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full rounded-xl border border-white/10 bg-ink-800/60 px-4 py-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">Contraseña</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full rounded-xl border border-white/10 bg-ink-800/60 px-4 py-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-brand-500"
                  />
                </div>
                {error && (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">{error}</p>
                )}
                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                  {loading ? 'Creando cuenta…' : 'Crear cuenta gratis'}
                </button>
              </form>

              {/* MAGIC LINK */}
              <div className="mt-4 text-center">
                <button
                  onClick={handleMagicLink}
                  disabled={loading || !email}
                  className="text-xs font-semibold text-brand-400 transition hover:text-brand-300 disabled:opacity-40"
                >
                  Prefiero entrar con enlace mágico →
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-slate-400">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="font-semibold text-brand-400 transition hover:text-brand-300">
                  Entra aquí
                </Link>
              </p>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Sin tarjeta · Listo en 2 minutos · Cancela cuando quieras
        </p>
      </div>
    </div>
  );
}