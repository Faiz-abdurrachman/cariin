import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import * as notifService from '@/services/notification.service';

const NOTIFICATIONS_ENABLED_KEY = '@cariin/notifications-enabled';

interface NotifContextValue {
  unread: number;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  refresh: () => Promise<void>;
}

const NotifContext = createContext<NotifContextValue | null>(null);

export function NotifProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [unread, setUnread] = useState(0);
  const [notificationsEnabled, setNotificationsEnabledState] = useState(true);
  const [preferenceLoaded, setPreferenceLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    void AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY)
      .then((stored) => {
        if (active && stored != null) {
          setNotificationsEnabledState(stored === 'true');
        }
      })
      .finally(() => {
        if (active) setPreferenceLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || !notificationsEnabled) {
      setUnread(0);
      return;
    }
    try {
      const count = await notifService.unreadCount();
      setUnread(count);
    } catch {
      // silent fail — badge notif bukan critical path
    }
  }, [isAuthenticated, notificationsEnabled]);

  const setNotificationsEnabled = useCallback(async (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    if (!enabled) setUnread(0);
    await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, String(enabled));
  }, []);

  useEffect(() => {
    if (!preferenceLoaded || !notificationsEnabled || !isAuthenticated) {
      setUnread(0);
      return;
    }
    void refresh();
    const interval = setInterval(() => void refresh(), 15_000);
    return () => clearInterval(interval);
  }, [isAuthenticated, notificationsEnabled, preferenceLoaded, refresh]);

  const value = useMemo<NotifContextValue>(
    () => ({
      unread,
      notificationsEnabled,
      setNotificationsEnabled,
      refresh,
    }),
    [notificationsEnabled, refresh, setNotificationsEnabled, unread],
  );

  return <NotifContext.Provider value={value}>{children}</NotifContext.Provider>;
}

export function useNotif(): NotifContextValue {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error('useNotif harus dipakai di dalam <NotifProvider>');
  return ctx;
}
