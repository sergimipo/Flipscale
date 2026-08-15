'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Verificar si viene de Stripe con éxito
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

      // Cargar la suscripción desde Supabase
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setSubscription(sub);
      setLoading(false);
    };

    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Cargando dashboard...</p>
      </div>
    );
  }

  const hasSubscription = subscription && subscription.status === 'active';

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
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
