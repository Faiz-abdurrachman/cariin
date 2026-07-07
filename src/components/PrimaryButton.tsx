import { ActivityIndicator, Pressable, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

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
            borderRadius: 18,
            opacity: isDisabled ? 0.6 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
            shadowColor: bg,
            shadowOpacity: 0.18,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 8 },
            elevation: 4,
          }}
        >
          <BlurView
            intensity={35}
            tint="light"
            style={{
              backgroundColor: bg,
              borderRadius: 18,
              overflow: 'hidden',
              minHeight: 52,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 14,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.24)',
            }}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.34)', 'rgba(255,255,255,0.1)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />

            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 15,
                  fontWeight: '800',
                  letterSpacing: 0.4,
                }}
              >
                {label}
              </Text>
            )}
          </BlurView>
        </View>
      )}
    </Pressable>
  );
}
