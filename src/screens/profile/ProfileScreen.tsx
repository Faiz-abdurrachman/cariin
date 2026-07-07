// Profile screen — header dengan nama+NIM+email, lalu list menu.

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
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
          opacity: 0.15,
          transform: [{ scale: 1.35 }],
        }}
        pointerEvents="none"
      />
      <View
        style={{
          position: 'absolute',
          bottom: -50,
          left: -50,
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
          intensity={60}
          tint="light"
          style={{
            marginHorizontal: 16,
            marginTop: 2,
            marginBottom: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255,255,255,0.42)',
            borderRadius: 24,
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.76)',
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.18)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <Text style={{ fontSize: 20, fontWeight: '900', color: COLORS.primary }}>
            Profil
          </Text>
          <Feather name="user" size={18} color={COLORS.primary} />
        </BlurView>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 132 }}>
          <BlurView
            intensity={55}
            tint="light"
            style={{
              borderRadius: 30,
              overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.42)',
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.76)',
              padding: 20,
              marginBottom: 16,
            }}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.18)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />

            <View style={{ alignItems: 'center' }}>
              <Pressable onPress={onAvatarPress} accessibilityRole="button" accessibilityLabel="Ganti foto profil">
                {({ pressed }) => (
                  <View
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 32,
                      backgroundColor: '#E4E4E7',
                      borderWidth: 3,
                      borderColor: 'rgba(255,255,255,0.78)',
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
                        style={{ width: 100, height: 100 }}
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
                  fontSize: 22,
                  fontWeight: '900',
                  color: COLORS.primary,
                  marginBottom: 4,
                }}
                numberOfLines={1}
              >
                {userProfile?.name ?? 'Mahasiswa'}
              </Text>
              <Text
                style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: '600' }}
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
                    paddingVertical: 6,
                    backgroundColor: 'rgba(37,99,235,0.08)',
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: 'rgba(37,99,235,0.14)',
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.primary }}>
                    {userProfile.faculty}
                  </Text>
                </View>
              ) : null}
            </View>
          </BlurView>

          <View style={{ gap: 12 }}>
            <BlurView
              intensity={50}
              tint="light"
              style={{
                borderRadius: 28,
                overflow: 'hidden',
                backgroundColor: 'rgba(255,255,255,0.42)',
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.76)',
                padding: 6,
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
            </BlurView>

            <BlurView
              intensity={50}
              tint="light"
              style={{
                borderRadius: 28,
                overflow: 'hidden',
                backgroundColor: 'rgba(255,255,255,0.42)',
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.76)',
                padding: 6,
              }}
            >
              <MenuItem
                icon="log-out"
                title="Keluar"
                danger
                onPress={onLogout}
                hideChevron
              />
            </BlurView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
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
            borderRadius: 20,
            backgroundColor: pressed ? 'rgba(255,255,255,0.55)' : 'transparent',
            gap: 14,
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 16,
              backgroundColor: danger ? '#FEE2E2' : 'rgba(37,99,235,0.08)',
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
                fontWeight: '800',
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
  return <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.7)', marginHorizontal: 16 }} />;
}
