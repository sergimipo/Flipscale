'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '../page';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
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
      setConfirm(true);
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-6 py-16 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-accent-500/5 blur-3xl" />
      </div>

      <div className="animate-fade-up relative w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3 transition hover:scale-[1.02]">
          <Logo className="h-10 w-10" />
          <span className="font-serif text-lg font-medium tracking-[0.3em]">
            FLIP<span className="text-accent-500">SCALE</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-ink-900/80 p-8 shadow-2xl backdrop-blur-xl">
          {confirm ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10 text-2xl">
                📬
              </div>
              <h1 className="font-display text-2xl font-bold">Revisa tu correo</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Te hemos enviado un enlace a <span className="font-semibold text-brand-400">{email}</span> para
                activar tu cuenta.
              </p>
              <Link href="/login" className="btn-primary mt-6 inline-block">
                Ir a entrar
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold">Crea tu cuenta</h1>
              <p className="mt-1 text-sm text-slate-400">Empieza a controlar tu reventa en 2 minutos.</p>

              <form onSubmit={handleRegister} className="mt-6 space-y-4">
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