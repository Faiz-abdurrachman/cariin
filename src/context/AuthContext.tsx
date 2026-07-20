// AuthContext — single source of truth untuk status otentikasi user.
// Subscribe Supabase auth state + sinkronkan dengan tabel `profiles` untuk dapat role.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { Linking } from 'react-native';

import { supabase } from '@/services/supabase';
import * as authService from '@/services/auth.service';
import {
  getMyProfile,
  type UserProfileRecord,
} from '@/services/profile.service';
import { createUserModel, type User as UserModel } from '@/models';
import type { UserRole } from '@/utils/constants';
import { isValidCampusEmail } from '@/utils/validators';

export type UserProfile = UserProfileRecord;

interface AuthContextValue {
  user: User | null;
  userProfile: UserProfile | null;
  currentUser: UserModel | null;
  role: UserRole | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPasswordRecovery: boolean;
  loginWithEmail: typeof authService.loginWithEmail;
  register: typeof authService.register;
  logout: () => Promise<void>;
  resetPassword: typeof authService.resetPassword;
  completePasswordRecovery: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function inferRoleFromSession(currentSession: Session | null): UserRole | null {
  const metadataRole = currentSession?.user.app_metadata?.role;
  if (metadataRole === 'admin') return 'admin';

  const email = currentSession?.user.email?.trim().toLowerCase();
  if (!email) return null;
  return isValidCampusEmail(email) ? 'mahasiswa' : null;
}

async function fetchProfile(): Promise<UserProfile | null> {
  try {
    return await getMyProfile();
  } catch (error) {
    console.warn(
      '[AuthContext] gagal fetch profile:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    return null;
  }
}

function parseRecoveryTokens(url: string): {
  accessToken: string;
  refreshToken: string;
} | null {
  const parameterString = url.includes('#')
    ? url.slice(url.indexOf('#') + 1)
    : url.includes('?')
      ? url.slice(url.indexOf('?') + 1)
      : '';
  const params = new URLSearchParams(parameterString);
  if (params.get('type') !== 'recovery') return null;

  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [roleHint, setRoleHint] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadInitial() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(data.session);
        setRoleHint(inferRoleFromSession(data.session));
        if (data.session) {
          void fetchProfile()
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

    const handleRecoveryUrl = async (url: string | null) => {
      if (!url || !mounted) return;
      const tokens = parseRecoveryTokens(url);
      if (!tokens) return;

      setIsPasswordRecovery(true);
      const { error } = await supabase.auth.setSession({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      });
      if (error && mounted) {
        setIsPasswordRecovery(false);
        console.warn('[AuthContext] gagal membuka sesi recovery:', error.message);
      }
    };

    void Linking.getInitialURL().then(handleRecoveryUrl);
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      void handleRecoveryUrl(url);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      if (event === 'PASSWORD_RECOVERY') setIsPasswordRecovery(true);
      setSession(newSession);
      setRoleHint(inferRoleFromSession(newSession));
      if (newSession) {
        void fetchProfile()
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
      linkingSubscription.remove();
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
      const profile = await fetchProfile();
      setUserProfile(profile);
    }
  }, [session?.user.id]);

  const completePasswordRecovery = useCallback(() => {
    setIsPasswordRecovery(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      userProfile,
      currentUser: userProfile ? createUserModel(userProfile) : null,
      role: userProfile?.role ?? roleHint ?? null,
      session,
      isLoading,
      isAuthenticated: !!session,
      isPasswordRecovery,
      loginWithEmail: authService.loginWithEmail,
      register: authService.register,
      logout,
      resetPassword: authService.resetPassword,
      completePasswordRecovery,
      refreshProfile,
    }),
    [
      session,
      userProfile,
      roleHint,
      isLoading,
      isPasswordRecovery,
      refreshProfile,
      completePasswordRecovery,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return ctx;
}
