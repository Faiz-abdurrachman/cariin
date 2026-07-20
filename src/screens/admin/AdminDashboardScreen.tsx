import { Feather } from '@expo/vector-icons';
import { DrawerActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Pressable, RefreshControl, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import EmptyState from '@/components/EmptyState';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useAuth } from '@/context/AuthContext';
import { useNotif } from '@/context/NotifContext';
import type { AdminDashboardStackParamList } from '@/navigation/types';
import { getAdminStats, listReports, type Report } from '@/services/report.service';
import { COLORS, type ReportStatus } from '@/utils/constants';
import { categoryLabel, formatRelativeTime } from '@/utils/formatters';

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

      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'transparent' }}>
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

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: COLORS.adminText, letterSpacing: 0.8 }}>
                ADMIN PANEL
              </Text>
              <Text style={{ fontSize: 22, fontWeight: '900', color: COLORS.adminText, marginTop: 2 }}>
                Selamat datang
              </Text>
              <Text style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 3, lineHeight: 18 }}>
                {userProfile?.name ?? 'Admin'} mengawasi laporan dan review status.
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <IconButton
                icon="menu"
                onPress={() => nav.dispatch(DrawerActions.openDrawer())}
                label="Buka menu"
              />
              <IconButton
                icon="bell"
                onPress={() => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const parent: any = nav.getParent();
                  parent?.navigate('ChatTab', { screen: 'Inbox' });
                }}
                label={`Notifikasi, ${unread} belum dibaca`}
                badge={unread}
              />
            </View>
          </View>
        </BlurView>

        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <StatCard value={stats?.pending ?? '-'} label="Pending" color={COLORS.pending} />
            <StatCard value={stats?.approved ?? '-'} label="Disetujui" color={COLORS.approved} />
            <StatCard value={stats?.rejected ?? '-'} label="Ditolak" color={COLORS.rejected} />
            <StatCard value={stats?.total ?? '-'} label="Total" color={COLORS.admin} />
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              onPress={() => {
                Alert.alert('Buat Laporan Admin', 'Pilih jenis laporan:', [
                  {
                    text: 'Laporan Kehilangan',
                    onPress: () => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const parent: any = nav.getParent();
                      parent?.navigate('CreateTab', { screen: 'AdminCreateLost' });
                    },
                  },
                  {
                    text: 'Laporan Penemuan',
                    onPress: () => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const parent: any = nav.getParent();
                      parent?.navigate('CreateTab', { screen: 'AdminCreateFound' });
                    },
                  },
                  { text: 'Batal', style: 'cancel' },
                ]);
              }}
              accessibilityRole="button"
              accessibilityLabel="Buat laporan admin baru"
              style={{ flex: 1 }}
            >
              {({ pressed }) => (
                <BlurView
                  intensity={45}
                  tint="light"
                  style={{
                    borderRadius: 22,
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255,255,255,0.42)',
                    borderWidth: 1.5,
                    borderColor: 'rgba(255,255,255,0.72)',
                    paddingVertical: 12,
                    alignItems: 'center',
                    opacity: pressed ? 0.86 : 1,
                  }}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.18)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                    pointerEvents="none"
                  />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 12,
                        backgroundColor: COLORS.admin,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Feather name="plus" size={16} color="#FFFFFF" />
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '900', color: COLORS.adminText }}>
                      Buat Laporan
                    </Text>
                  </View>
                </BlurView>
              )}
            </Pressable>

            <Pressable
              onPress={() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const parent: any = nav.getParent();
                parent?.navigate('ReportsTab');
              }}
              accessibilityRole="button"
              accessibilityLabel="Lihat Semua Laporan"
              style={{ flex: 1 }}
            >
              {({ pressed }) => (
                <BlurView
                  intensity={45}
                  tint="light"
                  style={{
                    borderRadius: 22,
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255,255,255,0.42)',
                    borderWidth: 1.5,
                    borderColor: 'rgba(255,255,255,0.72)',
                    paddingVertical: 12,
                    alignItems: 'center',
                    opacity: pressed ? 0.86 : 1,
                  }}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.18)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                    pointerEvents="none"
                  />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 12,
                        backgroundColor: 'rgba(79,70,229,0.15)', // COLORS.admin transparentish
                        borderWidth: 1,
                        borderColor: 'rgba(79,70,229,0.3)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Feather name="list" size={16} color={COLORS.admin} />
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '900', color: COLORS.adminText }}>
                      Semua Laporan
                    </Text>
                  </View>
                </BlurView>
              )}
            </Pressable>
          </View>
        </View>

      <FlatList
        style={{ flex: 1 }}
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Card report={item} onPress={() => nav.navigate('AdminReview', { reportId: item.id })} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 132, flexGrow: 1 }}
        ListHeaderComponent={
          <View style={{ paddingBottom: 6 }}>
            <BlurView
              intensity={50}
              tint="light"
              style={{
                marginBottom: 10,
                borderRadius: 22,
                overflow: 'hidden',
                backgroundColor: 'rgba(255,255,255,0.38)',
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.72)',
                padding: 4,
              }}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.18)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
              />
              <View style={{ flexDirection: 'row', gap: 4 }}>
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
                            paddingVertical: 10,
                            borderRadius: 16,
                            backgroundColor: activeTabValue ? COLORS.admin : 'transparent',
                            alignItems: 'center',
                            opacity: pressed ? 0.86 : 1,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: '800',
                              color: activeTabValue ? '#FFFFFF' : COLORS.adminText,
                            }}
                          >
                            {tab.label}
                            {count !== undefined ? (
                              <Text style={{ color: activeTabValue ? '#E0F2FE' : COLORS.textMuted }}>
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
            </BlurView>

            <Text
              style={{
                fontSize: 11,
                fontWeight: '900',
                color: COLORS.adminText,
                letterSpacing: 0.8,
                paddingHorizontal: 4,
                paddingVertical: 4,
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.admin} />}
      />
      </SafeAreaView>
    </View>
  );
}

function IconButton({
  icon,
  onPress,
  label,
  badge,
}: {
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  label: string;
  badge?: number;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      {({ pressed }) => (
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            backgroundColor: 'rgba(255,255,255,0.58)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.82)',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.78 : 1,
          }}
        >
          <Feather name={icon} size={18} color={COLORS.adminText} />
          {badge && badge > 0 ? (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                minWidth: 16,
                height: 16,
                borderRadius: 999,
                backgroundColor: '#EF4444',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 4,
                borderWidth: 1.5,
                borderColor: COLORS.adminLight,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '900' }}>
                {badge > 9 ? '9+' : badge}
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

function StatCard({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <BlurView
      intensity={40}
      tint="light"
      style={{
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.42)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.72)',
        padding: 12,
        alignItems: 'center',
      }}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.18)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
      <Text style={{ fontSize: 20, fontWeight: '900', color }}>{value}</Text>
      <Text style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: '800', marginTop: 2 }}>
        {label}
      </Text>
    </BlurView>
  );
}

function Card({ report, onPress }: { report: Report; onPress: () => void }) {
  const reporterName = report.created_by_admin ? report.reporter_name ?? 'Admin' : report.reporter?.name ?? 'Pengguna';
  const typeLabel = report.type === 'lost' ? 'Hilang' : 'Ditemukan';

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {({ pressed }) => (
        <BlurView
          intensity={45}
          tint="light"
          style={{
            marginHorizontal: 2,
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
                width: 68,
                height: 68,
                borderRadius: 16,
                backgroundColor: COLORS.adminLight,
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
            <View style={{ flex: 1, justifyContent: 'center', gap: 4 }}>
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
                <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.textMuted }}>
                  {report.status === 'pending' ? 'Pending' : report.status === 'approved' ? 'Aktif' : report.status === 'resolved' ? 'Selesai' : 'Ditolak'}
                </Text>
                <Text style={{ fontSize: 10, color: COLORS.textMuted }}>• {typeLabel}</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '900', color: COLORS.adminText }} numberOfLines={1}>
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
