// Wrapper image picker + upload ke Supabase Storage.
//
// Strategi upload di RN: pakai opsi `base64: true` di expo-image-picker, decode
// string base64 → Uint8Array via `atob` (tersedia global di Hermes RN 0.74+),
// lalu upload sebagai bytes. Pendekatan ini lebih reliable dibanding fetch(uri)
// → blob() yg sering bermasalah di Android dgn local file URI.

import * as ImagePicker from 'expo-image-picker';

import { supabase } from './supabase';

const REPORT_PHOTOS_BUCKET = 'report-photos';
const AVATARS_BUCKET = 'avatars';

export interface PickImageResult {
  uri: string;
  base64: string;
  mimeType: string;
}

// ----- HELPERS -----

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function extFromMime(mimeType: string): string {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  return 'jpg';
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ----- PICKERS -----

export async function pickImageFromLibrary(): Promise<PickImageResult | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    throw new Error('Akses galeri ditolak. Aktifkan izin di pengaturan.');
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
    base64: true,
  });
  if (result.canceled) return null;
  const asset = result.assets[0];
  if (!asset?.base64) throw new Error('Gagal membaca data gambar.');
  return {
    uri: asset.uri,
    base64: asset.base64,
    mimeType: asset.mimeType ?? 'image/jpeg',
  };
}

export async function takePhoto(): Promise<PickImageResult | null> {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) {
    throw new Error('Akses kamera ditolak. Aktifkan izin di pengaturan.');
  }
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
    base64: true,
  });
  if (result.canceled) return null;
  const asset = result.assets[0];
  if (!asset?.base64) throw new Error('Gagal membaca data gambar.');
  return {
    uri: asset.uri,
    base64: asset.base64,
    mimeType: asset.mimeType ?? 'image/jpeg',
  };
}

// ----- UPLOADERS -----

export async function uploadReportPhoto(
  picked: PickImageResult,
  userId: string,
): Promise<string> {
  // Path harus prefix `<userId>/...` — Storage RLS policy kita enforce itu.
  const path = `${userId}/${Date.now()}-${randomSuffix()}.${extFromMime(picked.mimeType)}`;
  const bytes = base64ToUint8Array(picked.base64);
  const { error } = await supabase.storage
    .from(REPORT_PHOTOS_BUCKET)
    .upload(path, bytes, { contentType: picked.mimeType, upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(REPORT_PHOTOS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadAvatar(
  picked: PickImageResult,
  userId: string,
): Promise<string> {
  // Avatar 1-user-1-file: path tetap, di-upsert biar overwrite. Append `?t=...`
  // ke URL biar UI gak nampilin cached version setelah ganti foto.
  const path = `${userId}/avatar.${extFromMime(picked.mimeType)}`;
  const bytes = base64ToUint8Array(picked.base64);
  const { error } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(path, bytes, { contentType: picked.mimeType, upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}
