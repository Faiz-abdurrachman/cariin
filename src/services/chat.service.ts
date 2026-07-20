import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { getCurrentUserId } from '@/services/auth.service';

export interface Conversation {
  id: string;
  report_id: string;
  user_a_id: string;
  user_b_id: string;
  last_message: string | null;
  last_at: string | null;
  created_at: string;
  report: {
    title: string;
  } | null;
  user_a: {
    id: string;
    name: string;
    avatar_url: string | null;
  } | null;
  user_b: {
    id: string;
    name: string;
    avatar_url: string | null;
  } | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

const CONVERSATION_SELECT = `*, report:report_id(title), user_a:user_a_id(id, name, avatar_url), user_b:user_b_id(id, name, avatar_url)`;

export async function listConversations(): Promise<Conversation[]> {
  const currentUserId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('conversations')
    .select(CONVERSATION_SELECT)
    .or(
      `user_a_id.eq.${currentUserId},user_b_id.eq.${currentUserId}`,
    )
    .order('last_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Conversation[];
}

export async function getOrCreateConversation(
  reportId: string,
  otherUserId: string,
): Promise<Conversation> {
  const currentUserId = await getCurrentUserId();
  if (currentUserId === otherUserId) {
    throw new Error('Percakapan tidak dapat dibuat dengan akun sendiri.');
  }

  const userAId = currentUserId < otherUserId ? currentUserId : otherUserId;
  const userBId = currentUserId < otherUserId ? otherUserId : currentUserId;

  const { data: existing, error: existingError } = await supabase
    .from('conversations')
    .select(CONVERSATION_SELECT)
    .eq('report_id', reportId)
    .eq('user_a_id', userAId)
    .eq('user_b_id', userBId)
    .maybeSingle();

  if (existingError) throw new Error(existingError.message);
  if (existing) return existing as Conversation;

  const { data: created, error: insertError } = await supabase
    .from('conversations')
    .insert({
      report_id: reportId,
      user_a_id: userAId,
      user_b_id: userBId,
    })
    .select(CONVERSATION_SELECT)
    .single();

  if (insertError?.code === '23505') {
    // Dua perangkat dapat membuat conversation yang sama hampir bersamaan.
    // Ambil row pemenang unique constraint agar flow tetap idempotent.
    const { data: concurrent, error: concurrentError } = await supabase
      .from('conversations')
      .select(CONVERSATION_SELECT)
      .eq('report_id', reportId)
      .eq('user_a_id', userAId)
      .eq('user_b_id', userBId)
      .single();
    if (concurrentError) throw new Error(concurrentError.message);
    return concurrent as Conversation;
  }
  if (insertError) throw new Error(insertError.message);
  if (!created) throw new Error('Gagal membuat percakapan.');
  return created as Conversation;
}

export async function listMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Message[];
}

export async function sendMessage(
  conversationId: string,
  content: string,
): Promise<Message> {
  const trimmed = content.trim();
  if (!trimmed) throw new Error('Pesan tidak boleh kosong.');
  const senderId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: trimmed,
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Gagal mengirim pesan.');
  return data as Message;
}

export function subscribeToMessages(
  conversationId: string,
  onInsert: (message: Message) => void,
): RealtimeChannel {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onInsert(payload.new as Message);
      },
    )
    .subscribe();
}

export async function markMessagesAsRead(conversationId: string): Promise<void> {
  const currentUserId = await getCurrentUserId();

  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', currentUserId)
    .eq('is_read', false);

  if (error) throw new Error(error.message);
}
