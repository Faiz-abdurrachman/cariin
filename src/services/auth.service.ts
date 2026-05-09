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
  department?: string;
}

export async function loginWithEmail(email: string, password: string): Promise<Session> {
  // Domain kampus DIVALIDASI di register, BUKAN di login — admin login pakai
  // email non-domain (admin@cariin.app). Supabase akan reject email/password
  // yang tidak match dgn pesan error sendiri.
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
      data: {
        name: payload.name,
        nim: payload.nim,
        faculty: payload.faculty,
        department: payload.department,
      },
    },
  });
  if (error) throw error;
  if (!data.user) throw new Error('Registrasi gagal: user tidak dibuat.');

  // Trigger DB `trg_on_auth_user_created` sudah bikin row profiles dengan
  // (id, email, name, role) saat insert ke auth.users. Kita UPDATE row itu
  // untuk mengisi nim/faculty/department. Kalau session null (email
  // confirmation ON) maka skip — data tetap ada di raw_user_meta_data dan
  // bisa di-sinkron nanti saat user benar-benar login pertama kali.
  if (data.session) {
    const { error: profileErr } = await supabase
      .from('profiles')
      .update({
        name: payload.name,
        nim: payload.nim,
        faculty: payload.faculty,
        department: payload.department,
      })
      .eq('id', data.user.id);
    if (profileErr) {
      // PostgrestError bukan Error instance — bungkus jadi Error agar
      // pesannya kebaca di catch block UI.
      throw new Error(profileErr.message);
    }
  }

  return data.user;
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: RESET_REDIRECT,
  });
  if (error) throw error;
}
