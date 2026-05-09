// Wrapper Supabase Auth — semua flow login/register lewat sini biar konsisten
// (validasi domain kampus, error message Indonesia, redirect URL terpusat).

import * as WebBrowser from 'expo-web-browser';
import type { Session, User } from '@supabase/supabase-js';

import { supabase } from './supabase';
import { EMAIL_DOMAIN_ERROR, isValidCampusEmail } from '@/utils/validators';

const OAUTH_REDIRECT = 'cariin://auth-callback';
const RESET_REDIRECT = 'cariin://reset-password';

export interface RegisterPayload {
  name: string;
  nim: string;
  email: string;
  password: string;
  faculty?: string;
}

export async function loginWithEmail(email: string, password: string): Promise<Session> {
  if (!isValidCampusEmail(email)) {
    throw new Error(EMAIL_DOMAIN_ERROR);
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw error;
  if (!data.session) throw new Error('Login gagal: session tidak diterima.');
  return data.session;
}

export async function loginWithGoogle(): Promise<void> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: OAUTH_REDIRECT, skipBrowserRedirect: true },
  });
  if (error) throw error;
  if (!data?.url) throw new Error('Gagal memulai Google OAuth: URL tidak diterima.');

  const result = await WebBrowser.openAuthSessionAsync(data.url, OAUTH_REDIRECT);
  if (result.type !== 'success' || !result.url) {
    throw new Error('Login Google dibatalkan.');
  }

  const url = new URL(result.url);
  const fragment = url.hash.startsWith('#') ? url.hash.slice(1) : url.hash;
  const search = url.search.startsWith('?') ? url.search.slice(1) : url.search;
  const params = new URLSearchParams(fragment || search);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  if (!accessToken || !refreshToken) {
    throw new Error('Token Google tidak diterima dari redirect.');
  }

  const { error: setErr } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (setErr) throw setErr;
}

export async function register(payload: RegisterPayload): Promise<User> {
  if (!isValidCampusEmail(payload.email)) {
    throw new Error(EMAIL_DOMAIN_ERROR);
  }

  const { data, error } = await supabase.auth.signUp({
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    options: {
      data: { name: payload.name, nim: payload.nim, faculty: payload.faculty },
    },
  });
  if (error) throw error;
  if (!data.user) throw new Error('Registrasi gagal: user tidak dibuat.');

  // Idempotent: aman walau ada trigger DB yang sudah bikin row profiles.
  const { error: profileErr } = await supabase.from('profiles').upsert({
    id: data.user.id,
    name: payload.name,
    nim: payload.nim,
    email: payload.email.trim().toLowerCase(),
    faculty: payload.faculty,
    role: 'mahasiswa',
  });
  if (profileErr) throw profileErr;

  return data.user;
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string): Promise<void> {
  if (!isValidCampusEmail(email)) {
    throw new Error(EMAIL_DOMAIN_ERROR);
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: RESET_REDIRECT,
  });
  if (error) throw error;
}
