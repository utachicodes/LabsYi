'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase, isDemoMode, signOut as supabaseSignOut } from '@/lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

interface UseAuthOptions {
  /** Where to redirect if not authenticated. Pass false to skip redirect. */
  redirectTo?: string | false;
}

/**
 * Checks Supabase auth session.
 * In demo mode (no Supabase env vars), always returns a mock user.
 */
export function useAuth({ redirectTo = '/auth/login' }: UseAuthOptions = {}) {
  const router   = useRouter();
  const pathname = usePathname();

  // In demo mode, initialise state synchronously to avoid setState-in-effect
  const [user, setUser]       = useState<AuthUser | null>(
    isDemoMode ? { id: 'demo', email: 'demo@labsyi.io', name: 'Demo User' } : null
  );
  // loading is false immediately when there's nothing async to wait for
  const [loading, setLoading] = useState(!isDemoMode && supabase !== null);

  /** Redirect to login with ?next= so user returns here after sign-in */
  const redirectToLogin = useCallback(() => {
    if (!redirectTo) return;
    const next = pathname ? `?next=${encodeURIComponent(pathname)}` : '';
    router.push(`${redirectTo}${next}`);
  }, [router, redirectTo, pathname]);

  useEffect(() => {
    if (isDemoMode) return;   // state already set via lazy init above

    if (!supabase) { return; }  // loading already false via lazy init

    // Get existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id:    session.user.id,
          email: session.user.email ?? '',
          name:  session.user.user_metadata?.name,
        });
      } else {
        setUser(null);
        redirectToLogin();
      }
      setLoading(false);
    });

    // Listen for auth changes (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id:    session.user.id,
          email: session.user.email ?? '',
          name:  session.user.user_metadata?.name,
        });
      } else {
        setUser(null);
        redirectToLogin();
      }
    });

    return () => subscription.unsubscribe();
  }, [redirectToLogin]);

  const logout = useCallback(async () => {
    await supabaseSignOut();
    router.push('/auth/login');
  }, [router]);

  return { user, loading, logout };
}
