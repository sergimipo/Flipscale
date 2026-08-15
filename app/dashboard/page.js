'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const fmt = (n) => n.toFixed(2) + ' €';

const CATEGORIES = {
  ingreso: ['vinted', 'wallapop', 'etsy', 'otra'],
  gasto: ['producto', 'impuestos', 'embalaje'],
};

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [transactions, setTransactions] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('ingreso');
  const [formCategory, setFormCategory] = useState('vinted');
  const [formAmount, setFormAmount] = useState('');
  const [formNote, setFormNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const router = useRouter();
  const supabase = createClient();

  const loadTransactions = async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    setTransactions(data || []);
  };

  useEffect(() => {
    let channel;

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('success') === 'true') {
        const sessionId = urlParams.get('session_id');
        if (sessionId) {
          await fetch('/api/confirm-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId }),
          });
          setSuccessMessage('✅ ¡Pago completado! Tu suscripción está activa.');
          window.history.replaceState({}, document.title, '/dashboard');
        }
      }

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setSubscription(sub);
      setLoading(false);

      channel = supabase
        .channel('cambios-transacciones-' + user.id)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions',
            filter: `user_id=eq.${user.id}`,
          },
          () => loadTransactions()
        )
        .subscribe();
    };

    getUser();
    loadTransactions();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(String(formAmount).replace(',', '.'));
    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError('Escribe un importe válido, por ejemplo 4,99');
      return;
    }
    setSaving(true);
    setFormError('');
    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      type: formType,
      category: formCategory,
      amount,
      note: formNote.trim() || null,
    });
    setSaving(false);
    if (error) {
      setFormError(error.message);
      return;
    }
    setFormAmount('');
    setFormNote('');
    setShowForm(false);
    loadTransactions();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Cargando dashboard...</p>
      </div>
    );
  }

  const hasSubscription = subscription && subscription.status === 'active';

  const sum = (list) => list.reduce((s, t) => s + Number(t.amount), 0);
  const ing = transactions.filter((t) => t.type === 'ingreso');
  const gas = transactions.filter((t) => t.type === 'gasto');
  const ingresos = sum(ing);
  const gastos = sum(gas);
  const beneficio = ingresos - gastos;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Mi Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm font-medium"
          >
            Cerrar sesión
          </button>
        </div>

        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <p className="text-green-800 font-bold">{successMessage}</p>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-2">Bienvenido, {user?.email}</h2>
          <p className="text-gray-600">
            Plan actual: {hasSubscription ? (
              <span className="text-green-600 font-bold">{subscription.plan.toUpperCase()} (Activo)</span>
            ) : (
              <span className="text-gray-500">Gratuito</span>
            )}
          </p>
          {!hasSubscription && (
            <button
              onClick={() => router.push('/pricing')}
              className="mt-4 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 text-sm font-medium"
            >
              Mejorar plan →
            </button>
          )}
        </div>

        {/* 💶 FINANZAS EN VIVO */}
        <div className="bg-white p-6 rounded-lg shadow mb-8 border-l-4 border-green-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">💶 Finanzas</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                En vivo
              </span>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 text-sm font-medium"
              >
                {showForm ? 'Cerrar' : '＋ Añadir'}
              </button>
            </div>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 rounded-lg bg-gray-50 p-4 grid gap-3 md:grid-cols-5">
              <div>
                <label className="text-xs font-medium text-gray-600">Tipo</label>
                <select
                  value={formType}
                  onChange={(e) => {
                    setFormType(e.target.value);
                    setFormCategory(CATEGORIES[e.target.value][0]);
                  }}
                  className="mt-1 w-full rounded border border-gray-300 p-2 text-sm bg-white"
                >
                  <option value="ingreso">💰 Ingreso</option>
                  <option value="gasto">💸 Gasto</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Categoría</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 p-2 text-sm bg-white capitalize"
                >
                  {CATEGORIES[formType].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Importe (€)</label>
                <input
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="4,99"
                  className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Nota</label>
                <input
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="opcional"
                  className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium disabled:opacity-50"
                >
                  {saving ? 'Guardando…' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
              {formError && (
                <p className="text-red-600 text-xs md:col-span-5">{formError}</p>
              )}
            </form>
          )}

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-xs text-green-700 font-medium">Ingresos</p>
              <p className="text-xl font-bold text-green-700">{fmt(ingresos)}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-xs text-red-700 font-medium">Gastos</p>
              <p className="text-xl font-bold text-red-700">{fmt(gastos)}</p>
            </div>
            <div className={`p-4 rounded-lg ${beneficio >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
              <p className={`text-xs font-medium ${beneficio >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>Beneficio</p>
              <p className={`text-xl font-bold ${beneficio >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>{fmt(beneficio)}</p>
            </div>
          </div>

          {transactions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="pb-2 font-medium">Tipo</th>
                    <th className="pb-2 font-medium">Categoría</th>
                    <th className="pb-2 font-medium">Nota</th>
                    <th className="pb-2 font-medium">Fecha</th>
                    <th className="pb-2 text-right font-medium">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 10).map((t) => (
                    <tr key={t.id} className="border-b border-gray-100">
                      <td className="py-2">{t.type === 'ingreso' ? '💰' : '💸'}</td>
                      <td className="py-2 capitalize">{t.category}</td>
                      <td className="py-2 text-gray-500">{t.note || '—'}</td>
                      <td className="py-2 text-gray-500">
                        {new Date(t.created_at).toLocaleDateString('es-ES')}
                      </td>
                      <td className={`py-2 text-right font-semibold ${t.type === 'ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === 'ingreso' ? '+' : '-'}{fmt(Number(t.amount))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {transactions.length === 0 && (
            <p className="text-center text-gray-400 py-6">
              Aún no hay movimientos. Añade uno con "＋ Añadir" o desde el atajo de tu iPhone. 📱
            </p>
          )}
        </div>

        {/* 🛠️ HERRAMIENTAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500 hover:shadow-lg transition">
            <h3 className="text-lg font-bold mb-2">🗑️ Borrado de Metadatos</h3>
            <p className="text-gray-500 text-sm mb-4">Limpia la información oculta de tus fotos para vender con privacidad.</p>
            <button
              onClick={() => router.push('/tools')}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm font-medium"
            >
              Usar ahora →
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500 hover:shadow-lg transition">
            <h3 className="text-lg font-bold mb-2">✨ Optimizador Descripciones IA</h3>
            <p className="text-gray-500 text-sm mb-4">Crea descripciones perfectas y multilingües a partir de una foto.</p>
            <button
              onClick={() => router.push('/tools/description')}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-sm font-medium"
            >
              Usar ahora →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}