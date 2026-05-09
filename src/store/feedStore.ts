// Zustand store untuk feed laporan publik (HomeScreen).
// Cache hasil fetch + state filter — supaya pindah-pindah tab gak refetch tiap
// kali kecuali pull-to-refresh atau filter berubah.

import { create } from 'zustand';

import { listReports, type Report, type ReportFilter } from '@/services/report.service';

export interface FeedFilter {
  type: 'all' | 'lost' | 'found';
  category: ReportFilter['category'] | null;
  search: string;
}

interface FeedState {
  reports: Report[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  filter: FeedFilter;
  fetch: () => Promise<void>;
  refresh: () => Promise<void>;
  setFilter: (patch: Partial<FeedFilter>) => void;
  clearFilter: () => void;
}

const DEFAULT_FILTER: FeedFilter = {
  type: 'all',
  category: null,
  search: '',
};

function toServiceFilter(f: FeedFilter): ReportFilter {
  return {
    ...(f.type !== 'all' && { type: f.type }),
    ...(f.category && { category: f.category }),
    ...(f.search.trim().length > 0 && { search: f.search }),
  };
}

export const useFeedStore = create<FeedState>((set, get) => ({
  reports: [],
  loading: false,
  refreshing: false,
  error: null,
  filter: DEFAULT_FILTER,

  async fetch() {
    set({ loading: true, error: null });
    try {
      const data = await listReports(toServiceFilter(get().filter));
      set({ reports: data, loading: false });
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : 'Gagal memuat laporan.',
      });
    }
  },

  async refresh() {
    set({ refreshing: true, error: null });
    try {
      const data = await listReports(toServiceFilter(get().filter));
      set({ reports: data, refreshing: false });
    } catch (e) {
      set({
        refreshing: false,
        error: e instanceof Error ? e.message : 'Gagal memuat laporan.',
      });
    }
  },

  setFilter(patch) {
    set((s) => ({ filter: { ...s.filter, ...patch } }));
    void get().fetch();
  },

  clearFilter() {
    set({ filter: DEFAULT_FILTER });
    void get().fetch();
  },
}));
