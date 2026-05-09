// Loading state global — ditampilkan saat AuthContext masih restore session
// dari AsyncStorage (sebelum onAuthStateChange fire pertama kali).

import { ActivityIndicator, View } from 'react-native';

import { COLORS } from '@/utils/constants';

export default function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-zinc-100">
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}
