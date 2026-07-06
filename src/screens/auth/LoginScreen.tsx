// LoginScreen — variant ditentukan oleh `route.params.isAdmin`.
//   - mahasiswa: aksen zinc, ada link "Lupa sandi" + "Daftar"
//   - admin    : aksen indigo, badge "Portal Admin", tanpa link forgot/register

import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthInput from '@/components/AuthInput';
import PrimaryButton from '@/components/PrimaryButton';
import { useAuth } from '@/context/AuthContext';
import type { AuthStackParamList } from '@/navigation/types';
import { ALLOWED_DOMAIN, isValidPassword, PASSWORD_ERROR } from '@/utils/validators';
import { COLORS } from '@/utils/constants';

type Nav = StackNavigationProp<AuthStackParamList, 'Login'>;
type Route = RouteProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { loginWithEmail } = useAuth();
  const isAdmin = !!route.params?.isAdmin;
  const variant = isAdmin ? 'admin' : 'default';

  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  // Kalau input adalah angka 6-15 digit (NIM), construct email lengkap.
  // Kalau bukan (admin atau email manual), pakai apa yang diketik.
  const isNim = !isAdmin && /^\d{6,15}$/.test(emailInput.trim());
  const actualEmail = isNim ? `${emailInput.trim()}@${ALLOWED_DOMAIN}` : emailInput.trim();

  const handleEmailChange = (text: string) => {
    setEmailInput(text);
  };

  function validate(): boolean {
    let valid = true;
    if (!actualEmail) {
      setEmailError('Email wajib diisi.');
      valid = false;
    } else if (!actualEmail.includes('@')) {
      setEmailError('Format email tidak valid.');
      valid = false;
    } else {
      setEmailError(undefined);
    }
    if (!isValidPassword(password)) {
      setPasswordError(PASSWORD_ERROR);
      valid = false;
    } else {
      setPasswordError(undefined);
    }
    return valid;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      await loginWithEmail(actualEmail, password);
      // Sukses → AuthContext.onAuthStateChange fire → RootNavigator branching
      // otomatis ke MainNavigator/AdminNavigator. Tidak perlu manual navigate.
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login gagal.';
      Alert.alert('Login gagal', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header back button */}
        <View style={{ height: 56, justifyContent: 'center', paddingHorizontal: 16 }}>
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            {({ pressed }) => (
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: COLORS.background,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.7 : 1,
                }}
              >
                <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
              </View>
            )}
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
          {/* Heading */}
          <View style={{ marginBottom: 32 }}>
            <View
              style={{
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 6,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: isAdmin ? COLORS.adminLight : COLORS.background,
                marginBottom: 16,
              }}
            >
              <Ionicons
                name={isAdmin ? 'shield-checkmark' : 'school'}
                size={14}
                color={isAdmin ? COLORS.adminText : COLORS.primary}
              />
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  letterSpacing: 0.5,
                  color: isAdmin ? COLORS.adminText : COLORS.primary,
                  textTransform: 'uppercase',
                }}
              >
                {isAdmin ? 'Portal Admin' : 'Mahasiswa'}
              </Text>
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
              {isAdmin ? 'Verifikasi Identitas' : 'Selamat datang kembali'}
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.textMuted }}>
              {isAdmin
                ? 'Masuk menggunakan kredensial administrator Anda.'
                : 'Masukkan NIM, email otomatis terisi.'}
            </Text>
          </View>

          {/* Form */}
          <View style={{ rowGap: 20 }}>
            <AuthInput
              label={isAdmin ? 'ID Admin / Email' : 'NIM / Email'}
              variant={variant}
              value={emailInput}
              onChangeText={handleEmailChange}
              placeholder={isAdmin ? 'admin@cariin.app' : '241111021'}
              keyboardType={isAdmin ? 'email-address' : 'default'}
              autoCapitalize="none"
              autoComplete={isAdmin ? 'email' : 'off'}
              error={emailError}
            />
            {/* Info auto-generate email (mahasiswa only) */}
            {!isAdmin && isNim ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 4,
                }}
              >
                <Feather name="check-circle" size={12} color={COLORS.found} />
                <Text style={{ fontSize: 11, color: COLORS.found, fontWeight: '500' }} numberOfLines={1}>
                  {actualEmail}
                </Text>
              </View>
            ) : null}
            <AuthInput
              label={isAdmin ? 'Kata Sandi Akses' : 'Kata Sandi'}
              variant={variant}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              error={passwordError}
              rightAction={
                isAdmin ? null : (
                  <Pressable
                    onPress={() => navigation.navigate('ForgotPassword')}
                    hitSlop={8}
                  >
                    {({ pressed }) => (
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color: COLORS.textMuted,
                          opacity: pressed ? 0.7 : 1,
                        }}
                      >
                        Lupa sandi?
                      </Text>
                    )}
                  </Pressable>
                )
              }
            />
            <View style={{ paddingTop: 8 }}>
              <PrimaryButton
                label={isAdmin ? 'Masuk Dashboard Admin' : 'Masuk'}
                variant={variant}
                onPress={handleSubmit}
                loading={loading}
              />
            </View>
          </View>

          {/* Footer (mahasiswa only) */}
          {!isAdmin ? (
            <Text
              style={{
                textAlign: 'center',
                marginTop: 32,
                fontSize: 14,
                color: COLORS.textMuted,
              }}
            >
              Belum punya akun?{' '}
              <Text
                style={{ color: COLORS.primary, fontWeight: '700' }}
                onPress={() => navigation.navigate('Register')}
              >
                Daftar
              </Text>
            </Text>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
