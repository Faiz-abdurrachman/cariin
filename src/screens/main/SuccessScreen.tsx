// Konfirmasi laporan terkirim. Ditampilkan setelah CreateReport sukses.
// Referensi visual: cariin-web/success.html.

import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type {
  CreateModalParamList,
  RootStackParamList,
} from '@/navigation/types';
import { COLORS } from '@/utils/constants';

type Nav = StackNavigationProp<CreateModalParamList, 'Success'>;
type RouteP = RouteProp<CreateModalParamList, 'Success'>;

export default function SuccessScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteP>();
  const type = route.params?.type;

  const closeModal = () => {
    // Naik ke RootStack dan goBack untuk dismiss modal stack — kembali ke
    // MainTabs (HomeTab tetap fokus, feed sudah di-refresh oleh CreateReport).
    const root = nav.getParent<StackNavigationProp<RootStackParamList>>();
    if (root) {
      root.goBack();
    } else {
      nav.goBack();
    }
  };

  const goToMyPosts = () => {
    const root = nav.getParent<StackNavigationProp<RootStackParamList>>();
    if (root && root.canGoBack()) {
      root.goBack();
    }
    root?.navigate('MainTabs', { screen: 'MyPostsTab', params: { screen: 'MyPosts' } });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 32,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 999,
            backgroundColor: '#D1FAE5',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 28,
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              backgroundColor: COLORS.found,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: COLORS.found,
              shadowOpacity: 0.35,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 6,
            }}
          >
            <Feather name="check" size={32} color="#FFFFFF" />
          </View>
        </View>

        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: COLORS.primary,
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          Laporan Terkirim!
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: COLORS.textMuted,
            textAlign: 'center',
            lineHeight: 22,
            maxWidth: 300,
          }}
        >
          Terima kasih! Laporan {type === 'lost' ? 'kehilangan' : 'temuan'} Anda
          telah kami terima dan sedang{' '}
          <Text style={{ fontWeight: '700', color: COLORS.primary }}>
            menunggu review admin
          </Text>{' '}
          sebelum ditampilkan di publik.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 24, gap: 12 }}>
        <Pressable onPress={closeModal} accessibilityRole="button">
          {({ pressed }) => (
            <View
              style={{
                paddingVertical: 16,
                backgroundColor: COLORS.primary,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.85 : 1,
                shadowColor: COLORS.primary,
                shadowOpacity: 0.2,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 4,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>
                Kembali ke Beranda
              </Text>
            </View>
          )}
        </Pressable>
        <Pressable onPress={goToMyPosts} accessibilityRole="button">
          {({ pressed }) => (
            <View
              style={{
                paddingVertical: 16,
                backgroundColor: COLORS.surface,
                borderWidth: 2,
                borderColor: COLORS.border,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.85 : 1,
              }}
            >
              <Text style={{ color: COLORS.primary, fontSize: 15, fontWeight: '700' }}>
                Lihat Laporanku
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
