// Konstanta global Cari.In — referensi tunggal untuk warna, kategori, dan fakultas.
// Sumber: CONTEXT.md section 11. Update di sini akan menyebar ke seluruh aplikasi.

export const COLORS = {
  primary: '#18181B', // zinc-900
  lost: '#EF4444', // red-500
  lostBg: '#FEE2E2', // red-100
  lostText: '#991B1B', // red-800
  found: '#22C55E', // emerald-500
  foundBg: '#D1FAE5', // emerald-100
  foundText: '#065F46', // emerald-800
  admin: '#4F46E5', // indigo-600
  adminLight: '#EEF2FF', // indigo-50
  adminText: '#3730A3', // indigo-800
  pending: '#F59E0B', // amber-500
  approved: '#22C55E', // emerald-500
  rejected: '#EF4444', // red-500
  resolved: '#8B5CF6', // violet-500
  background: '#F4F4F5', // zinc-100
  surface: '#FFFFFF',
  border: '#E4E4E7', // zinc-200
  textMuted: '#71717A', // zinc-500
} as const;

export type CategoryId =
  | 'elektronik'
  | 'dokumen'
  | 'dompet_tas'
  | 'kunci'
  | 'aksesoris'
  | 'pakaian'
  | 'buku_atk'
  | 'lainnya';

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
}

export const CATEGORIES: readonly Category[] = [
  { id: 'elektronik', label: 'Elektronik', emoji: '💻' },
  { id: 'dokumen', label: 'Dokumen', emoji: '📄' },
  { id: 'dompet_tas', label: 'Dompet/Tas', emoji: '👜' },
  { id: 'kunci', label: 'Kunci', emoji: '🔑' },
  { id: 'aksesoris', label: 'Aksesoris', emoji: '💍' },
  { id: 'pakaian', label: 'Pakaian', emoji: '👕' },
  { id: 'buku_atk', label: 'Buku/ATK', emoji: '📚' },
  { id: 'lainnya', label: 'Lainnya', emoji: '📦' },
] as const;

// Daftar fakultas — placeholder sesuai CONTEXT.md, akan diupdate dengan data
// resmi UNU Yogyakarta di tahap polish (FASE 6).
export const FACULTIES: readonly string[] = [
  'Teknik',
  'Ekonomi',
  'Hukum',
  'FISIP',
  'FMIPA',
  'Kedokteran',
  'Pertanian',
  'Lainnya',
] as const;

// Status laporan untuk filter & badge.
export type ReportStatus = 'pending' | 'approved' | 'rejected' | 'resolved';
export type ReportType = 'lost' | 'found';
export type UserRole = 'mahasiswa' | 'admin';

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  pending: 'Menunggu Review',
  approved: 'Aktif',
  rejected: 'Ditolak',
  resolved: 'Selesai',
};
