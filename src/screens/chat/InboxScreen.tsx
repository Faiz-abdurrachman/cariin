import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, Text, View } from 'react-native';
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

export default function InboxScreen() {
  const nav = useNavigation<Nav>();
  const { user } = useAuth();
  const { conversations, loadingConversations, fetchConversations } = useChatStore();
  const [refreshing, setRefreshing] = useState(false);

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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              gap: 14,
              backgroundColor: pressed ? '#FAFAFA' : COLORS.surface,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border,
            }}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 999,
                backgroundColor: '#F4F4F5',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {otherAvatar ? (
                <Image
                  source={{ uri: otherAvatar }}
                  style={{ width: 52, height: 52 }}
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
                  style={{ fontSize: 15, fontWeight: '700', color: COLORS.primary }}
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
              <Text
                style={{ fontSize: 13, color: COLORS.textMuted }}
                numberOfLines={1}
              >
                {item.last_message ?? 'Belum ada pesan'}
              </Text>
            </View>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <View
        style={{
          height: 56,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.surface,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.primary }}>
          Pesan
        </Text>
      </View>

      {loadingConversations ? (
        <LoadingSkeleton count={4} />
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="message-circle"
              title="Belum ada percakapan"
              subtitle="Chat tersedia setelah kamu menghubungi pelapor atau penemu dari Detail laporan."
            />
          }
          contentContainerStyle={conversations.length === 0 ? { flexGrow: 1 } : undefined}
        />
      )}
    </SafeAreaView>
  );
}
