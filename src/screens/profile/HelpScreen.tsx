// Pusat Bantuan — hero card indigo + FAQ accordion + kontak dukungan.
// Referensi visual: cariin-web/help.html.

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Alert, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ProfileStackParamList } from '@/navigation/types';
import { COLORS } from '@/utils/constants';

type Nav = StackNavigationProp<ProfileStackParamList, 'Help'>;

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ: FaqItem[] = [
  {
    question: 'Bagaimana cara klaim barang yang ditemukan?',
    answer:
      'Tekan tombol "Chat Penemu" pada halaman detail laporan untuk langsung membuka percakapan dengan penemu barang. Buktikan kepemilikan Anda lewat chat sebelum mengambil barang di titik penitipan.',
  },
  {
    question: 'Mengapa laporan saya statusnya Pending?',
    answer:
      'Semua laporan baru akan ditinjau oleh Admin kampus untuk mencegah spam. Proses ini biasanya memakan waktu maksimal 1x24 jam.',
  },
  {
    question: 'Bagaimana cara mengedit atau menghapus laporan?',
    answer:
      'Buka tab "Laporanku", pilih laporan yang ingin diubah, lalu tekan tombol Edit atau Hapus. Laporan yang sudah berstatus "Selesai" tidak dapat diubah lagi.',
  },
  {
    question: 'Apakah identitas saya aman?',
    answer:
      'Cari.In dirancang dengan prinsip privasi. Informasi kontak Anda hanya terlihat oleh pihak yang berkepentingan (penemu/pelapor) setelah laporan disetujui admin. Identitas pelapor walk-in via admin tidak ditampilkan di feed publik.',
  },
  {
    question: 'Apa yang harus dilakukan jika menemukan barang?',
    answer:
      'Segera buat laporan "Ditemukan" melalui tombol + di beranda. Isi informasi lokasi, titik penitipan, dan deskripsi selengkap mungkin. Admin akan meninjau laporan Anda sebelum ditampilkan.',
  },
];

function FaqCard({ item }: { item: FaqItem }) {
  return (
    <View
      style={{
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <Pressable
        onPress={() => {}}
        accessibilityRole="button"
        style={{
          padding: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 14,
            fontWeight: '700',
            color: COLORS.primary,
            paddingRight: 12,
          }}
        >
          {item.question}
        </Text>
        <Feather name="chevron-down" size={18} color={COLORS.textMuted} />
      </Pressable>
      <View style={{ borderTopWidth: 1, borderTopColor: '#F4F4F5', paddingHorizontal: 16, paddingVertical: 14 }}>
        <Text style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 20 }}>
          {item.answer}
        </Text>
      </View>
    </View>
  );
}

export default function HelpScreen() {
  const nav = useNavigation<Nav>();

  const openEmail = () => {
    const email = 'support@cariin.app';
    const canOpen = Linking.canOpenURL(`mailto:${email}`);
    void canOpen.then((ok) => {
      if (ok) void Linking.openURL(`mailto:${email}`);
      else Alert.alert('Tidak bisa membuka email', `Kirim email ke ${email}`);
    });
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
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
        <Pressable
          onPress={() => nav.goBack()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F4F4F5',
            borderRadius: 999,
          }}
        >
          {({ pressed }) => (
            <Feather
              name="arrow-left"
              size={20}
              color={pressed ? COLORS.textMuted : COLORS.primary}
            />
          )}
        </Pressable>
        <Text
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 17,
            fontWeight: '700',
            color: COLORS.primary,
            pointerEvents: 'none',
          }}
        >
          Pusat Bantuan
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }}
      >
        {/* Hero card */}
        <View
          style={{
            backgroundColor: COLORS.admin,
            borderRadius: 24,
            padding: 28,
            alignItems: 'center',
            shadowColor: COLORS.admin,
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            <Feather name="life-buoy" size={28} color="#FFFFFF" />
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: 6,
            }}
          >
            Butuh Bantuan?
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: '#C7D2FE',
              textAlign: 'center',
              lineHeight: 20,
            }}
          >
            Kami siap membantu masalah Anda seputar aplikasi Cari.In.
          </Text>
        </View>

        {/* FAQ section */}
        <Text
          style={{
            fontSize: 13,
            fontWeight: '700',
            color: COLORS.primary,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            marginBottom: 4,
          }}
        >
          Pertanyaan Umum (FAQ)
        </Text>
        <View style={{ gap: 12 }}>
          {FAQ.map((item, i) => (
            <FaqCard key={i} item={item} />
          ))}
        </View>

        {/* Contact button */}
        <View style={{ paddingTop: 8 }}>
          <Pressable
            onPress={openEmail}
            accessibilityRole="link"
            accessibilityLabel="Hubungi dukungan via email"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              paddingVertical: 16,
              backgroundColor: COLORS.surface,
              borderWidth: 2,
              borderColor: COLORS.border,
              borderRadius: 16,
            }}
          >
            <Feather name="mail" size={18} color={COLORS.primary} />
            <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.primary }}>
              Hubungi Dukungan
            </Text>
          </Pressable>
        </View>

        {/* Version info */}
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: COLORS.textMuted,
            paddingTop: 8,
          }}
        >
          Cari.In v1.0.0 — UNU Yogyakarta
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
