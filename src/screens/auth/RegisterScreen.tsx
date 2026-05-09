// RegisterScreen — form daftar mahasiswa baru. Domain email kampus DIVALIDASI
// di sini (gate UVP #1). Setelah signUp + insert profile sukses, AuthContext
// onAuthStateChange auto-route ke MainNavigator.

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
import FacultyPicker from '@/components/FacultyPicker';
import PrimaryButton from '@/components/PrimaryButton';
import { useAuth } from '@/context/AuthContext';
import type { AuthStackParamList } from '@/navigation/types';
import { COLORS } from '@/utils/constants';
import {
  EMAIL_DOMAIN_ERROR,
  isValidCampusEmail,
  isValidNim,
  isValidPassword,
  NIM_ERROR,
  PASSWORD_ERROR,
} from '@/utils/validators';

type Nav = StackNavigationProp<AuthStackParamList, 'Register'>;

interface FormErrors {
  name?: string;
  nim?: string;
  email?: string;
  faculty?: string;
  password?: string;
}

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [faculty, setFaculty] = useState<string | null>(null);
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!name.trim()) next.name = 'Nama wajib diisi.';
    if (!nim.trim()) next.nim = 'NIM wajib diisi.';
    else if (!isValidNim(nim)) next.nim = NIM_ERROR;
    if (!email.trim()) next.email = 'Email wajib diisi.';
    else if (!isValidCampusEmail(email)) next.email = EMAIL_DOMAIN_ERROR;
    if (!faculty) next.faculty = 'Pilih fakultas.';
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
        department: department.trim() || undefined,
      });
      // signUp Supabase otomatis bikin session kalau email confirmation OFF.
      // Kalau ON, session null dan onAuthStateChange tidak fire — kasih info.
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

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Heading */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                letterSpacing: -0.4,
                color: COLORS.primary,
                marginBottom: 8,
              }}
            >
              Buat Akun
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.textMuted }}>
              Daftar dengan email kampus kamu.
            </Text>
          </View>

          {/* Form */}
          <View style={{ rowGap: 16 }}>
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
              onChangeText={setNim}
              placeholder="22-TI-001"
              keyboardType="numeric"
              autoCapitalize="none"
              error={errors.nim}
            />
            <AuthInput
              label="Email Kampus"
              value={email}
              onChangeText={setEmail}
              placeholder="nama@student.unu-jogja.ac.id"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
            />

            <View style={{ flexDirection: 'row', columnGap: 12 }}>
              <View style={{ flex: 1 }}>
                <FacultyPicker
                  label="Fakultas"
                  value={faculty}
                  onChange={setFaculty}
                  error={errors.faculty}
                />
              </View>
              <View style={{ flex: 1 }}>
                <AuthInput
                  label="Jurusan"
                  value={department}
                  onChangeText={setDepartment}
                  placeholder="Cth: Informatika"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <AuthInput
              label="Kata Sandi"
              value={password}
              onChangeText={setPassword}
              placeholder="Minimal 6 karakter"
              secureTextEntry
              autoCapitalize="none"
              error={errors.password}
            />

            <View style={{ paddingTop: 8 }}>
              <PrimaryButton label="Daftar Sekarang" onPress={handleSubmit} loading={loading} />
            </View>
          </View>

          <Text
            style={{
              textAlign: 'center',
              marginTop: 24,
              fontSize: 14,
              color: COLORS.textMuted,
            }}
          >
            Sudah punya akun?{' '}
            <Text
              style={{ color: COLORS.primary, fontWeight: '700' }}
              onPress={() => navigation.navigate('Login', { isAdmin: false })}
            >
              Masuk
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
