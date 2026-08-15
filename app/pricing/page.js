'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
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
      setLoading(false);
    };
    getUser();
  }, []);

  const handleCheckout = async (plan, priceId) => {
    setProcessing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          origin: window.location.origin,
          userId: user.id,
          plan,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error al crear la sesión de pago');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  const plans = [
    {
      name: 'Gratis',
      price: '0€',
      period: '/mes',
      description: 'Perfecto para empezar',
      features: [
        '1 imagen por semana',
        'Borrado de metadatos',
        'Descripciones IA básicas',
        'Soporte por email',
      ],
      buttonText: 'Plan actual',
      buttonStyle: 'bg-gray-200 text-gray-500 cursor-not-allowed',
      priceId: null,
      planName: 'free',
    },
    {
      name: 'Pro',
      price: '4,99€',
      period: '/mes',
      description: 'Para vendedores frecuentes',
      features: [
        '50 imágenes por mes',
        'Borrado de metadatos ilimitado',
        'Descripciones IA avanzadas',
        'Soporte prioritario',
        'Exportación en lote',
      ],
      buttonText: 'Suscribirse',
      buttonStyle: 'bg-purple-600 text-white hover:bg-purple-700',
      priceId: 'price_1Txqng3D5YoB9GApQPsHeoP8', // ⚠️ CAMBIA ESTO por tu Price ID real de Stripe
      planName: 'pro',
      popular: true,
    },
    {
      name: 'Business',
      price: '14,99€',
      period: '/mes',
      description: 'Para profesionales y tiendas',
      features: [
        'Imágenes ilimitadas',
        'Todas las funciones Pro',
        'API access',
        'Soporte 24/7',
        'Multi-usuario',
      ],
      buttonText: 'Suscribirse',
      buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
      priceId: 'price_1Txqp53D5YoB9GApBnoiBvSi', // ⚠️ CAMBIA ESTO por tu Price ID real de Stripe
      planName: 'business',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Elige tu plan
          </h1>
          <p className="text-xl text-gray-600">
            Comienza gratis y escala cuando lo necesites
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                plan.popular ? 'ring-4 ring-purple-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Más popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h2>
                <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 ml-2">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => plan.priceId && handleCheckout(plan.planName, plan.priceId)}
                disabled={!plan.priceId || processing}
                className={`w-full py-3 rounded-lg font-bold transition ${plan.buttonStyle}`}
              >
                {processing ? 'Procesando...' : plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/dashboard" className="text-purple-600 hover:underline font-medium">
            ← Volver al Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
