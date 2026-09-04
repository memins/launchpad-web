import { createBrowserClient as createSSRBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

const getSupabaseUrl = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }
  return supabaseUrl;
};

const getSupabaseAnonKey = () => {
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return supabaseAnonKey;
};

/**
 * Browser / client-component Supabase client (cookie-backed via @supabase/ssr).
 */
export const createBrowserClient = () => {
  return createSSRBrowserClient<Database>(getSupabaseUrl(), getSupabaseAnonKey());
};

/**
 * Service-role client for trusted server code only. Do not import this from Client Components.
 */
export const createAdminClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    throw new Error(
      'Supabase admin client requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL'
    );
  }

  return createClient<Database>(getSupabaseUrl(), supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
