import { supabase } from '@/services/supabase';
import { getCurrentUserId } from '@/services/auth.service';

export interface AppNotification {
  id: string;
  user_id: string;
  type: 'report_approved' | 'report_rejected' | 'new_message';
  title: string;
  body: string;
  is_read: boolean;
  ref_id: string | null;
  created_at: string;
}

export async function listNotifications(): Promise<AppNotification[]> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);
  return (data ?? []) as AppNotification[];
}

export async function markAsRead(id: string): Promise<void> {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
}

export async function markAllAsRead(): Promise<void> {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw new Error(error.message);
}

export async function unreadCount(): Promise<number> {
  const userId = await getCurrentUserId();
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw new Error(error.message);
  return count ?? 0;
}
