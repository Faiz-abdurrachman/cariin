// AdminDashboard — stats overview + daftar laporan pending.
// Header gelap (zinc-950) dengan stat cards, lalu tab filter + list pending.
// Referensi visual: cariin-web/admin-dashboard.html.

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
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '@/components/EmptyState';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import type {
  AdminDashboardStackParamList,
  AdminDrawerParamList,
} from '@/navigation/types';
import {
  getAdminStats,
  listReports,
  type Report,
} from '@/services/report.service';
import { COLORS, type ReportStatus } from '@/utils/constants';
import { categoryEmoji, formatRelativeTime } from '@/utils/formatters';

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

  const [stats, setStats] = useState<Stats | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabFilter>('pending');

  const load = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setError(null);
    try {
      const [statsData, reportsData] = await Promise.all([
        getAdminStats(),
        listReports({ status: 'pending' as ReportStatus }),
      ]);
      setStats(statsData);
      setReports(reportsData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadTab = useCallback(async (tab: TabFilter) => {
    setActiveTab(tab);
    setLoading(true);
    setError(null);
    try {
      const data = await listReports({ status: tab as ReportStatus });
      setReports(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load(true);
    }, [load]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    void load(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F4F5' }}>
      {/* Dark header with stats */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#09090B' }}>
        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: 24,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          {/* Header row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#FFFFFF' }}>
                Admin Panel
              </Text>
              <Text style={{ fontSize: 11, color: '#A1A1AA', marginTop: 2 }}>
                Cari.In Overview
              </Text>
            </View>
            <Pressable
              onPress={() => {
                const drawer = nav.getParent<StackNavigationProp<AdminDrawerParamList>>();
                if (drawer) {
                  drawer.navigate('CreateDrawer', { screen: 'AdminCreateLost' });
                }
              }}
              accessibilityRole="button"
              accessibilityLabel="Buat laporan baru"
            >
              {({ pressed }) => (
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed ? 0.7 : 1,
                  }}
                >
                  <Feather name="plus" size={20} color="#FFFFFF" />
                </View>
              )}
            </Pressable>
          </View>

          {/* Stat cards */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <StatCard value={stats?.pending ?? '-'} label="Pending" color="#F59E0B" />
            <StatCard value={stats?.approved ?? '-'} label="Aktif" color="#22C55E" />
            <StatCard value={stats?.total ?? '-'} label="Total" color="#FFFFFF" />
          </View>
        </View>
      </SafeAreaView>

      {/* Tab filter + list */}
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PendingCard
            report={item}
            onPress={() => nav.navigate('AdminReview', { reportId: item.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingBottom: 32, flexGrow: 1 }}
        ListHeaderComponent={
          <View style={{ paddingTop: 16, paddingBottom: 4 }}>
            {/* Tab bar */}
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'rgba(228,228,231,0.6)',
                padding: 6,
                borderRadius: 16,
                marginHorizontal: 20,
                marginBottom: 12,
              }}
            >
              {TAB_CONFIG.map((tab) => {
                const active = activeTab === tab.value;
                const count =
                  tab.value === 'pending'
                    ? stats?.pending
                    : tab.value === 'approved'
                      ? stats?.approved
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
                          borderRadius: 12,
                          backgroundColor: active ? '#FFFFFF' : 'transparent',
                          alignItems: 'center',
                          opacity: pressed ? 0.85 : 1,
                          shadowColor: active ? '#000' : 'transparent',
                          shadowOpacity: active ? 0.06 : 0,
                          shadowRadius: 4,
                          elevation: active ? 1 : 0,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: '700',
                            color: active ? COLORS.primary : COLORS.textMuted,
                          }}
                        >
                          {tab.label}{' '}
                          <Text
                            style={{
                              fontSize: 10,
                              backgroundColor: active ? '#FEF3C7' : 'transparent',
                              color: active ? '#B45309' : COLORS.textMuted,
                              paddingHorizontal: 4,
                              paddingVertical: 1,
                              borderRadius: 6,
                              overflow: 'hidden',
                            }}
                          >
                            {count ?? ''}
                          </Text>
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
                color: COLORS.primary,
                letterSpacing: 0.8,
                paddingHorizontal: 20,
                paddingTop: 8,
                paddingBottom: 4,
              }}
            >
              {activeTab === 'pending'
                ? 'MENUNGGU REVIEW'
                : activeTab === 'approved'
                  ? 'LAPORAN AKTIF'
                  : 'LAPORAN SELESAI'}
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
            <EmptyState
              icon="check-circle"
              title="Tidak ada laporan"
              subtitle={`Tidak ada laporan dengan status ${activeTab}.`}
            />
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
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 14,
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: '700', color }}>{value}</Text>
      <Text
        style={{
          fontSize: 9,
          color: '#D4D4D8',
          fontWeight: '600',
          letterSpacing: 0.8,
          marginTop: 4,
        }}
      >
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

function PendingCard({ report, onPress }: { report: Report; onPress: () => void }) {
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
            borderColor: COLORS.border,
            borderRadius: 24,
            padding: 14,
            opacity: pressed ? 0.85 : 1,
          }}
        >
          <View style={{ flexDirection: 'row', gap: 14 }}>
            <View
              style={{
                width: 72,
                height: 72,
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
                  style={{ width: 72, height: 72 }}
                  resizeMode="cover"
                />
              ) : (
                <Feather name="image" size={24} color={COLORS.textMuted} />
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
                      report.status === 'pending'
                        ? COLORS.pending
                        : report.status === 'approved'
                          ? COLORS.approved
                          : report.status === 'resolved'
                            ? COLORS.resolved
                            : COLORS.rejected,
                  }}
                />
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color:
                      report.status === 'pending'
                        ? '#B45309'
                        : report.status === 'approved'
                          ? '#065F46'
                          : COLORS.textMuted,
                  }}
                >
                  {report.status === 'pending'
                    ? 'Pending'
                    : report.status === 'approved'
                      ? 'Aktif'
                      : report.status === 'resolved'
                        ? 'Selesai'
                        : 'Ditolak'}
                </Text>
                <Text style={{ fontSize: 10, color: COLORS.textMuted }}>• {typeLabel}</Text>
              </View>
              <Text
                style={{ fontSize: 14, fontWeight: '700', color: COLORS.primary }}
                numberOfLines={1}
              >
                {report.title}
              </Text>
              <Text style={{ fontSize: 11, color: COLORS.textMuted }} numberOfLines={1}>
                {reporterName} • {categoryEmoji(report.category)}{' '}
                {formatRelativeTime(report.created_at)}
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={18}
              color={COLORS.border}
              style={{ alignSelf: 'center' }}
            />
          </View>
        </View>
      )}
    </Pressable>
  );
}
