export const COLORS = {
  primary: '#2563EB',
  primaryLight: '#DBEAFE',
  lost: '#F97316',
  lostBg: '#FFF7ED',
  lostText: '#9A3412',
  found: '#059669',
  foundBg: '#ECFDF5',
  foundText: '#065F46',
  admin: '#0D9488',
  adminLight: '#F0FDFA',
  adminText: '#134E4A',
  adminBorder: '#99F6E4',
  pending: '#F59E0B',
  approved: '#059669',
  rejected: '#F97316',
  resolved: '#8B5CF6',
  background: '#EFF6FF',
  surface: '#FFFFFF',
  border: '#BFDBFE',
  textMuted: '#64748B',
} as const;

export const RADIUS = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 999,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
} as const;

export const FONT_SIZE = {
  xs: 9,
  sm: 11,
  base: 13,
  md: 15,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
} as const;

export const SHADOW = {
  subtle: {
    shadowColor: '#2563EB',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  card: {
    shadowColor: '#2563EB',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  elevated: {
    shadowColor: '#2563EB',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
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
  icon: string;
}

export const CATEGORIES: readonly Category[] = [
  { id: 'elektronik', label: 'Elektronik', icon: 'laptop' },
  { id: 'dokumen', label: 'Dokumen', icon: 'file-document-outline' },
  { id: 'dompet_tas', label: 'Dompet/Tas', icon: 'wallet-outline' },
  { id: 'kunci', label: 'Kunci', icon: 'key' },
  { id: 'aksesoris', label: 'Aksesoris', icon: 'watch' },
  { id: 'pakaian', label: 'Pakaian', icon: 'tshirt-crew' },
  { id: 'buku_atk', label: 'Buku/ATK', icon: 'book-open-page-variant-outline' },
  { id: 'lainnya', label: 'Lainnya', icon: 'dots-horizontal' },
] as const;

export const FACULTIES: readonly string[] = [
  'FIH - Fakultas Industri Halal',
  'FTI - Fakultas Teknologi Informasi',
  'FE - Fakultas Ekonomi',
  'FIP - Fakultas Ilmu Pendidikan',
  'FDI - Fakultas Dirasah Islamiyah',
  'Lainnya',
] as const;

// Mapping fakultas → daftar program studi (prodi)
export const FACULTY_PROGRAMS: Record<string, readonly string[]> = {
  'FIH - Fakultas Industri Halal': [
    'S1 Farmasi',
    'S1 Agribisnis',
    'S1 Teknologi Hasil Pertanian',
  ],
  'FTI - Fakultas Teknologi Informasi': [
    'S1 Informatika',
    'S1 Teknik Elektro',
    'S1 Teknik Komputer',
  ],
  'FE - Fakultas Ekonomi': [
    'S1 Manajemen',
    'S1 Akuntansi',
  ],
  'FIP - Fakultas Ilmu Pendidikan': [
    'S1 Pendidikan Guru Sekolah Dasar (PGSD)',
    'S1 Pendidikan Bahasa Inggris',
  ],
  'FDI - Fakultas Dirasah Islamiyah': [
    'S1 Studi Islam Interdisipliner',
  ],
  'Lainnya': [],
} as const;

export type ReportStatus = 'pending' | 'approved' | 'rejected' | 'resolved';
export type ReportType = 'lost' | 'found';
export type UserRole = 'mahasiswa' | 'admin';

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  pending: 'Menunggu Review',
  approved: 'Aktif',
  rejected: 'Ditolak',
  resolved: 'Selesai',
};
