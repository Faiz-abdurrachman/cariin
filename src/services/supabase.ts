// Inisialisasi Supabase client untuk React Native.
// Konfigurasi diambil dari env (EXPO_PUBLIC_SUPABASE_*).
//
// Catatan RN:
// 1. `react-native-url-polyfill/auto` WAJIB di-import sebelum createClient,
//    karena Supabase pakai URL/Headers yang tidak ada di Hermes/JSC default.
// 2. Session (JWT) disimpan via SecureStore (expo-secure-store) — token
//    ter-enkripsi di Keychain (iOS) / Keystore (Android), bukan plaintext.
// 3. `detectSessionInUrl: false` karena di mobile tidak ada URL callback ala web.

import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// SecureStore membatasi ~2048 byte per value. Session Supabase (access_token +
// refresh_token + user) bisa melebihi itu, jadi value dipecah jadi beberapa
// chunk key `${key}.<i>` dengan penanda jumlah di `${key}.__count`.
const CHUNK_SIZE = 1800;

async function clearChunks(key: string): Promise<void> {
  const countRaw = await SecureStore.getItemAsync(`${key}.__count`);
  if (countRaw != null) {
    const count = parseInt(countRaw, 10);
    if (!Number.isNaN(count)) {
      for (let i = 0; i < count; i++) {
        await SecureStore.deleteItemAsync(`${key}.${i}`);
      }
    }
    await SecureStore.deleteItemAsync(`${key}.__count`);
  }
  await SecureStore.deleteItemAsync(key);
}

const SecureStoreAdapter = {
  async getItem(key: string): Promise<string | null> {
    const countRaw = await SecureStore.getItemAsync(`${key}.__count`);
    if (countRaw == null) {
      return SecureStore.getItemAsync(key);
    }
    const count = parseInt(countRaw, 10);
    if (Number.isNaN(count)) return null;
    let value = '';
    for (let i = 0; i < count; i++) {
      const part = await SecureStore.getItemAsync(`${key}.${i}`);
      if (part == null) return null;
      value += part;
    }
    return value;
  },

  async setItem(key: string, value: string): Promise<void> {
    await clearChunks(key);
    if (value.length <= CHUNK_SIZE) {
      await SecureStore.setItemAsync(key, value);
      return;
    }
    const count = Math.ceil(value.length / CHUNK_SIZE);
    await SecureStore.setItemAsync(`${key}.__count`, String(count));
    for (let i = 0; i < count; i++) {
      await SecureStore.setItemAsync(`${key}.${i}`, value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE));
    }
  },

  async removeItem(key: string): Promise<void> {
    await clearChunks(key);
  },
};

// SecureStore tidak tersedia di web — pakai AsyncStorage sebagai fallback agar
// web preview (expo start --web) tetap bisa menyimpan session.
const authStorage = Platform.OS === 'web' ? AsyncStorage : SecureStoreAdapter;

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  // Lempar warning saat import — biar ketahuan cepat kalau .env belum di-set.
   
  console.warn(
    '[supabase] EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY belum di-set di .env',
  );
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: authStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
