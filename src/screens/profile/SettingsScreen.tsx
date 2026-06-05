// Pengaturan Akun — edit nama, ganti kata sandi, toggle notifikasi.
// Referensi visual: cariin-web/settings.html.

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';
import type { ProfileStackParamList } from '@/navigation/types';
import { supabase } from '@/services/supabase';
import { COLORS } from '@/utils/constants';

export default function SettingsScreen() {
  const { userProfile, refreshProfile } = useAuth();
  const nav = useNavigation<StackNavigationProp<ProfileStackParamList, 'Settings'>>();

  const [name, setName] = useState(userProfile?.name ?? '');
  const [password, setPassword] = useState('');
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Nama tidak boleh kosong');
      return;
    }

    setSaving(true);
    try {
      // 1) Update profile name
      const { error: profileErr } = await supabase
        .from('profiles')
        .update({ name: trimmed, updated_at: new Date().toISOString() })
        .eq('id', userProfile!.id);
      if (profileErr) throw new Error(profileErr.message);

      // 2) Update password kalau diisi
      if (password.length > 0) {
        if (password.length < 6) {
          Alert.alert('Kata sandi minimal 6 karakter');
          setSaving(false);
          return;
        }
        const { error: pwErr } = await supabase.auth.updateUser({ password });
        if (pwErr) throw new Error(pwErr.message);
      }

      // 3) Refresh context profile
      await refreshProfile();

      Alert.alert('Berhasil', 'Perubahan tersimpan.', [
        { text: 'OK', onPress: () => nav.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Gagal menyimpan', e instanceof Error ? e.message : 'Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View
        style={{
          height: 56,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.surface,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <Pressable
          onPress={() => nav.goBack()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F4F4F5',
            borderRadius: 999,
          }}
        >
          {({ pressed }) => (
            <Feather
              name="arrow-left"
              size={20}
              color={pressed ? COLORS.textMuted : COLORS.primary}
            />
          )}
        </Pressable>
        <Text
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 17,
            fontWeight: '700',
            color: COLORS.primary,
            pointerEvents: 'none',
          }}
        >
          Pengaturan Akun
        </Text>
      </View>

      {/* Form */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Nama */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.primary }}>
              Nama Lengkap
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nama lengkap"
              placeholderTextColor={COLORS.textMuted}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 16,
                fontSize: 14,
                color: COLORS.primary,
              }}
            />
          </View>

          {/* Email (read-only) */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.primary }}>
              Email
            </Text>
            <TextInput
              value={userProfile?.email ?? ''}
              editable={false}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: '#F4F4F5',
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 16,
                fontSize: 14,
                color: COLORS.textMuted,
              }}
            />
          </View>

          {/* Password */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.primary }}>
              Kata Sandi Baru
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Kosongkan jika tidak ingin diubah"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              style={{
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 16,
                fontSize: 14,
                color: COLORS.primary,
              }}
            />
          </View>

          {/* Notifikasi section header */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: COLORS.primary,
              paddingTop: 8,
              paddingBottom: 4,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            Notifikasi
          </Text>

          {/* Push notification toggle */}
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
              padding: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.primary }}>
                Push Notifications
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
                Pemberitahuan pesan & status
              </Text>
            </View>
            <Switch
              value={notifEnabled}
              onValueChange={setNotifEnabled}
              trackColor={{ false: '#D4D4D8', true: '#22C55E' }}
              thumbColor={COLORS.surface}
            />
          </View>

          {/* Save button */}
          <View style={{ paddingTop: 24 }}>
            <Pressable
              onPress={onSave}
              disabled={saving}
              accessibilityRole="button"
              accessibilityLabel="Simpan Perubahan"
              style={{
                backgroundColor: COLORS.primary,
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: saving ? 0.6 : 1,
                shadowColor: '#000',
                shadowOpacity: 0.12,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                elevation: 4,
              }}
            >
              {saving ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text
                  style={{ fontSize: 15, fontWeight: '700', color: COLORS.surface }}
                >
                  Simpan Perubahan
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
