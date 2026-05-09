// Splash awal aplikasi — auto-redirect ke RoleSelection setelah ~1.8 detik.
// Background gelap (zinc-950) sesuai prototype HTML.

import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';

import type { AuthStackParamList } from '@/navigation/types';

const REDIRECT_DELAY_MS = 1800;

type Nav = StackNavigationProp<AuthStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    const id = setTimeout(() => {
      navigation.replace('RoleSelection');
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(id);
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-zinc-950">
      <View className="items-center" style={{ rowGap: 16 }}>
        <View
          className="bg-white items-center justify-center"
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            transform: [{ rotate: '3deg' }],
            shadowColor: '#000',
            shadowOpacity: 0.4,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
            elevation: 8,
          }}
        >
          <Ionicons name="search" size={28} color="#18181B" style={{ transform: [{ rotate: '-3deg' }] }} />
        </View>
        <Text className="text-3xl font-bold text-white tracking-tight">Cari.In</Text>
        <Text className="text-sm font-medium text-zinc-400 tracking-wide">Kampus Lebih Aman</Text>
      </View>
    </View>
  );
}
