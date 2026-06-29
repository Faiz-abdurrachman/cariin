import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import * as notifService from '@/services/notification.service';

interface NotifContextValue {
  unread: number;
  refresh: () => Promise<void>;
}

const NotifContext = createContext<NotifContextValue | null>(null);

export function NotifProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [unread, setUnread] = useState(0);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setUnread(0);
      return;
    }
    try {
      const count = await notifService.unreadCount();
      setUnread(count);
    } catch {
      // silent fail — badge notif bukan critical path
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refresh();
    const interval = setInterval(() => void refresh(), 15_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const value = useMemo<NotifContextValue>(() => ({ unread, refresh }), [unread, refresh]);

  return <NotifContext.Provider value={value}>{children}</NotifContext.Provider>;
}

export function useNotif(): NotifContextValue {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error('useNotif harus dipakai di dalam <NotifProvider>');
  return ctx;
}
