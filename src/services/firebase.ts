// Inisialisasi Firebase App + Auth (dengan AsyncStorage persistence) + Firestore + Storage.
// Konfigurasi diambil dari env (EXPO_PUBLIC_FIREBASE_*).
//
// Catatan RN: `getReactNativePersistence` di-bundle lewat kondisi resolver `react-native`
// pada package `@firebase/auth`, sehingga tidak terdeklarasi di tipe `firebase/auth`.
// Di runtime, Metro akan memilih bundle React Native yang benar.

import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import {
  initializeAuth,
  // @ts-ignore — getReactNativePersistence ada di bundle RN namun absen di .d.ts publik
  getReactNativePersistence,
  type Auth,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Hindari init ganda saat hot reload.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!;

// Auth dengan persistence AsyncStorage agar sesi user bertahan setelah app ditutup.
export const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

export default app;
