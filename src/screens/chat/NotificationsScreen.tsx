import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '@/components/EmptyState';
import { useNotif } from '@/context/NotifContext';
import type { ChatStackParamList, MainTabParamList } from '@/navigation/types';
import * as notifService from '@/services/notification.service';
import type { AppNotification } from '@/services/notification.service';
import { COLORS } from '@/utils/constants';
import { formatRelativeTime } from '@/utils/formatters';

type ChatNav = StackNavigationProp<ChatStackParamList, 'Notifications'>;

const NOTIF_ICONS: Record<AppNotification['type'], keyof typeof Feather.glyphMap> = {
  report_approved: 'check-circle',
  report_rejected: 'x-circle',
  new_message: 'message-circle',
};

const NOTIF_COLORS: Record<AppNotification['type'], string> = {
  report_approved: '#059669',
  report_rejected: COLORS.lost,
  new_message: COLORS.primary,
};

export default function NotificationsScreen() {
  const nav = useNavigation<ChatNav>();
  const { refresh: refreshBadge } = useNotif();
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await notifService.listNotifications();
      setNotifs(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const onPress = async (item: AppNotification) => {
    if (!item.is_read) {
      try {
        await notifService.markAsRead(item.id);
        setNotifs((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n)),
        );
        void refreshBadge();
      } catch {
        // silent
      }
    }

    if (item.type === 'new_message' && item.ref_id) {
      nav.navigate('ChatRoom', {
        conversationId: item.ref_id,
        reportId: '',
      });
    } else if (item.ref_id) {
      const parent = nav.getParent<StackNavigationProp<MainTabParamList>>();
      parent?.navigate('HomeTab', {
        screen: 'DetailLost',
        params: { reportId: item.ref_id },
      });
    }
  };

  const markAll = async () => {
    try {
      await notifService.markAllAsRead();
      setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
      void refreshBadge();
    } catch {
      // silent
    }
  };

  const hasUnread = notifs.some((n) => !n.is_read);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <View
        style={{
          height: 56,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: COLORS.surface,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.primary }}>
          Notifikasi
        </Text>
        {hasUnread ? (
          <Pressable
            onPress={markAll}
            accessibilityRole="button"
            accessibilityLabel="Tandai semua sudah dibaca"
          >
            {({ pressed }) => (
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: COLORS.primary,
                  opacity: pressed ? 0.6 : 1,
                }}
              >
                Tandai semua
              </Text>
            )}
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={notifs}
        renderItem={({ item }) => (
          <Pressable onPress={() => void onPress(item)} accessibilityRole="button">
            {({ pressed }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  padding: 16,
                  gap: 12,
                  backgroundColor: pressed
                    ? '#FAFAFA'
                    : item.is_read
                      ? COLORS.surface
                      : '#F0F0FF',
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.border,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    backgroundColor: NOTIF_COLORS[item.type] + '15',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather
                    name={NOTIF_ICONS[item.type]}
                    size={18}
                    color={NOTIF_COLORS[item.type]}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: item.is_read ? '600' : '700',
                      color: COLORS.primary,
                      marginBottom: 2,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 18 }}>
                    {item.body}
                  </Text>
                  <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>
                    {formatRelativeTime(item.created_at)}
                  </Text>
                </View>
                {!item.is_read ? (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      backgroundColor: COLORS.primary,
                      marginTop: 6,
                    }}
                  />
                ) : null}
              </View>
            )}
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          loading ? null : (
            <EmptyState
              icon="bell"
              title="Belum ada notifikasi"
              subtitle="Notifikasi akan muncul saat laporan kamu di-review atau ada pesan baru."
            />
          )
        }
        contentContainerStyle={notifs.length === 0 ? { flexGrow: 1 } : undefined}
      />
    </SafeAreaView>
  );
}
