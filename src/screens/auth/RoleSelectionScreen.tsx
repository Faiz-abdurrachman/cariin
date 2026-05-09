// Pilih peran: Mahasiswa atau Admin. Hasilnya menentukan variant LoginScreen.

import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AuthStackParamList } from '@/navigation/types';
import { COLORS } from '@/utils/constants';

type Nav = StackNavigationProp<AuthStackParamList, 'RoleSelection'>;

interface RoleCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}

function RoleCard({ icon, title, subtitle, onPress }: RoleCardProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${title}: ${subtitle}`}>
      {({ pressed }) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.surface,
            borderColor: pressed ? COLORS.primary : COLORS.border,
            borderWidth: 2,
            borderRadius: 24,
            padding: 20,
            shadowColor: '#000',
            shadowOpacity: 0.04,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 1,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: COLORS.background,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
            }}
          >
            <Ionicons name={icon} size={26} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{ fontSize: 17, fontWeight: '700', color: COLORS.primary, marginBottom: 2 }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                color: COLORS.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {subtitle}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </View>
      )}
    </Pressable>
  );
}

export default function RoleSelectionScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              backgroundColor: COLORS.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 8 },
              elevation: 6,
            }}
          >
            <Ionicons name="search" size={36} color="#FFFFFF" />
          </View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '700',
              color: COLORS.primary,
              letterSpacing: -0.5,
              marginBottom: 8,
            }}
          >
            Cari.In
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: COLORS.textMuted,
              textAlign: 'center',
              lineHeight: 20,
              maxWidth: 260,
            }}
          >
            Pilih peran Anda untuk melanjutkan ke dalam aplikasi.
          </Text>
        </View>

        <View style={{ rowGap: 16 }}>
          <RoleCard
            icon="school-outline"
            title="Mahasiswa"
            subtitle="Cari & Lapor Barang"
            onPress={() => navigation.navigate('Login', { isAdmin: false })}
          />
          <RoleCard
            icon="shield-checkmark-outline"
            title="Admin"
            subtitle="Verifikasi Laporan"
            onPress={() => navigation.navigate('Login', { isAdmin: true })}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
