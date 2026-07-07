// Input dengan label + error message — dipakai di seluruh form auth (Login,
// Register, ForgotPassword) untuk menjamin styling konsisten.

import { useState } from 'react';
import { Text, TextInput, View, StyleSheet, Platform, Pressable, type TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS } from '@/utils/constants';

interface Props extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  variant?: 'default' | 'admin';
  rightAction?: React.ReactNode;
  isPassword?: boolean;
}

export default function AuthInput({
  label,
  error,
  variant = 'default',
  rightAction,
  isPassword,
  ...inputProps
}: Props) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const focusColor = variant === 'admin' ? COLORS.admin : COLORS.primary;

  const borderColor = error
    ? COLORS.lost
    : focused
      ? focusColor
      : 'rgba(255, 255, 255, 0.6)';

  return (
    <View style={{ marginBottom: 8 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
          paddingHorizontal: 4,
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.primary }}>
          {label}
        </Text>
        {rightAction}
      </View>

      <View style={{ borderRadius: 18 }}>
        <BlurView
          intensity={55}
          tint="light"
          style={{
            backgroundColor: focused ? 'rgba(255,255,255,0.68)' : 'rgba(255,255,255,0.42)',
            borderWidth: 1.5,
            borderColor,
            borderRadius: 18,
            overflow: 'hidden',
            minHeight: 54,
            justifyContent: 'center',
            shadowColor: focused ? focusColor : '#000',
            shadowOpacity: focused ? 0.08 : 0.05,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 2,
          }}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.86)', 'rgba(255,255,255,0.22)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              {...inputProps}
              secureTextEntry={isPassword ? !showPassword : inputProps.secureTextEntry}
              onFocus={(e) => {
                setFocused(true);
                inputProps.onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                inputProps.onBlur?.(e);
              }}
              placeholderTextColor="rgba(100, 116, 139, 0.72)"
              style={{
                flex: 1,
                paddingHorizontal: 16,
                paddingVertical: Platform.OS === 'ios' ? 15 : 12,
                fontSize: 15,
                color: COLORS.primary,
                fontWeight: '600',
              }}
            />
            {isPassword && (
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={{ padding: 12, marginRight: 4 }}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              >
                {({ pressed }) => (
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={focused ? focusColor : COLORS.textMuted}
                    style={{ opacity: pressed ? 0.6 : 1 }}
                  />
                )}
              </Pressable>
            )}
          </View>
        </BlurView>
      </View>
      
      {error ? (
        <Text style={{ fontSize: 11, fontWeight: '500', color: COLORS.lost, marginTop: 4, paddingHorizontal: 4 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
