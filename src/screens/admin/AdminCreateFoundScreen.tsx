// AdminCreateFoundScreen — form laporan walk-in penemuan barang oleh admin.
// Mirip AdminCreateLostScreen + field custody_point wajib.
// Submit via RPC `create_admin_report` → langsung approved.

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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
      <SafeAreaView edges={['top']} style={{ backgroundColor: COLORS.surface }}>
        <View
          style={{
            height: 56,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.surface,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.adminBorder,
          }}
        >
          <Pressable onPress={goBack} accessibilityRole="button">
            {({ pressed }) => (
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  backgroundColor: '#F4F4F5',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.7 : 1,
                }}
              >
                <Feather name="arrow-left" size={18} color={COLORS.adminText} />
              </View>
            )}
          </Pressable>
          <Text
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: 16,
              fontWeight: '700',
              color: COLORS.adminText,
            }}
          >
            Laporan Walk-In • Menemukan
          </Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Type toggle */}
          <View style={{ flexDirection: 'row', backgroundColor: '#E4E4E7', padding: 4, borderRadius: 16, marginBottom: 24, gap: 4 }}>
            {(['lost', 'found'] as const).map((t) => {
              const active = t === 'found';
              const label = t === 'lost' ? 'Kehilangan' : 'Menemukan';
              return (
                <Pressable key={t} onPress={t === 'lost' ? switchToLost : undefined} style={{ flex: 1 }} accessibilityRole="button">
                  {({ pressed }) => (
                    <View
                      style={{
                        paddingVertical: 11,
                        borderRadius: 12,
                        backgroundColor: active ? COLORS.surface : 'transparent',
                        alignItems: 'center',
                        elevation: active ? 1 : 0,
                        opacity: pressed ? 0.85 : 1,
                      }}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '700', color: active ? COLORS.adminText : COLORS.textMuted }}>
                        {label}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Photo upload (opsional untuk admin) */}
          <FieldLabel>Foto Barang (Opsional)</FieldLabel>
          <Pressable onPress={onPickPhoto} accessibilityRole="button">
            {({ pressed }) =>
              photo ? (
                <View style={{ height: 200, borderRadius: 24, overflow: 'hidden', backgroundColor: '#F4F4F5', opacity: pressed ? 0.85 : 1, marginBottom: 24 }}>
                  <Image source={{ uri: photo.uri }} style={{ width: '100%', height: 200 }} resizeMode="cover" />
                  <View style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Feather name="edit-2" size={12} color="#FFFFFF" />
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>Ganti Foto</Text>
                  </View>
                </View>
              ) : (
                <View style={{ height: 140, borderRadius: 24, backgroundColor: COLORS.surface, borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.adminBorder, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.85 : 1, marginBottom: 24 }}>
                  <View style={{ width: 44, height: 44, borderRadius: 999, backgroundColor: '#F4F4F5', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                    <Feather name="image" size={20} color={COLORS.textMuted} />
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.textMuted }}>Ketuk untuk tambah foto</Text>
                </View>
              )
            }
          </Pressable>

          {/* Nama Barang */}
          <FieldLabel required>Nama Barang</FieldLabel>
          <Input value={title} onChangeText={setTitle} placeholder="Cth: Dompet hitam, Kunci motor" />

          {/* Kategori */}
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
                        backgroundColor: active ? COLORS.admin : COLORS.surface,
                        borderWidth: 1,
                        borderColor: active ? COLORS.admin : COLORS.adminBorder,
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: pressed ? 0.85 : 1,
                      }}
                    >
                      <MaterialCommunityIcons name={c.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={20} color={active ? '#FFFFFF' : COLORS.textMuted} style={{ marginBottom: 4 }} />
                      <Text style={{ fontSize: 10, fontWeight: '700', color: active ? '#FFFFFF' : COLORS.adminText, textAlign: 'center', paddingHorizontal: 2 }} numberOfLines={2}>
                        {c.label}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Lokasi */}
          <FieldLabel required>Lokasi</FieldLabel>
          <Input value={location} onChangeText={setLocation} placeholder="Tempat ditemukan..." leftIcon="map-pin" />

          {/* Custody point — Found only, wajib */}
          <FieldLabel required>Titik Penitipan</FieldLabel>
          <Input value={custodyPoint} onChangeText={setCustodyPoint} placeholder="Cth: Resepsionis FT, Pos satpam pusat..." leftIcon="archive" />

          {/* Deskripsi */}
          <FieldLabel>Deskripsi Detail</FieldLabel>
          <Input value={description} onChangeText={setDescription} placeholder="Kondisi barang, ciri khas, kapan ditemukan..." multiline numberOfLines={4} />

          {/* Reporter info (walk-in fields) */}
          <View style={{ marginTop: 8, marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Feather name="user" size={14} color={COLORS.admin} />
              <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.admin, letterSpacing: 0.3 }}>
                INFO PELAPOR (Opsional — walk-in)
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

        {/* Bottom submit bar */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 12 + insets.bottom,
            backgroundColor: COLORS.surface,
            borderTopWidth: 1,
            borderTopColor: COLORS.adminBorder,
          }}
        >
          <Pressable onPress={onSubmit} disabled={submitting} accessibilityRole="button">
            {({ pressed }) => (
              <View
                style={{
                  paddingVertical: 16,
                  backgroundColor: COLORS.admin,
                  borderRadius: 16,
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
                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>
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
    <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.adminText, marginBottom: 8 }}>
      {children} {required ? <Text style={{ color: COLORS.lost }}>*</Text> : null}
    </Text>
  );
}

function Input({
  leftIcon,
  multiline,
  ...props
}: React.ComponentProps<typeof TextInput> & { leftIcon?: keyof typeof Feather.glyphMap }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: multiline ? 'flex-start' : 'center',
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.adminBorder,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: multiline ? 14 : 12,
        marginBottom: 20,
        gap: 10,
        minHeight: multiline ? 100 : 48,
      }}
    >
      {leftIcon ? (
        <Feather name={leftIcon} size={16} color={COLORS.textMuted} style={multiline ? { marginTop: 2 } : undefined} />
      ) : null}
      <TextInput
        {...props}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        placeholderTextColor={COLORS.textMuted}
        style={{ flex: 1, fontSize: 14, color: COLORS.adminText, paddingVertical: 0, minHeight: multiline ? 80 : undefined }}
      />
    </View>
  );
}
