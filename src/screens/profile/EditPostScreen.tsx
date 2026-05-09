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
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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
          <Pressable onPress={() => nav.goBack()} accessibilityRole="button">
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 16,
                backgroundColor: '#F4F4F5',
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
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
            </View>
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
                    Simpan Perubahan
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
