// LoginScreen — variant ditentukan oleh `route.params.isAdmin`.

import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

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

  const isNim = !isAdmin && /^\d{6,15}$/.test(emailInput.trim());
  const actualEmail = isNim ? `${emailInput.trim()}@${ALLOWED_DOMAIN}` : emailInput.trim();

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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login gagal.';
      Alert.alert('Login gagal', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View
        style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 360,
          height: 360,
          borderRadius: 999,
          backgroundColor: isAdmin ? COLORS.admin : COLORS.primary,
          opacity: 0.14,
          transform: [{ scale: 1.35 }],
        }}
        pointerEvents="none"
      />
      <View
        style={{
          position: 'absolute',
          bottom: -70,
          left: -70,
          width: 320,
          height: 320,
          borderRadius: 999,
          backgroundColor: isAdmin ? COLORS.admin : COLORS.found,
          opacity: 0.12,
          transform: [{ scale: 1.18 }],
        }}
        pointerEvents="none"
      />

      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Pressable
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Kembali"
              style={{ alignSelf: 'flex-start', marginBottom: 16 }}
            >
              {({ pressed }) => (
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.8)',
                    opacity: pressed ? 0.72 : 1,
                    shadowColor: '#000',
                    shadowOpacity: 0.06,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 2,
                  }}
                >
                  <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
                </View>
              )}
            </Pressable>

            <BlurView
              intensity={60}
              tint="light"
              style={{
                borderRadius: 32,
                overflow: 'hidden',
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.78)',
                backgroundColor: 'rgba(255,255,255,0.42)',
                padding: 24,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 22,
                shadowOffset: { width: 0, height: 12 },
                elevation: 6,
              }}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.2)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
              />

              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <View
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: 28,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.58)',
                    borderWidth: 1.5,
                    borderColor: 'rgba(255,255,255,0.9)',
                    marginBottom: 18,
                    shadowColor: '#000',
                    shadowOpacity: 0.06,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: 2,
                  }}
                >
                  <LinearGradient
                    colors={isAdmin ? [COLORS.admin, '#14B8A6'] : [COLORS.primary, '#60A5FA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 18,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={isAdmin ? 'shield-checkmark' : 'search'} size={30} color="#FFFFFF" />
                  </LinearGradient>
                </View>

                <View
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: isAdmin ? 'rgba(13,148,136,0.08)' : 'rgba(37,99,235,0.08)',
                    borderWidth: 1,
                    borderColor: isAdmin ? 'rgba(13,148,136,0.14)' : 'rgba(37,99,235,0.14)',
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '800',
                      letterSpacing: 0.8,
                      color: isAdmin ? COLORS.adminText : COLORS.primary,
                      textTransform: 'uppercase',
                    }}
                  >
                    {isAdmin ? 'Portal Admin' : 'Mahasiswa'}
                  </Text>
                </View>

                <Text style={{ fontSize: 26, fontWeight: '900', color: COLORS.primary, letterSpacing: -0.5, marginBottom: 8 }}>
                  {isAdmin ? 'Masuk ke panel admin' : 'Masuk ke Cari.In'}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 22,
                    color: COLORS.textMuted,
                    textAlign: 'center',
                    maxWidth: 280,
                  }}
                >
                  {isAdmin
                    ? 'Gunakan akun administrator untuk memoderasi laporan dan mengelola data.'
                    : 'Masukkan NIM atau email kampus untuk mengakses feed dan laporan kamu.'}
                </Text>
              </View>

              <View style={{ gap: 16 }}>
                <AuthInput
                  label={isAdmin ? 'ID Admin / Email' : 'NIM / Email'}
                  variant={variant}
                  value={emailInput}
                  onChangeText={setEmailInput}
                  placeholder={isAdmin ? 'admin@cariin.app' : '241111021'}
                  keyboardType={isAdmin ? 'email-address' : 'default'}
                  autoCapitalize="none"
                  autoComplete={isAdmin ? 'email' : 'off'}
                  error={emailError}
                />

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
                    <Text
                      style={{
                        fontSize: 11,
                        color: COLORS.found,
                        fontWeight: '600',
                      }}
                      numberOfLines={1}
                    >
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
                  isPassword
                  autoCapitalize="none"
                  error={passwordError}
                  rightAction={
                    isAdmin ? null : (
                      <Pressable onPress={() => navigation.navigate('ForgotPassword')} hitSlop={8}>
                        {({ pressed }) => (
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: '700',
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

                <View style={{ paddingTop: 4 }}>
                  <PrimaryButton
                    label={isAdmin ? 'Masuk Dashboard Admin' : 'Masuk'}
                    variant={variant}
                    onPress={handleSubmit}
                    loading={loading}
                  />
                </View>
              </View>

              {!isAdmin ? (
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 22,
                    fontSize: 14,
                    color: COLORS.textMuted,
                  }}
                >
                  Belum punya akun?{' '}
                  <Text
                    style={{ color: COLORS.primary, fontWeight: '800' }}
                    onPress={() => navigation.navigate('Register')}
                  >
                    Daftar
                  </Text>
                </Text>
              ) : null}
            </BlurView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
