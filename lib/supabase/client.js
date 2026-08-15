import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Validar que las variables existan
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Faltan las variables de entorno de Supabase. ' +
      'Verifica que NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY estén configuradas.'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}