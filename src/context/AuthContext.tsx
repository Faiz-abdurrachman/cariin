// AuthContext — single source of truth untuk status otentikasi user.
// Subscribe Supabase auth state + sinkronkan dengan tabel `profiles` untuk dapat role.

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '@/services/supabase';
import * as authService from '@/services/auth.service';
import type { UserRole } from '@/utils/constants';

export interface UserProfile {
  id: string;
  name: string;
  nim: string | null;
  email: string;
  role: UserRole;
  faculty: string | null;
  department: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  expo_push_token: string | null;
}

interface AuthContextValue {
  user: User | null;
  userProfile: UserProfile | null;
  role: UserRole | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithEmail: typeof authService.loginWithEmail;
  loginWithGoogle: typeof authService.loginWithGoogle;
  register: typeof authService.register;
  logout: () => Promise<void>;
  resetPassword: typeof authService.resetPassword;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) {
    // Bukan fatal — bisa terjadi kalau row profiles belum di-insert (misal Google
    // login pertama kali) atau RLS belum dikonfigurasi. Caller boleh decide UX.
     
    console.warn('[AuthContext] gagal fetch profile:', error.message);
    return null;
  }
  return data as UserProfile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadInitial() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      if (data.session) {
        const profile = await fetchProfile(data.session.user.id);
        if (!mounted) return;
        setUserProfile(profile);
      }
      setIsLoading(false);
    }

    void loadInitial();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (newSession) {
        const profile = await fetchProfile(newSession.user.id);
        if (!mounted) return;
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await authService.logout();
    setSession(null);
    setUserProfile(null);
  };

  const refreshProfile = async () => {
    if (session?.user.id) {
      const profile = await fetchProfile(session.user.id);
      setUserProfile(profile);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      userProfile,
      role: userProfile?.role ?? null,
      session,
      isLoading,
      isAuthenticated: !!session,
      loginWithEmail: authService.loginWithEmail,
      loginWithGoogle: authService.loginWithGoogle,
      register: authService.register,
      logout,
      resetPassword: authService.resetPassword,
      refreshProfile,
    }),
    [session, userProfile, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return ctx;
}
