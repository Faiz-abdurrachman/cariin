// HomeScreen — feed laporan publik dengan search, filter type, dan kategori.

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
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

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
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View
        style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 360,
          height: 360,
          borderRadius: 999,
          backgroundColor: COLORS.primary,
          opacity: 0.18,
          transform: [{ scale: 1.35 }],
        }}
        pointerEvents="none"
      />
      <View
        style={{
          position: 'absolute',
          bottom: -60,
          left: -60,
          width: 320,
          height: 320,
          borderRadius: 999,
          backgroundColor: COLORS.found,
          opacity: 0.14,
          transform: [{ scale: 1.2 }],
        }}
        pointerEvents="none"
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          windowSize={5}
          maxToRenderPerBatch={5}
          initialNumToRender={4}
          removeClippedSubviews
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
          contentContainerStyle={{ paddingBottom: 132 }}
          ListHeaderComponent={
            <View style={{ paddingBottom: 10 }}>
              <BlurView
                intensity={60}
                tint="light"
                style={{
                  marginHorizontal: 16,
                  marginTop: 2,
                  borderRadius: 32,
                  overflow: 'hidden',
                  borderWidth: 1.5,
                  borderColor: 'rgba(255,255,255,0.76)',
                  backgroundColor: 'rgba(255,255,255,0.42)',
                  padding: 18,
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 18,
                  shadowOffset: { width: 0, height: 10 },
                  elevation: 4,
                }}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.18)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                  pointerEvents="none"
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: '600' }} numberOfLines={1}>
                      {greeting},
                    </Text>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: '900',
                        color: COLORS.primary,
                        marginTop: 2,
                        letterSpacing: -0.4,
                      }}
                      numberOfLines={1}
                    >
                      {userProfile?.name ?? 'Mahasiswa'}
                    </Text>
                    <Text style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4, lineHeight: 19 }}>
                      Temukan barang yang hilang atau bantu kembalikan barang yang ditemukan.
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
                          width: 46,
                          height: 46,
                          borderRadius: 16,
                          backgroundColor: 'rgba(255,255,255,0.58)',
                          borderWidth: 1,
                          borderColor: 'rgba(255,255,255,0.8)',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: pressed ? 0.72 : 1,
                          overflow: 'hidden',
                        }}
                      >
                        {userProfile?.avatar_url ? (
                          <Image
                            source={{ uri: userProfile.avatar_url }}
                            style={{ width: 46, height: 46, borderRadius: 16 }}
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
              </BlurView>

              <BlurView
                intensity={55}
                tint="light"
                style={{
                  marginHorizontal: 16,
                  marginTop: 14,
                  borderRadius: 22,
                  overflow: 'hidden',
                  borderWidth: 1.5,
                  borderColor: 'rgba(255,255,255,0.76)',
                  backgroundColor: 'rgba(255,255,255,0.42)',
                  paddingHorizontal: 14,
                  height: 54,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.86)', 'rgba(255,255,255,0.16)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                  pointerEvents="none"
                />
                <Feather name="search" size={18} color={COLORS.textMuted} />
                <TextInput
                  value={filter.search}
                  onChangeText={(t) => setFilter({ search: t })}
                  placeholder="Cari barang, lokasi, atau deskripsi..."
                  placeholderTextColor={COLORS.textMuted}
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: COLORS.primary,
                    paddingVertical: 0,
                    fontWeight: '600',
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
              </BlurView>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 8,
                  paddingHorizontal: 20,
                  marginTop: 14,
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
                            backgroundColor: active ? COLORS.primary : 'rgba(255,255,255,0.72)',
                            color: active ? '#FFFFFF' : COLORS.textMuted,
                            borderWidth: active ? 0 : 1,
                            borderColor: 'rgba(255,255,255,0.8)',
                            paddingHorizontal: 18,
                            paddingVertical: 10,
                            borderRadius: 999,
                            fontSize: 13,
                            fontWeight: '700',
                            opacity: pressed ? 0.78 : 1,
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
    </View>
  );
}
