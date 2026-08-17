'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

function Logo({ className = 'h-9 w-9' }) {
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

const PLATFORMS = {
  vinted: { color: '#09B1BA', letter: 'V', label: 'Vinted' },
  wallapop: { color: '#10B981', letter: 'W', label: 'Wallapop' },
  etsy: { color: '#F1641E', letter: 'E', label: 'Etsy' },
  otra: { color: '#64748b', letter: 'O', label: 'Otra' },
  producto: { color: '#3b82f6', letter: 'P', label: 'Producto' },
  impuestos: { color: '#8b5cf6', letter: 'I', label: 'Impuestos' },
  embalaje: { color: '#ec4899', letter: 'B', label: 'Embalaje' },
};

const fmt = (n) => n.toFixed(2) + ' €';
const fmtShort = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + 'k €' : n.toFixed(0) + ' €');

function PlatformIcon({ name, size = 22 }) {
  const p = PLATFORMS[name] || PLATFORMS.otra;
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ width: size, height: size, backgroundColor: p.color, fontSize: size * 0.5 }}
      title={p.label}
    >
      {p.letter}
    </span>
  );
}

function ArrowIcon({ up, className = 'h-3 w-3' }) {
  return up ? (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 3l6 6h-4v8H8V9H4l6-6z" />
    </svg>
  ) : (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 17l-6-6h4V3h4v8h4l-6 6z" />
    </svg>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('ingreso');
  const [formCategory, setFormCategory] = useState('vinted');
  const [formAmount, setFormAmount] = useState('');
  const [formNote, setFormNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const CATEGORIES = {
    ingreso: ['vinted', 'wallapop', 'etsy', 'otra'],
    gasto: ['producto', 'impuestos', 'embalaje'],
  };

  useEffect(() => {
    const saved = localStorage.getItem('fs-theme');
    if (saved === 'light') setTheme('light');
  }, []);

  const dark = theme === 'dark';

  const setThemeAndSave = (t) => {
    setTheme(t);
    localStorage.setItem('fs-theme', t);
  };

  const c = {
    page: dark ? 'bg-ink-950 text-white' : 'bg-paper text-ink-950',
    header: dark ? 'border-white/10 bg-ink-950/80' : 'border-slate-200 bg-white/80',
    sidebar: dark ? 'border-white/10 bg-ink-900' : 'border-slate-200 bg-white',
    card: dark ? 'border-white/10 bg-ink-900' : 'border-slate-200 bg-white',
    sub: dark ? 'text-slate-400' : 'text-slate-600',
    faint: dark ? 'text-slate-500' : 'text-slate-400',
    input: dark ? 'border-white/10 bg-ink-800 text-white placeholder:text-slate-500' : 'border-slate-200 bg-white text-ink-950 placeholder:text-slate-400',
    row: dark ? 'border-white/10' : 'border-slate-200',
    rowSoft: dark ? 'border-white/5' : 'border-slate-100',
    navIdle: dark ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-ink-950',
    navActive: dark ? 'bg-brand-500/10 text-brand-400' : 'bg-brand-500/10 text-brand-700',
  };

  const loadTransactions = async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    setTransactions(data || []);
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setLoading(false);
    };

    getUser();
    loadTransactions();

    const channel = supabase
      .channel('cambios-transacciones')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () =>
        loadTransactions()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(String(formAmount).replace(',', '.'));
    if (!Number.isFinite(amount) || amount <= 0) return;
    setSaving(true);
    await supabase.from('transactions').insert({
      user_id: user.id,
      type: formType,
      category: formCategory,
      amount,
      note: formNote.trim() || null,
    });
    setSaving(false);
    setFormAmount('');
    setFormNote('');
    setShowForm(false);
    loadTransactions();
  };

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    if (period === 'day') cutoff.setDate(now.getDate() - 1);
    else if (period === 'week') cutoff.setDate(now.getDate() - 7);
    else if (period === 'month') cutoff.setMonth(now.getMonth() - 1);
    else cutoff.setFullYear(now.getFullYear() - 1);
    return transactions.filter((t) => new Date(t.created_at) >= cutoff);
  }, [transactions, period]);

  const chartData = useMemo(() => {
    const grouped = {};
    const platforms = new Set();

    filteredTransactions.forEach((t) => {
      const date = new Date(t.created_at);
      let key;
      if (period === 'day') key = date.toISOString().split('T')[0];
      else if (period === 'week') {
        const ws = new Date(date);
        ws.setDate(date.getDate() - date.getDay());
        key = ws.toISOString().split('T')[0];
      } else if (period === 'month') key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      else key = String(date.getFullYear());

      if (!grouped[key]) grouped[key] = { date: key };
      const cat = String(t.category).toLowerCase();
      platforms.add(cat);
      grouped[key][cat] = (grouped[key][cat] || 0) + Number(t.amount) * (t.type === 'ingreso' ? 1 : -1);
    });

    return {
      data: Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date)),
      platforms: Array.from(platforms),
    };
  }, [filteredTransactions, period]);

  const platformBreakdown = useMemo(() => {
    const map = {};
    filteredTransactions.forEach((t) => {
      const cat = String(t.category).toLowerCase();
      if (!map[cat]) map[cat] = { ingresos: 0, gastos: 0, count: 0 };
      if (t.type === 'ingreso') map[cat].ingresos += Number(t.amount);
      else map[cat].gastos += Number(t.amount);
      map[cat].count++;
    });
    return Object.entries(map)
      .map(([name, d]) => ({ name, ...d, beneficio: d.ingresos - d.gastos, color: (PLATFORMS[name] || PLATFORMS.otra).color }))
      .sort((a, b) => b.beneficio - a.beneficio);
  }, [filteredTransactions]);

  const kpis = useMemo(() => {
    const sum = (list) => list.reduce((s, t) => s + Number(t.amount), 0);
    const ing = filteredTransactions.filter((t) => t.type === 'ingreso');
    const gas = filteredTransactions.filter((t) => t.type === 'gasto');
    const ingresos = sum(ing);
    const gastos = sum(gas);
    const beneficio = ingresos - gastos;
    return {
      ingresos,
      gastos,
      beneficio,
      margen: ingresos > 0 ? (beneficio / ingresos) * 100 : 0,
      ticketMedio: ing.length > 0 ? ingresos / ing.length : 0,
      transacciones: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <Logo className="h-12 w-12 animate-pulse" />
      </div>
    );
  }

  const axisColor = dark ? '#64748b' : '#94a3b8';
  const gridColor = dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';

  const toolItems = [
    {
      label: 'Borrado de metadatos',
      href: '/tools',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      label: 'Descripciones IA',
      href: '/tools/description',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`min-h-screen ${c.page}`}>
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r md:flex ${c.sidebar}`}>
        <div className="flex h-16 items-center gap-3 px-6">
          <Logo className="h-8 w-8" />
          <span className="font-display text-base font-semibold tracking-wide">
            FLIP<span className="text-accent-500">SCALE</span>
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${c.navActive}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 7h7v7" />
            </svg>
            Dashboard
          </Link>

          {/* HERRAMIENTAS: DESPLEGABLE */}
          <button
            onClick={() => setToolsOpen(!toolsOpen)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${c.navIdle}`}
          >
            <span className="flex items-center gap-3">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-2.572-1.065c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Herramientas
            </span>
            <svg
              className={`h-4 w-4 transition-transform duration-300 ${toolsOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${toolsOpen ? 'max-h-40' : 'max-h-0'}`}>
            <div className={`ml-6 space-y-1 border-l pl-3 ${dark ? 'border-white/10' : 'border-slate-200'}`}>
              {toolItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${c.navIdle}`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <div className={`border-t px-6 py-4 ${c.row}`}>
          <p className={`text-xs ${c.faint}`}>© 2026 Flipscale</p>
        </div>
      </aside>

      {/* HEADER */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-xl md:pl-60 ${c.header}`}>
        <div className="flex h-16 items-center justify-between px-6">
          <div className="relative flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
              {(user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-tight">{user?.email}</p>
              <p className={`text-xs ${c.faint}`}>Plan gratuito</p>
            </div>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`ml-1 rounded-lg p-2 transition ${c.navIdle}`}
              aria-label="Ajustes"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-2.572-1.065c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {settingsOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSettingsOpen(false)} />
                <div className={`absolute left-0 top-12 z-20 w-64 rounded-xl border p-2 shadow-2xl ${c.card}`}>
                  <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${c.faint}`}>Ajustes</div>

                  <div className="flex items-center justify-between rounded-lg px-3 py-2.5">
                    <span className="text-sm font-medium">Modo oscuro</span>
                    <button
                      onClick={() => setThemeAndSave(dark ? 'light' : 'dark')}
                      className={`relative h-6 w-11 rounded-full transition ${dark ? 'bg-brand-500' : 'bg-slate-300'}`}
                      aria-label="Cambiar tema"
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                          dark ? 'left-[22px]' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <Link
                    href="/pricing"
                    onClick={() => setSettingsOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${c.navIdle}`}
                  >
                    Plan y suscripción
                  </Link>
                  <Link
                    href="/"
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${c.navIdle}`}
                  >
                    Ir a la web
                  </Link>
                  <div className={`my-1 h-px ${dark ? 'bg-white/10' : 'bg-slate-200'}`} />
                  <button
                    onClick={handleSignOut}
                    className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-500/10"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>

          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cerrar' : '+ Añadir'}
          </button>
        </div>

        {/* NAV MÓVIL */}
        <div className={`flex gap-1 overflow-x-auto border-t px-4 py-2 md:hidden ${c.row}`}>
          <Link
            href="/dashboard"
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${c.navActive}`}
          >
            Dashboard
          </Link>
          {toolItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium ${c.navIdle}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      {/* MAIN */}
      <main className="px-6 py-8 md:pl-60">
        {/* FORMULARIO */}
        {showForm && (
          <form onSubmit={handleSubmit} className={`mb-6 rounded-xl border p-6 ${c.card}`}>
            <div className="grid gap-4 md:grid-cols-5">
              <div>
                <label className={`mb-1.5 block text-xs font-medium ${c.sub}`}>Tipo</label>
                <select
                  value={formType}
                  onChange={(e) => {
                    setFormType(e.target.value);
                    setFormCategory(CATEGORIES[e.target.value][0]);
                  }}
                  className={`w-full rounded-lg border px-3 py-2 text-sm ${c.input}`}
                >
                  <option value="ingreso">Ingreso</option>
                  <option value="gasto">Gasto</option>
                </select>
              </div>
              <div>
                <label className={`mb-1.5 block text-xs font-medium ${c.sub}`}>Plataforma</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-sm capitalize ${c.input}`}
                >
                  {CATEGORIES[formType].map((cat) => (
                    <option key={cat} value={cat}>
                      {(PLATFORMS[cat] || PLATFORMS.otra).label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`mb-1.5 block text-xs font-medium ${c.sub}`}>Importe (€)</label>
                <input
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="4,99"
                  className={`w-full rounded-lg border px-3 py-2 text-sm ${c.input}`}
                />
              </div>
              <div>
                <label className={`mb-1.5 block text-xs font-medium ${c.sub}`}>Nota</label>
                <input
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="opcional"
                  className={`w-full rounded-lg border px-3 py-2 text-sm ${c.input}`}
                />
              </div>
              <div className="flex items-end">
                <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
                  {saving ? 'Guardando…' : 'Guardar'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* KPIs */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[
            { label: 'Ingresos', value: fmt(kpis.ingresos), color: 'text-brand-500' },
            { label: 'Gastos', value: fmt(kpis.gastos), color: 'text-red-500' },
            { label: 'Beneficio', value: fmt(kpis.beneficio), color: kpis.beneficio >= 0 ? 'text-brand-500' : 'text-red-500' },
            { label: 'Margen', value: kpis.margen.toFixed(1) + '%', color: '' },
            { label: 'Ticket medio', value: fmt(kpis.ticketMedio), color: '' },
            { label: 'Movimientos', value: String(kpis.transacciones), color: '' },
          ].map((k) => (
            <div key={k.label} className={`rounded-xl border p-5 ${c.card}`}>
              <p className={`text-xs font-medium ${c.sub}`}>{k.label}</p>
              <p className={`mt-1 font-display text-2xl font-bold ${k.color}`}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* PERIODO */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Análisis</h2>
          <div className={`flex gap-1 rounded-lg p-1 ${dark ? 'bg-ink-800' : 'bg-slate-100'}`}>
            {['day', 'week', 'month', 'year'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-md px-4 py-1.5 text-xs font-semibold transition ${
                  period === p
                    ? dark
                      ? 'bg-ink-950 text-white shadow'
                      : 'bg-white text-ink-950 shadow-sm'
                    : c.sub
                }`}
              >
                {p === 'day' ? 'Día' : p === 'week' ? 'Semana' : p === 'month' ? 'Mes' : 'Año'}
              </button>
            ))}
          </div>
        </div>

        {/* GRÁFICO PRINCIPAL */}
        <div className={`mb-8 rounded-xl border p-6 ${c.card}`}>
          <h3 className="mb-4 font-display text-lg font-semibold">Evolución por plataforma</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.data}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={axisColor} style={{ fontSize: '12px' }} />
                <YAxis stroke={axisColor} style={{ fontSize: '12px' }} tickFormatter={fmtShort} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: dark ? '#0f1a2e' : '#fff',
                    border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: dark ? '#fff' : '#0B1220',
                  }}
                  formatter={(value) => fmt(Number(value))}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                {chartData.platforms.map((platform) => (
                  <Line
                    key={platform}
                    type="monotone"
                    dataKey={platform}
                    name={(PLATFORMS[platform] || PLATFORMS.otra).label}
                    stroke={(PLATFORMS[platform] || PLATFORMS.otra).color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DESGLOSES */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className={`rounded-xl border p-6 ${c.card}`}>
            <h3 className="mb-4 font-display text-lg font-semibold">Rendimiento por plataforma</h3>
            <div className="space-y-5">
              {platformBreakdown.map((p) => (
                <div key={p.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <PlatformIcon name={p.name} />
                      <span className="font-medium capitalize">{p.name}</span>
                      <span className={`text-xs ${c.faint}`}>{p.count} mov.</span>
                    </div>
                    <span className={`font-semibold ${p.beneficio >= 0 ? 'text-brand-500' : 'text-red-500'}`}>
                      {fmt(p.beneficio)}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`w-14 ${c.sub}`}>Ingresos</span>
                      <div className={`h-1.5 flex-1 rounded-full ${dark ? 'bg-white/5' : 'bg-slate-100'}`}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${(p.ingresos / (p.ingresos + p.gastos || 1)) * 100}%`,
                            backgroundColor: p.color,
                          }}
                        />
                      </div>
                      <span className={`w-20 text-right ${c.sub}`}>{fmt(p.ingresos)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`w-14 ${c.sub}`}>Gastos</span>
                      <div className={`h-1.5 flex-1 rounded-full ${dark ? 'bg-white/5' : 'bg-slate-100'}`}>
                        <div
                          className="h-1.5 rounded-full bg-red-500"
                          style={{ width: `${(p.gastos / (p.ingresos + p.gastos || 1)) * 100}%` }}
                        />
                      </div>
                      <span className={`w-20 text-right ${c.sub}`}>{fmt(p.gastos)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {platformBreakdown.length === 0 && (
                <p className={`py-6 text-center text-sm ${c.faint}`}>Sin datos en este periodo</p>
              )}
            </div>
          </div>

          <div className={`rounded-xl border p-6 ${c.card}`}>
            <h3 className="mb-4 font-display text-lg font-semibold">Ingresos vs gastos</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformBreakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis type="number" stroke={axisColor} style={{ fontSize: '12px' }} tickFormatter={fmtShort} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke={axisColor}
                    style={{ fontSize: '12px' }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: dark ? '#0f1a2e' : '#fff',
                      border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: dark ? '#fff' : '#0B1220',
                    }}
                    formatter={(value) => fmt(Number(value))}
                  />
                  <Bar dataKey="ingresos" name="Ingresos" fill="#14B8A6" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="gastos" name="Gastos" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* TABLA */}
        <div className={`mt-8 rounded-xl border ${c.card}`}>
          <div className={`border-b px-6 py-4 ${c.row}`}>
            <h3 className="font-display text-lg font-semibold">Transacciones recientes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b text-left ${c.row} ${c.sub}`}>
                  <th className="px-6 py-3 font-medium">Tipo</th>
                  <th className="px-6 py-3 font-medium">Plataforma</th>
                  <th className="px-6 py-3 font-medium">Nota</th>
                  <th className="px-6 py-3 font-medium">Fecha</th>
                  <th className="px-6 py-3 text-right font-medium">Importe</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 20).map((t) => (
                  <tr key={t.id} className={`border-b last:border-0 ${c.rowSoft}`}>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          t.type === 'ingreso'
                            ? 'bg-brand-500/10 text-brand-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        <ArrowIcon up={t.type === 'ingreso'} />
                        {t.type === 'ingreso' ? 'Ingreso' : 'Gasto'}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="flex items-center gap-2">
                        <PlatformIcon name={String(t.category).toLowerCase()} size={20} />
                        <span className="capitalize">{t.category}</span>
                      </span>
                    </td>
                    <td className={`px-6 py-3 ${c.sub}`}>{t.note || '—'}</td>
                    <td className={`px-6 py-3 ${c.sub}`}>
                      {new Date(t.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td
                      className={`px-6 py-3 text-right font-semibold ${
                        t.type === 'ingreso' ? 'text-brand-500' : 'text-red-500'
                      }`}
                    >
                      {t.type === 'ingreso' ? '+' : '-'}
                      {fmt(Number(t.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}