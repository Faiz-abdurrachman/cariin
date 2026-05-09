// Input dengan label + error message — dipakai di seluruh form auth (Login,
// Register, ForgotPassword) untuk menjamin styling konsisten.

import { useState } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { COLORS } from '@/utils/constants';

interface Props extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  /** Mahasiswa default → focus zinc-950. Admin → focus indigo-600. */
  variant?: 'default' | 'admin';
  rightAction?: React.ReactNode;
}

export default function AuthInput({
  label,
  error,
  variant = 'default',
  rightAction,
  ...inputProps
}: Props) {
  const [focused, setFocused] = useState(false);
  const focusColor = variant === 'admin' ? COLORS.admin : COLORS.primary;

  const borderColor = error
    ? COLORS.lost
    : focused
      ? focusColor
      : COLORS.border;

  return (
    <View className="space-y-1.5">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-zinc-900">{label}</Text>
        {rightAction}
      </View>
      <TextInput
        {...inputProps}
        onFocus={(e) => {
          setFocused(true);
          inputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          inputProps.onBlur?.(e);
        }}
        placeholderTextColor={COLORS.textMuted}
        style={{
          backgroundColor: '#FAFAFA',
          borderColor,
          borderWidth: focused || error ? 2 : 1,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 14,
          fontSize: 14,
          color: COLORS.primary,
        }}
      />
      {error ? (
        <Text className="text-xs font-medium" style={{ color: COLORS.lost }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
