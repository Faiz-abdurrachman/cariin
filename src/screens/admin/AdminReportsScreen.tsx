// AdminReportsScreen — list semua laporan dengan filter status + search.

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
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import EmptyState from '@/components/EmptyState';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import type { AdminTabParamList } from '@/navigation/types';
import { listReports, type Report } from '@/services/report.service';
import { COLORS, type ReportStatus } from '@/utils/constants';
import { categoryLabel, formatRelativeTime } from '@/utils/formatters';

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

  const load = useCallback(
    async (showSpinner = true) => {
      if (showSpinner) setLoading(true);
      setError(null);
      try {
        const filter: {
          status?: ReportStatus;
          search?: string;
          includeAllStatuses?: boolean;
        } = {};
        if (statusFilter !== 'all') filter.status = statusFilter as ReportStatus;
        else filter.includeAllStatuses = true;
        if (search.trim().length > 0) filter.search = search.trim();
        const data = await listReports(filter);
        setReports(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Gagal memuat data.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [statusFilter, search],
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

  const goToReview = (reportId: string) => {
    nav.navigate('DashboardTab', { screen: 'AdminReview', params: { reportId } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.adminLight }}>
      <View
        style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 350,
          height: 350,
          borderRadius: 999,
          backgroundColor: COLORS.admin,
          opacity: 0.16,
          transform: [{ scale: 1.35 }],
        }}
        pointerEvents="none"
      />
      <View
        style={{
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: 300,
          height: 300,
          borderRadius: 999,
          backgroundColor: COLORS.found,
          opacity: 0.08,
          transform: [{ scale: 1.2 }],
        }}
        pointerEvents="none"
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
        <BlurView
          intensity={55}
          tint="light"
          style={{
            marginHorizontal: 16,
            marginTop: 2,
            marginBottom: 10,
            borderRadius: 24,
            overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255,0.42)',
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.72)',
            padding: 16,
          }}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.18)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <Text style={{ fontSize: 20, fontWeight: '900', color: COLORS.adminText }}>
            Semua Laporan
          </Text>
          <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
            Filter, cari, dan buka laporan untuk review admin.
          </Text>
        </BlurView>

        <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
          <BlurView
            intensity={45}
            tint="light"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.42)',
              borderRadius: 18,
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.72)',
              paddingHorizontal: 14,
              height: 50,
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.18)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />
            <Feather name="search" size={16} color={COLORS.textMuted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Cari laporan..."
              placeholderTextColor={COLORS.textMuted}
              style={{ flex: 1, fontSize: 14, color: COLORS.adminText, paddingVertical: 0, marginLeft: 8, fontWeight: '600' }}
              returnKeyType="search"
              onSubmitEditing={() => void load(true)}
            />
            {search.length > 0 ? (
              <Pressable onPress={() => setSearch('')} hitSlop={8} accessibilityRole="button" accessibilityLabel="Hapus pencarian">
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
          </BlurView>
        </View>

        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          windowSize={5}
          maxToRenderPerBatch={5}
          initialNumToRender={4}
          removeClippedSubviews
          renderItem={({ item }) => <ReportRow report={item} onPress={() => goToReview(item.id)} />}
          ListHeaderComponent={
            <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
              <FlatList
                horizontal
                data={STATUS_CHIPS}
                keyExtractor={(item) => item.value}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
                renderItem={({ item: chip }) => {
                  const active = statusFilter === chip.value;
                  return (
                    <Pressable
                      onPress={() => setStatusFilter(chip.value)}
                      accessibilityRole="button"
                    >
                      {({ pressed }) => (
                        <View
                          style={{
                            paddingHorizontal: 14,
                            paddingVertical: 8,
                            borderRadius: 999,
                            backgroundColor: active ? COLORS.admin : 'rgba(255,255,255,0.55)',
                            borderWidth: 1,
                            borderColor: active ? COLORS.admin : 'rgba(255,255,255,0.8)',
                            opacity: pressed ? 0.78 : 1,
                          }}
                        >
                          <Text style={{ fontSize: 12, fontWeight: '800', color: active ? '#FFFFFF' : COLORS.adminText }}>
                            {chip.label}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  );
                }}
              />
            </View>
          }
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 132, flexGrow: 1 }}
          ListEmptyComponent={
            loading && !refreshing ? (
              <LoadingSkeleton count={3} />
            ) : error ? (
              <EmptyState icon="alert-triangle" title="Gagal memuat" subtitle={error} />
            ) : (
              <EmptyState icon="inbox" title="Tidak ada laporan" subtitle="Coba ubah filter atau kata kunci." />
            )
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.admin} />}
        />
      </SafeAreaView>
    </View>
  );
}

function ReportRow({ report, onPress }: { report: Report; onPress: () => void }) {
  const reporterName = report.created_by_admin ? report.reporter_name ?? 'Admin' : report.reporter?.name ?? 'Pengguna';
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
        <BlurView
          intensity={45}
          tint="light"
          style={{
            marginHorizontal: 16,
            borderRadius: 22,
            overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255,0.46)',
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.72)',
            opacity: pressed ? 0.88 : 1,
          }}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.18)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <View style={{ padding: 14, flexDirection: 'row', gap: 12 }}>
            <View
              style={{
                width: 58,
                height: 58,
                borderRadius: 16,
                backgroundColor: COLORS.adminLight,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {report.photo_url ? (
                <Image source={{ uri: report.photo_url }} style={{ width: 58, height: 58 }} resizeMode="cover" />
              ) : (
                <Feather name="image" size={20} color={COLORS.textMuted} />
              )}
            </View>
            <View style={{ flex: 1, justifyContent: 'center', gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: statusColor[report.status] }} />
                <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.textMuted }}>
                  {report.status === 'pending' ? 'Pending' : report.status === 'approved' ? 'Aktif' : report.status === 'resolved' ? 'Selesai' : 'Ditolak'}
                </Text>
                <Text style={{ fontSize: 10, color: COLORS.textMuted }}>• {typeLabel}</Text>
              </View>
              <Text style={{ fontSize: 13, fontWeight: '900', color: COLORS.adminText }} numberOfLines={1}>
                {report.title}
              </Text>
              <Text style={{ fontSize: 11, color: COLORS.textMuted }} numberOfLines={1}>
                {reporterName} • {categoryLabel(report.category)} • {formatRelativeTime(report.created_at)}
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={COLORS.textMuted} style={{ alignSelf: 'center' }} />
          </View>
        </BlurView>
      )}
    </Pressable>
  );
}
