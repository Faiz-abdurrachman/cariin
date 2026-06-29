// Custom tab button untuk slot tengah Bottom Tab — bulat menonjol ke atas.
// Dipakai oleh MainNavigator sebagai shortcut buka modal Create.

import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/utils/constants';

interface Props {
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  variant?: 'default' | 'admin';
}

export default function FabButton({
  onPress,
  containerStyle,
  accessibilityLabel = 'Buat laporan baru',
  variant = 'default',
}: Props) {
  const bg = variant === 'admin' ? COLORS.admin : COLORS.primary;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[containerStyle, { alignItems: 'center', justifyContent: 'center' }]}
    >
      {({ pressed }) => (
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: bg,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: bg,
            shadowOpacity: 0.25,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
            opacity: pressed ? 0.85 : 1,
          }}
        >
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </View>
      )}
    </Pressable>
  );
}
