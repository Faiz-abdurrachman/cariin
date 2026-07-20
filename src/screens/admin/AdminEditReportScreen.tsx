// Admin edit report — mengubah data laporan mahasiswa maupun walk-in.
// Identitas manual hanya ditampilkan untuk laporan created_by_admin.

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import type { AdminDashboardStackParamList } from '@/navigation/types';
import { getCurrentUserId } from '@/services/auth.service';
import {
  getReportById,
  updateAdminReport,
  type Report,
} from '@/services/report.service';
import {
  pickImageFromLibrary,
  takePhoto,
  uploadReportPhoto,
  type PickImageResult,
} from '@/services/upload.service';
import {
  CATEGORIES,
  COLORS,
  type CategoryId,
  type ReportType,
} from '@/utils/constants';

type Nav = StackNavigationProp<AdminDashboardStackParamList, 'AdminEditReport'>;
type RouteP = RouteProp<AdminDashboardStackParamList, 'AdminEditReport'>;
type MciName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export default function AdminEditReportScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteP>();
  const insets = useSafeAreaInsets();
  const reportId = route.params.reportId;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<ReportType>('lost');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [location, setLocation] = useState('');
  const [custodyPoint, setCustodyPoint] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterNim, setReporterNim] = useState('');
  const [reporterFaculty, setReporterFaculty] = useState('');
  const [newPhoto, setNewPhoto] = useState<PickImageResult | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await getReportById(reportId);
        if (!mounted) return;
        setReport(data);
        setType(data.type);
        setTitle(data.title);
        setDescription(data.description ?? '');
        setCategory(data.category);
        setLocation(data.location);
        setCustodyPoint(data.custody_point ?? '');
        setReporterName(data.reporter_name ?? '');
        setReporterNim(data.reporter_nim ?? '');
        setReporterFaculty(data.reporter_faculty ?? '');
      } catch (error) {
        Alert.alert(
          'Gagal memuat',
          error instanceof Error ? error.message : 'Laporan tidak ditemukan.',
          [{ text: 'OK', onPress: () => nav.goBack() }],
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [nav, reportId]);

  const onPickPhoto = () => {
    Alert.alert('Ganti Foto', 'Pilih sumber foto baru:', [
      {
        text: 'Kamera',
        onPress: async () => {
          try {
            const result = await takePhoto();
            if (result) setNewPhoto(result);
          } catch (error) {
            Alert.alert(
              'Gagal mengambil foto',
              error instanceof Error ? error.message : 'Coba lagi.',
            );
          }
        },
      },
      {
        text: 'Galeri',
        onPress: async () => {
          try {
            const result = await pickImageFromLibrary();
            if (result) setNewPhoto(result);
          } catch (error) {
            Alert.alert(
              'Gagal memilih foto',
              error instanceof Error ? error.message : 'Coba lagi.',
            );
          }
        },
      },
      { text: 'Batal', style: 'cancel' },
    ]);
  };

  const onSubmit = async () => {
    if (!report) return;
    if (!title.trim()) {
      Alert.alert('Validasi', 'Nama barang wajib diisi.');
      return;
    }
    if (!category) {
      Alert.alert('Validasi', 'Kategori wajib dipilih.');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Validasi', 'Lokasi wajib diisi.');
      return;
    }
    if (type === 'found' && !custodyPoint.trim()) {
      Alert.alert(
        'Validasi',
        'Titik penitipan wajib diisi untuk barang temuan.',
      );
      return;
    }

    setSubmitting(true);
    try {
      let photoUrl = report.photo_url;
      if (newPhoto) {
        const adminId = await getCurrentUserId();
        photoUrl = await uploadReportPhoto(newPhoto, adminId);
      }

      await updateAdminReport(report.id, {
        type,
        title: title.trim(),
        description: description.trim() || null,
        category,
        location: location.trim(),
        custody_point: type === 'found' ? custodyPoint.trim() : null,
        photo_url: photoUrl,
        reporter_name: report.created_by_admin
          ? reporterName.trim() || null
          : report.reporter_name,
        reporter_nim: report.created_by_admin
          ? reporterNim.trim() || null
          : report.reporter_nim,
        reporter_faculty: report.created_by_admin
          ? reporterFaculty.trim() || null
          : report.reporter_faculty,
      });

      Alert.alert('Berhasil', 'Data laporan berhasil diperbarui.', [
        { text: 'OK', onPress: () => nav.goBack() },
      ]);
    } catch (error) {
      Alert.alert(
        'Gagal menyimpan',
        error instanceof Error ? error.message : 'Coba lagi.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.admin} />
      </View>
    );
  }

  if (!report) return null;

  const previewUri = newPhoto?.uri ?? report.photo_url;

  return (
    <View style={styles.screen}>
      <View style={styles.topBlob} pointerEvents="none" />
      <View style={styles.bottomBlob} pointerEvents="none" />

      <SafeAreaView edges={['top']}>
        <BlurView intensity={55} tint="light" style={styles.header}>
          <LinearGradient
            colors={[
              'rgba(255,255,255,0.9)',
              'rgba(255,255,255,0.18)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <Pressable
            onPress={() => nav.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            {({ pressed }) => (
              <View style={[styles.headerIcon, pressed && styles.pressed]}>
                <Feather
                  name="arrow-left"
                  size={18}
                  color={COLORS.adminText}
                />
              </View>
            )}
          </Pressable>
          <View style={styles.headerTitle}>
            <Text style={styles.headerTitleText}>Edit Laporan</Text>
            <Text style={styles.headerSubtitle}>
              {report.created_by_admin ? 'Data walk-in' : 'Laporan mahasiswa'}
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
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 112 + insets.bottom,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <GlassCard>
            <Text style={styles.sectionLabel}>JENIS LAPORAN</Text>
            <View style={styles.segmentRow}>
              {(['lost', 'found'] as const).map((item) => {
                const active = item === type;
                return (
                  <Pressable
                    key={item}
                    onPress={() => setType(item)}
                    style={{ flex: 1 }}
                    accessibilityRole="button"
                  >
                    {({ pressed }) => (
                      <View
                        style={[
                          styles.segment,
                          active && styles.segmentActive,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.segmentText,
                            active && styles.segmentTextActive,
                          ]}
                        >
                          {item === 'lost' ? 'Kehilangan' : 'Menemukan'}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </GlassCard>

          <FieldLabel>Foto Barang</FieldLabel>
          <Pressable onPress={onPickPhoto} accessibilityRole="button">
            {({ pressed }) => (
              <BlurView
                intensity={45}
                tint="light"
                style={[styles.photoCard, pressed && styles.pressed]}
              >
                {previewUri ? (
                  <Image
                    source={{ uri: previewUri }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.photoEmpty}>
                    <Feather
                      name="image"
                      size={28}
                      color={COLORS.textMuted}
                    />
                    <Text style={styles.photoEmptyText}>Belum ada foto</Text>
                  </View>
                )}
                <View style={styles.photoAction}>
                  <Feather name="camera" size={13} color="#FFFFFF" />
                  <Text style={styles.photoActionText}>
                    {previewUri ? 'Ganti Foto' : 'Tambah Foto'}
                  </Text>
                </View>
              </BlurView>
            )}
          </Pressable>

          <FieldLabel required>Nama Barang</FieldLabel>
          <Input
            value={title}
            onChangeText={setTitle}
            placeholder="Nama barang"
          />

          <FieldLabel required>Kategori</FieldLabel>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((item) => {
              const active = item.id === category;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setCategory(item.id)}
                  style={styles.categorySlot}
                  accessibilityRole="button"
                >
                  {({ pressed }) => (
                    <BlurView
                      intensity={active ? 20 : 45}
                      tint="light"
                      style={[
                        styles.categoryCard,
                        active && styles.categoryCardActive,
                        pressed && styles.pressed,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={item.icon as MciName}
                        size={20}
                        color={active ? '#FFFFFF' : COLORS.adminText}
                      />
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.categoryText,
                          active && styles.categoryTextActive,
                        ]}
                      >
                        {item.label}
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
            placeholder="Lokasi kehilangan atau penemuan"
            leftIcon="map-pin"
          />

          {type === 'found' ? (
            <>
              <FieldLabel required>Titik Penitipan</FieldLabel>
              <Input
                value={custodyPoint}
                onChangeText={setCustodyPoint}
                placeholder="Tempat barang dititipkan"
                leftIcon="archive"
              />
            </>
          ) : null}

          <FieldLabel>Deskripsi</FieldLabel>
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder="Ciri-ciri dan informasi tambahan"
            multiline
          />

          {report.created_by_admin ? (
            <GlassCard>
              <Text style={styles.sectionTitle}>Data Pelapor Walk-In</Text>
              <Text style={styles.sectionHint}>
                Data manual ini bisa diperbarui karena pelapor tidak memakai
                akun aplikasi.
              </Text>
              <FieldLabel>Nama Pelapor</FieldLabel>
              <Input
                value={reporterName}
                onChangeText={setReporterName}
                placeholder="Nama pelapor"
                leftIcon="user"
              />
              <FieldLabel>NIM</FieldLabel>
              <Input
                value={reporterNim}
                onChangeText={setReporterNim}
                placeholder="NIM pelapor"
                keyboardType="number-pad"
              />
              <FieldLabel>Fakultas</FieldLabel>
              <Input
                value={reporterFaculty}
                onChangeText={setReporterFaculty}
                placeholder="Fakultas pelapor"
                leftIcon="book-open"
              />
            </GlassCard>
          ) : (
            <GlassCard>
              <View style={styles.infoRow}>
                <Feather name="shield" size={18} color={COLORS.admin} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoTitle}>Identitas dari akun</Text>
                  <Text style={styles.infoText}>
                    Nama, NIM, dan fakultas mahasiswa dikelola dari profil,
                    bukan dari data laporan.
                  </Text>
                </View>
              </View>
            </GlassCard>
          )}
        </ScrollView>

        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(12, insets.bottom) },
          ]}
        >
          <Pressable
            onPress={() => void onSubmit()}
            disabled={submitting}
            accessibilityRole="button"
          >
            {({ pressed }) => (
              <View
                style={[
                  styles.saveButton,
                  (pressed || submitting) && styles.pressed,
                ]}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Feather name="save" size={17} color="#FFFFFF" />
                    <Text style={styles.saveText}>Simpan Perubahan</Text>
                  </>
                )}
              </View>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <BlurView intensity={50} tint="light" style={styles.glassCard}>
      <LinearGradient
        colors={[
          'rgba(255,255,255,0.9)',
          'rgba(255,255,255,0.18)',
          'transparent',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
      {children}
    </BlurView>
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
    <Text style={styles.fieldLabel}>
      {children}
      {required ? <Text style={{ color: COLORS.lost }}> *</Text> : null}
    </Text>
  );
}

function Input({
  leftIcon,
  multiline,
  ...props
}: ComponentProps<typeof TextInput> & {
  leftIcon?: keyof typeof Feather.glyphMap;
}) {
  return (
    <BlurView
      intensity={55}
      tint="light"
      style={[styles.inputShell, multiline && styles.inputShellMultiline]}
    >
      <LinearGradient
        colors={[
          'rgba(255,255,255,0.86)',
          'rgba(255,255,255,0.16)',
          'transparent',
        ]}
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
        style={[styles.input, multiline && styles.inputMultiline]}
      />
    </BlurView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.adminLight,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.adminLight,
  },
  topBlob: {
    position: 'absolute',
    top: -90,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 999,
    backgroundColor: COLORS.admin,
    opacity: 0.12,
  },
  bottomBlob: {
    position: 'absolute',
    bottom: 80,
    left: -110,
    width: 300,
    height: 300,
    borderRadius: 999,
    backgroundColor: COLORS.found,
    opacity: 0.09,
  },
  header: {
    height: 60,
    marginHorizontal: 16,
    marginTop: 2,
    paddingHorizontal: 12,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.42)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.76)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.58)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.82)',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerTitleText: {
    color: COLORS.adminText,
    fontSize: 16,
    fontWeight: '900',
  },
  headerSubtitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  glassCard: {
    padding: 16,
    marginBottom: 18,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.42)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.76)',
  },
  sectionLabel: {
    color: COLORS.adminText,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segment: {
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.56)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.82)',
  },
  segmentActive: {
    backgroundColor: COLORS.admin,
    borderColor: COLORS.admin,
  },
  segmentText: {
    color: COLORS.adminText,
    fontSize: 13,
    fontWeight: '800',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  fieldLabel: {
    color: COLORS.adminText,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  photoCard: {
    height: 190,
    borderRadius: 26,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.44)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.78)',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoEmptyText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  photoAction: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(19,78,74,0.78)',
  },
  photoActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: 16,
  },
  categorySlot: {
    width: '25%',
    padding: 4,
  },
  categoryCard: {
    aspectRatio: 1,
    padding: 6,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  categoryCardActive: {
    backgroundColor: COLORS.admin,
    borderColor: COLORS.admin,
  },
  categoryText: {
    color: COLORS.adminText,
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  inputShell: {
    minHeight: 54,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 18,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.44)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.76)',
  },
  inputShellMultiline: {
    minHeight: 116,
    alignItems: 'flex-start',
    paddingTop: 15,
  },
  input: {
    flex: 1,
    color: COLORS.adminText,
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 0,
  },
  inputMultiline: {
    minHeight: 84,
  },
  sectionTitle: {
    color: COLORS.adminText,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 4,
  },
  sectionHint: {
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoTitle: {
    color: COLORS.adminText,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 3,
  },
  infoText: {
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 17,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: 'rgba(240,253,250,0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.86)',
  },
  saveButton: {
    minHeight: 54,
    borderRadius: 20,
    backgroundColor: COLORS.admin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.admin,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.76,
  },
});
