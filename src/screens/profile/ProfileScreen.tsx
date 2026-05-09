// ProfileScreen placeholder — diisi penuh di FASE 4. Sementara kasih
// tombol Logout biar bisa keluar dari MainTab saat testing.

import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '@/components/PrimaryButton';
import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/utils/constants';

export default function ProfileScreen() {
  const { logout, user, userProfile } = useAuth();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 32,
          rowGap: 16,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.primary }}>
          ProfileScreen
        </Text>
        <Text style={{ fontSize: 12, color: COLORS.textMuted, textAlign: 'center' }}>
          {user?.email ?? 'no email'} · role: {userProfile?.role ?? 'null'}
        </Text>
        <View style={{ width: '100%', maxWidth: 320, marginTop: 24 }}>
          <PrimaryButton label="Logout" onPress={() => void logout()} />
        </View>
      </View>
    </SafeAreaView>
  );
}
