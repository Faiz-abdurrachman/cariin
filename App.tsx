// Entry utama aplikasi Cari.In.
// FASE 1: hanya menampilkan splash sederhana untuk memverifikasi setup
// (Expo + NativeWind v4 + TypeScript) berjalan. Root navigator akan dipasang di FASE 2.

import './global.css';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-4xl font-bold text-white">Cari.In</Text>
        <Text className="mt-3 text-base text-zinc-400">Cariin barangmu di kampus.</Text>
        <View className="mt-12 rounded-2xl bg-emerald-500/10 px-4 py-3">
          <Text className="text-sm text-emerald-300">Setup FASE 1 berhasil ✓</Text>
        </View>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
