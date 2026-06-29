import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ChatBubble from '@/components/ChatBubble';
import { useAuth } from '@/context/AuthContext';
import type { ChatStackParamList } from '@/navigation/types';
import { markMessagesAsRead } from '@/services/chat.service';
import { useChatStore } from '@/store/chatStore';
import { COLORS } from '@/utils/constants';

type Nav = StackNavigationProp<ChatStackParamList, 'ChatRoom'>;
type Route = RouteProp<ChatStackParamList, 'ChatRoom'>;

export default function ChatRoomScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { conversationId } = route.params;
  const { user } = useAuth();
  const {
    messages,
    loadingMessages,
    fetchMessages,
    sendMessage,
    subscribe,
    unsubscribe,
    fetchConversations,
    conversations,
  } = useChatStore();

  const [text, setText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const otherNameRef = useRef('...');

  const conversation = conversations.find((c) => c.id === conversationId);
  const otherUser = conversation
    ? conversation.user_a_id === user?.id
      ? conversation.user_b
      : conversation.user_a
    : null;
  otherNameRef.current = otherUser?.name ?? '...';
  const msgs = messages[conversationId] ?? [];

  useEffect(() => {
    void fetchMessages(conversationId);
    subscribe(conversationId);
    void markMessagesAsRead(conversationId);
    void fetchConversations();

    return () => {
      unsubscribe();
    };
  }, [conversationId, fetchConversations, fetchMessages, subscribe, unsubscribe]);

  useEffect(() => {
    if (msgs.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [msgs.length]);

  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText('');
    await sendMessage(conversationId, trimmed);
    void fetchConversations();
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [text, conversationId, sendMessage, fetchConversations]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <View
        style={{
          height: 56,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.surface,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <Pressable
          onPress={() => nav.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          hitSlop={8}
        >
          {({ pressed }) => (
            <Feather
              name="arrow-left"
              size={22}
              color={COLORS.primary}
              style={{ opacity: pressed ? 0.6 : 1 }}
            />
          )}
        </Pressable>

        {otherUser ? (
          <Pressable
            onPress={() => nav.navigate('UserProfile', { userId: otherUser.id })}
            style={{ flex: 1, marginLeft: 14 }}
            accessibilityRole="button"
          >
            {({ pressed }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    backgroundColor: '#F4F4F5',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather name="user" size={18} color={COLORS.textMuted} />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: COLORS.primary,
                    opacity: pressed ? 0.7 : 1,
                  }}
                  numberOfLines={1}
                >
                  {otherUser.name}
                </Text>
              </View>
            )}
          </Pressable>
        ) : (
          <Text
            style={{
              flex: 1,
              marginLeft: 14,
              fontSize: 16,
              fontWeight: '700',
              color: COLORS.primary,
            }}
            numberOfLines={1}
          >
            Chat
          </Text>
        )}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={msgs}
          renderItem={({ item, index }) => {
            const isMine = item.sender_id === user?.id;
            const prev = index > 0 ? msgs[index - 1] : null;
            const showTime = !prev || prev.sender_id !== item.sender_id;
            return <ChatBubble message={item} isMine={isMine} showTime={showTime} />;
          }}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingVertical: 12,
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            loadingMessages ? null : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 40,
                }}
              >
                <Feather name="message-circle" size={48} color={COLORS.border} />
                <Text
                  style={{
                    marginTop: 12,
                    fontSize: 14,
                    color: COLORS.textMuted,
                    textAlign: 'center',
                  }}
                >
                  Kirim pesan pertama untuk memulai percakapan.
                </Text>
              </View>
            )
          }
        />

        <SafeAreaView edges={['bottom']}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderTopWidth: 1,
              borderTopColor: COLORS.border,
              backgroundColor: COLORS.surface,
              gap: 8,
            }}
          >
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Ketik pesan..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              style={{
                flex: 1,
                fontSize: 14,
                paddingHorizontal: 14,
                paddingVertical: 10,
                backgroundColor: '#F4F4F5',
                borderRadius: 24,
                color: COLORS.primary,
                maxHeight: 100,
              }}
            />
            <Pressable
              onPress={handleSend}
              disabled={!text.trim()}
              accessibilityRole="button"
              accessibilityLabel="Kirim pesan"
            >
              {({ pressed }) => (
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    backgroundColor: text.trim() ? COLORS.primary : '#D4D4D8',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed ? 0.8 : 1,
                  }}
                >
                  <Feather name="send" size={16} color="#FFFFFF" />
                </View>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
