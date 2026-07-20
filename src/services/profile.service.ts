import type { UserRole } from '@/utils/constants';

import { supabase } from './supabase';

export interface UserProfileRecord {
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

export interface PublicProfile {
  name: string;
  nim: string | null;
  faculty: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface ProfilePatch {
  name?: string;
  nim?: string | null;
  faculty?: string | null;
  department?: string | null;
  avatar_url?: string | null;
  expo_push_token?: string | null;
}

export async function getMyProfile(): Promise<UserProfileRecord | null> {
  const { data, error } = await supabase.rpc('get_my_profile');
  if (error) {
    // Jalur transisi untuk environment yang belum menjalankan schema terbaru.
    // Setelah RPC tersedia, profil lengkap tidak lagi dibaca lewat SELECT tabel.
    if (error.code === 'PGRST202' || error.message.includes('get_my_profile')) {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw new Error(authError.message);
      if (!authData.user) return null;

      const { data: fallback, error: fallbackError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      if (fallbackError) throw new Error(fallbackError.message);
      return fallback ? (fallback as UserProfileRecord) : null;
    }
    throw new Error(error.message);
  }

  const profile = Array.isArray(data) ? data[0] : data;
  return profile ? (profile as UserProfileRecord) : null;
}

export async function getPublicProfile(userId: string): Promise<PublicProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('name, nim, faculty, avatar_url, created_at')
    .eq('id', userId)
    .single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Profil tidak ditemukan.');
  return data as PublicProfile;
}

export async function updateMyProfile(
  userId: string,
  patch: ProfilePatch,
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId);
  if (error) throw new Error(error.message);
}
