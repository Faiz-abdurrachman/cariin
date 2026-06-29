import { supabase } from '@/services/supabase';

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
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);
  return (data ?? []) as AppNotification[];
}

export async function markAsRead(id: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function markAllAsRead(): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('is_read', false);

  if (error) throw new Error(error.message);
}

export async function unreadCount(): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);

  if (error) throw new Error(error.message);
  return count ?? 0;
}
