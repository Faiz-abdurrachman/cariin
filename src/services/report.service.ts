// Wrapper Supabase untuk operasi tabel `reports` — semua CRUD lewat sini agar
// validasi & error handling terpusat. Pola sama dgn auth.service.ts:
// PostgrestError bukan Error class instance, jadi di-rewrap pakai
// `throw new Error(error.message)` supaya UI bisa kebaca.

import { supabase } from './supabase';
import type { CategoryId, ReportStatus, ReportType } from '@/utils/constants';

// ----- TYPES -----

export interface Reporter {
  name: string;
  nim: string | null;
  faculty: string | null;
  avatar_url: string | null;
}

export interface Report {
  id: string;
  user_id: string | null;
  type: ReportType;
  title: string;
  description: string | null;
  category: CategoryId;
  location: string;
  custody_point: string | null;
  photo_url: string | null;
  status: ReportStatus;
  admin_note: string | null;
  created_by_admin: boolean;
  event_time: string | null;
  reporter_name: string | null;
  reporter_nim: string | null;
  reporter_faculty: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  reporter?: Reporter | null;
}

export interface ReportInput {
  type: ReportType;
  title: string;
  description?: string | null;
  category: CategoryId;
  location: string;
  custody_point?: string | null;
  photo_url?: string | null;
  event_time?: string | null;
}

export interface ReportFilter {
  type?: ReportType;
  category?: CategoryId;
  status?: ReportStatus;
  search?: string;
  userId?: string; // dipakai MyPosts: filter laporan milik user tertentu
  includeAllStatuses?: boolean; // khusus admin: jangan pasang filter status default
}

// PostgREST foreign embed: `reporter:user_id (...)`. Pakai alias `reporter`
// supaya jelas di UI; kolom-kolom yg dibutuhkan untuk display (nama+fakultas).
const REPORT_SELECT =
  '*, reporter:user_id ( name, nim, faculty, avatar_url )';

// ----- HELPERS -----

function escapeLike(s: string): string {
  // Escape wildcard PostgREST ilike supaya user input "50%" gak ditafsir wildcard.
  return s.replace(/[%_\\]/g, (m) => `\\${m}`);
}

// ----- API -----

export async function listReports(filter: ReportFilter = {}): Promise<Report[]> {
  let q = supabase.from('reports').select(REPORT_SELECT);

  // Default: hanya tampilkan approved+resolved untuk feed publik (RLS juga
  // memfilter, tapi explicit di query menghemat round trip & jelas intent).
  // Untuk MyPosts (userId di-set), tampilkan semua status milik user.
  if (filter.userId) q = q.eq('user_id', filter.userId);

  if (filter.status) {
    q = q.eq('status', filter.status);
  } else if (!filter.userId && !filter.includeAllStatuses) {
    q = q.in('status', ['approved', 'resolved']);
  }

  if (filter.type) q = q.eq('type', filter.type);
  if (filter.category) q = q.eq('category', filter.category);
  if (filter.search && filter.search.trim().length > 0) {
    const term = escapeLike(filter.search.trim()).replace(/[(),"]/g, ' ').trim();
    if (term) {
      q = q.or(
        `title.ilike.%${term}%,location.ilike.%${term}%,description.ilike.%${term}%`,
      );
    }
  }

  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Report[];
}

export async function getReportById(id: string): Promise<Report> {
  const { data, error } = await supabase
    .from('reports')
    .select(REPORT_SELECT)
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Laporan tidak ditemukan.');
  return data as Report;
}

export async function createReport(input: ReportInput): Promise<Report> {
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id;
  if (!userId) throw new Error('Sesi tidak valid. Silakan login ulang.');

  const { data, error } = await supabase
    .from('reports')
    .insert({
      user_id: userId,
      type: input.type,
      title: input.title,
      description: input.description ?? null,
      category: input.category,
      location: input.location,
      custody_point: input.custody_point ?? null,
      photo_url: input.photo_url ?? null,
      event_time: input.event_time ?? null,
      status: 'pending', // default schema, di-set eksplisit biar jelas
    })
    .select(REPORT_SELECT)
    .single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Gagal membuat laporan.');
  return data as Report;
}

export async function updateReport(
  id: string,
  patch: Partial<ReportInput>,
): Promise<Report> {
  // RLS `reports_update_self` memblokir update kalau status='resolved' atau
  // bukan owner — gak perlu cek di sini. Error dari Supabase akan ke-throw.
  const { data, error } = await supabase
    .from('reports')
    .update({
      ...(patch.type !== undefined && { type: patch.type }),
      ...(patch.title !== undefined && { title: patch.title }),
      ...(patch.description !== undefined && { description: patch.description }),
      ...(patch.category !== undefined && { category: patch.category }),
      ...(patch.location !== undefined && { location: patch.location }),
      ...(patch.custody_point !== undefined && { custody_point: patch.custody_point }),
      ...(patch.photo_url !== undefined && { photo_url: patch.photo_url }),
      ...(patch.event_time !== undefined && { event_time: patch.event_time }),
    })
    .eq('id', id)
    .select(REPORT_SELECT)
    .single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Gagal memperbarui laporan.');
  return data as Report;
}

export async function deleteReport(id: string): Promise<void> {
  const { error } = await supabase.from('reports').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function markAsResolved(id: string): Promise<Report> {
  const { data, error } = await supabase.rpc('mark_report_resolved', {
    p_report_id: id,
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Gagal menandai laporan selesai.');
  return data as Report;
}

// ----- ADMIN FUNCTIONS -----
// Memakai RPC security-definer functions dari supabase-schema.sql.
// RPC `update_report_status` dan `create_admin_report` sudah di-grant ke authenticated.

export async function approveReport(id: string, note?: string): Promise<void> {
  const { error } = await supabase.rpc('update_report_status', {
    p_report_id: id,
    p_new_status: 'approved',
    p_admin_note: note ?? null,
  });
  if (error) throw new Error(error.message);
}

export async function rejectReport(id: string, note: string): Promise<void> {
  const { error } = await supabase.rpc('update_report_status', {
    p_report_id: id,
    p_new_status: 'rejected',
    p_admin_note: note,
  });
  if (error) throw new Error(error.message);
}

export interface AdminReportInput {
  type: ReportType;
  title: string;
  description?: string | null;
  category: CategoryId;
  location: string;
  custody_point?: string | null;
  photo_url?: string | null;
  event_time?: string | null;
  reporter_name?: string | null;
  reporter_nim?: string | null;
  reporter_faculty?: string | null;
}

export async function createAdminReport(input: AdminReportInput): Promise<string> {
  const { data, error } = await supabase.rpc('create_admin_report', {
    p_type: input.type,
    p_title: input.title,
    p_description: input.description ?? null,
    p_category: input.category,
    p_location: input.location,
    p_custody_point: input.custody_point ?? null,
    p_photo_url: input.photo_url ?? null,
    p_event_time: input.event_time ?? null,
    p_reporter_name: input.reporter_name ?? null,
    p_reporter_nim: input.reporter_nim ?? null,
    p_reporter_faculty: input.reporter_faculty ?? null,
  });
  if (error) throw new Error(error.message);
  return data as string;
}

export async function updateAdminReport(
  id: string,
  input: AdminReportInput,
): Promise<Report> {
  const { data, error } = await supabase.rpc('update_admin_report', {
    p_report_id: id,
    p_type: input.type,
    p_title: input.title,
    p_description: input.description ?? null,
    p_category: input.category,
    p_location: input.location,
    p_custody_point: input.custody_point ?? null,
    p_photo_url: input.photo_url ?? null,
    p_event_time: input.event_time ?? null,
    p_reporter_name: input.reporter_name ?? null,
    p_reporter_nim: input.reporter_nim ?? null,
    p_reporter_faculty: input.reporter_faculty ?? null,
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Gagal memperbarui laporan.');
  return data as Report;
}

export async function resolveReportAsAdmin(id: string): Promise<Report> {
  const { data, error } = await supabase.rpc('admin_mark_report_resolved', {
    p_report_id: id,
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Gagal menyelesaikan laporan.');
  return data as Report;
}

export async function getAdminStats(): Promise<{
  pending: number;
  approved: number;
  rejected: number;
  resolved: number;
  total: number;
  todayApproved: number;
}> {
  const { data, error } = await supabase
    .from('reports')
    .select('status, created_at, updated_at');
  if (error) throw new Error(error.message);

  const rows = data ?? [];
  const today = new Date().toISOString().slice(0, 10);

  let pending = 0;
  let approved = 0;
  let rejected = 0;
  let resolved = 0;
  let todayApproved = 0;

  for (const r of rows) {
    if (r.status === 'pending') pending++;
    else if (r.status === 'approved') approved++;
    else if (r.status === 'rejected') rejected++;
    else if (r.status === 'resolved') resolved++;

    if (
      (r.status === 'approved' || r.status === 'resolved') &&
      r.updated_at &&
      r.updated_at.slice(0, 10) === today
    ) {
      todayApproved++;
    }
  }

  return { pending, approved, rejected, resolved, total: rows.length, todayApproved };
}
