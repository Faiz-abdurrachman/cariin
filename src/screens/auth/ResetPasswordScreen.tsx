import { Ionicons } from '@expo/vector-icons';
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
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthInput from '@/components/AuthInput';
import PrimaryButton from '@/components/PrimaryButton';
import { useAuth } from '@/context/AuthContext';
import { updatePassword } from '@/services/auth.service';
import { COLORS } from '@/utils/constants';
import { isValidPassword, PASSWORD_ERROR } from '@/utils/validators';

export default function ResetPasswordScreen() {
  const { completePasswordRecovery, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmationError, setConfirmationError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    let valid = true;
    if (!isValidPassword(password)) {
      setPasswordError(PASSWORD_ERROR);
      valid = false;
    } else {
      setPasswordError(undefined);
    }

    if (confirmation !== password) {
      setConfirmationError('Konfirmasi kata sandi tidak sama.');
      valid = false;
    } else {
      setConfirmationError(undefined);
    }
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await updatePassword(password);
      Alert.alert('Kata sandi diperbarui', 'Silakan lanjut menggunakan Cari.In.', [
        { text: 'Lanjut', onPress: completePasswordRecovery },
      ]);
    } catch (error) {
      Alert.alert(
        'Gagal memperbarui kata sandi',
        error instanceof Error ? error.message : 'Coba lagi.',
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelRecovery = async () => {
    try {
      await logout();
    } finally {
      completePasswordRecovery();
    }
  };

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={{ flex: 1, backgroundColor: COLORS.surface }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 32,
            paddingVertical: 32,
          }}
          keyboardShouldPersistTaps="handled"
        >
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
              <Ionicons name="lock-closed-outline" size={36} color={COLORS.primary} />
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: COLORS.primary,
                marginBottom: 8,
              }}
            >
              Buat Kata Sandi Baru
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.textMuted,
                textAlign: 'center',
                lineHeight: 20,
              }}
            >
              Masukkan kata sandi baru untuk menyelesaikan proses pemulihan akun.
            </Text>
          </View>

          <View style={{ rowGap: 18 }}>
            <AuthInput
              label="Kata Sandi Baru"
              value={password}
              onChangeText={setPassword}
              placeholder="Minimal 6 karakter"
              isPassword
              error={passwordError}
            />
            <AuthInput
              label="Konfirmasi Kata Sandi"
              value={confirmation}
              onChangeText={setConfirmation}
              placeholder="Ulangi kata sandi baru"
              isPassword
              error={confirmationError}
            />
            <PrimaryButton
              label="Simpan Kata Sandi"
              onPress={handleSubmit}
              loading={loading}
            />
            <Pressable
              onPress={() => void cancelRecovery()}
              accessibilityRole="button"
              accessibilityLabel="Batalkan pemulihan kata sandi"
              style={{ alignItems: 'center', paddingVertical: 10 }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.textMuted }}>
                Batal dan kembali ke login
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
