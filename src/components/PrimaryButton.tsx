// Tombol primary full-width — variant default (zinc-950) untuk mahasiswa,
// variant admin (indigo-600) untuk admin login & admin actions.

import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { COLORS } from '@/utils/constants';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: 'default' | 'admin';
  loading?: boolean;
  disabled?: boolean;
}

export default function PrimaryButton({
  label,
  onPress,
  variant = 'default',
  loading,
  disabled,
}: Props) {
  const bg = variant === 'admin' ? COLORS.admin : COLORS.primary;
  const isDisabled = loading || disabled;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
    >
      {({ pressed }) => (
        <View
          style={{
            backgroundColor: bg,
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1,
            shadowColor: bg,
            shadowOpacity: 0.2,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600' }}>{label}</Text>
          )}
        </View>
      )}
    </Pressable>
  );
}
