'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (localStorage.getItem('fs-theme') === 'light') setTheme('light');
  }, []);

  const show =
    pathname === '/dashboard' || pathname === '/tools' || pathname === '/tools/description';
  if (!show) return null;

  const dark = theme === 'dark';

  const activeKey =
    pathname === '/tools/description' ? 'ia' : pathname === '/tools' ? 'tools' : 'dashboard';

  const bar = dark ? 'border-white/10 bg-ink-950/90' : 'border-slate-200 bg-white/90';
  const idle = dark ? 'text-slate-500' : 'text-slate-400';
  const active = dark ? 'text-blue-400' : 'text-blue-600';
  const cls = (key) => (activeKey === key ? active : idle);

  return (
    <nav
      className={`fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-xl lg:hidden ${bar}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto grid h-16 w-full max-w-md grid-cols-3 items-stretch">
        {/* RESUMEN */}
        <Link href="/dashboard" className={`flex flex-col items-center justify-center gap-1 py-2 transition ${cls('dashboard')}`}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 7h7v7" />
          </svg>
          <span className={`text-[10px] ${activeKey === 'dashboard' ? 'font-bold' : 'font-semibold'}`}>Resumen</span>
        </Link>

        {/* METADATOS */}
        <Link href="/tools" className={`flex flex-col items-center justify-center gap-1 py-2 transition ${cls('tools')}`}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span className={`text-[10px] ${activeKey === 'tools' ? 'font-bold' : 'font-semibold'}`}>Metadatos</span>
        </Link>

        {/* IA */}
        <Link href="/tools/description" className={`flex flex-col items-center justify-center gap-1 py-2 transition ${cls('ia')}`}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          <span className={`text-[10px] ${activeKey === 'ia' ? 'font-bold' : 'font-semibold'}`}>IA</span>
        </Link>
      </div>
    </nav>
  );
}