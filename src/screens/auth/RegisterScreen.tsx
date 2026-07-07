// RegisterScreen — form daftar mahasiswa baru.

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
import { useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import AuthInput from '@/components/AuthInput';
import FacultyPicker from '@/components/FacultyPicker';
import PrimaryButton from '@/components/PrimaryButton';
import ProgramPicker from '@/components/ProgramPicker';
import { useAuth } from '@/context/AuthContext';
import type { AuthStackParamList } from '@/navigation/types';
import { ALLOWED_DOMAIN, isValidNim, isValidPassword, NIM_ERROR, PASSWORD_ERROR } from '@/utils/validators';
import { COLORS } from '@/utils/constants';

type Nav = StackNavigationProp<AuthStackParamList, 'Register'>;

interface FormErrors {
  name?: string;
  nim?: string;
  faculty?: string;
  prodi?: string;
  password?: string;
}

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [faculty, setFaculty] = useState<string | null>(null);
  const [prodi, setProdi] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleNimChange = (text: string) => {
    setNim(text);
    const trimmed = text.trim();
    if (trimmed.length > 0 && /^\d+$/.test(trimmed)) {
      setEmail(`${trimmed}@${ALLOWED_DOMAIN}`);
    } else {
      setEmail('');
    }
  };

  function validate(): boolean {
    const next: FormErrors = {};
    if (!name.trim()) next.name = 'Nama wajib diisi.';
    if (!nim.trim()) next.nim = 'NIM wajib diisi.';
    else if (!isValidNim(nim)) next.nim = NIM_ERROR;
    if (!faculty) next.faculty = 'Pilih fakultas.';
    if (!prodi) next.prodi = 'Pilih prodi.';
    if (!isValidPassword(password)) next.password = PASSWORD_ERROR;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        name: name.trim(),
        nim: nim.trim(),
        email,
        password,
        faculty: faculty ?? undefined,
        department: prodi ?? undefined,
      });
      Alert.alert(
        'Pendaftaran berhasil',
        'Akun Anda telah dibuat. Jika ada email konfirmasi, silakan cek inbox.',
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Pendaftaran gagal.';
      Alert.alert('Pendaftaran gagal', message);
    } finally {
      setLoading(false);
    }
  }

  const hasEmail = email.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View
        style={{
          position: 'absolute',
          top: -50,
          right: -60,
          width: 360,
          height: 360,
          borderRadius: 999,
          backgroundColor: COLORS.primary,
          opacity: 0.14,
          transform: [{ scale: 1.28 }],
        }}
        pointerEvents="none"
      />
      <View
        style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 320,
          height: 320,
          borderRadius: 999,
          backgroundColor: COLORS.found,
          opacity: 0.12,
          transform: [{ scale: 1.16 }],
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
                    colors={[COLORS.primary, '#60A5FA']}
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
                    <Ionicons name="create" size={28} color="#FFFFFF" />
                  </LinearGradient>
                </View>

                <Text style={{ fontSize: 26, fontWeight: '900', color: COLORS.primary, letterSpacing: -0.5, marginBottom: 8 }}>
                  Buat akun mahasiswa
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 22,
                    color: COLORS.textMuted,
                    textAlign: 'center',
                    maxWidth: 300,
                  }}
                >
                  Isi NIM, lalu email kampus akan dibuat otomatis. Data lain tinggal dilengkapi.
                </Text>
              </View>

              <View style={{ gap: 16 }}>
                <AuthInput
                  label="Nama Lengkap"
                  value={name}
                  onChangeText={setName}
                  placeholder="Sesuai KTM"
                  autoCapitalize="words"
                  error={errors.name}
                />

                <AuthInput
                  label="NIM"
                  value={nim}
                  onChangeText={handleNimChange}
                  placeholder="241111021"
                  keyboardType="numeric"
                  autoCapitalize="none"
                  error={errors.nim}
                />

                <BlurView
                  intensity={50}
                  tint="light"
                  style={{
                    borderRadius: 18,
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255,255,255,0.42)',
                    borderWidth: 1.5,
                    borderColor: 'rgba(255,255,255,0.75)',
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.84)', 'rgba(255,255,255,0.18)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                    pointerEvents="none"
                  />
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: hasEmail ? 'rgba(5,150,105,0.1)' : 'rgba(37,99,235,0.08)',
                    }}
                  >
                    <Feather name={hasEmail ? 'check-circle' : 'mail'} size={16} color={hasEmail ? COLORS.found : COLORS.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginBottom: 2 }}>
                      Email Kampus
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: hasEmail ? COLORS.primary : COLORS.textMuted,
                        fontWeight: '600',
                      }}
                      numberOfLines={1}
                    >
                      {hasEmail ? email : 'Otomatis dari NIM'}
                    </Text>
                  </View>
                </BlurView>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <FacultyPicker
                      label="Fakultas"
                      value={faculty}
                      onChange={(f) => {
                        setFaculty(f);
                        setProdi(null);
                      }}
                      error={errors.faculty}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ProgramPicker
                      faculty={faculty}
                      value={prodi}
                      onChange={setProdi}
                      error={errors.prodi}
                    />
                  </View>
                </View>

                <AuthInput
                  label="Kata Sandi"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Minimal 6 karakter"
                  isPassword
                  autoCapitalize="none"
                  error={errors.password}
                />

                <View style={{ paddingTop: 4 }}>
                  <PrimaryButton label="Daftar Sekarang" onPress={handleSubmit} loading={loading} />
                </View>
              </View>

              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 22,
                  fontSize: 14,
                  color: COLORS.textMuted,
                }}
              >
                Sudah punya akun?{' '}
                <Text
                  style={{ color: COLORS.primary, fontWeight: '800' }}
                  onPress={() => navigation.navigate('Login', { isAdmin: false })}
                >
                  Masuk
                </Text>
              </Text>
            </BlurView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
