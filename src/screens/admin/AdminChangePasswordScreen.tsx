import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
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
import type { AdminProfileStackParamList } from '@/navigation/types';
import { updatePassword } from '@/services/auth.service';
import { COLORS } from '@/utils/constants';
import {
  isValidPassword,
  PASSWORD_ERROR,
} from '@/utils/validators';

type Nav = StackNavigationProp<
  AdminProfileStackParamList,
  'AdminChangePassword'
>;

export default function AdminChangePasswordScreen() {
  const nav = useNavigation<Nav>();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [passwordError, setPasswordError] = useState<string>();
  const [confirmationError, setConfirmationError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const save = async () => {
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

    if (!valid) return;

    setSaving(true);
    try {
      await updatePassword(password);
      setPassword('');
      setConfirmation('');
      Alert.alert('Berhasil', 'Kata sandi admin telah diperbarui.', [
        { text: 'OK', onPress: () => nav.goBack() },
      ]);
    } catch (error) {
      Alert.alert(
        'Gagal memperbarui kata sandi',
        error instanceof Error ? error.message : 'Coba lagi.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.adminLight }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View
          style={{
            height: 60,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: COLORS.adminBorder,
            backgroundColor: 'rgba(255,255,255,0.78)',
          }}
        >
          <Pressable
            onPress={() => nav.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            {({ pressed }) => (
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFFFFF',
                  opacity: pressed ? 0.72 : 1,
                }}
              >
                <Feather name="arrow-left" size={20} color={COLORS.adminText} />
              </View>
            )}
          </Pressable>
          <Text
            style={{
              position: 'absolute',
              left: 64,
              right: 64,
              textAlign: 'center',
              fontSize: 17,
              fontWeight: '800',
              color: COLORS.adminText,
            }}
          >
            Ganti Kata Sandi
          </Text>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              padding: 24,
              paddingBottom: 48,
            }}
          >
            <View
              style={{
                borderRadius: 28,
                padding: 22,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: COLORS.adminBorder,
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  backgroundColor: COLORS.adminLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 18,
                }}
              >
                <Feather name="key" size={28} color={COLORS.admin} />
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '900',
                  color: COLORS.adminText,
                  marginBottom: 6,
                }}
              >
                Amankan akun admin
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 20,
                  color: COLORS.textMuted,
                  marginBottom: 22,
                }}
              >
                Gunakan minimal 6 karakter dan jangan bagikan kata sandi kepada
                pengguna lain.
              </Text>

              <AuthInput
                label="Kata Sandi Baru"
                value={password}
                onChangeText={setPassword}
                placeholder="Minimal 6 karakter"
                isPassword
                variant="admin"
                error={passwordError}
              />
              <AuthInput
                label="Konfirmasi Kata Sandi"
                value={confirmation}
                onChangeText={setConfirmation}
                placeholder="Ulangi kata sandi baru"
                isPassword
                variant="admin"
                error={confirmationError}
              />
              <View style={{ marginTop: 10 }}>
                <PrimaryButton
                  label="Simpan Kata Sandi"
                  onPress={() => void save()}
                  loading={saving}
                  variant="admin"
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
