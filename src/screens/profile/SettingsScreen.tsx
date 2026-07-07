// Pengaturan Akun — edit nama, ganti kata sandi, toggle notifikasi.

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
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import AuthInput from '@/components/AuthInput';
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
      const { error: profileErr } = await supabase
        .from('profiles')
        .update({ name: trimmed, updated_at: new Date().toISOString() })
        .eq('id', userProfile!.id);
      if (profileErr) throw new Error(profileErr.message);

      if (password.length > 0) {
        if (password.length < 6) {
          Alert.alert('Kata sandi minimal 6 karakter');
          return;
        }

        const { error: pwErr } = await supabase.auth.updateUser({ password });
        if (pwErr) throw new Error(pwErr.message);
      }

      await refreshProfile();
      Alert.alert('Berhasil', 'Perubahan tersimpan.', [{ text: 'OK', onPress: () => nav.goBack() }]);
    } catch (e) {
      Alert.alert('Gagal menyimpan', e instanceof Error ? e.message : 'Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View
        style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 350,
          height: 350,
          borderRadius: 999,
          backgroundColor: COLORS.primary,
          opacity: 0.18,
          transform: [{ scale: 1.5 }],
        }}
        pointerEvents="none"
      />
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          left: -70,
          width: 300,
          height: 300,
          borderRadius: 999,
          backgroundColor: COLORS.found,
          opacity: 0.14,
          transform: [{ scale: 1.2 }],
        }}
        pointerEvents="none"
      />

      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'transparent' }}>
        <BlurView
          intensity={70}
          tint="light"
          style={{
            height: 60,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.38)',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.72)',
          }}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.8)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />

          <Pressable
            onPress={() => nav.goBack()}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            {({ pressed }) => (
              <View
                style={{
                  width: 40,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255,255,255,0.55)',
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.8)',
                  opacity: pressed ? 0.72 : 1,
                }}
              >
                <Feather
                  name="arrow-left"
                  size={20}
                  color={pressed ? COLORS.textMuted : COLORS.primary}
                />
              </View>
            )}
          </Pressable>

          <View style={{ position: 'absolute', left: 0, right: 0, alignItems: 'center', pointerEvents: 'none' }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.primary }}>
              Pengaturan Akun
            </Text>
          </View>
        </BlurView>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.primary }}>
                Edit identitas akun
              </Text>
              <Text style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 20 }}>
                Ubah nama, perbarui kata sandi, dan atur preferensi notifikasi.
              </Text>
            </View>

            <BlurView
              intensity={60}
              tint="light"
              style={{
                borderRadius: 24,
                padding: 18,
                gap: 12,
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.75)',
                backgroundColor: 'rgba(255,255,255,0.38)',
                overflow: 'hidden',
              }}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.8)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
              />

              <AuthInput
                label="Nama Lengkap"
                value={name}
                onChangeText={setName}
                placeholder="Nama lengkap"
                autoCapitalize="words"
              />

              <AuthInput
                label="Email"
                value={userProfile?.email ?? ''}
                onChangeText={() => {}}
                editable={false}
              />

              <AuthInput
                label="Kata Sandi Baru"
                value={password}
                onChangeText={setPassword}
                placeholder="Kosongkan jika tidak ingin diubah"
                isPassword
              />
            </BlurView>

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

            <BlurView
              intensity={60}
              tint="light"
              style={{
                backgroundColor: 'rgba(255,255,255,0.38)',
                borderRadius: 24,
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.75)',
                padding: 16,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.8)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
              />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.primary }}>
                  Push Notifications
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
                  Pemberitahuan pesan dan status laporan.
                </Text>
              </View>
              <Switch
                value={notifEnabled}
                onValueChange={setNotifEnabled}
                trackColor={{ false: '#D4D4D8', true: '#22C55E' }}
                thumbColor={COLORS.surface}
              />
            </BlurView>

            <View style={{ paddingTop: 8 }}>
              <Pressable
                onPress={onSave}
                disabled={saving}
                accessibilityRole="button"
                accessibilityLabel="Simpan Perubahan"
                style={{
                  backgroundColor: COLORS.primary,
                  paddingVertical: 16,
                  borderRadius: 18,
                  alignItems: 'center',
                  opacity: saving ? 0.7 : 1,
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
                  <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.surface }}>
                    Simpan Perubahan
                  </Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
