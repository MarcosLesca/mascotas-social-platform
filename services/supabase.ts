import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn(
    'Supabase: faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Crea un .env según .env.example.'
  );
}

export const supabase = createClient(url || '', anonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
