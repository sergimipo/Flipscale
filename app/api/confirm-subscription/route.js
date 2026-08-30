import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export async function POST(req) {
  try {
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
    
    // Verificamos que el pago único se haya completado
    if (session.payment_status !== 'paid') {
       return Response.json({ error: 'El pago no se ha completado' }, { status: 400 });
    }

    const userId = session.metadata?.userId;

    if (!userId) {
      return Response.json({ error: 'Faltan datos en la sesión de Stripe' }, { status: 400 });
    }

    // Guardamos como pago único de por vida (status: 'active', plan: 'lifetime')
    const { error } = await supabase.from('subscriptions').upsert(
      {
        user_id: userId,
        plan: 'lifetime', 
        status: 'active',
        stripe_session_id: session.id,
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