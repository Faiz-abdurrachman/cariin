// AdminReviewScreen — detail per laporan + tombol Approve/Reject.

import { Feather } from '@expo/vector-icons';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';
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
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import StatusBadge from '@/components/StatusBadge';
import ViaAdminBadge from '@/components/ViaAdminBadge';
import type { AdminDashboardStackParamList } from '@/navigation/types';
import {
  approveReport,
  getReportById,
  rejectReport,
  deleteReport,
  resolveReportAsAdmin,
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

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const onApprove = () => {
    Alert.alert('Setujui laporan?', `"${report?.title}" akan dipublikasikan di feed.`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Setujui',
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

  const onDelete = () => {
    if (!report) return;
    Alert.alert('Hapus Laporan?', `Laporan "${report.title}" akan dihapus permanen.`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          setSubmitting(true);
          try {
            await deleteReport(report.id);
            Alert.alert('Terhapus', 'Laporan berhasil dihapus.', [
              { text: 'OK', onPress: () => nav.goBack() },
            ]);
          } catch (e) {
            Alert.alert('Gagal Hapus', e instanceof Error ? e.message : 'Coba lagi.');
          } finally {
            setSubmitting(false);
          }
        },
      },
    ]);
  };

  const onResolve = () => {
    if (!report) return;
    Alert.alert(
      'Selesaikan laporan?',
      `Laporan "${report.title}" akan dipindahkan ke status Selesai.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Selesaikan',
          onPress: async () => {
            setSubmitting(true);
            try {
              await resolveReportAsAdmin(report.id);
              Alert.alert('Berhasil', 'Laporan telah diselesaikan.', [
                { text: 'OK', onPress: () => nav.goBack() },
              ]);
            } catch (e) {
              Alert.alert(
                'Gagal menyelesaikan',
                e instanceof Error ? e.message : 'Coba lagi.',
              );
            } finally {
              setSubmitting(false);
            }
          },
        },
      ],
    );
  };

  const onEdit = () => {
    if (!report) return;
    nav.navigate('AdminEditReport', { reportId: report.id });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.adminLight, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.admin} />
      </View>
    );
  }

  if (error || !report) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.adminLight }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 12 }}>
          <Feather name="alert-triangle" size={40} color={COLORS.lost} />
          <Text style={{ fontSize: 16, fontWeight: '900', color: COLORS.adminText }}>
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
                  borderRadius: 14,
                  opacity: pressed ? 0.85 : 1,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>Kembali</Text>
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
  const reporterName = report.created_by_admin ? report.reporter_name ?? 'Admin' : report.reporter?.name ?? 'Pengguna';
  const reporterNim = report.created_by_admin ? report.reporter_nim : report.reporter?.nim;
  const reporterFaculty = report.created_by_admin ? report.reporter_faculty : report.reporter?.faculty;

  const chatOwner = async () => {
    if (!report.user_id) return;
    try {
      const conv = await getOrCreateConversation(report.id, report.user_id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parent: any = nav.getParent();
      parent?.navigate('ChatTab', {
        screen: 'ChatRoom',
        params: { conversationId: conv.id, reportId: report.id },
      });
    } catch (e) {
      Alert.alert('Gagal membuka chat', e instanceof Error ? e.message : 'Coba lagi nanti.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.adminLight }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 188 }}>
        <View style={{ height: 280, backgroundColor: COLORS.adminLight }}>
          {report.photo_url ? (
            <Image source={{ uri: report.photo_url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="image" size={48} color={COLORS.textMuted} />
            </View>
          )}

          <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
            <View style={{ paddingHorizontal: 16, paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Pressable onPress={() => nav.goBack()} accessibilityRole="button">
                {({ pressed }) => (
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: 'rgba(255,255,255,0.88)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.96)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: pressed ? 0.75 : 1,
                      shadowColor: '#000000',
                      shadowOpacity: 0.12,
                      shadowRadius: 8,
                      shadowOffset: { width: 0, height: 3 },
                      elevation: 3,
                    }}
                  >
                    <Feather name="arrow-left" size={18} color={COLORS.adminText} />
                  </View>
                )}
              </Pressable>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable onPress={onEdit} disabled={submitting} accessibilityRole="button" accessibilityLabel="Edit laporan">
                  {({ pressed }) => (
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: 'rgba(255,255,255,0.88)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.96)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: submitting ? 0.5 : pressed ? 0.75 : 1,
                        shadowColor: '#000000',
                        shadowOpacity: 0.12,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 3 },
                        elevation: 3,
                      }}
                    >
                      <Feather name="edit-3" size={18} color={COLORS.admin} />
                    </View>
                  )}
                </Pressable>

                <Pressable onPress={onDelete} disabled={submitting} accessibilityRole="button" accessibilityLabel="Hapus laporan">
                  {({ pressed }) => (
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: 'rgba(255,255,255,0.88)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.96)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: submitting ? 0.5 : pressed ? 0.75 : 1,
                        shadowColor: '#000000',
                        shadowOpacity: 0.12,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 3 },
                        elevation: 3,
                      }}
                    >
                      <Feather name="trash-2" size={18} color={COLORS.lost} />
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
          </SafeAreaView>

          <View
            style={{
              position: 'absolute',
              bottom: 12,
              right: 16,
              backgroundColor: 'rgba(19,78,74,0.58)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.26)',
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 999,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.6 }}>
              MODE REVIEW
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <BlurView
            intensity={55}
            tint="light"
            style={{
              borderRadius: 30,
              overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.42)',
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.76)',
              padding: 18,
            }}
          >
            <LinearGradient colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.18)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} pointerEvents="none" />

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              <StatusBadge status={report.status} />
              <View style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: typeBg, borderRadius: 999 }}>
                <Text style={{ color: typeText, fontSize: 11, fontWeight: '900', letterSpacing: 0.5 }}>{typeLabel}</Text>
              </View>
              <View style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 999 }}>
                <Text style={{ color: COLORS.adminText, fontSize: 11, fontWeight: '800' }}>
                  {categoryLabel(report.category)}
                </Text>
              </View>
              {report.created_by_admin ? <ViaAdminBadge /> : null}
            </View>

            <Text style={{ fontSize: 23, fontWeight: '900', color: COLORS.adminText, lineHeight: 30, marginBottom: 8 }}>
              {report.title}
            </Text>
            <Text style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 18 }}>
              Dilaporkan {formatFullDate(report.created_at)}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.62)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.82)',
                borderRadius: 22,
                padding: 14,
                gap: 14,
                marginBottom: 18,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  backgroundColor: 'rgba(37,99,235,0.08)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '900', color: COLORS.adminText }}>
                  {reporterName.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '900', color: COLORS.adminText }}>
                  {reporterName}
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.textMuted }} numberOfLines={1}>
                  {[reporterNim, reporterFaculty].filter(Boolean).join(' • ')}
                </Text>
              </View>
            </View>

            <View style={{ gap: 14, marginBottom: 18 }}>
              <InfoRow icon="map-pin" label="Lokasi" value={report.location} />
              {report.custody_point ? <InfoRow icon="archive" label="Titik Penitipan" value={report.custody_point} /> : null}
              <InfoRow icon="calendar" label="Waktu Lapor" value={formatFullDate(report.created_at)} />
            </View>

            {report.description ? (
              <View style={{ marginBottom: 18 }}>
                <Text style={{ fontSize: 11, fontWeight: '900', color: COLORS.adminText, letterSpacing: 0.8, marginBottom: 8 }}>
                  DESKRIPSI
                </Text>
                <Text style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 22 }}>
                  {report.description}
                </Text>
              </View>
            ) : null}

            {report.admin_note ? (
              <View style={{ marginBottom: 18 }}>
                <Text style={{ fontSize: 11, fontWeight: '900', color: COLORS.adminText, letterSpacing: 0.8, marginBottom: 8 }}>
                  CATATAN ADMIN
                </Text>
                <Text style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 22 }}>
                  {report.admin_note}
                </Text>
              </View>
            ) : null}
          </BlurView>
        </View>
      </ScrollView>

      {report.status === 'pending' ? (
        <SafeAreaView
          edges={['bottom']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(255,255,255,0.54)',
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.8)',
          }}
        >
          <View style={{ padding: 16, gap: 12 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable
                onPress={() => setRejectModalVisible(true)}
                disabled={submitting}
                style={{ flex: 1 }}
                accessibilityRole="button"
              >
                {({ pressed }) => (
                  <View
                    style={{
                      paddingVertical: 16,
                      backgroundColor: 'rgba(255,255,255,0.62)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.82)',
                      borderRadius: 18,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 8,
                      opacity: submitting ? 0.5 : pressed ? 0.85 : 1,
                    }}
                  >
                    <Feather name="x-circle" size={18} color={COLORS.lost} />
                    <Text style={{ color: COLORS.lost, fontSize: 14, fontWeight: '900' }}>Tolak</Text>
                  </View>
                )}
              </Pressable>
              <Pressable onPress={onApprove} disabled={submitting} style={{ flex: 1 }} accessibilityRole="button">
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
                      opacity: submitting ? 0.5 : pressed ? 0.85 : 1,
                      shadowColor: COLORS.admin,
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <Feather name="check-circle" size={18} color="#FFFFFF" />
                    <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '900' }}>Setujui</Text>
                  </View>
                )}
              </Pressable>
            </View>

            {report.user_id && !report.created_by_admin ? (
              <Pressable onPress={chatOwner} accessibilityRole="button">
                {({ pressed }) => (
                  <View
                    style={{
                      paddingVertical: 14,
                      backgroundColor: 'rgba(37,99,235,0.92)',
                      borderRadius: 18,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 8,
                      opacity: pressed ? 0.88 : 1,
                    }}
                  >
                    <Feather name="message-circle" size={16} color="#FFFFFF" />
                    <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '900' }}>
                      Chat Pemilik
                    </Text>
                  </View>
                )}
              </Pressable>
            ) : null}
          </View>
        </SafeAreaView>
      ) : report.status === 'approved' ? (
        <SafeAreaView
          edges={['bottom']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(255,255,255,0.64)',
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.84)',
          }}
        >
          <View style={{ padding: 16, flexDirection: 'row', gap: 12 }}>
            <Pressable
              onPress={onEdit}
              disabled={submitting}
              style={{ flex: 1 }}
              accessibilityRole="button"
            >
              {({ pressed }) => (
                <View
                  style={{
                    paddingVertical: 15,
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    borderWidth: 1.5,
                    borderColor: 'rgba(13,148,136,0.28)',
                    borderRadius: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 8,
                    opacity: submitting ? 0.5 : pressed ? 0.82 : 1,
                  }}
                >
                  <Feather name="edit-3" size={17} color={COLORS.admin} />
                  <Text style={{ color: COLORS.adminText, fontSize: 13, fontWeight: '900' }}>
                    Edit Data
                  </Text>
                </View>
              )}
            </Pressable>

            <Pressable
              onPress={onResolve}
              disabled={submitting}
              style={{ flex: 1 }}
              accessibilityRole="button"
            >
              {({ pressed }) => (
                <View
                  style={{
                    paddingVertical: 15,
                    backgroundColor: COLORS.resolved,
                    borderRadius: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 8,
                    opacity: submitting ? 0.5 : pressed ? 0.84 : 1,
                    shadowColor: COLORS.resolved,
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 4,
                  }}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Feather name="check-circle" size={17} color="#FFFFFF" />
                  )}
                  <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '900' }}>
                    Selesaikan
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      ) : (
        <SafeAreaView
          edges={['bottom']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(255,255,255,0.54)',
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.8)',
          }}
        >
          <View style={{ padding: 16 }}>
            <BlurView
              intensity={45}
              tint="light"
              style={{
                overflow: 'hidden',
                backgroundColor: 'rgba(255,255,255,0.62)',
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.82)',
                paddingVertical: 14,
                borderRadius: 18,
                alignItems: 'center',
              }}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.18)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
              />
              <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.textMuted }}>
                Laporan ini sudah {report.status === 'rejected' ? 'ditolak' : 'selesai'}.
              </Text>
            </BlurView>
          </View>
        </SafeAreaView>
      )}

      <Modal visible={rejectModalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' }}
          >
            <View style={{ padding: 20, paddingBottom: 20 + insets.bottom }}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: COLORS.adminText, marginBottom: 4 }}>
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
                  backgroundColor: 'rgba(255,255,255,0.72)',
                  borderWidth: 1,
                  borderColor: 'rgba(153,246,228,0.9)',
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
                <Pressable onPress={() => setRejectModalVisible(false)} disabled={submitting} style={{ flex: 1 }} accessibilityRole="button">
                  {({ pressed }) => (
                    <View
                      style={{
                        paddingVertical: 14,
                        backgroundColor: 'rgba(255,255,255,0.72)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.9)',
                        borderRadius: 16,
                        alignItems: 'center',
                        opacity: pressed ? 0.7 : 1,
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: '800', color: COLORS.textMuted }}>Batal</Text>
                    </View>
                  )}
                </Pressable>
                <Pressable onPress={() => void onRejectConfirm()} disabled={submitting} style={{ flex: 1 }} accessibilityRole="button">
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
                      <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFFFFF' }}>
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
          width: 38,
          height: 38,
          borderRadius: 14,
          backgroundColor: 'rgba(37,99,235,0.08)',
          borderWidth: 1,
          borderColor: 'rgba(37,99,235,0.14)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name={icon} size={16} color={COLORS.adminText} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 10, fontWeight: '900', color: COLORS.textMuted, letterSpacing: 0.8, marginBottom: 3 }}>
          {label.toUpperCase()}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.adminText }}>{value}</Text>
      </View>
    </View>
  );
}
