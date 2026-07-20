import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import EmptyState from '@/components/EmptyState';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import StatusBadge from '@/components/StatusBadge';
import ViaAdminBadge from '@/components/ViaAdminBadge';
import { useAuth } from '@/context/AuthContext';
import type { MyPostsStackParamList } from '@/navigation/types';
import { deleteReport, listReports, markAsResolved, type Report } from '@/services/report.service';
import { useFeedStore } from '@/store/feedStore';
import { COLORS } from '@/utils/constants';
import { formatRelativeTime } from '@/utils/formatters';

type Nav = StackNavigationProp<MyPostsStackParamList, 'MyPosts'>;
type FilterKey = 'all' | 'pending' | 'approved' | 'rejected' | 'resolved';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Aktif' },
  { key: 'rejected', label: 'Ditolak' },
  { key: 'resolved', label: 'Selesai' },
];

export default function MyPostsScreen() {
  const nav = useNavigation<Nav>();
  const { user } = useAuth();
  const refreshFeed = useFeedStore((s) => s.fetch);

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const load = useCallback(
    async (showSpinner = true) => {
      if (!user) return;
      if (showSpinner) setLoading(true);
      setError(null);
      try {
        const data = await listReports({ userId: user.id });
        setReports(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Gagal memuat laporan.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user],
  );

  const filteredReports = useMemo(() => {
    if (activeFilter === 'all') return reports;
    return reports.filter((item) => item.status === activeFilter);
  }, [activeFilter, reports]);

  const stats = useMemo(
    () => ({
      total: reports.length,
      active: reports.filter((item) => item.status === 'approved').length,
      pending: reports.filter((item) => item.status === 'pending').length,
      finished: reports.filter((item) => item.status === 'resolved').length,
    }),
    [reports],
  );

  useFocusEffect(
    useCallback(() => {
      void load(true);
    }, [load]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    void load(false);
  };

  const onDelete = (item: Report) => {
    Alert.alert('Hapus laporan?', `"${item.title}" akan dihapus permanen.`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteReport(item.id);
            setReports((prev) => prev.filter((r) => r.id !== item.id));
            void refreshFeed();
          } catch (e) {
            Alert.alert('Gagal hapus', e instanceof Error ? e.message : 'Coba lagi sebentar.');
          }
        },
      },
    ]);
  };

  const onMarkResolved = (item: Report) => {
    Alert.alert(
      'Tandai selesai?',
      `Setelah ditandai selesai, laporan "${item.title}" tidak bisa diedit lagi.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Tandai Selesai',
          onPress: async () => {
            try {
              const updated = await markAsResolved(item.id);
              setReports((prev) => prev.map((r) => (r.id === item.id ? updated : r)));
              void refreshFeed();
            } catch (e) {
              Alert.alert('Gagal', e instanceof Error ? e.message : 'Coba lagi sebentar.');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View
        style={{
          position: 'absolute',
          top: -70,
          right: -80,
          width: 360,
          height: 360,
          borderRadius: 999,
          backgroundColor: COLORS.primary,
          opacity: 0.16,
          transform: [{ scale: 1.28 }],
        }}
        pointerEvents="none"
      />
      <View
        style={{
          position: 'absolute',
          bottom: -90,
          left: -90,
          width: 320,
          height: 320,
          borderRadius: 999,
          backgroundColor: COLORS.found,
          opacity: 0.12,
          transform: [{ scale: 1.18 }],
        }}
        pointerEvents="none"
      />
      <View
        style={{
          position: 'absolute',
          top: 150,
          left: -70,
          width: 180,
          height: 180,
          borderRadius: 999,
          backgroundColor: COLORS.admin,
          opacity: 0.08,
        }}
        pointerEvents="none"
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
        <BlurView
          intensity={60}
          tint="light"
          style={{
            marginHorizontal: 16,
            marginTop: 2,
            marginBottom: 14,
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderRadius: 28,
            backgroundColor: 'rgba(255,255,255,0.48)',
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.82)',
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 8 },
            elevation: 4,
          }}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.94)', 'rgba(255,255,255,0.24)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(37,99,235,0.1)',
                borderWidth: 1,
                borderColor: 'rgba(37,99,235,0.14)',
              }}
            >
              <Feather name="folder" size={22} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 22, fontWeight: '900', color: COLORS.primary, letterSpacing: -0.4 }}>
                Laporanku
              </Text>
              <Text style={{ fontSize: 12.5, lineHeight: 18, color: COLORS.textMuted, marginTop: 3 }}>
                Semua laporan milikmu ada di sini, lengkap dengan status, waktu, dan aksi cepat.
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            <MiniStat label="Total" value={stats.total} accent={COLORS.primary} />
            <MiniStat label="Aktif" value={stats.active} accent={COLORS.found} />
            <MiniStat label="Pending" value={stats.pending} accent={COLORS.pending} />
            <MiniStat label="Selesai" value={stats.finished} accent={COLORS.resolved} />
          </View>
        </BlurView>

        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <FlatList
            horizontal
            data={FILTERS}
            keyExtractor={(item) => item.key}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => {
              const selected = activeFilter === item.key;
              return (
                <Pressable
                  onPress={() => setActiveFilter(item.key)}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter ${item.label}`}
                >
                  {({ pressed }) => (
                    <View
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 9,
                        borderRadius: 999,
                        backgroundColor: selected ? 'rgba(37,99,235,0.94)' : 'rgba(255,255,255,0.56)',
                        borderWidth: 1,
                        borderColor: selected ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.84)',
                        opacity: pressed ? 0.82 : 1,
                        shadowColor: selected ? COLORS.primary : '#000',
                        shadowOpacity: selected ? 0.16 : 0.05,
                        shadowRadius: 10,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: selected ? 3 : 1,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '800',
                          color: selected ? '#FFFFFF' : COLORS.primary,
                        }}
                      >
                        {item.label}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            }}
          />
        </View>

        <FlatList
          data={filteredReports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              report={item}
              onPressDetail={() =>
                nav.navigate(item.type === 'lost' ? 'DetailLost' : 'DetailFound', {
                  reportId: item.id,
                })
              }
              onEdit={() => nav.navigate('EditPost', { reportId: item.id })}
              onDelete={() => onDelete(item)}
              onMarkResolved={() => onMarkResolved(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 6,
            paddingBottom: 132,
            flexGrow: 1,
          }}
          ListEmptyComponent={
            loading ? (
              <LoadingSkeleton count={3} />
            ) : error ? (
              <EmptyState icon="alert-triangle" title="Gagal memuat" subtitle={error} />
            ) : (
              <EmptyState
                icon="folder"
                title={activeFilter === 'all' ? 'Belum ada laporan' : 'Tidak ada hasil'}
                subtitle={
                  activeFilter === 'all'
                    ? 'Buat laporan pertama lewat tombol + di tab bar.'
                    : 'Coba ganti filter untuk melihat status lain.'
                }
              />
            )
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
        />
      </SafeAreaView>
    </View>
  );
}

interface PostCardProps {
  report: Report;
  onPressDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMarkResolved: () => void;
}

function PostCard({ report, onPressDetail, onEdit, onDelete, onMarkResolved }: PostCardProps) {
  const canEdit = report.status !== 'resolved' && report.status !== 'rejected';
  const canMarkResolved = report.status === 'approved';
  const typeLabel = report.type === 'lost' ? 'Hilang' : 'Ditemukan';
  const typeColor = report.type === 'lost' ? COLORS.lost : COLORS.found;

  return (
    <BlurView
      intensity={50}
      tint="light"
      style={{
        borderRadius: 30,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.82)',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        elevation: 5,
      }}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.94)', 'rgba(255,255,255,0.22)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <Pressable onPress={onPressDetail} accessibilityRole="button">
        {({ pressed }) => (
          <View style={{ opacity: pressed ? 0.92 : 1 }}>
            <View
              style={{
                height: 180,
                backgroundColor: '#F4F4F5',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                overflow: 'hidden',
              }}
            >
              {report.photo_url ? (
                <Image source={{ uri: report.photo_url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                  }}
                >
                  <Feather name="image" size={34} color={COLORS.textMuted} />
                </View>
              )}

              <View
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  right: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', flex: 1 }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.72)',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.88)',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <View
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 999,
                        backgroundColor: typeColor,
                      }}
                    />
                    <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.primary }}>{typeLabel}</Text>
                  </View>
                  {report.created_by_admin ? <ViaAdminBadge /> : null}
                </View>

                <StatusBadge status={report.status} />
              </View>

              <View
                style={{
                  position: 'absolute',
                  left: 12,
                  right: 12,
                  bottom: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: 'rgba(255,255,255,0.72)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.88)',
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.primary }}>
                    {formatRelativeTime(report.created_at)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ padding: 16, gap: 12 }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '900',
                    color: COLORS.primary,
                    lineHeight: 22,
                  }}
                  numberOfLines={2}
                >
                  {report.title}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 13,
                    lineHeight: 19,
                    color: COLORS.textMuted,
                    marginTop: 6,
                  }}
                >
                  {report.description || 'Tidak ada deskripsi.'}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  alignSelf: 'flex-start',
                  backgroundColor: 'rgba(37,99,235,0.06)',
                  borderWidth: 1,
                  borderColor: 'rgba(37,99,235,0.08)',
                  paddingHorizontal: 10,
                  paddingVertical: 7,
                  borderRadius: 999,
                }}
              >
                <Feather name="map-pin" size={12} color={COLORS.textMuted} />
                <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.textMuted }} numberOfLines={1}>
                  {report.location}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <ActionChip label="Lihat" icon="eye" onPress={onPressDetail} />
                {canEdit ? <ActionChip label="Edit" icon="edit-3" onPress={onEdit} /> : null}
                {canMarkResolved ? <ActionChip label="Selesai" icon="check-circle" onPress={onMarkResolved} /> : null}
                <ActionChip label="Hapus" icon="trash-2" onPress={onDelete} tone="danger" />
              </View>
            </View>
          </View>
        )}
      </Pressable>
    </BlurView>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <View
      style={{
        minWidth: 82,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.56)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.82)',
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '900', color: accent, lineHeight: 22 }}>{value}</Text>
      <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.textMuted, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function ActionChip({
  label,
  icon,
  onPress,
  tone = 'default',
}: {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  tone?: 'default' | 'danger';
}) {
  const accent = tone === 'danger' ? COLORS.lostText : COLORS.primary;

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {({ pressed }) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingHorizontal: 12,
            paddingVertical: 9,
            borderRadius: 999,
            backgroundColor: tone === 'danger' ? 'rgba(249,115,22,0.08)' : 'rgba(37,99,235,0.08)',
            borderWidth: 1,
            borderColor: tone === 'danger' ? 'rgba(249,115,22,0.14)' : 'rgba(37,99,235,0.12)',
            opacity: pressed ? 0.82 : 1,
          }}
        >
          <Feather name={icon} size={13} color={accent} />
          <Text style={{ fontSize: 11.5, fontWeight: '800', color: accent }}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}
