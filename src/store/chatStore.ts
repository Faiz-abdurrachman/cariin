import type { RealtimeChannel } from '@supabase/supabase-js';
import { create } from 'zustand';
import * as chatService from '@/services/chat.service';
import type { Conversation, Message } from '@/services/chat.service';

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeChannel: RealtimeChannel | null;
  loadingConversations: boolean;
  loadingMessages: boolean;

  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  appendMessage: (conversationId: string, message: Message) => void;
  subscribe: (conversationId: string) => void;
  unsubscribe: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: {},
  activeChannel: null,
  loadingConversations: false,
  loadingMessages: false,

  async fetchConversations() {
    set({ loadingConversations: true });
    try {
      const data = await chatService.listConversations();
      set({ conversations: data, loadingConversations: false });
    } catch {
      set({ loadingConversations: false });
    }
  },

  async fetchMessages(conversationId: string) {
    set({ loadingMessages: true });
    try {
      const data = await chatService.listMessages(conversationId);
      set((s) => ({
        messages: { ...s.messages, [conversationId]: data },
        loadingMessages: false,
      }));
    } catch {
      set({ loadingMessages: false });
    }
  },

  async sendMessage(conversationId: string, content: string) {
    const msg = await chatService.sendMessage(conversationId, content);
    set((s) => ({
      messages: {
        ...s.messages,
        [conversationId]: [...(s.messages[conversationId] ?? []), msg],
      },
    }));
  },

  appendMessage(conversationId: string, message: Message) {
    const { messages } = get();
    const existing = messages[conversationId] ?? [];
    if (existing.some((m) => m.id === message.id)) return;
    set({
      messages: {
        ...messages,
        [conversationId]: [...existing, message],
      },
    });
  },

  subscribe(conversationId: string) {
    const { activeChannel } = get();
    if (activeChannel) activeChannel.unsubscribe();

    const channel = chatService.subscribeToMessages(conversationId, (msg) => {
      get().appendMessage(conversationId, msg);
    });
    set({ activeChannel: channel });
  },

  unsubscribe() {
    const { activeChannel } = get();
    if (activeChannel) {
      activeChannel.unsubscribe();
      set({ activeChannel: null });
    }
  },
}));
