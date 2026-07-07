// AdminCreateFoundScreen — form laporan walk-in penemuan barang oleh admin.

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import type { ComponentProps } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import type { AdminCreateStackParamList } from '@/navigation/types';
import { createAdminReport } from '@/services/report.service';
import { supabase } from '@/services/supabase';
import {
  pickImageFromLibrary,
  takePhoto,
  uploadReportPhoto,
  type PickImageResult,
} from '@/services/upload.service';
import { CATEGORIES, COLORS, type CategoryId } from '@/utils/constants';

type Nav = StackNavigationProp<AdminCreateStackParamList, 'AdminCreateFound'>;

export default function AdminCreateFoundScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [location, setLocation] = useState('');
  const [custodyPoint, setCustodyPoint] = useState('');
  const [photo, setPhoto] = useState<PickImageResult | null>(null);
  const [reporterName, setReporterName] = useState('');
  const [reporterNim, setReporterNim] = useState('');
  const [reporterFaculty, setReporterFaculty] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onPickPhoto = () => {
    Alert.alert('Tambah Foto', 'Pilih sumber foto:', [
      {
        text: 'Kamera',
        onPress: async () => {
          try {
            const res = await takePhoto();
            if (res) setPhoto(res);
          } catch (e) {
            Alert.alert('Error', e instanceof Error ? e.message : 'Gagal ambil foto.');
          }
        },
      },
      {
        text: 'Galeri',
        onPress: async () => {
          try {
            const res = await pickImageFromLibrary();
            if (res) setPhoto(res);
          } catch (e) {
            Alert.alert('Error', e instanceof Error ? e.message : 'Gagal pilih foto.');
          }
        },
      },
      { text: 'Batal', style: 'cancel' },
    ]);
  };

  const switchToLost = () => {
    nav.replace('AdminCreateLost');
  };

  const goBack = () => {
    if (nav.canGoBack()) {
      nav.goBack();
    }
  };

  const onSubmit = async () => {
    if (!title.trim()) return Alert.alert('Validasi', 'Nama barang wajib diisi.');
    if (!category) return Alert.alert('Validasi', 'Pilih kategori barang.');
    if (!location.trim()) return Alert.alert('Validasi', 'Lokasi wajib diisi.');
    if (!custodyPoint.trim()) return Alert.alert('Validasi', 'Titik penitipan wajib diisi untuk barang temuan.');

    setSubmitting(true);
    try {
      let photoUrl: string | null = null;
      if (photo) {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData.user?.id;
        if (userId) photoUrl = await uploadReportPhoto(photo, userId);
      }

      await createAdminReport({
        type: 'found',
        title: title.trim(),
        description: description.trim() || null,
        category,
        location: location.trim(),
        custody_point: custodyPoint.trim(),
        photo_url: photoUrl,
        reporter_name: reporterName.trim() || null,
        reporter_nim: reporterNim.trim() || null,
        reporter_faculty: reporterFaculty.trim() || null,
      });

      Alert.alert('Berhasil', 'Laporan walk-in telah dibuat.', [
        { text: 'OK', onPress: goBack },
      ]);
    } catch (e) {
      Alert.alert('Gagal', e instanceof Error ? e.message : 'Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.adminLight }}>
      <View
        style={{
          position: 'absolute',
          top: -56,
          right: -42,
          width: 320,
          height: 320,
          borderRadius: 999,
          backgroundColor: COLORS.admin,
          opacity: 0.14,
        }}
        pointerEvents="none"
      />
      <View
        style={{
          position: 'absolute',
          bottom: 120,
          left: -96,
          width: 260,
          height: 260,
          borderRadius: 999,
          backgroundColor: COLORS.found,
          opacity: 0.12,
        }}
        pointerEvents="none"
      />

      <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
        <BlurView
          intensity={55}
          tint="light"
          style={{
            marginHorizontal: 16,
            marginTop: 2,
            height: 60,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.42)',
            borderRadius: 24,
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.76)',
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.18)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <Pressable onPress={goBack} accessibilityRole="button">
            {({ pressed }) => (
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 14,
                  backgroundColor: 'rgba(255,255,255,0.58)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.82)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.75 : 1,
                }}
              >
                <Feather name="arrow-left" size={18} color={COLORS.adminText} />
              </View>
            )}
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '900', color: COLORS.adminText }} numberOfLines={1}>
              Laporan Walk-In
            </Text>
            <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }} numberOfLines={1}>
              Penemuan
            </Text>
          </View>
          <View style={{ width: 38 }} />
        </BlurView>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 + insets.bottom }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BlurView
            intensity={50}
            tint="light"
            style={{
              borderRadius: 30,
              overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.42)',
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.76)',
              padding: 18,
              marginBottom: 16,
            }}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.18)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['lost', 'found'] as const).map((t) => {
                const active = t === 'found';
                return (
                  <Pressable
                    key={t}
                    onPress={t === 'lost' ? switchToLost : undefined}
                    style={{ flex: 1 }}
                    accessibilityRole="button"
                  >
                    {({ pressed }) => (
                      <View
                        style={{
                          paddingVertical: 11,
                          borderRadius: 16,
                          alignItems: 'center',
                          backgroundColor: active ? COLORS.admin : 'rgba(255,255,255,0.52)',
                          borderWidth: 1,
                          borderColor: active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.78)',
                          opacity: pressed ? 0.85 : 1,
                        }}
                      >
                        <Text style={{ fontSize: 13, fontWeight: '900', color: active ? '#FFFFFF' : COLORS.adminText }}>
                          {t === 'lost' ? 'Kehilangan' : 'Menemukan'}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </BlurView>

          <FieldLabel>Foto Barang (Opsional)</FieldLabel>
          <Pressable onPress={onPickPhoto} accessibilityRole="button">
            {({ pressed }) =>
              photo ? (
                <View style={{ marginBottom: 20, opacity: pressed ? 0.88 : 1 }}>
                  <BlurView
                    intensity={45}
                    tint="light"
                    style={{
                      height: 210,
                      borderRadius: 28,
                      overflow: 'hidden',
                      backgroundColor: 'rgba(255,255,255,0.42)',
                      borderWidth: 1.5,
                      borderColor: 'rgba(255,255,255,0.76)',
                    }}
                  >
                    <Image source={{ uri: photo.uri }} style={{ width: '100%', height: 210 }} resizeMode="cover" />
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                        backgroundColor: 'rgba(0,0,0,0.58)',
                        paddingHorizontal: 12,
                        paddingVertical: 7,
                        borderRadius: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Feather name="edit-2" size={12} color="#FFFFFF" />
                      <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>Ganti Foto</Text>
                    </View>
                  </BlurView>
                </View>
              ) : (
                <BlurView
                  intensity={45}
                  tint="light"
                  style={{
                    height: 140,
                    borderRadius: 28,
                    backgroundColor: 'rgba(255,255,255,0.42)',
                    borderWidth: 2,
                    borderStyle: 'dashed',
                    borderColor: 'rgba(255,255,255,0.78)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed ? 0.86 : 1,
                    marginBottom: 20,
                    overflow: 'hidden',
                  }}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.18)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                    pointerEvents="none"
                  />
                  <View style={{ width: 50, height: 50, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.62)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                    <Feather name="image" size={20} color={COLORS.adminText} />
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: '900', color: COLORS.adminText }}>Ketuk untuk tambah foto</Text>
                </BlurView>
              )
            }
          </Pressable>

          <FieldLabel required>Nama Barang</FieldLabel>
          <Input value={title} onChangeText={setTitle} placeholder="Cth: Dompet hitam, Kunci motor" />

          <FieldLabel required>Kategori</FieldLabel>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4, marginBottom: 20 }}>
            {CATEGORIES.map((c) => {
              const active = category === c.id;
              return (
                <Pressable key={c.id} onPress={() => setCategory(c.id)} style={{ width: '25%', padding: 4 }}>
                  {({ pressed }) => (
                    <View
                      style={{
                        borderRadius: 16,
                        aspectRatio: 1,
                        backgroundColor: active ? COLORS.admin : 'rgba(255,255,255,0.62)',
                        borderWidth: 1,
                        borderColor: active ? COLORS.admin : 'rgba(255,255,255,0.82)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: pressed ? 0.86 : 1,
                      }}
                    >
                      <MaterialCommunityIcons
                        name={c.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                        size={20}
                        color={active ? '#FFFFFF' : COLORS.adminText}
                        style={{ marginBottom: 4 }}
                      />
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '800',
                          color: active ? '#FFFFFF' : COLORS.adminText,
                          textAlign: 'center',
                          paddingHorizontal: 2,
                        }}
                        numberOfLines={2}
                      >
                        {c.label}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          <FieldLabel required>Lokasi</FieldLabel>
          <Input value={location} onChangeText={setLocation} placeholder="Tempat ditemukan..." leftIcon="map-pin" />

          <FieldLabel required>Titik Penitipan</FieldLabel>
          <Input value={custodyPoint} onChangeText={setCustodyPoint} placeholder="Cth: Resepsionis FT, Pos satpam pusat..." leftIcon="archive" />

          <FieldLabel>Deskripsi Detail</FieldLabel>
          <Input value={description} onChangeText={setDescription} placeholder="Kondisi barang, ciri khas, kapan ditemukan..." multiline numberOfLines={4} />

          <View style={{ marginTop: 8, marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Feather name="user" size={14} color={COLORS.admin} />
              <Text style={{ fontSize: 13, fontWeight: '900', color: COLORS.admin, letterSpacing: 0.3 }}>
                INFO PELAPOR (Opsional - walk-in)
              </Text>
            </View>
          </View>
          <FieldLabel>Nama Pelapor</FieldLabel>
          <Input value={reporterName} onChangeText={setReporterName} placeholder="Nama lengkap pelapor" leftIcon="user" />
          <FieldLabel>NIM Pelapor</FieldLabel>
          <Input value={reporterNim} onChangeText={setReporterNim} placeholder="Cth: 241111021" />
          <FieldLabel>Fakultas Pelapor</FieldLabel>
          <Input value={reporterFaculty} onChangeText={setReporterFaculty} placeholder="Cth: Teknik" />
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 12 + insets.bottom,
            backgroundColor: 'rgba(255,255,255,0.54)',
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.8)',
          }}
        >
          <Pressable onPress={onSubmit} disabled={submitting} accessibilityRole="button">
            {({ pressed }) => (
              <View
                style={{
                  paddingVertical: 16,
                  backgroundColor: COLORS.admin,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 8,
                  opacity: submitting ? 0.6 : pressed ? 0.85 : 1,
                  shadowColor: COLORS.admin,
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Feather name="check-circle" size={18} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '900' }}>
                  {submitting ? 'Mengirim...' : 'Kirim Laporan'}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function FieldLabel({ children, required }: { children: string; required?: boolean }) {
  return (
    <Text style={{ fontSize: 13, fontWeight: '900', color: COLORS.adminText, marginBottom: 8 }}>
      {children} {required ? <Text style={{ color: COLORS.lost }}>*</Text> : null}
    </Text>
  );
}

function Input({
  leftIcon,
  multiline,
  ...props
}: ComponentProps<typeof TextInput> & { leftIcon?: keyof typeof Feather.glyphMap }) {
  return (
    <BlurView
      intensity={45}
      tint="light"
      style={{
        flexDirection: 'row',
        alignItems: multiline ? 'flex-start' : 'center',
        backgroundColor: 'rgba(255,255,255,0.42)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.76)',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: multiline ? 14 : 12,
        marginBottom: 20,
        gap: 10,
        minHeight: multiline ? 104 : 50,
        overflow: 'hidden',
      }}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.18)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
      {leftIcon ? <Feather name={leftIcon} size={16} color={COLORS.textMuted} style={multiline ? { marginTop: 2 } : undefined} /> : null}
      <TextInput
        {...props}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        placeholderTextColor={COLORS.textMuted}
        style={{ flex: 1, fontSize: 14, color: COLORS.adminText, paddingVertical: 0, minHeight: multiline ? 80 : undefined, fontWeight: '600' }}
      />
    </BlurView>
  );
}
