import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export async function POST(req) {
  try {
    // ✅ Inicializar DENTRO de la función para evitar que Next.js lo ejecute en el build
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY 
    );

    const { sessionId } = await req.json();
    
    if (!sessionId) {
      return Response.json({ error: 'Falta el sessionId' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (!userId || !plan) {
      return Response.json({ error: 'Faltan datos en la sesión de Stripe' }, { status: 400 });
    }

    const { error } = await supabase.from('subscriptions').upsert(
      { 
        user_id: userId, 
        plan: plan, 
        status: 'active', 
        stripe_subscription_id: session.subscription 
      },
      { onConflict: 'user_id' }
    );

    if (error) {
      console.error('❌ Error Supabase:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('❌ Error en confirm-subscription:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}