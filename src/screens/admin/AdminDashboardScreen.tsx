import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '@/components/EmptyState';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useAuth } from '@/context/AuthContext';
import { useNotif } from '@/context/NotifContext';
import type { AdminDashboardStackParamList } from '@/navigation/types';
import { getAdminStats, listReports, type Report } from '@/services/report.service';
import { COLORS, type ReportStatus } from '@/utils/constants';
import { formatRelativeTime, categoryLabel } from '@/utils/formatters';

type Nav = StackNavigationProp<AdminDashboardStackParamList, 'AdminDashboard'>;
type TabFilter = 'pending' | 'approved' | 'resolved';

const TAB_CONFIG: { value: TabFilter; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Aktif' },
  { value: 'resolved', label: 'Selesai' },
];

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
  resolved: number;
  total: number;
}

export default function AdminDashboardScreen() {
  const nav = useNavigation<Nav>();
  const { userProfile } = useAuth();
  const { unread } = useNotif();

  const [stats, setStats] = useState<Stats | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabFilter>('pending');

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, reportsData] = await Promise.all([
        getAdminStats(),
        listReports({ status: activeTab as ReportStatus }),
      ]);
      setStats(statsData);
      setReports(reportsData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const loadTab = useCallback(async (tab: TabFilter) => {
    setActiveTab(tab);
    setLoading(true);
    setError(null);
    try {
      const [statsData, reportsData] = await Promise.all([
        getAdminStats(),
        listReports({ status: tab as ReportStatus }),
      ]);
      setStats(statsData);
      setReports(reportsData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshData();
    }, [refreshData]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    setLoading(false);
    void refreshData().finally(() => setRefreshing(false));
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.adminLight }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: COLORS.admin }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF' }}>
                Admin Panel
              </Text>
              <Text style={{ fontSize: 12, color: '#C7D2FE', marginTop: 2 }}>
                Selamat datang, {userProfile?.name ?? 'Admin'}
              </Text>
            </View>
            <Pressable
              onPress={() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const parent: any = nav.getParent();
                parent?.navigate('ChatTab', { screen: 'Inbox' });
              }}
              accessibilityRole="button"
              accessibilityLabel={`Notifikasi, ${unread} belum dibaca`}
            >
              {({ pressed }) => (
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed ? 0.7 : 1,
                  }}
                >
                  <Feather name="bell" size={18} color="#FFFFFF" />
                  {unread > 0 ? (
                    <View
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        minWidth: 16,
                        height: 16,
                        borderRadius: 999,
                        backgroundColor: '#EF4444',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 4,
                        borderWidth: 1.5,
                        borderColor: COLORS.admin,
                      }}
                    >
                      <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '800' }}>
                        {unread > 9 ? '9+' : unread}
                      </Text>
                    </View>
                  ) : null}
                </View>
              )}
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <StatCard value={stats?.pending ?? '-'} label="Pending" color="#FBBF24" />
            <StatCard value={stats?.approved ?? '-'} label="Disetujui" color="#34D399" />
            <StatCard value={stats?.rejected ?? '-'} label="Ditolak" color="#F87171" />
            <StatCard value={stats?.total ?? '-'} label="Total" color="#A5B4FC" />
          </View>

          <Pressable
              onPress={() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const parent: any = nav.getParent();
                parent?.navigate('CreateTab', { screen: 'AdminCreateLost' });
              }}
            accessibilityRole="button"
            accessibilityLabel="Buat laporan admin baru"
          >
            {({ pressed }) => (
              <View
                style={{
                  marginTop: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  paddingVertical: 12,
                  borderRadius: 14,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderWidth: 1,
                  borderColor: 'rgba(199,210,254,0.3)',
                  opacity: pressed ? 0.7 : 1,
                }}
              >
                <Feather name="plus" size={16} color="#C7D2FE" />
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#C7D2FE' }}>
                  Buat Laporan Admin
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </SafeAreaView>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            report={item}
            onPress={() => nav.navigate('AdminReview', { reportId: item.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ paddingBottom: 32, flexGrow: 1 }}
        ListHeaderComponent={
          <View style={{ paddingTop: 14, paddingBottom: 4 }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#E0E7FF',
                padding: 4,
                borderRadius: 14,
                marginHorizontal: 20,
                marginBottom: 8,
              }}
            >
              {TAB_CONFIG.map((tab) => {
                const activeTabValue = activeTab === tab.value;
                const count =
                  tab.value === 'pending' ? stats?.pending
                  : tab.value === 'approved' ? stats?.approved
                  : stats?.resolved;
                return (
                  <Pressable
                    key={tab.value}
                    onPress={() => void loadTab(tab.value)}
                    style={{ flex: 1 }}
                    accessibilityRole="button"
                  >
                    {({ pressed }) => (
                      <View
                        style={{
                          paddingVertical: 9,
                          borderRadius: 11,
                          backgroundColor: activeTabValue ? '#FFFFFF' : 'transparent',
                          alignItems: 'center',
                          opacity: pressed ? 0.85 : 1,
                          shadowColor: activeTabValue ? '#000' : 'transparent',
                          shadowOpacity: activeTabValue ? 0.05 : 0,
                          shadowRadius: 4,
                          elevation: activeTabValue ? 1 : 0,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: activeTabValue ? '700' : '600',
                            color: activeTabValue ? COLORS.adminText : '#6366F1',
                          }}
                        >
                          {tab.label}
                          {count !== undefined ? (
                            <Text style={{ color: activeTabValue ? '#6366F1' : '#A5B4FC' }}>
                              {' '}({count})
                            </Text>
                          ) : null}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>

            <Text
              style={{
                fontSize: 11,
                fontWeight: '800',
                color: COLORS.adminText,
                letterSpacing: 0.8,
                paddingHorizontal: 20,
                paddingVertical: 6,
              }}
            >
              {activeTab === 'pending' ? 'MENUNGGU REVIEW' : activeTab === 'approved' ? 'LAPORAN AKTIF' : 'LAPORAN SELESAI'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          loading && !refreshing ? (
            <View style={{ paddingHorizontal: 20 }}>
              <LoadingSkeleton count={3} />
            </View>
          ) : error ? (
            <EmptyState icon="alert-triangle" title="Gagal memuat" subtitle={error} />
          ) : (
            <EmptyState icon="check-circle" title="Tidak ada laporan" subtitle={`Tidak ada laporan dengan status ${activeTab}.`} />
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.admin} />
        }
      />
    </View>
  );
}

function StatCard({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 14,
        padding: 12,
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: '700', color }}>{value}</Text>
      <Text style={{ fontSize: 10, color: '#A5B4FC', fontWeight: '600', marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}

function Card({ report, onPress }: { report: Report; onPress: () => void }) {
  const reporterName = report.created_by_admin
    ? report.reporter_name ?? 'Admin'
    : report.reporter?.name ?? 'Pengguna';
  const typeLabel = report.type === 'lost' ? 'Hilang' : 'Ditemukan';

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {({ pressed }) => (
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.adminBorder,
            borderRadius: 20,
            padding: 14,
            opacity: pressed ? 0.85 : 1,
          }}
        >
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View
              style={{
                width: 68,
                height: 68,
                borderRadius: 14,
                backgroundColor: COLORS.background,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {report.photo_url ? (
                <Image source={{ uri: report.photo_url }} style={{ width: 68, height: 68 }} resizeMode="cover" />
              ) : (
                <Feather name="image" size={22} color={COLORS.textMuted} />
              )}
            </View>
            <View style={{ flex: 1, justifyContent: 'center', gap: 3 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    backgroundColor:
                      report.status === 'pending' ? COLORS.pending
                      : report.status === 'approved' ? COLORS.approved
                      : report.status === 'resolved' ? COLORS.resolved
                      : COLORS.rejected,
                  }}
                />
                <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.textMuted }}>
                  {report.status === 'pending' ? 'Pending' : report.status === 'approved' ? 'Aktif' : report.status === 'resolved' ? 'Selesai' : 'Ditolak'}
                </Text>
                <Text style={{ fontSize: 10, color: COLORS.textMuted }}>• {typeLabel}</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.adminText }} numberOfLines={1}>
                {report.title}
              </Text>
              <Text style={{ fontSize: 11, color: COLORS.textMuted }}>
                {reporterName} • {categoryLabel(report.category)} {formatRelativeTime(report.created_at)}
              </Text>
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Feather name="chevron-right" size={16} color={COLORS.textMuted} />
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}
