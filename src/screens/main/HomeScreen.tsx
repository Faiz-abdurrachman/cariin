// HomeScreen — feed laporan publik dengan search, filter type, dan kategori.
// Referensi visual: cariin-web/home.html.

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useEffect } from 'react';
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

import CategoryGrid from '@/components/CategoryGrid';
import EmptyState from '@/components/EmptyState';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ReportCard from '@/components/ReportCard';
import { useAuth } from '@/context/AuthContext';
import { useNotif } from '@/context/NotifContext';
import type { HomeStackParamList } from '@/navigation/types';
import { useFeedStore } from '@/store/feedStore';
import { COLORS } from '@/utils/constants';

type Nav = StackNavigationProp<HomeStackParamList, 'HomeFeed'>;

const TYPE_FILTERS: { value: 'all' | 'lost' | 'found'; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'lost', label: 'Hilang' },
  { value: 'found', label: 'Ditemukan' },
];

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const { userProfile } = useAuth();
  const { unread } = useNotif();
  const { reports, loading, refreshing, error, filter, fetch, refresh, setFilter } =
    useFeedStore();

  useEffect(() => {
    void fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 11) return 'Selamat pagi';
    if (h < 15) return 'Selamat siang';
    if (h < 19) return 'Selamat sore';
    return 'Selamat malam';
  })();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }} edges={['top']}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 20 }}>
            <ReportCard
              report={item}
              onPress={() =>
                nav.navigate(item.type === 'lost' ? 'DetailLost' : 'DetailFound', {
                  reportId: item.id,
                })
              }
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListHeaderComponent={
          <View style={{ paddingBottom: 8 }}>
            {/* Header */}
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 8,
                paddingBottom: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: COLORS.background,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: '500' }}
                  numberOfLines={1}
                >
                  {greeting},
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: COLORS.primary,
                    marginTop: 2,
                  }}
                  numberOfLines={1}
                >
                  {userProfile?.name ?? 'Mahasiswa'}
                </Text>
              </View>
              <Pressable
                onPress={() => nav.getParent()?.navigate('ChatTab', { screen: 'Notifications' })}
                accessibilityRole="button"
                accessibilityLabel="Notifikasi"
              >
                {({ pressed }) => (
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 999,
                      backgroundColor: COLORS.surface,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: pressed ? 0.7 : 1,
                    }}
                  >
                    {userProfile?.avatar_url ? (
                      <Image
                        source={{ uri: userProfile.avatar_url }}
                        style={{ width: 44, height: 44, borderRadius: 999 }}
                      />
                    ) : (
                      <Feather name="bell" size={20} color={COLORS.primary} />
                    )}
                    {unread > 0 ? (
                      <View
                        style={{
                          position: 'absolute',
                          top: -2,
                          right: -2,
                          minWidth: 18,
                          height: 18,
                          borderRadius: 999,
                          backgroundColor: '#EF4444',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingHorizontal: 4,
                          borderWidth: 1.5,
                          borderColor: COLORS.surface,
                        }}
                      >
                        <Text
                          style={{
                            color: '#FFFFFF',
                            fontSize: 10,
                            fontWeight: '800',
                          }}
                        >
                          {unread > 99 ? '99+' : unread}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                )}
              </Pressable>
            </View>

            {/* Search */}
            <View style={{ paddingHorizontal: 20, marginTop: 4 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: COLORS.surface,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  paddingHorizontal: 14,
                  height: 48,
                  gap: 8,
                }}
              >
                <Feather name="search" size={18} color={COLORS.textMuted} />
                <TextInput
                  value={filter.search}
                  onChangeText={(t) => setFilter({ search: t })}
                  placeholder="Cari barang hilang..."
                  placeholderTextColor={COLORS.textMuted}
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: COLORS.primary,
                    paddingVertical: 0,
                  }}
                  returnKeyType="search"
                />
                {filter.search.length > 0 ? (
                  <Pressable
                    onPress={() => setFilter({ search: '' })}
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

            {/* Type filter chips */}
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                paddingHorizontal: 20,
                marginTop: 16,
              }}
            >
              {TYPE_FILTERS.map((f) => {
                const active = filter.type === f.value;
                return (
                  <Pressable
                    key={f.value}
                    onPress={() => setFilter({ type: f.value })}
                    accessibilityRole="button"
                  >
                    {({ pressed }) => (
                      <Text
                        style={{
                          backgroundColor: active ? COLORS.primary : COLORS.surface,
                          color: active ? '#FFFFFF' : COLORS.textMuted,
                          borderWidth: active ? 0 : 1,
                          borderColor: COLORS.border,
                          paddingHorizontal: 18,
                          paddingVertical: 9,
                          borderRadius: 999,
                          fontSize: 13,
                          fontWeight: '600',
                          opacity: pressed ? 0.7 : 1,
                          overflow: 'hidden',
                        }}
                      >
                        {f.label}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>

            {/* Categories */}
            <View style={{ marginTop: 14, marginBottom: 16 }}>
              <CategoryGrid
                selected={filter.category ?? null}
                onSelect={(id) => setFilter({ category: id })}
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={{ paddingHorizontal: 20 }}>
              <LoadingSkeleton count={3} />
            </View>
          ) : error ? (
            <EmptyState
              icon="alert-triangle"
              title="Gagal memuat laporan"
              subtitle={error}
            />
          ) : (
            <EmptyState
              icon="inbox"
              title="Belum ada laporan"
              subtitle="Tarik ke bawah untuk refresh, atau coba ubah filter."
            />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={COLORS.primary}
          />
        }
      />
    </SafeAreaView>
  );
}
