import { createClient } from '@supabase/supabase-js';

function monthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
  return { start, end };
}

export async function GET(req) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const tool = searchParams.get('tool') || 'all';

    if (!userId) {
      return Response.json({ error: 'Falta userId' }, { status: 400 });
    }

    // ✅ Comprobar licencia Pro en la tabla subscriptions (donde se guarda el pago)
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .maybeSingle();

    if (sub && sub.status === 'active') {
      return Response.json({
        allowed: true,
        remaining: 999999,
        count: 0,
        limit: 999999,
        plan: 'pro',
      });
    }

    const { start, end } = monthRange();

    let query = supabase
      .from('usage_logs')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', start)
      .lt('created_at', end);

    if (tool !== 'all') {
      query = query.eq('action', tool);
    }

    const { data: usageData, error } = await query;

    if (error) {
      console.error('Error consultando usage_logs:', error);
      return Response.json({ allowed: true, remaining: 5, count: 0, limit: 5, plan: 'free' });
    }

    const count = usageData ? usageData.length : 0;
    const FREE_LIMIT = 5;
    const remaining = Math.max(0, FREE_LIMIT - count);

    return Response.json({
      allowed: remaining > 0,
      remaining,
      count,
      limit: FREE_LIMIT,
      plan: 'free',
    });
  } catch (err) {
    console.error('Error en usage GET:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { userId, action } = await req.json();

    if (!userId) {
      return Response.json({ error: 'Falta userId' }, { status: 400 });
    }

    const { error } = await supabase
      .from('usage_logs')
      .insert([{ user_id: userId, action: action || 'tool_use' }]);

    if (error) {
      console.error('Error registrando uso:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Error en usage POST:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}