// Badge "Dilaporkan via Admin" — indigo, ditampilkan kalau report.created_by_admin=true.

import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { COLORS } from '@/utils/constants';

interface Props {
  size?: 'sm' | 'md';
}

export default function ViaAdminBadge({ size = 'sm' }: Props) {
  return (
    <View
      style={{
        backgroundColor: COLORS.adminLight,
        paddingHorizontal: size === 'sm' ? 8 : 12,
        paddingVertical: size === 'sm' ? 3 : 5,
        borderRadius: 999,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Feather name="shield" size={size === 'sm' ? 10 : 12} color={COLORS.adminText} />
      <Text
        style={{
          color: COLORS.adminText,
          fontSize: size === 'sm' ? 10 : 12,
          fontWeight: '700',
          letterSpacing: 0.3,
        }}
      >
        via Admin
      </Text>
    </View>
  );
}
