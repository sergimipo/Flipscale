'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '../page';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError('Credenciales incorrectas. Prueba de nuevo.');
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
          <h1 className="font-display text-2xl font-bold">Bienvenido de nuevo</h1>
          <p className="mt-1 text-sm text-slate-400">Entra en tu panel de Flipscale.</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
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
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-ink-800/60 px-4 py-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-brand-500"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="font-semibold text-brand-400 transition hover:text-brand-300">
              Crea una gratis
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Más inteligencia. Más crecimiento. <span className="text-accent-500">Más beneficios.</span>
        </p>
      </div>
    </div>
  );
}