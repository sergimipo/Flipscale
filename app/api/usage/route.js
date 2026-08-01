import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const hasSubscription = searchParams.get('hasSubscription') === 'true';

    if (!userId) {
      return Response.json({ error: 'Falta userId' }, { status: 400 });
    }

    // Si tiene suscripción activa, permitir todo
    if (hasSubscription) {
      return Response.json({
        allowed: true,
        remaining: 999999,
        count: 0,
        plan: 'premium'
      });
    }

    // Usuario gratuito: verificar usos del mes actual
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const { data: usageData, error } = await supabase
      .from('usage_logs')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`)
      .lt('created_at', `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-01`);

    if (error) {
      console.error('Error consultando usage_logs:', error);
      // Si hay error, permitir por defecto (mejor que bloquear)
      return Response.json({
        allowed: true,
        remaining: 5,
        count: 0,
        plan: 'free'
      });
    }

    const count = usageData ? usageData.length : 0;
    const FREE_LIMIT = 5; // 5 usos gratuitos al mes
    const remaining = Math.max(0, FREE_LIMIT - count);

    return Response.json({
      allowed: remaining > 0,
      remaining: remaining,
      count: count,
      limit: FREE_LIMIT,
      plan: 'free'
    });

  } catch (err) {
    console.error('Error en usage GET:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return Response.json({ error: 'Falta userId' }, { status: 400 });
    }

    // Registrar el uso en la base de datos
    const { error } = await supabase
      .from('usage_logs')
      .insert([{ user_id: userId, action: 'remove_metadata' }]);

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