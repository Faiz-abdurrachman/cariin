// EditPost — form pre-filled dari report yg ada. Hanya edit text fields
// (title, location, custody_point, description). Foto/kategori/type tidak
// diubah di MVP — kalau perlu ganti foto, hapus laporan dan buat baru.
// Referensi visual: cariin-web/edit-post.html.

import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
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

import type { MyPostsStackParamList } from '@/navigation/types';
import {
  getReportById,
  updateReport,
  type Report,
} from '@/services/report.service';
import { useFeedStore } from '@/store/feedStore';
import { COLORS } from '@/utils/constants';

type Nav = StackNavigationProp<MyPostsStackParamList, 'EditPost'>;
type RouteP = RouteProp<MyPostsStackParamList, 'EditPost'>;

export default function EditPostScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteP>();
  const insets = useSafeAreaInsets();
  const refreshFeed = useFeedStore((s) => s.fetch);
  const reportId = route.params.reportId;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [custodyPoint, setCustodyPoint] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getReportById(reportId);
        if (!mounted) return;
        setReport(data);
        setTitle(data.title);
        setLocation(data.location);
        setCustodyPoint(data.custody_point ?? '');
        setDescription(data.description ?? '');
      } catch (e) {
        Alert.alert(
          'Gagal memuat',
          e instanceof Error ? e.message : 'Coba lagi.',
          [{ text: 'OK', onPress: () => nav.goBack() }],
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [reportId, nav]);

  const onSubmit = async () => {
    if (!report) return;
    if (!title.trim()) return Alert.alert('Validasi', 'Nama barang wajib diisi.');
    if (!location.trim()) return Alert.alert('Validasi', 'Lokasi wajib diisi.');
    if (report.type === 'found' && !custodyPoint.trim()) {
      return Alert.alert('Validasi', 'Titik penitipan wajib diisi.');
    }

    setSubmitting(true);
    try {
      await updateReport(report.id, {
        title: title.trim(),
        location: location.trim(),
        custody_point: report.type === 'found' ? custodyPoint.trim() : null,
        description: description.trim() || null,
      });
      void refreshFeed();
      Alert.alert('Berhasil', 'Laporan diperbarui.', [
        { text: 'OK', onPress: () => nav.goBack() },
      ]);
    } catch (e) {
      Alert.alert(
        'Gagal menyimpan',
        e instanceof Error ? e.message : 'Coba lagi sebentar.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.surface,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Background Blobs for Glass Refraction */}
      <View style={{ position: 'absolute', top: -100, right: -50, width: 300, height: 300, borderRadius: 999, backgroundColor: COLORS.primary, opacity: 0.16, transform: [{ scale: 1.45 }] }} pointerEvents="none" />
      <View style={{ position: 'absolute', bottom: -50, left: -100, width: 350, height: 350, borderRadius: 999, backgroundColor: COLORS.found, opacity: 0.12, transform: [{ scale: 1.15 }] }} pointerEvents="none" />

      <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
        <View
          style={{
            height: 60,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.38)',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.72)',
            borderRadius: 24,
            marginHorizontal: 16,
            marginTop: 2,
            overflow: 'hidden',
          }}
        >
          <LinearGradient colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.18)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
          <Pressable onPress={() => nav.goBack()} accessibilityRole="button">
            {({ pressed }) => (
              <BlurView
                intensity={40}
                tint="light"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 14,
                  backgroundColor: 'rgba(255,255,255,0.58)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.82)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.7 : 1,
                }}
              >
                <Feather name="arrow-left" size={18} color={COLORS.primary} />
              </BlurView>
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
            Edit Laporan
          </Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Foto preview (read-only di MVP) */}
          <FieldLabel>Foto Barang</FieldLabel>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <BlurView
              intensity={40}
              tint="light"
              style={{
                width: 80,
                height: 80,
                borderRadius: 16,
                backgroundColor: 'rgba(255,255,255,0.5)',
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.78)',
              }}
            >
              {report.photo_url ? (
                <Image
                  source={{ uri: report.photo_url }}
                  style={{ width: 80, height: 80 }}
                  resizeMode="cover"
                />
              ) : (
                <Feather name="image" size={24} color={COLORS.textMuted} />
              )}
            </BlurView>
            <Text style={{ fontSize: 12, color: COLORS.textMuted, flex: 1 }}>
              Foto tidak bisa diubah di sini. Hapus laporan dan buat ulang kalau
              perlu ganti foto.
            </Text>
          </View>

          <FieldLabel required>Nama Barang</FieldLabel>
          <Input
            value={title}
            onChangeText={setTitle}
            placeholder="Cth: Dompet hitam"
          />

          <FieldLabel required>Lokasi</FieldLabel>
          <Input
            value={location}
            onChangeText={setLocation}
            placeholder="Tempat..."
            leftIcon="map-pin"
          />

          {report.type === 'found' ? (
            <>
              <FieldLabel required>Titik Penitipan</FieldLabel>
              <Input
                value={custodyPoint}
                onChangeText={setCustodyPoint}
                placeholder="Cth: Resepsionis FT..."
                leftIcon="archive"
              />
            </>
          ) : null}

          <FieldLabel>Deskripsi Detail</FieldLabel>
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder="Ciri-ciri khusus..."
            multiline
          />
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 12 + insets.bottom,
            backgroundColor: 'transparent',
          }}
        >
          <Pressable onPress={onSubmit} disabled={submitting} accessibilityRole="button">
            {({ pressed }) => (
              <BlurView
                intensity={80}
                tint="light"
                style={{
                  paddingVertical: 16,
                  backgroundColor: submitting ? 'rgba(37, 99, 235, 0.55)' : 'rgba(37, 99, 235, 0.92)',
                  borderRadius: 24,
                  borderWidth: 1.5,
                  borderColor: 'rgba(255,255,255,0.62)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.85 : 1,
                  shadowColor: COLORS.primary,
                  shadowOpacity: 0.22,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 5,
                  overflow: 'hidden',
                }}
              >
                <LinearGradient colors={['rgba(255,255,255,0.34)', 'rgba(255,255,255,0.08)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800' }}>
                    Simpan Perubahan
                  </Text>
                )}
              </BlurView>
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
    <BlurView
      intensity={60}
      tint="light"
      style={{
        flexDirection: 'row',
        alignItems: multiline ? 'flex-start' : 'center',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: multiline ? 16 : 14,
        marginBottom: 20,
        gap: 12,
        minHeight: multiline ? 120 : 54,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.42)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.76)',
      }}
    >
      <LinearGradient colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.18)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
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
