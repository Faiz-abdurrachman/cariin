// ForgotPasswordScreen — form kirim tautan reset password ke email kampus.

import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthInput from '@/components/AuthInput';
import PrimaryButton from '@/components/PrimaryButton';
import { useAuth } from '@/context/AuthContext';
import type { AuthStackParamList } from '@/navigation/types';
import { COLORS } from '@/utils/constants';

type Nav = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<Nav>();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    if (!email.trim()) {
      setEmailError('Email wajib diisi.');
      return false;
    }
    if (!email.includes('@')) {
      setEmailError('Format email tidak valid.');
      return false;
    }
    setEmailError(undefined);
    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Tautan reset terkirim',
        'Kami sudah mengirim tautan reset password ke email Anda. Silakan cek inbox.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal mengirim tautan reset.';
      Alert.alert('Gagal', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header back */}
        <View style={{ height: 56, justifyContent: 'center', paddingHorizontal: 16 }}>
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: COLORS.background,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 32,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Centered icon + heading */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: COLORS.background,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <Ionicons name="key-outline" size={36} color={COLORS.primary} />
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                letterSpacing: -0.4,
                color: COLORS.primary,
                marginBottom: 8,
              }}
            >
              Lupa Kata Sandi?
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.textMuted,
                textAlign: 'center',
                lineHeight: 20,
              }}
            >
              Masukkan email kampus Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata
              sandi.
            </Text>
          </View>

          {/* Form */}
          <View style={{ rowGap: 20 }}>
            <AuthInput
              label="Email Kampus"
              value={email}
              onChangeText={setEmail}
              placeholder="nim@student.unu-jogja.ac.id"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={emailError}
            />
            <View style={{ paddingTop: 8 }}>
              <PrimaryButton label="Kirim Tautan Reset" onPress={handleSubmit} loading={loading} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
