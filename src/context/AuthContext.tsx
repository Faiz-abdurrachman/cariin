// AuthContext — single source of truth untuk status otentikasi user.
// Subscribe Supabase auth state + sinkronkan dengan tabel `profiles` untuk dapat role.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '@/services/supabase';
import * as authService from '@/services/auth.service';
import { createUserModel, type User as UserModel } from '@/models';
import type { UserRole } from '@/utils/constants';
import { isValidCampusEmail } from '@/utils/validators';

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
  currentUser: UserModel | null;
  role: UserRole | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithEmail: typeof authService.loginWithEmail;
  register: typeof authService.register;
  logout: () => Promise<void>;
  resetPassword: typeof authService.resetPassword;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function inferRoleFromSession(currentSession: Session | null): UserRole | null {
  const email = currentSession?.user.email?.trim().toLowerCase();
  if (!email) return null;
  return isValidCampusEmail(email) ? 'mahasiswa' : 'admin';
}

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
  const [roleHint, setRoleHint] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadInitial() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(data.session);
        setRoleHint(inferRoleFromSession(data.session));
        if (data.session) {
          void fetchProfile(data.session.user.id)
            .then((profile) => {
              if (!mounted) return;
              setUserProfile(profile);
            })
            .catch(() => {
              // Profile loading is non-blocking; fallback role stays active.
            });
        }
      } catch {
        // Network error atau Supabase unreachable — user tetap bisa
        // lanjut ke AuthNavigator, nanti login balik.
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    void loadInitial();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setRoleHint(inferRoleFromSession(newSession));
      if (newSession) {
        void fetchProfile(newSession.user.id)
          .then((profile) => {
            if (!mounted) return;
            setUserProfile(profile);
          })
          .catch(() => {
            // Keep the fallback role; profile can retry on next refresh.
          });
      } else {
        setUserProfile(null);
        setRoleHint(null);
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

  const refreshProfile = useCallback(async () => {
    if (session?.user.id) {
      const profile = await fetchProfile(session.user.id);
      setUserProfile(profile);
    }
  }, [session?.user.id]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      userProfile,
      currentUser: userProfile ? createUserModel(userProfile) : null,
      role: userProfile?.role ?? roleHint ?? null,
      session,
      isLoading,
      isAuthenticated: !!session,
      loginWithEmail: authService.loginWithEmail,
      register: authService.register,
      logout,
      resetPassword: authService.resetPassword,
      refreshProfile,
    }),
    [session, userProfile, roleHint, isLoading, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return ctx;
}
