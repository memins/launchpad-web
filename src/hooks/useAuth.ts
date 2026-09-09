import { useCallback, useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { AuthError, User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithApple: () => Promise<{ error: AuthError | null }>;
}

/**
 * Hook for authentication state and methods
 */
export function useAuth(): UseAuthReturn {
  const supabase = createBrowserClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check if user has admin role
      setIsAdmin(session?.user?.user_metadata?.role === 'admin');
      
      setIsLoading(false);
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAdmin(session?.user?.user_metadata?.role === 'admin');
        setIsLoading(false);
        
        // Refresh the page to update server-side session state
        if (_event === 'SIGNED_IN' || _event === 'SIGNED_OUT') {
          router.refresh();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    },
    [supabase.auth]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error };
    },
    [supabase.auth]
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, [supabase.auth]);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectTo=/onboarding`,
      },
    });
    return { error };
  }, [supabase.auth]);

  const signInWithApple = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectTo=/onboarding`,
      },
    });
    return { error };
  }, [supabase.auth]);

  return {
    user,
    session,
    isLoading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithApple,
  };
} 