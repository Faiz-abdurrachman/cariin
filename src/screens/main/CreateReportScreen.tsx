// Form create laporan — dipakai oleh route CreateLost & CreateFound.

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
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
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '@/context/AuthContext';
import { createReportModel } from '@/models';
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

  const [type, setType] = useState<ReportType>(
    route.name === 'CreateLost' ? 'lost' : 'found',
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [location, setLocation] = useState('');
  const [custodyPoint, setCustodyPoint] = useState('');
  const [photo, setPhoto] = useState<PickImageResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const switchType = (target: ReportType) => {
    if (target === type) return;
    setType(target);
  };

  const closeModal = () => {
    const root = nav.getParent<StackNavigationProp<RootStackParamList>>();
    if (root && root.canGoBack()) {
      root.goBack();
    } else if (root) {
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

    const reportModel = createReportModel(type, {
      title: title.trim(),
      category,
      location: location.trim(),
      description: description.trim() || null,
      custodyPoint: custodyPoint.trim(),
    });
    const domainError = reportModel.validate();
    if (domainError) return Alert.alert('Validasi', domainError);
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
      Alert.alert('Gagal mengirim laporan', e instanceof Error ? e.message : 'Coba lagi sebentar.');
    } finally {
      setSubmitting(false);
    }
  };

  const typeMeta = {
    lost: {
      title: 'Laporan Kehilangan',
      subtitle: 'Isi detail barang yang hilang agar mudah dikenali.',
      accent: COLORS.lost,
    },
    found: {
      title: 'Laporan Temuan',
      subtitle: 'Catat barang temuan dan titik penitipan dengan jelas.',
      accent: COLORS.found,
    },
  }[type];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ position: 'absolute', top: -100, left: -50, width: 300, height: 300, borderRadius: 999, backgroundColor: COLORS.primary, opacity: 0.16, transform: [{ scale: 1.45 }] }} pointerEvents="none" />
      <View style={{ position: 'absolute', top: 280, right: -100, width: 400, height: 400, borderRadius: 999, backgroundColor: COLORS.admin, opacity: 0.12, transform: [{ scale: 1.15 }] }} pointerEvents="none" />
      <View style={{ position: 'absolute', bottom: -50, left: 50, width: 300, height: 300, borderRadius: 999, backgroundColor: COLORS.found, opacity: 0.16, transform: [{ scale: 1.75 }] }} pointerEvents="none" />

      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'transparent' }}>
        <BlurView
          intensity={60}
          tint="light"
          style={{
            marginHorizontal: 16,
            marginTop: 2,
            height: 60,
            paddingHorizontal: 16,
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
          <LinearGradient colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.18)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
          <Pressable onPress={closeModal} accessibilityRole="button">
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
                  opacity: pressed ? 0.72 : 1,
                }}
              >
                <Feather name="arrow-left" size={18} color={COLORS.primary} />
              </View>
            )}
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '900', color: COLORS.primary }} numberOfLines={1}>
              Buat Laporan
            </Text>
            <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }} numberOfLines={1}>
              {typeMeta.title}
            </Text>
          </View>
          <View style={{ width: 38 }} />
        </BlurView>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 + insets.bottom }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <BlurView
              intensity={60}
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
              <LinearGradient colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.18)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} pointerEvents="none" />

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <View
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.62)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.82)',
                  }}
                >
                  <MaterialCommunityIcons
                    name={type === 'lost' ? 'bag-suitcase-outline' : 'package-variant-closed'}
                    size={28}
                    color={typeMeta.accent}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 20, fontWeight: '900', color: COLORS.primary }}>
                    {typeMeta.title}
                  </Text>
                  <Text style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 19, marginTop: 3 }}>
                    {typeMeta.subtitle}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                {(['lost', 'found'] as ReportType[]).map((t) => {
                  const active = type === t;
                  return (
                    <Pressable
                      key={t}
                      onPress={() => switchType(t)}
                      accessibilityRole="button"
                      style={{ flex: 1 }}
                    >
                      {({ pressed }) => (
                        <View
                          style={{
                            paddingVertical: 11,
                            borderRadius: 16,
                            alignItems: 'center',
                            backgroundColor: active ? typeMeta.accent : 'rgba(255,255,255,0.52)',
                            borderWidth: 1,
                            borderColor: active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.78)',
                            opacity: pressed ? 0.85 : 1,
                          }}
                        >
                          <Text style={{ fontSize: 13, fontWeight: '800', color: active ? '#FFFFFF' : COLORS.primary }}>
                            {t === 'lost' ? 'Kehilangan' : 'Menemukan'}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </BlurView>

            <FieldLabel required>Foto Barang</FieldLabel>
            <Pressable onPress={onPickPhoto} accessibilityRole="button">
              {({ pressed }) =>
                photo ? (
                  <View style={{ marginBottom: 20, opacity: pressed ? 0.88 : 1 }}>
                    <BlurView
                      intensity={50}
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
                        <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>
                          Ganti Foto
                        </Text>
                      </View>
                    </BlurView>
                  </View>
                ) : (
                  <BlurView
                    intensity={50}
                    tint="light"
                    style={{
                      height: 190,
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
                    <LinearGradient colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.18)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
                    <View
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 18,
                        backgroundColor: 'rgba(255,255,255,0.62)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 12,
                      }}
                    >
                      <Feather name="image" size={22} color={COLORS.primary} />
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: COLORS.primary }}>
                      Ketuk untuk tambah foto
                    </Text>
                    <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
                      Kamera atau galeri
                    </Text>
                  </BlurView>
                )
              }
            </Pressable>

            <FieldLabel required>Nama Barang</FieldLabel>
            <Input value={title} onChangeText={setTitle} placeholder="Cth: Dompet hitam, Kunci motor" />

            <FieldLabel required>Kategori</FieldLabel>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginHorizontal: -4,
                marginBottom: 20,
              }}
            >
              {CATEGORIES.map((c) => {
                const active = category === c.id;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setCategory(c.id)}
                    style={{ width: '25%', padding: 4 }}
                  >
                    {({ pressed }) => (
                      <BlurView
                        intensity={50}
                        tint="light"
                        style={{
                          borderRadius: 18,
                          aspectRatio: 1,
                          backgroundColor: active ? COLORS.primary : 'rgba(255,255,255,0.42)',
                          borderWidth: 1.5,
                          borderColor: active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.76)',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: pressed ? 0.88 : 1,
                          overflow: 'hidden',
                        }}
                      >
                        <LinearGradient colors={['rgba(255,255,255,0.86)', 'rgba(255,255,255,0.18)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
                        <MaterialCommunityIcons
                          name={c.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                          size={22}
                          color={active ? '#FFFFFF' : COLORS.textMuted}
                          style={{ marginBottom: 4 }}
                        />
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: '800',
                            color: active ? '#FFFFFF' : COLORS.primary,
                            textAlign: 'center',
                            paddingHorizontal: 2,
                          }}
                          numberOfLines={2}
                        >
                          {c.label}
                        </Text>
                      </BlurView>
                    )}
                  </Pressable>
                );
              })}
            </View>

            <FieldLabel required>Lokasi</FieldLabel>
            <Input
              value={location}
              onChangeText={setLocation}
              placeholder={type === 'lost' ? 'Tempat terakhir terlihat...' : 'Tempat ditemukan...'}
              leftIcon="map-pin"
            />

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

            <FieldLabel>Deskripsi Detail</FieldLabel>
            <Input
              value={description}
              onChangeText={setDescription}
              placeholder={type === 'lost' ? 'Ciri-ciri khusus, isi dompet, warna, dll...' : 'Kondisi barang, ciri khas, kapan ditemukan...'}
              multiline
              numberOfLines={4}
            />
          </ScrollView>

          <BlurView
            intensity={65}
            tint="light"
            style={{
              paddingHorizontal: 16,
              paddingTop: 14,
              paddingBottom: 12 + insets.bottom,
              backgroundColor: 'rgba(255,255,255,0.42)',
              borderTopWidth: 1.5,
              borderTopColor: 'rgba(255,255,255,0.76)',
            }}
          >
            <Pressable onPress={onSubmit} disabled={submitting} accessibilityRole="button">
              {({ pressed }) => (
                <View
                  style={{
                    borderRadius: 18,
                    opacity: submitting ? 0.7 : pressed ? 0.9 : 1,
                    shadowColor: typeMeta.accent,
                    shadowOpacity: 0.22,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: 4,
                  }}
                >
                  <BlurView
                    intensity={50}
                    tint="light"
                    style={{
                      paddingVertical: 16,
                      borderRadius: 18,
                      overflow: 'hidden',
                      backgroundColor: typeMeta.accent,
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.22)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LinearGradient colors={['rgba(255,255,255,0.36)', 'rgba(255,255,255,0.08)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
                    {submitting ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '900' }}>
                        Kirim Laporan
                      </Text>
                    )}
                  </BlurView>
                </View>
              )}
            </Pressable>
          </BlurView>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
        fontWeight: '800',
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
    <BlurView
      intensity={55}
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
        colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.18)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
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
          fontWeight: '600',
        }}
      />
    </BlurView>
  );
}
