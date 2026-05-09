// Form create laporan — dipakai oleh route CreateLost & CreateFound.
// Type di-derive dari route name. Field custody_point hanya muncul untuk Found.
// Referensi visual: cariin-web/create.html + create-found.html.

import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import {
  ActivityIndicator,
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

import { useAuth } from '@/context/AuthContext';
import type { CreateModalParamList, RootStackParamList } from '@/navigation/types';
import { createReport } from '@/services/report.service';
import {
  pickImageFromLibrary,
  takePhoto,
  uploadReportPhoto,
  type PickImageResult,
} from '@/services/upload.service';
import { useFeedStore } from '@/store/feedStore';
import { CATEGORIES, COLORS, type CategoryId, type ReportType } from '@/utils/constants';

type Nav = StackNavigationProp<CreateModalParamList, 'CreateLost' | 'CreateFound'>;
type RouteP = RouteProp<CreateModalParamList, 'CreateLost' | 'CreateFound'>;

export default function CreateReportScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteP>();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const refreshFeed = useFeedStore((s) => s.fetch);

  const type: ReportType = route.name === 'CreateLost' ? 'lost' : 'found';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [location, setLocation] = useState('');
  const [custodyPoint, setCustodyPoint] = useState('');
  const [photo, setPhoto] = useState<PickImageResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const switchType = (target: ReportType) => {
    if (target === type) return;
    nav.replace(target === 'lost' ? 'CreateLost' : 'CreateFound');
  };

  // Tombol back di header: harus dismiss modal (CreateModal di RootStack).
  // CreateLost adalah first screen di stack lokal, jadi nav.goBack() di sini
  // no-op. Pakai parent navigator (RootStack) goBack untuk pop CreateModal.
  const closeModal = () => {
    const root = nav.getParent<StackNavigationProp<RootStackParamList>>();
    if (root && root.canGoBack()) {
      root.goBack();
    } else if (root) {
      // Fallback: navigate eksplisit ke MainTabs.
      root.navigate('MainTabs', { screen: 'HomeTab', params: { screen: 'HomeFeed' } });
    }
  };

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

  const onSubmit = async () => {
    if (!title.trim()) return Alert.alert('Validasi', 'Nama barang wajib diisi.');
    if (!category) return Alert.alert('Validasi', 'Pilih kategori barang.');
    if (!location.trim()) return Alert.alert('Validasi', 'Lokasi wajib diisi.');
    if (type === 'found' && !custodyPoint.trim()) {
      return Alert.alert('Validasi', 'Titik penitipan wajib diisi untuk barang temuan.');
    }
    if (!photo) return Alert.alert('Validasi', 'Foto barang wajib diunggah.');
    if (!user) return Alert.alert('Error', 'Sesi tidak valid. Silakan login ulang.');

    setSubmitting(true);
    try {
      const photoUrl = await uploadReportPhoto(photo, user.id);
      const report = await createReport({
        type,
        title: title.trim(),
        description: description.trim() || null,
        category,
        location: location.trim(),
        custody_point: type === 'found' ? custodyPoint.trim() : null,
        photo_url: photoUrl,
      });
      void refreshFeed();
      nav.replace('Success', { reportId: report.id, type });
    } catch (e) {
      Alert.alert(
        'Gagal mengirim laporan',
        e instanceof Error ? e.message : 'Coba lagi sebentar.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: COLORS.surface }}>
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
          <Pressable onPress={closeModal} accessibilityRole="button">
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
                <Feather name="arrow-left" size={18} color={COLORS.primary} />
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
              color: COLORS.primary,
            }}
          >
            Buat Laporan
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
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#E4E4E7',
              padding: 4,
              borderRadius: 16,
              marginBottom: 24,
            }}
          >
            {(['lost', 'found'] as ReportType[]).map((t) => {
              const active = type === t;
              const label = t === 'lost' ? 'Kehilangan' : 'Menemukan';
              return (
                <Pressable
                  key={t}
                  onPress={() => switchType(t)}
                  style={{
                    flex: 1,
                    paddingVertical: 11,
                    borderRadius: 12,
                    backgroundColor: active ? COLORS.surface : 'transparent',
                    alignItems: 'center',
                    shadowColor: active ? '#000' : 'transparent',
                    shadowOpacity: active ? 0.06 : 0,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 1 },
                    elevation: active ? 1 : 0,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '700',
                      color: active ? COLORS.primary : COLORS.textMuted,
                    }}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Photo upload — pakai pola Pressable children-as-function (style
              function-form sering bermasalah di RN versi ini, lihat CLAUDE.md). */}
          <FieldLabel required>Foto Barang</FieldLabel>
          <Pressable onPress={onPickPhoto} accessibilityRole="button">
            {({ pressed }) =>
              photo ? (
                <View
                  style={{
                    height: 200,
                    borderRadius: 24,
                    overflow: 'hidden',
                    backgroundColor: '#F4F4F5',
                    opacity: pressed ? 0.85 : 1,
                    marginBottom: 24,
                  }}
                >
                  <Image
                    source={{ uri: photo.uri }}
                    style={{ width: '100%', height: 200 }}
                    resizeMode="cover"
                  />
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      backgroundColor: 'rgba(0,0,0,0.65)',
                      paddingHorizontal: 12,
                      paddingVertical: 7,
                      borderRadius: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Feather name="edit-2" size={12} color="#FFFFFF" />
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      Ganti Foto
                    </Text>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    height: 180,
                    borderRadius: 24,
                    backgroundColor: COLORS.surface,
                    borderWidth: 2,
                    borderStyle: 'dashed',
                    borderColor: COLORS.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed ? 0.85 : 1,
                    marginBottom: 24,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 999,
                      backgroundColor: '#F4F4F5',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <Feather name="image" size={22} color={COLORS.textMuted} />
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.textMuted }}>
                    Ketuk untuk tambah foto
                  </Text>
                </View>
              )
            }
          </Pressable>

          {/* Nama Barang */}
          <FieldLabel required>Nama Barang</FieldLabel>
          <Input
            value={title}
            onChangeText={setTitle}
            placeholder="Cth: Dompet hitam, Kunci motor"
          />

          {/* Kategori */}
          <FieldLabel required>Kategori</FieldLabel>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 20,
            }}
          >
            {CATEGORIES.map((c) => {
              const active = category === c.id;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setCategory(c.id)}
                  style={({ pressed }) => ({
                    width: '23.5%', // 4 cols dgn gap 8
                    aspectRatio: 1,
                    borderRadius: 16,
                    backgroundColor: active ? COLORS.primary : COLORS.surface,
                    borderWidth: 1,
                    borderColor: active ? COLORS.primary : COLORS.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Text style={{ fontSize: 22 }}>{c.emoji}</Text>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: active ? '#FFFFFF' : COLORS.primary,
                      textAlign: 'center',
                    }}
                  >
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Lokasi */}
          <FieldLabel required>Lokasi</FieldLabel>
          <Input
            value={location}
            onChangeText={setLocation}
            placeholder={
              type === 'lost' ? 'Tempat terakhir terlihat...' : 'Tempat ditemukan...'
            }
            leftIcon="map-pin"
          />

          {/* Custody point — Found only */}
          {type === 'found' ? (
            <>
              <FieldLabel required>Titik Penitipan</FieldLabel>
              <Input
                value={custodyPoint}
                onChangeText={setCustodyPoint}
                placeholder="Cth: Resepsionis FT, Pos satpam pusat..."
                leftIcon="archive"
              />
            </>
          ) : null}

          {/* Deskripsi */}
          <FieldLabel>Deskripsi Detail</FieldLabel>
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder={
              type === 'lost'
                ? 'Ciri-ciri khusus, isi dompet, warna, dll...'
                : 'Kondisi barang, ciri khas, kapan ditemukan...'
            }
            multiline
            numberOfLines={4}
          />
        </ScrollView>

        {/* Bottom submit bar — pakai plain View + manual safe-area inset agar
            posisinya stabil di dalam KeyboardAvoidingView (nested SafeAreaView
            sering konflik bikin tombol hilang). */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 12 + insets.bottom,
            backgroundColor: COLORS.surface,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
          }}
        >
          <Pressable onPress={onSubmit} disabled={submitting} accessibilityRole="button">
            {({ pressed }) => (
              <View
                style={{
                  paddingVertical: 16,
                  backgroundColor: COLORS.primary,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: submitting ? 0.6 : pressed ? 0.85 : 1,
                  shadowColor: COLORS.primary,
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 4,
                }}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>
                    Kirim Laporan
                  </Text>
                )}
              </View>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function FieldLabel({
  children,
  required,
}: {
  children: string;
  required?: boolean;
}) {
  return (
    <Text
      style={{
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 8,
      }}
    >
      {children} {required ? <Text style={{ color: COLORS.lost }}>*</Text> : null}
    </Text>
  );
}

function Input({
  leftIcon,
  multiline,
  ...props
}: React.ComponentProps<typeof TextInput> & {
  leftIcon?: keyof typeof Feather.glyphMap;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: multiline ? 'flex-start' : 'center',
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: multiline ? 14 : 12,
        marginBottom: 20,
        gap: 10,
        minHeight: multiline ? 100 : 48,
      }}
    >
      {leftIcon ? (
        <Feather
          name={leftIcon}
          size={16}
          color={COLORS.textMuted}
          style={multiline ? { marginTop: 2 } : undefined}
        />
      ) : null}
      <TextInput
        {...props}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        placeholderTextColor={COLORS.textMuted}
        style={{
          flex: 1,
          fontSize: 14,
          color: COLORS.primary,
          paddingVertical: 0,
          minHeight: multiline ? 80 : undefined,
        }}
      />
    </View>
  );
}
