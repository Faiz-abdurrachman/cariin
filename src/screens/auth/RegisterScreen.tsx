// RegisterScreen — form daftar mahasiswa baru.
// Opsi A: user isi NIM → email auto-generate (nim@student.unu-jogja.ac.id).
// Field email read-only biar gak perlu diketik manual & gak ada typo.

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
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  // Saat user ngetik NIM, email auto-generate
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
              Masukkan NIM, data lainnya otomatis.
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
              onChangeText={handleNimChange}
              placeholder="241111021"
              keyboardType="numeric"
              autoCapitalize="none"
              error={errors.nim}
            />

            {/* Email auto-generate — read-only display */}
            <View style={{ rowGap: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#18181B' }}>Email Kampus</Text>
              <View
                style={{
                  backgroundColor: '#F1F5F9',
                  borderColor: COLORS.border,
                  borderWidth: 1,
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Feather name={hasEmail ? 'check-circle' : 'mail'} size={16} color={hasEmail ? COLORS.found : COLORS.textMuted} />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: hasEmail ? COLORS.primary : COLORS.textMuted,
                    fontStyle: hasEmail ? 'normal' : 'italic',
                  }}
                  numberOfLines={1}
                >
                  {hasEmail ? email : 'Otomatis dari NIM'}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', columnGap: 12 }}>
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
