import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const cookieStore = await cookies(); // ✅ Añadido 'await' (recomendado en Next.js 13.5+)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,       // ✅ Usa variable de entorno
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,  // ✅ Usa variable de entorno (¡NUNCA la clave real aquí!)
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name, options) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // ¡Éxito! Redirigir al dashboard
      return NextResponse.redirect(`${origin}/dashboard`);
    } else {
      console.error('Error en exchangeCodeForSession:', error);
    }
  }

  // Si falla o no hay código, volver al login
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}