'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved);
        document.documentElement.setAttribute('data-theme', saved);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try { localStorage.setItem('theme', newTheme); } catch (e) {}
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const navItems = [
    { href: '/dashboard', label: 'Resumen' },
    { href: '/tools/description', label: 'Descripciones' },
    { href: '/tools/photos', label: 'Fotos' },
  ];

  return (
    <header className="sticky top-0 z-40 h-14 md:h-16 border-b border-border bg-bg/88 backdrop-blur-md">
      <div className="container-app h-full flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 group transition-transform duration-200 ease-custom hover:translate-x-0.5 hover:-translate-y-0.5">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-accent-2 fill-current">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-semibold text-lg tracking-tight text-text hidden sm:block">Flipscale</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} className={`nav-link ${isActive ? 'active' : ''}`} aria-current={isActive ? 'page' : undefined}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-btn text-muted hover:text-accent transition-transform duration-200 ease-custom hover:rotate-180" aria-label="Cambiar tema">
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
          </button>

          <Link href="/tools/description" className="btn-primary flex md:hidden p-0 w-[38px] h-[38px] justify-center">
            <svg className="w-4 h-4 icon-plus transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </Link>
          <Link href="/tools/description" className="btn-primary hidden md:flex">
            <svg className="w-4 h-4 icon-plus transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            <span>Añadir</span>
          </Link>

          <div className="w-9 h-9 rounded-full bg-accent-soft text-accent flex items-center justify-center font-semibold text-sm border border-accent/20 hidden md:flex">
            U
          </div>
        </div>
      </div>
    </header>
  );
}