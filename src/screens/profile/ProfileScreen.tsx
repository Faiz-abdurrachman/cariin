// Profile screen — header dengan nama+NIM+email, lalu list menu (Pengaturan,
// Help) + tombol Logout merah. Avatar pakai userProfile.avatar_url kalau ada,
// fallback ke icon. Referensi visual: cariin-web/profile.html.

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';
import type { ProfileStackParamList } from '@/navigation/types';
import { supabase } from '@/services/supabase';
import { pickImageFromLibrary, takePhoto, uploadAvatar } from '@/services/upload.service';
import { COLORS } from '@/utils/constants';

export default function ProfileScreen() {
  const { logout, userProfile, refreshProfile } = useAuth();
  const nav = useNavigation<StackNavigationProp<ProfileStackParamList, 'Profile'>>();
  const [avatarUploading, setAvatarUploading] = useState(false);

  const onAvatarPress = () => {
    if (avatarUploading || !userProfile) return;
    Alert.alert('Foto Profil', 'Pilih sumber gambar.', [
      {
        text: 'Ambil Foto',
        onPress: async () => {
          setAvatarUploading(true);
          const picked = await takePhoto();
          if (picked && userProfile) {
            const url = await uploadAvatar(picked, userProfile.id);
            await supabase
              .from('profiles')
              .update({ avatar_url: url })
              .eq('id', userProfile.id);
            await refreshProfile();
          }
          setAvatarUploading(false);
        },
      },
      {
        text: 'Pilih dari Galeri',
        onPress: async () => {
          setAvatarUploading(true);
          const picked = await pickImageFromLibrary();
          if (picked && userProfile) {
            const url = await uploadAvatar(picked, userProfile.id);
            await supabase
              .from('profiles')
              .update({ avatar_url: url })
              .eq('id', userProfile.id);
            await refreshProfile();
          }
          setAvatarUploading(false);
        },
      },
      { text: 'Batal', style: 'cancel' },
    ]);
  };

  const onLogout = () => {
    Alert.alert('Keluar dari Cari.In?', 'Sesi akan diakhiri.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (e) {
            Alert.alert(
              'Gagal logout',
              e instanceof Error ? e.message : 'Coba lagi sebentar.',
            );
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View
        style={{
          height: 56,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.surface,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.primary }}>
          Profil
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: 24, paddingBottom: 32 }}>
        {/* Avatar + identitas */}
        <View style={{ alignItems: 'center', paddingHorizontal: 20, marginBottom: 28 }}>
          <Pressable onPress={onAvatarPress} accessibilityRole="button" accessibilityLabel="Ganti foto profil">
            {({ pressed }) => (
              <View
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 999,
                  backgroundColor: '#E4E4E7',
                  borderWidth: 4,
                  borderColor: COLORS.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  marginBottom: 14,
                  opacity: pressed ? 0.8 : 1,
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 4,
                }}
              >
                {avatarUploading ? (
                  <ActivityIndicator color={COLORS.textMuted} />
                ) : userProfile?.avatar_url ? (
                  <Image
                    source={{ uri: userProfile.avatar_url }}
                    style={{ width: 96, height: 96 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    <Feather name="user" size={36} color={COLORS.textMuted} />
                    <Text style={{ fontSize: 9, color: COLORS.textMuted, marginTop: 4 }}>
                      Tambah Foto
                    </Text>
                  </View>
                )}
              </View>
            )}
          </Pressable>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: COLORS.primary,
              marginBottom: 4,
            }}
            numberOfLines={1}
          >
            {userProfile?.name ?? 'Mahasiswa'}
          </Text>
          <Text
            style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: '500' }}
            numberOfLines={1}
          >
            {[userProfile?.nim, userProfile?.email].filter(Boolean).join(' • ') ||
              'Profil belum lengkap'}
          </Text>
          {userProfile?.faculty ? (
            <View
              style={{
                marginTop: 10,
                paddingHorizontal: 12,
                paddingVertical: 5,
                backgroundColor: COLORS.surface,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.primary }}>
                {userProfile.faculty}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Menu items */}
        <View style={{ paddingHorizontal: 20, gap: 16 }}>
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 24,
              padding: 6,
              borderWidth: 1,
              borderColor: '#F4F4F5',
            }}
          >
            <MenuItem
              icon="settings"
              title="Pengaturan Akun"
              subtitle="Edit profil dan kata sandi"
              onPress={() => nav.navigate('Settings')}
            />
            <Divider />
            <MenuItem
              icon="help-circle"
              title="Pusat Bantuan"
              subtitle="FAQ & Kontak Dukungan"
              onPress={() => nav.navigate('Help')}
            />
            <Divider />
            <MenuItem
              icon="info"
              title="Tentang Aplikasi"
              subtitle="Cari.In v1.0 — UNU Yogyakarta"
              onPress={() =>
                Alert.alert(
                  'Cari.In',
                  'Aplikasi lost & found kampus UNU Yogyakarta.\n\nVersi 1.0.0\nDibuat untuk tugas Mobile Programming Semester 4.',
                )
              }
            />
          </View>

          <View
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 24,
              padding: 6,
              borderWidth: 1,
              borderColor: '#F4F4F5',
            }}
          >
            <MenuItem
              icon="log-out"
              title="Keluar"
              danger
              onPress={onLogout}
              hideChevron
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface MenuItemProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
  hideChevron?: boolean;
}

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
  danger,
  hideChevron,
}: MenuItemProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {({ pressed }) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            borderRadius: 16,
            backgroundColor: pressed ? '#F4F4F5' : 'transparent',
            gap: 14,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              backgroundColor: danger ? '#FEE2E2' : '#F4F4F5',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather
              name={icon}
              size={18}
              color={danger ? COLORS.lost : COLORS.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: danger ? COLORS.lost : COLORS.primary,
              }}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          {!hideChevron ? (
            <Feather name="chevron-right" size={18} color={COLORS.border} />
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: '#F4F4F5', marginHorizontal: 16 }} />;
}
