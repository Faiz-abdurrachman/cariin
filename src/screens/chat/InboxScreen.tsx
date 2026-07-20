import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, Text, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '@/components/EmptyState';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useAuth } from '@/context/AuthContext';
import type { ChatStackParamList } from '@/navigation/types';
import type { Conversation } from '@/services/chat.service';
import { useChatStore } from '@/store/chatStore';
import { COLORS } from '@/utils/constants';
import { formatRelativeTime } from '@/utils/formatters';

type Nav = StackNavigationProp<ChatStackParamList, 'Inbox'>;
type Route = RouteProp<ChatStackParamList, 'Inbox'>;

export default function InboxScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<Route>();
  const redirectHandled = useRef<string | null>(null);

  const { user, role } = useAuth();
  const { conversations, loadingConversations, fetchConversations } = useChatStore();
  const [refreshing, setRefreshing] = useState(false);
  const isAdmin = role === 'admin';
  const accent = isAdmin ? COLORS.admin : COLORS.primary;
  const background = isAdmin ? COLORS.adminLight : COLORS.background;

  useEffect(() => {
    const { openConversationId, openReportId } = route.params ?? {};
    if (openConversationId && openReportId && redirectHandled.current !== openConversationId) {
      redirectHandled.current = openConversationId;
      nav.navigate('ChatRoom', {
        conversationId: openConversationId,
        reportId: openReportId,
      });
    }
  }, [route.params, nav]);

  useFocusEffect(
    useCallback(() => {
      void fetchConversations();
    }, [fetchConversations]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConversations();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Conversation }) => {
    const other = item.user_a_id === user?.id ? item.user_b : item.user_a;
    const otherName = other?.name ?? 'Pengguna';
    const otherAvatar = other?.avatar_url ?? null;

    return (
      <Pressable
        onPress={() =>
          nav.navigate('ChatRoom', {
            conversationId: item.id,
            reportId: item.report_id,
          })
        }
        accessibilityRole="button"
      >
        {({ pressed }) => (
          <View style={{ marginHorizontal: 16, marginBottom: 10, opacity: pressed ? 0.92 : 1 }}>
            <BlurView
              intensity={50}
              tint="light"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 14,
                gap: 14,
                backgroundColor: 'rgba(255,255,255,0.44)',
                borderRadius: 22,
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.76)',
                overflow: 'hidden',
              }}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.18)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
              />
              <View
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 18,
                  backgroundColor: '#F4F4F5',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {otherAvatar ? (
                  <Image
                    source={{ uri: otherAvatar }}
                    style={{ width: 54, height: 54 }}
                    resizeMode="cover"
                  />
                ) : (
                  <Feather name="user" size={24} color={COLORS.textMuted} />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}
                >
                  <Text
                    style={{ fontSize: 15, fontWeight: '800', color: accent }}
                    numberOfLines={1}
                  >
                    {otherName}
                  </Text>
                  {item.last_at ? (
                    <Text style={{ fontSize: 11, color: COLORS.textMuted }}>
                      {formatRelativeTime(item.last_at)}
                    </Text>
                  ) : null}
                </View>
                <Text style={{ fontSize: 13, color: COLORS.textMuted }} numberOfLines={1}>
                  {item.last_message ?? 'Belum ada pesan'}
                </Text>
                {item.report?.title ? (
                  <Text style={{ fontSize: 11, color: accent, marginTop: 2 }} numberOfLines={1}>
                    Re: {item.report.title}
                  </Text>
                ) : null}
              </View>
            </BlurView>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: background }}>
      <View
        style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 350,
          height: 350,
          borderRadius: 999,
          backgroundColor: accent,
          opacity: 0.15,
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
          opacity: 0.14,
          transform: [{ scale: 1.2 }],
        }}
        pointerEvents="none"
      />

      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'transparent' }}>
        <BlurView
          intensity={60}
          tint="light"
          style={{
            marginHorizontal: 16,
            marginTop: 2,
            marginBottom: 10,
            paddingHorizontal: 16,
            paddingVertical: 14,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.42)',
            borderRadius: 24,
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.76)',
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.18)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <Text style={{ fontSize: 20, fontWeight: '900', color: accent }}>
            Pesan
          </Text>
          <Text style={{ fontSize: 12, color: COLORS.textMuted, marginLeft: 10 }}>
            Percakapan aktif dan riwayat chat.
          </Text>
        </BlurView>

        {loadingConversations ? (
          <LoadingSkeleton count={4} />
        ) : (
          <FlatList
            data={conversations}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accent} />
            }
            ListEmptyComponent={
              <EmptyState
                icon="message-circle"
                title="Belum ada percakapan"
                subtitle="Chat tersedia setelah kamu menghubungi pelapor atau penemu dari Detail laporan."
              />
            }
            contentContainerStyle={{
              paddingTop: 4,
              paddingBottom: 132,
              flexGrow: conversations.length === 0 ? 1 : undefined,
            }}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
