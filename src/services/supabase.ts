// Inisialisasi Supabase client untuk React Native.
// Konfigurasi diambil dari env (EXPO_PUBLIC_SUPABASE_*).
//
// Catatan RN:
// 1. `react-native-url-polyfill/auto` WAJIB di-import sebelum createClient,
//    karena Supabase pakai URL/Headers yang tidak ada di Hermes/JSC default.
// 2. Storage pakai AsyncStorage agar session bertahan setelah app ditutup.
// 3. `detectSessionInUrl: false` karena di mobile tidak ada URL callback ala web.

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  // Lempar warning saat import — biar ketahuan cepat kalau .env belum di-set.
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY belum di-set di .env',
  );
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
