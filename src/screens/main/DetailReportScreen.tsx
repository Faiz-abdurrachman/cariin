// Detail laporan — screen yang sama dipakai oleh route DetailLost & DetailFound.
// Isi screen di-derive dari `report.type` (label tombol & warna badge berubah,
// layout sama). Referensi visual: cariin-web/detail.html + detail-dompet.html.

import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import StatusBadge from '@/components/StatusBadge';
import ViaAdminBadge from '@/components/ViaAdminBadge';
import { useAuth } from '@/context/AuthContext';
import type { HomeStackParamList } from '@/navigation/types';
import { getOrCreateConversation } from '@/services/chat.service';
import { getReportById, type Report } from '@/services/report.service';
import { COLORS } from '@/utils/constants';
import { categoryEmoji, categoryLabel, formatFullDate } from '@/utils/formatters';

type Nav = StackNavigationProp<HomeStackParamList, 'DetailLost' | 'DetailFound'>;
type RouteP = RouteProp<HomeStackParamList, 'DetailLost' | 'DetailFound'>;

export default function DetailReportScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteP>();
  const { user } = useAuth();
  const reportId = route.params.reportId;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReportById(reportId);
      setReport(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat detail.');
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    void load();
  }, [load]);

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

  if (error || !report) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 32,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <Feather name="alert-triangle" size={40} color={COLORS.lost} />
          <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.primary }}>
            Laporan tidak ditemukan
          </Text>
          <Text
            style={{ fontSize: 13, color: COLORS.textMuted, textAlign: 'center' }}
          >
            {error ?? 'Mungkin sudah dihapus atau Anda tidak punya akses.'}
          </Text>
          <Pressable
            onPress={() => nav.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            {({ pressed }) => (
              <View
                style={{
                  marginTop: 12,
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  backgroundColor: COLORS.primary,
                  borderRadius: 12,
                  alignItems: 'center',
                  opacity: pressed ? 0.85 : 1,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Kembali</Text>
              </View>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isLost = report.type === 'lost';
  const typeLabel = isLost ? 'HILANG' : 'DITEMUKAN';
  const typeBg = isLost ? COLORS.lostBg : COLORS.foundBg;
  const typeText = isLost ? COLORS.lostText : COLORS.foundText;

  const isOwner = !!user && report.user_id === user.id;
  const reporterName = report.created_by_admin
    ? report.reporter_name ?? 'Admin'
    : report.reporter?.name ?? 'Pengguna';
  const reporterFaculty = report.created_by_admin
    ? report.reporter_faculty
    : report.reporter?.faculty;
  const reporterAvatar = report.created_by_admin
    ? null
    : report.reporter?.avatar_url ?? null;

  const ctaLabel = isLost ? 'Info Telah Ditemukan' : 'Chat Penemu';
  const canChat = !isOwner && report.status === 'approved';

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero foto + tombol back/share overlay */}
        <View style={{ height: 320, backgroundColor: '#F4F4F5' }}>
          {report.photo_url ? (
            <Image
              source={{ uri: report.photo_url }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <Feather name="image" size={56} color={COLORS.textMuted} />
            </View>
          )}
          <SafeAreaView
            edges={['top']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <RoundIconButton icon="arrow-left" onPress={() => nav.goBack()} />
              <RoundIconButton
                icon="share-2"
                onPress={() =>
                  Alert.alert('Segera hadir', 'Fitur share laporan akan tersedia di update berikutnya.')
                }
              />
            </View>
          </SafeAreaView>
        </View>

        {/* Body — overlay rounded di atas foto */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            marginTop: -28,
            paddingHorizontal: 22,
            paddingTop: 24,
          }}
        >
          {/* Badges row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
              gap: 8,
            }}
          >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, flex: 1 }}>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: typeBg,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: typeText,
                    fontSize: 11,
                    fontWeight: '800',
                    letterSpacing: 0.5,
                  }}
                >
                  {typeLabel}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: '#F4F4F5',
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Text style={{ fontSize: 12 }}>{categoryEmoji(report.category)}</Text>
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: 11,
                    fontWeight: '700',
                    letterSpacing: 0.3,
                  }}
                >
                  {categoryLabel(report.category)}
                </Text>
              </View>
              {report.created_by_admin ? <ViaAdminBadge /> : null}
              {report.status !== 'approved' ? <StatusBadge status={report.status} /> : null}
            </View>
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: COLORS.primary,
              lineHeight: 30,
              marginBottom: 20,
            }}
          >
            {report.title}
          </Text>

          {/* Info card: lokasi + waktu + (custody point untuk found) */}
          <View
            style={{
              backgroundColor: '#FAFAFA',
              borderRadius: 18,
              padding: 18,
              borderWidth: 1,
              borderColor: '#F4F4F5',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <InfoRow icon="map-pin" label="Lokasi" value={report.location} />
            <Divider />
            <InfoRow
              icon="calendar"
              label="Waktu Lapor"
              value={formatFullDate(report.created_at)}
            />
            {report.custody_point ? (
              <>
                <Divider />
                <InfoRow
                  icon="archive"
                  label="Titik Penitipan"
                  value={report.custody_point}
                />
              </>
            ) : null}
          </View>

          {/* Description */}
          {report.description ? (
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '800',
                  color: COLORS.primary,
                  letterSpacing: 0.8,
                  marginBottom: 10,
                }}
              >
                DESKRIPSI
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.textMuted,
                  lineHeight: 22,
                }}
              >
                {report.description}
              </Text>
            </View>
          ) : null}

          {/* Reporter card */}
          <Pressable
            onPress={() => {
              if (report.user_id) {
                nav.navigate('UserProfile', { userId: report.user_id });
              }
            }}
            disabled={report.created_by_admin || !report.user_id}
          >
            {({ pressed }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 14,
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 18,
                gap: 12,
                opacity: pressed ? 0.7 : 1,
                marginBottom: 12,
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
                  overflow: 'hidden',
                }}
              >
                {reporterAvatar ? (
                  <Image
                    source={{ uri: reporterAvatar }}
                    style={{ width: 48, height: 48 }}
                  />
                ) : (
                  <Feather name="user" size={20} color={COLORS.textMuted} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '800',
                    color: COLORS.textMuted,
                    letterSpacing: 0.8,
                    marginBottom: 2,
                  }}
                >
                  DILAPORKAN OLEH
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '700', color: COLORS.primary }}
                  numberOfLines={1}
                >
                  {reporterName}
                </Text>
                {reporterFaculty ? (
                  <Text style={{ fontSize: 12, color: COLORS.textMuted }} numberOfLines={1}>
                    {reporterFaculty}
                  </Text>
                ) : null}
              </View>
              {!report.created_by_admin && report.user_id ? (
                <Feather name="chevron-right" size={20} color={COLORS.border} />
              ) : null}
            </View>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <SafeAreaView
        edges={['bottom']}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}
      >
        <View style={{ padding: 16 }}>
          {isOwner ? (
            <View
              style={{
                paddingVertical: 14,
                backgroundColor: '#F4F4F5',
                borderRadius: 16,
                alignItems: 'center',
              }}
            >
              <Text
                style={{ fontSize: 13, fontWeight: '600', color: COLORS.textMuted }}
              >
                Ini laporan Anda. Kelola di tab Laporanku.
              </Text>
            </View>
          ) : canChat ? (
            <Pressable
              onPress={async () => {
                if (!report.user_id) {
                  Alert.alert('Tidak dapat chat', 'Pengguna sudah tidak tersedia.');
                  return;
                }
                try {
                  const conv = await getOrCreateConversation(report.id, report.user_id);
                  nav.navigate('ChatRoom', {
                    conversationId: conv.id,
                    reportId: report.id,
                  });
                } catch (e) {
                  Alert.alert(
                    'Gagal membuka chat',
                    e instanceof Error ? e.message : 'Coba lagi nanti.',
                  );
                }
              }}
            >
              {({ pressed }) => (
                <View
                  style={{
                    paddingVertical: 16,
                    backgroundColor: COLORS.primary,
                    borderRadius: 16,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                    opacity: pressed ? 0.85 : 1,
                    shadowColor: COLORS.primary,
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 4,
                  }}
                >
                  <Feather name="message-circle" size={18} color="#FFFFFF" />
                  <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>
                    {ctaLabel}
                  </Text>
                </View>
              )}
            </Pressable>
          ) : (
            <View
              style={{
                paddingVertical: 14,
                backgroundColor: '#F4F4F5',
                borderRadius: 16,
                alignItems: 'center',
              }}
            >
              <Text
                style={{ fontSize: 13, fontWeight: '600', color: COLORS.textMuted }}
              >
                {report.status === 'resolved'
                  ? 'Laporan ini sudah selesai.'
                  : 'Laporan belum aktif.'}
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

function RoundIconButton({
  icon,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
    >
      {({ pressed }) => (
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            backgroundColor: 'rgba(0,0,0,0.35)',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.7 : 1,
          }}
        >
          <Feather name={icon} size={18} color="#FFFFFF" />
        </View>
      )}
    </Pressable>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 999,
          backgroundColor: COLORS.surface,
          borderWidth: 1,
          borderColor: COLORS.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name={icon} size={18} color={COLORS.textMuted} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 10,
            fontWeight: '800',
            color: COLORS.textMuted,
            letterSpacing: 0.8,
            marginBottom: 4,
          }}
        >
          {label.toUpperCase()}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.primary }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: COLORS.border }} />;
}
