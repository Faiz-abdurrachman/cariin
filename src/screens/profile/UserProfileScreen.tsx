// Profil publik user lain — dipanggil dari DetailReport (tap reporter card)
// atau ChatRoom (tap nama lawan bicara). Referensi visual: cariin-web/user-profile.html.
// Dipasang di HomeStack, ChatStack, dan ProfileStack (sama param: {userId}).

import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '@/components/EmptyState';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import type {
  ChatStackParamList,
  HomeStackParamList,
  ProfileStackParamList,
} from '@/navigation/types';
import { getOrCreateConversation } from '@/services/chat.service';
import {
  getPublicProfile,
  type PublicProfile,
} from '@/services/profile.service';
import { listReports, type Report } from '@/services/report.service';
import { COLORS } from '@/utils/constants';
import { formatRelativeTime, categoryLabel } from '@/utils/formatters';

type CommonProfileStackParamList =
  & HomeStackParamList
  & ChatStackParamList
  & ProfileStackParamList;
type Nav = StackNavigationProp<CommonProfileStackParamList, 'UserProfile'>;
type Route = RouteProp<CommonProfileStackParamList, 'UserProfile'>;

export default function UserProfileScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { user } = useAuth();
  const userId = route.params.userId;

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileData, reportsData] = await Promise.all([
        getPublicProfile(userId),
        listReports({ userId, status: 'approved' }),
      ]);
      setProfile(profileData);
      setReports(reportsData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat profil.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 32,
            gap: 12,
          }}
        >
          <Feather name="alert-triangle" size={40} color={COLORS.lost} />
          <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.primary }}>
            Profil tidak ditemukan
          </Text>
          <Text style={{ fontSize: 13, color: COLORS.textMuted, textAlign: 'center' }}>
            {error ?? 'User ini mungkin sudah menghapus akunnya.'}
          </Text>
          <Pressable
            onPress={() => nav.goBack()}
            accessibilityRole="button"
          >
            {({ pressed }) => (
              <View
                style={{
                  marginTop: 12,
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  backgroundColor: COLORS.primary,
                  borderRadius: 12,
                  opacity: pressed ? 0.85 : 1,
                }}
              >
                <Text style={{ color: '#FFF', fontWeight: '600' }}>Kembali</Text>
              </View>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const joinYear = new Date(profile.created_at).getFullYear();
  const isFound = (type: string) => type === 'found';
  const activeReport = reports[0];

  const startChat = async () => {
    if (!activeReport || startingChat) return;
    setStartingChat(true);
    try {
      const conversation = await getOrCreateConversation(activeReport.id, userId);
      nav.navigate('ChatRoom', {
        conversationId: conversation.id,
        reportId: activeReport.id,
      });
    } catch (chatError) {
      Alert.alert(
        'Gagal membuka percakapan',
        chatError instanceof Error ? chatError.message : 'Coba lagi.',
      );
    } finally {
      setStartingChat(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header back */}
      <View
        style={{
          position: 'absolute',
          top: 56,
          left: 16,
          zIndex: 10,
        }}
      >
        <Pressable
          onPress={() => nav.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
        >
          {({ pressed }) => (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.7 : 1,
              }}
            >
              <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </View>
          )}
        </Pressable>
      </View>

      {/* Banner + avatar overlay */}
      <View style={{ height: 160, backgroundColor: COLORS.primary }}>
        <View
          style={{
            flex: 1,
            opacity: 0.15,
            backgroundColor: '#3F3F46',
          }}
        />
      </View>

      {/* Profile card overlapping banner */}
      <View
        style={{
          marginTop: -48,
          paddingHorizontal: 20,
          zIndex: 5,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 32,
            padding: 20,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#F4F4F5',
          }}
        >
          {/* Avatar */}
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 999,
              backgroundColor: '#E4E4E7',
              borderWidth: 4,
              borderColor: COLORS.surface,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              marginTop: -64,
              marginBottom: 12,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            }}
          >
            {profile.avatar_url ? (
              <Image
                source={{ uri: profile.avatar_url }}
                style={{ width: 96, height: 96 }}
                resizeMode="cover"
              />
            ) : (
              <Feather name="user" size={36} color={COLORS.textMuted} />
            )}
          </View>

          <Text
            style={{ fontSize: 20, fontWeight: '700', color: COLORS.primary }}
          >
            {profile.name}
          </Text>
          {profile.faculty ? (
            <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
              {profile.faculty}
            </Text>
          ) : null}
          <Text
            style={{ fontSize: 12, fontWeight: '600', color: COLORS.textMuted, marginTop: 4 }}
          >
            Bergabung sejak {joinYear}
          </Text>

          {user?.id !== userId && activeReport ? (
            <Pressable
              onPress={() => void startChat()}
              disabled={startingChat}
              style={{ marginTop: 16 }}
              accessibilityRole="button"
              accessibilityLabel={`Kirim pesan tentang ${activeReport.title}`}
            >
              {({ pressed }) => (
                <View
                  style={{
                    paddingHorizontal: 24,
                    paddingVertical: 10,
                    backgroundColor: COLORS.primary,
                    borderRadius: 999,
                    opacity: pressed || startingChat ? 0.72 : 1,
                    shadowColor: '#000',
                    shadowOpacity: 0.12,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 4,
                  }}
                >
                  <Text
                    style={{ fontSize: 13, fontWeight: '700', color: '#FFFFFF' }}
                  >
                    {startingChat ? 'Membuka Pesan...' : 'Kirim Pesan'}
                  </Text>
                </View>
              )}
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Laporan aktif */}
      <View style={{ paddingHorizontal: 20, paddingTop: 24, flex: 1 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: '700',
            color: COLORS.primary,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          Laporan Aktif
        </Text>

        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                const target = item.type === 'lost' ? 'DetailLost' : 'DetailFound';
                nav.navigate(target, { reportId: item.id });
              }}
              accessibilityRole="button"
            >
              {({ pressed }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 12,
                    backgroundColor: COLORS.surface,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    borderRadius: 16,
                    padding: 12,
                    marginBottom: 12,
                    opacity: pressed ? 0.85 : 1,
                  }}
                >
                  {/* Thumbnail */}
                  <View
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 12,
                      backgroundColor: '#F4F4F5',
                      overflow: 'hidden',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.photo_url ? (
                      <Image
                        source={{ uri: item.photo_url }}
                        style={{ width: 72, height: 72 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Feather name="image" size={22} color={COLORS.textMuted} />
                    )}
                  </View>

                  {/* Info */}
                  <View style={{ flex: 1, justifyContent: 'center', gap: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <StatusBadge status={item.status} size="sm" />
                      <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.textMuted }}>
                        {isFound(item.type) ? 'Ditemukan' : 'Hilang'}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '700',
                        color: COLORS.primary,
                      }}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
                      {categoryLabel(item.category)} {formatRelativeTime(item.created_at)}
                    </Text>
                  </View>
                </View>
              )}
            </Pressable>
          )}
          ListEmptyComponent={
            <EmptyState
              icon="folder"
              title="Belum ada laporan aktif"
              subtitle="User ini belum memiliki laporan yang dipublikasikan."
            />
          }
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      </View>
    </SafeAreaView>
  );
}
