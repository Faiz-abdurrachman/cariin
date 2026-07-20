import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import ChatBubble from '@/components/ChatBubble';
import { useAuth } from '@/context/AuthContext';
import { useKeyboardHeight } from '@/hooks/useKeyboardHeight';
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
  const { user, role } = useAuth();
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
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
  const isAdmin = role === 'admin';
  const keyboardVisible = keyboardHeight > 0;
  const accent = isAdmin ? COLORS.admin : COLORS.primary;
  const background = isAdmin ? COLORS.adminLight : COLORS.background;

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
    void markMessagesAsRead(conversationId).catch(() => {
      // Read receipt bukan critical path; pesan tetap dapat dibaca/dikirim.
    });
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
    try {
      await sendMessage(conversationId, trimmed);
      void fetchConversations();
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      setText(trimmed);
      Alert.alert(
        'Pesan gagal dikirim',
        error instanceof Error ? error.message : 'Coba lagi.',
      );
    }
  }, [text, conversationId, sendMessage, fetchConversations]);

  return (
    <View style={{ flex: 1, backgroundColor: background }}>
      <View
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 360,
          height: 360,
          borderRadius: 999,
          backgroundColor: accent,
          opacity: 0.12,
          transform: [{ scale: 1.25 }],
        }}
        pointerEvents="none"
      />
      <View
        style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 320,
          height: 320,
          borderRadius: 999,
          backgroundColor: COLORS.found,
          opacity: 0.12,
          transform: [{ scale: 1.15 }],
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
            borderColor: 'rgba(255,255,255,0.78)',
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
          <Pressable
            onPress={() => {
              if (nav.canGoBack()) {
                nav.goBack();
              } else {
                nav.replace('Inbox');
              }
            }}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            hitSlop={8}
          >
            {({ pressed }) => (
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 14,
                  backgroundColor: 'rgba(255,255,255,0.62)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.82)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.7 : 1,
                }}
              >
                <Feather name="arrow-left" size={20} color={accent} />
              </View>
            )}
          </Pressable>

          {otherUser ? (
            <Pressable
              onPress={() => nav.navigate('UserProfile', { userId: otherUser.id })}
              style={{ flex: 1, marginLeft: 14 }}
              accessibilityRole="button"
            >
              {({ pressed }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 14,
                      backgroundColor: 'rgba(255,255,255,0.62)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.82)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Feather name="user" size={18} color={COLORS.textMuted} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '900',
                        color: accent,
                        opacity: pressed ? 0.78 : 1,
                      }}
                      numberOfLines={1}
                    >
                      {otherUser.name}
                    </Text>
                    <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }} numberOfLines={1}>
                      Ketuk untuk lihat profil
                    </Text>
                  </View>
                </View>
              )}
            </Pressable>
          ) : (
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={{ fontSize: 16, fontWeight: '900', color: accent }} numberOfLines={1}>
                Chat
              </Text>
              <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }} numberOfLines={1}>
                Percakapan aktif
              </Text>
            </View>
          )}
        </BlurView>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <FlatList
            ref={flatListRef}
            data={msgs}
            renderItem={({ item, index }) => {
              const isMine = item.sender_id === user?.id;
              const prev = index > 0 ? msgs[index - 1] : null;
              const showTime = !prev || prev.sender_id !== item.sender_id;
              return (
                <ChatBubble
                  message={item}
                  isMine={isMine}
                  showTime={showTime}
                  variant={isAdmin ? 'admin' : 'default'}
                />
              );
            }}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{
              paddingTop: 8,
              paddingBottom: 16,
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

          <View
            style={{
              paddingHorizontal: 12,
              paddingTop: 8,
              paddingBottom: keyboardVisible ? 8 : Math.max(insets.bottom, 8),
            }}
          >
            <BlurView
              intensity={60}
              tint="light"
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 28,
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.8)',
                backgroundColor: 'rgba(255,255,255,0.44)',
                overflow: 'hidden',
              }}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.18)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
              />
              <View style={{ flex: 1, paddingRight: 10 }}>
                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder="Ketik pesan..."
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                  style={{
                    minHeight: 42,
                    maxHeight: 110,
                    fontSize: 14,
                    paddingHorizontal: 12,
                    paddingTop: 10,
                    paddingBottom: 10,
                    color: accent,
                    fontWeight: '600',
                    textAlignVertical: 'top',
                    backgroundColor: 'rgba(255,255,255,0.58)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.74)',
                    borderRadius: 18,
                  }}
                />
              </View>
              <Pressable
                onPress={handleSend}
                disabled={!text.trim()}
                accessibilityRole="button"
                accessibilityLabel="Kirim pesan"
              >
                {({ pressed }) => (
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 16,
                      backgroundColor: text.trim() ? accent : '#D4D4D8',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: pressed ? 0.82 : 1,
                    }}
                  >
                    <Feather name="send" size={16} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            </BlurView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
