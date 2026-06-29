// AdminReviewScreen — detail per laporan + tombol Approve/Reject.
// Dipanggil dari AdminDashboard (pending list) atau AdminReports (semua list).
// Reject wajib isi alasan via modal input.
// Referensi visual: cariin-web/admin-review.html.

import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import StatusBadge from '@/components/StatusBadge';
import ViaAdminBadge from '@/components/ViaAdminBadge';
import type { AdminDashboardStackParamList } from '@/navigation/types';
import {
  approveReport,
  getReportById,
  rejectReport,
  type Report,
} from '@/services/report.service';
import { getOrCreateConversation } from '@/services/chat.service';
import { COLORS } from '@/utils/constants';
import { formatFullDate, categoryLabel } from '@/utils/formatters';

type Nav = StackNavigationProp<AdminDashboardStackParamList, 'AdminReview'>;
type RouteP = RouteProp<AdminDashboardStackParamList, 'AdminReview'>;

export default function AdminReviewScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteP>();
  const insets = useSafeAreaInsets();
  const reportId = route.params.reportId;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Reject modal state
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectNote, setRejectNote] = useState('');

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

  const onApprove = () => {
    Alert.alert('Setujui Laporan?', `"${report?.title}" akan dipublikasikan di feed.`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Setujui',
        style: 'default',
        onPress: async () => {
          if (!report) return;
          setSubmitting(true);
          try {
            await approveReport(report.id);
            Alert.alert('Berhasil', 'Laporan telah disetujui.', [
              { text: 'OK', onPress: () => nav.goBack() },
            ]);
          } catch (e) {
            Alert.alert('Gagal', e instanceof Error ? e.message : 'Coba lagi.');
          } finally {
            setSubmitting(false);
          }
        },
      },
    ]);
  };

  const onRejectConfirm = async () => {
    if (!report) return;
    if (!rejectNote.trim()) {
      Alert.alert('Validasi', 'Alasan penolakan wajib diisi.');
      return;
    }
    setSubmitting(true);
    try {
      await rejectReport(report.id, rejectNote.trim());
      setRejectModalVisible(false);
      Alert.alert('Berhasil', 'Laporan telah ditolak.', [
        { text: 'OK', onPress: () => nav.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Gagal', e instanceof Error ? e.message : 'Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.admin} />
      </View>
    );
  }

  if (error || !report) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 12 }}>
          <Feather name="alert-triangle" size={40} color={COLORS.lost} />
          <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.adminText }}>
            Laporan tidak ditemukan
          </Text>
          <Text style={{ fontSize: 13, color: COLORS.textMuted, textAlign: 'center' }}>
            {error ?? 'Mungkin sudah dihapus.'}
          </Text>
          <Pressable onPress={() => nav.goBack()} accessibilityRole="button">
            {({ pressed }) => (
              <View
                style={{
                  marginTop: 12,
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  backgroundColor: COLORS.admin,
                  borderRadius: 12,
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
  const reporterName = report.created_by_admin
    ? report.reporter_name ?? 'Admin'
    : report.reporter?.name ?? 'Pengguna';
  const reporterNim = report.created_by_admin
    ? report.reporter_nim
    : report.reporter?.nim;
  const reporterFaculty = report.created_by_admin
    ? report.reporter_faculty
    : report.reporter?.faculty;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero photo */}
        <View style={{ height: 260, backgroundColor: '#F4F4F5' }}>
          {report.photo_url ? (
            <Image source={{ uri: report.photo_url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="image" size={48} color={COLORS.textMuted} />
            </View>
          )}
          <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <Pressable onPress={() => nav.goBack()} accessibilityRole="button">
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
                    <Feather name="arrow-left" size={18} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            </View>
          </SafeAreaView>
          {/* Mode Review badge */}
          <View
            style={{
              position: 'absolute',
              bottom: 12,
              right: 16,
              backgroundColor: 'rgba(0,0,0,0.5)',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 }}>
              MODE REVIEW
            </Text>
          </View>
        </View>

        {/* Body */}
        <View style={{ paddingHorizontal: 22, paddingTop: 20 }}>
          {/* Badges */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            <StatusBadge status={report.status} />
            <View style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: typeBg, borderRadius: 8 }}>
              <Text style={{ color: typeText, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 }}>{typeLabel}</Text>
            </View>
            <View style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#F4F4F5', borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.textMuted }}>{categoryLabel(report.category)}</Text>
              <Text style={{ color: COLORS.adminText, fontSize: 11, fontWeight: '700' }}>{categoryLabel(report.category)}</Text>
            </View>
            {report.created_by_admin ? <ViaAdminBadge /> : null}
          </View>

          {/* Title */}
          <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.adminText, lineHeight: 30, marginBottom: 6 }}>
            {report.title}
          </Text>
          <Text style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 20 }}>
            Dilaporkan {formatFullDate(report.created_at)}
          </Text>

          {/* Reporter card */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FAFAFA',
              borderWidth: 1,
              borderColor: '#F4F4F5',
              borderRadius: 20,
              padding: 14,
              gap: 14,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                backgroundColor: '#E4E4E7',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.textMuted }}>
                {reporterName.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.adminText }}>
                {reporterName}
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.textMuted }} numberOfLines={1}>
                {[reporterNim, reporterFaculty].filter(Boolean).join(' • ')}
              </Text>
            </View>
          </View>

          {/* Info rows */}
          <View style={{ gap: 14, marginBottom: 20 }}>
            <InfoRow icon="map-pin" label="Lokasi" value={report.location} />
            {report.custody_point ? (
              <InfoRow icon="archive" label="Titik Penitipan" value={report.custody_point} />
            ) : null}
            <InfoRow icon="calendar" label="Waktu Lapor" value={formatFullDate(report.created_at)} />
          </View>

          {/* Description */}
          {report.description ? (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.adminText, letterSpacing: 0.8, marginBottom: 8 }}>
                DESKRIPSI
              </Text>
              <Text style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 22 }}>
                {report.description}
              </Text>
            </View>
          ) : null}

          {/* Admin note (jika sudah pernah direject/approved dengan note) */}
          {report.admin_note ? (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.adminText, letterSpacing: 0.8, marginBottom: 8 }}>
                CATATAN ADMIN
              </Text>
              <Text style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 22 }}>
                {report.admin_note}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Bottom action bar */}
      {report.status === 'pending' ? (
        <SafeAreaView
          edges={['bottom']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderTopWidth: 1,
            borderTopColor: COLORS.adminBorder,
          }}
        >
          <View style={{ flexDirection: 'row', gap: 12, padding: 16 }}>
            <Pressable
              onPress={() => { setRejectNote(''); setRejectModalVisible(true); }}
              disabled={submitting}
              style={{ flex: 1 }}
              accessibilityRole="button"
            >
              {({ pressed }) => (
                <View
                  style={{
                    paddingVertical: 16,
                    backgroundColor: '#FEF2F2',
                    borderWidth: 1,
                    borderColor: '#FECACA',
                    borderRadius: 16,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                    opacity: submitting ? 0.5 : pressed ? 0.85 : 1,
                  }}
                >
                  <Feather name="x-circle" size={18} color={COLORS.lost} />
                  <Text style={{ color: COLORS.lost, fontSize: 14, fontWeight: '700' }}>Tolak</Text>
                </View>
              )}
            </Pressable>
            <Pressable
              onPress={onApprove}
              disabled={submitting}
              style={{ flex: 1 }}
              accessibilityRole="button"
            >
              {({ pressed }) => (
                <View
                  style={{
                    paddingVertical: 16,
                    backgroundColor: '#22C55E',
                    borderRadius: 16,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                    opacity: submitting ? 0.5 : pressed ? 0.85 : 1,
                    shadowColor: '#22C55E',
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Feather name="check-circle" size={18} color="#FFFFFF" />
                  <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>Setujui</Text>
                </View>
              )}
            </Pressable>
          </View>

          {report.user_id ? (
            <Pressable
              onPress={async () => {
                try {
                  const conv = await getOrCreateConversation(report.id, report.user_id!);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const parent: any = nav.getParent();
                  parent?.navigate('ChatTab', {
                    screen: 'ChatRoom',
                    params: { conversationId: conv.id, reportId: report.id },
                  });
                } catch (e) {
                  Alert.alert('Gagal membuka chat', e instanceof Error ? e.message : 'Coba lagi nanti.');
                }
              }}
              accessibilityRole="button"
              style={{ marginTop: 10 }}
            >
              {({ pressed }) => (
                <View
                  style={{
                    paddingVertical: 14,
                    backgroundColor: COLORS.admin,
                    borderRadius: 16,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                    opacity: pressed ? 0.85 : 1,
                  }}
                >
                  <Feather name="message-circle" size={16} color="#FFFFFF" />
                  <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>
                    Chat Pemilik
                  </Text>
                </View>
              )}
            </Pressable>
          ) : null}
        </SafeAreaView>
      ) : (
        <SafeAreaView
          edges={['bottom']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: COLORS.surface,
            borderTopWidth: 1,
            borderTopColor: COLORS.adminBorder,
          }}
        >
          <View style={{ padding: 16 }}>
            <View
              style={{
                paddingVertical: 14,
                backgroundColor: '#F4F4F5',
                borderRadius: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.textMuted }}>
                Laporan ini sudah {report.status === 'approved' ? 'disetujui' : report.status === 'rejected' ? 'ditolak' : 'selesai'}.
              </Text>
            </View>
          </View>
        </SafeAreaView>
      )}

      {/* Reject reason modal */}
      <Modal visible={rejectModalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
          >
            <View style={{ padding: 20, paddingBottom: 20 + insets.bottom }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.adminText, marginBottom: 4 }}>
                Tolak Laporan
              </Text>
              <Text style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 16 }}>
                Tulis alasan penolakan. Alasan ini akan dikirim ke pelapor.
              </Text>
              <TextInput
                value={rejectNote}
                onChangeText={setRejectNote}
                placeholder="Contoh: Foto tidak jelas, informasi tidak lengkap..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: '#F4F4F5',
                  borderWidth: 1,
                  borderColor: COLORS.adminBorder,
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 14,
                  color: COLORS.adminText,
                  minHeight: 100,
                  textAlignVertical: 'top',
                  marginBottom: 16,
                }}
                autoFocus
              />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Pressable
                  onPress={() => setRejectModalVisible(false)}
                  disabled={submitting}
                  style={{ flex: 1 }}
                  accessibilityRole="button"
                >
                  {({ pressed }) => (
                    <View
                      style={{
                        paddingVertical: 14,
                        backgroundColor: '#F4F4F5',
                        borderRadius: 16,
                        alignItems: 'center',
                        opacity: pressed ? 0.7 : 1,
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.textMuted }}>Batal</Text>
                    </View>
                  )}
                </Pressable>
                <Pressable
                  onPress={() => void onRejectConfirm()}
                  disabled={submitting}
                  style={{ flex: 1 }}
                  accessibilityRole="button"
                >
                  {({ pressed }) => (
                    <View
                      style={{
                        paddingVertical: 14,
                        backgroundColor: COLORS.lost,
                        borderRadius: 16,
                        alignItems: 'center',
                        opacity: submitting ? 0.5 : pressed ? 0.85 : 1,
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>
                        {submitting ? 'Menolak...' : 'Tolak Laporan'}
                      </Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          backgroundColor: COLORS.surface,
          borderWidth: 1,
          borderColor: COLORS.adminBorder,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name={icon} size={16} color={COLORS.textMuted} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 0.8, marginBottom: 3 }}>
          {label.toUpperCase()}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.adminText }}>{value}</Text>
      </View>
    </View>
  );
}
