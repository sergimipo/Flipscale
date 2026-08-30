import Stripe from 'stripe';

export async function POST(req) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { origin, userId } = await req.json();

    // ⚠️ Lee el Price ID de 5€ desde las variables de entorno de Vercel
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      return Response.json({ error: 'Falta configurar STRIPE_PRICE_ID en Vercel' }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment', // 👈 PAGO ÚNICO (no subscription)
      metadata: { userId },
      success_url: `${origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("❌ ERROR DE STRIPE:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}