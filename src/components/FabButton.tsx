// Custom tab button untuk slot tengah Bottom Tab — bulat menonjol ke atas.
// Dipakai oleh MainNavigator sebagai shortcut buka modal Create.

import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/utils/constants';

interface Props {
  onPress?: () => void;
  /** Style yang dikirim React Navigation ke tabBarButton — wajib di-spread
   *  ke wrapper biar slot tab punya dimensi flex yang benar. */
  containerStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export default function FabButton({
  onPress,
  containerStyle,
  accessibilityLabel = 'Buat laporan baru',
}: Props) {
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
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 4,
            opacity: pressed ? 0.85 : 1,
          }}
        >
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </View>
      )}
    </Pressable>
  );
}
