import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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
 * Server Component / Route Handler client. Cookie writes may no-op in RSC;
 * middleware refreshes the session on the next request.
 */
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Ignore — middleware will persist the session.
        }
      },
    },
  });
};
