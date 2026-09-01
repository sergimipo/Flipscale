'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (localStorage.getItem('fs-theme') === 'light') setTheme('light');
  }, []);

  const show =
    pathname === '/dashboard' || pathname === '/tools' || pathname === '/tools/description';
  if (!show) return null;

  const dark = theme === 'dark';
  const bar = dark ? 'border-white/10 bg-ink-950/90' : 'border-slate-200 bg-white/90';
  const idle = dark ? 'text-slate-500' : 'text-slate-400';
  const active = 'text-brand-500';
  const tab = (p) => (pathname === p ? active : idle);

  const handleAdd = () => {
    if (pathname === '/dashboard') {
      window.dispatchEvent(new CustomEvent('flipscale-open-add'));
    } else {
      router.push('/dashboard?add=1');
    }
  };

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl lg:hidden ${bar}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid h-16 grid-cols-4 items-center">
        <Link href="/dashboard" className={`flex flex-col items-center justify-center gap-1 ${tab('/dashboard')}`}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 7h7v7" />
          </svg>
          <span className="text-[10px] font-semibold">Resumen</span>
        </Link>

        <button onClick={handleAdd} className="flex items-center justify-center" aria-label="Añadir">
          <span className="flex h-11 w-11 -translate-y-3 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/30">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </span>
        </button>

        <Link href="/tools" className={`flex flex-col items-center justify-center gap-1 ${tab('/tools')}`}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-[10px] font-semibold">Metadatos</span>
        </Link>

        <Link href="/tools/description" className={`flex flex-col items-center justify-center gap-1 ${tab('/tools/description')}`}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span className="text-[10px] font-semibold">IA</span>
        </Link>
      </div>
    </nav>
  );
}