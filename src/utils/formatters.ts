// Helper formatter untuk display tanggal, waktu relatif, dan label kategori.

import { CATEGORIES, type CategoryId } from './constants';

export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return '';
  const diffMs = Date.now() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'baru saja';
  if (diffMin < 60) return `${diffMin}m lalu`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}j lalu`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}h lalu`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}mg lalu`;
  return then.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatFullDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const CATEGORY_BY_ID: Record<CategoryId, (typeof CATEGORIES)[number]> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<CategoryId, (typeof CATEGORIES)[number]>,
);

export function categoryLabel(id: CategoryId): string {
  return CATEGORY_BY_ID[id].label;
}

export function categoryEmoji(id: CategoryId): string {
  return CATEGORY_BY_ID[id].emoji;
}
