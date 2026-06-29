// AdminReportsScreen — list semua laporan dengan filter status + search.
// Dipakai sebagai Drawer screen "Semua Laporan".
// Tap item → navigate ke AdminReview (di dalam DashboardDrawer stack).

import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '@/components/EmptyState';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import type { AdminTabParamList } from '@/navigation/types';
import { listReports, type Report } from '@/services/report.service';
import { COLORS, type ReportStatus } from '@/utils/constants';
import { formatRelativeTime, categoryLabel } from '@/utils/formatters';

type Nav = StackNavigationProp<AdminTabParamList, 'ReportsTab'>;

type StatusFilter = 'all' | ReportStatus;

const STATUS_CHIPS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Aktif' },
  { value: 'rejected', label: 'Ditolak' },
  { value: 'resolved', label: 'Selesai' },
];

export default function AdminReportsScreen() {
  const nav = useNavigation<Nav>();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  const load = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setError(null);
    try {
      const filter: { status?: ReportStatus; search?: string } = {};
      if (statusFilter !== 'all') filter.status = statusFilter as ReportStatus;
      if (search.trim().length > 0) filter.search = search.trim();
      const data = await listReports(filter);
      setReports(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, search]);

  useFocusEffect(
    useCallback(() => {
      void load(true);
    }, [load]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    void load(false);
  };

  const goToReview = (reportId: string) => {
    nav.navigate('DashboardTab', { screen: 'AdminReview', params: { reportId } });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.adminLight }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          height: 56,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.admin,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#FFFFFF' }}>
          Semua Laporan
        </Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: COLORS.adminBorder,
            paddingHorizontal: 14,
            height: 48,
          }}
        >
          <Feather name="search" size={16} color={COLORS.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari laporan..."
            placeholderTextColor={COLORS.textMuted}
            style={{ flex: 1, fontSize: 14, color: COLORS.adminText, paddingVertical: 0 }}
            returnKeyType="search"
            onSubmitEditing={() => void load(true)}
          />
          {search.length > 0 ? (
            <Pressable
              onPress={() => { setSearch(''); }}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Hapus pencarian"
            >
              {({ pressed }) => (
                <Feather
                  name="x-circle"
                  size={16}
                  color={COLORS.textMuted}
                  style={{ opacity: pressed ? 0.7 : 1 }}
                />
              )}
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Status filter chips */}
      <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 20, marginTop: 12, marginBottom: 4 }}>
        {STATUS_CHIPS.map((chip) => {
          const active = statusFilter === chip.value;
          return (
            <Pressable
              key={chip.value}
              onPress={() => setStatusFilter(chip.value)}
              accessibilityRole="button"
            >
              {({ pressed }) => (
                <Text
                  style={{
                    backgroundColor: active ? COLORS.admin : COLORS.surface,
                    color: active ? '#FFFFFF' : COLORS.textMuted,
                    borderWidth: active ? 0 : 1,
                    borderColor: COLORS.adminBorder,
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: '600',
                    opacity: pressed ? 0.7 : 1,
                    overflow: 'hidden',
                  }}
                >
                  {chip.label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* List */}
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReportRow report={item} onPress={() => goToReview(item.id)} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ padding: 20, paddingBottom: 32, flexGrow: 1 }}
        ListEmptyComponent={
          loading && !refreshing ? (
            <LoadingSkeleton count={3} />
          ) : error ? (
            <EmptyState icon="alert-triangle" title="Gagal memuat" subtitle={error} />
          ) : (
            <EmptyState icon="inbox" title="Tidak ada laporan" subtitle="Coba ubah filter atau kata kunci." />
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.admin} />
        }
      />
    </SafeAreaView>
  );
}

function ReportRow({ report, onPress }: { report: Report; onPress: () => void }) {
  const reporterName = report.created_by_admin
    ? report.reporter_name ?? 'Admin'
    : report.reporter?.name ?? 'Pengguna';
  const typeLabel = report.type === 'lost' ? 'Hilang' : 'Ditemukan';

  const statusColor: Record<ReportStatus, string> = {
    pending: COLORS.pending,
    approved: COLORS.approved,
    rejected: COLORS.rejected,
    resolved: COLORS.resolved,
  };

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {({ pressed }) => (
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.adminBorder,
            borderRadius: 20,
            padding: 12,
            flexDirection: 'row',
            gap: 12,
            opacity: pressed ? 0.85 : 1,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: '#F4F4F5',
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {report.photo_url ? (
              <Image source={{ uri: report.photo_url }} style={{ width: 56, height: 56 }} resizeMode="cover" />
            ) : (
              <Feather name="image" size={20} color={COLORS.textMuted} />
            )}
          </View>
          <View style={{ flex: 1, justifyContent: 'center', gap: 3 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: statusColor[report.status] }} />
              <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.textMuted }}>
                {report.status === 'pending' ? 'Pending' : report.status === 'approved' ? 'Aktif' : report.status === 'resolved' ? 'Selesai' : 'Ditolak'}
              </Text>
              <Text style={{ fontSize: 10, color: COLORS.textMuted }}>• {typeLabel}</Text>
            </View>
            <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.adminText }} numberOfLines={1}>
              {report.title}
            </Text>
            <Text style={{ fontSize: 11, color: COLORS.textMuted }} numberOfLines={1}>
              {reporterName} • {categoryLabel(report.category)} {formatRelativeTime(report.created_at)}
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={COLORS.adminBorder} style={{ alignSelf: 'center' }} />
        </View>
      )}
    </Pressable>
  );
}
