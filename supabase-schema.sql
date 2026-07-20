-- ============================================================================
-- Cari.In — Supabase Schema (Postgres) + RLS Policies
-- ============================================================================
-- Cara pakai:
--   1. Buka Supabase Dashboard → SQL Editor
--   2. Klik "New query", paste seluruh isi file ini
--   3. Klik "Run". Pastikan tidak ada error.
--   4. Buka Table Editor untuk verifikasi 5 tabel sudah dibuat.
--   5. Verifikasi bucket Storage report-photos, chat-media, dan avatars
--      beserta policy-nya pada bagian "STORAGE BUCKETS".
--
-- Semua perintah idempotent (pakai IF NOT EXISTS / DROP POLICY IF EXISTS),
-- jadi aman di-run ulang.
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================
create extension if not exists "pgcrypto";  -- untuk gen_random_uuid()

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- profiles: 1-1 dengan auth.users
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  name            text not null,
  nim             text,
  email           text not null,
  role            text not null default 'mahasiswa'
                    check (role in ('mahasiswa','admin')),
  faculty         text,
  department      text,
  avatar_url      text,
  is_verified     boolean not null default false,
  expo_push_token text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create unique index if not exists idx_profiles_email_unique
  on public.profiles (lower(email));
create unique index if not exists idx_profiles_nim_unique
  on public.profiles (nim)
  where nim is not null;

-- reports: laporan barang hilang / temuan
create table if not exists public.reports (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references public.profiles(id) on delete set null,
  type              text not null check (type in ('lost','found')),
  title             text not null,
  description       text,
  category          text not null check (category in (
                      'elektronik','dokumen','dompet_tas','kunci',
                      'aksesoris','pakaian','buku_atk','lainnya'
                    )),
  location          text not null,
  custody_point     text,
  photo_url         text,
  status            text not null default 'pending'
                      check (status in ('pending','approved','rejected','resolved')),
  admin_note        text,
  created_by_admin  boolean not null default false,
  reporter_name     text,
  reporter_nim      text,
  reporter_faculty  text,
  resolved_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_reports_status on public.reports(status);
create index if not exists idx_reports_type on public.reports(type);
create index if not exists idx_reports_user_id on public.reports(user_id);
create index if not exists idx_reports_created_at on public.reports(created_at desc);

-- conversations: chat antar 2 user terkait 1 laporan
create table if not exists public.conversations (
  id            uuid primary key default gen_random_uuid(),
  report_id     uuid not null references public.reports(id) on delete cascade,
  user_a_id     uuid not null references public.profiles(id) on delete cascade,
  user_b_id     uuid not null references public.profiles(id) on delete cascade,
  last_message  text,
  last_at       timestamptz,
  created_at    timestamptz not null default now(),
  unique (report_id, user_a_id, user_b_id),
  check (user_a_id <> user_b_id)
);

create index if not exists idx_conversations_user_a on public.conversations(user_a_id);
create index if not exists idx_conversations_user_b on public.conversations(user_b_id);

-- messages: isi chat
create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id),
  content         text not null,
  is_read         boolean not null default false,
  created_at      timestamptz not null default now()
);

create index if not exists idx_messages_conversation on public.messages(conversation_id, created_at);
create index if not exists idx_messages_sender_id on public.messages(sender_id);

-- notifications: in-app notification user
create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null check (type in (
                'report_approved','report_rejected','new_message'
              )),
  title       text not null,
  body        text not null,
  is_read     boolean not null default false,
  ref_id      uuid,
  created_at  timestamptz not null default now()
);

create index if not exists idx_notifications_user on public.notifications(user_id, is_read, created_at desc);

-- ============================================================================
-- 3. TRIGGERS
-- ============================================================================

-- Auto-update updated_at saat row diubah.
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql set search_path = public;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_reports_updated_at on public.reports;
create trigger trg_reports_updated_at
  before update on public.reports
  for each row execute function public.set_updated_at();

-- Auto-bikin row profiles saat user baru daftar via auth.users.
-- Field name diambil dari raw_user_meta_data (di-set saat signUp dari client).
create or replace function public.handle_new_user() returns trigger as $$
declare
  v_is_admin_invite boolean;
begin
  -- App metadata hanya dapat ditetapkan oleh server/service-role. Metadata
  -- client signUp masuk ke raw_user_meta_data dan tidak dapat menaikkan role.
  v_is_admin_invite :=
    coalesce(new.raw_app_meta_data ->> 'role', '') = 'admin';

  if split_part(lower(new.email), '@', 2) <> 'student.unu-jogja.ac.id'
     and not v_is_admin_invite then
    raise exception 'Registrasi hanya menerima email kampus @student.unu-jogja.ac.id.';
  end if;

  insert into public.profiles (
    id, email, name, nim, faculty, department, role, is_verified
  )
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    nullif(new.raw_user_meta_data ->> 'nim', ''),
    nullif(new.raw_user_meta_data ->> 'faculty', ''),
    nullif(new.raw_user_meta_data ->> 'department', ''),
    case when v_is_admin_invite then 'admin' else 'mahasiswa' end,
    new.email_confirmed_at is not null
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Update conversations.last_message + last_at saat message baru masuk.
create or replace function public.update_conversation_last_message() returns trigger as $$
begin
  update public.conversations
  set last_message = new.content,
      last_at      = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_messages_update_conversation on public.messages;
create trigger trg_messages_update_conversation
  after insert on public.messages
  for each row execute function public.update_conversation_last_message();

-- Notifikasi ke receiver saat ada pesan baru masuk.
create or replace function public.notify_new_message() returns trigger as $$
declare
  v_receiver_id uuid;
  v_sender_name text;
begin
  select case
    when c.user_a_id = new.sender_id then c.user_b_id
    else c.user_a_id
  end into v_receiver_id
  from public.conversations c
  where c.id = new.conversation_id;

  select name into v_sender_name
  from public.profiles
  where id = new.sender_id;

  if v_receiver_id is not null then
    insert into public.notifications (user_id, type, title, body, ref_id)
    values (
      v_receiver_id,
      'new_message',
      'Pesan Baru',
      coalesce(v_sender_name, 'Seseorang') || ': ' || left(new.content, 80),
      new.conversation_id
    );
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_notify_new_message on public.messages;
create trigger trg_notify_new_message
  after insert on public.messages
  for each row execute function public.notify_new_message();

-- ============================================================================
-- 4. HELPER FUNCTIONS (untuk RLS)
-- ============================================================================

-- security definer + explicit search_path: function dieksekusi sebagai owner
-- (postgres) sehingga bisa baca profiles tanpa rekursif memicu RLS.
-- search_path eksplisit mencegah search_path hijack saat dipanggil dari
-- konteks role lain.
create or replace function public.is_admin()
  returns boolean
  language sql
  stable
  security definer
  set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Profil lengkap hanya boleh dibaca oleh pemiliknya. SELECT tabel profiles
-- di bawah hanya membuka kolom direktori yang dibutuhkan UI publik.
create or replace function public.get_my_profile()
  returns setof public.profiles
  language sql
  stable
  security definer
  set search_path = public
as $$
  select *
  from public.profiles
  where id = auth.uid();
$$;

-- Status laporan tidak dapat diubah langsung oleh client. Mahasiswa hanya
-- boleh menutup laporan approved miliknya lewat fungsi terkontrol ini.
create or replace function public.mark_report_resolved(p_report_id uuid)
  returns public.reports
  language plpgsql
  security definer
  set search_path = public
as $$
declare
  v_report public.reports;
begin
  update public.reports
  set status = 'resolved',
      resolved_at = now()
  where id = p_report_id
    and user_id = auth.uid()
    and status = 'approved'
  returning * into v_report;

  if not found then
    raise exception 'Laporan tidak ditemukan, bukan milik Anda, atau belum disetujui.';
  end if;

  return v_report;
end;
$$;

-- ============================================================================
-- 4a. GRANTS — wajib supaya role authenticated/anon bisa "menyentuh" tabel
-- ============================================================================
-- Tanpa GRANT ini, klien Supabase JS kena error
-- "permission denied for table profiles" walaupun RLS policy sudah ada.
-- Postgres butuh DUA layer izin: GRANT (boleh akses tabel?) + RLS (boleh
-- akses baris tertentu?).

grant usage on schema public to anon, authenticated;

revoke all on all tables in schema public from anon;
grant select, insert, update, delete on all tables in schema public to authenticated;

-- Cabut kembali akses blanket pada data/kolom sensitif.
revoke select on public.profiles from anon, authenticated;
grant select (id, name, nim, faculty, department, avatar_url, created_at, updated_at)
  on public.profiles to authenticated;

revoke update on public.profiles from authenticated;
grant update (name, nim, faculty, department, avatar_url, expo_push_token)
  on public.profiles to authenticated;

revoke update on public.reports from authenticated;
grant update (type, title, description, category, location, custody_point, photo_url)
  on public.reports to authenticated;

revoke update on public.conversations from authenticated;

revoke update on public.messages from authenticated;
grant update (is_read) on public.messages to authenticated;

revoke update on public.notifications from authenticated;
grant update (is_read) on public.notifications to authenticated;

grant usage, select on all sequences in schema public to authenticated;

-- Default privilege untuk tabel/sequence yang dibuat di masa depan.
alter default privileges in schema public
  revoke select on tables from anon;
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant usage, select on sequences to authenticated;

-- Function `is_admin` butuh EXECUTE permission supaya bisa dipanggil dari
-- RLS policy oleh role authenticated/anon.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.update_conversation_last_message()
  from public, anon, authenticated;
revoke execute on function public.notify_new_message()
  from public, anon, authenticated;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
revoke execute on function public.get_my_profile() from public, anon;
revoke execute on function public.mark_report_resolved(uuid) from public, anon;
grant execute on function public.get_my_profile() to authenticated;
grant execute on function public.mark_report_resolved(uuid) to authenticated;

-- ============================================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================================

alter table public.profiles      enable row level security;
alter table public.reports       enable row level security;
alter table public.conversations enable row level security;
alter table public.messages      enable row level security;
alter table public.notifications enable row level security;

-- ----- profiles -----
drop policy if exists profiles_select_all on public.profiles;
drop policy if exists profiles_select_authenticated on public.profiles;
create policy profiles_select_authenticated on public.profiles
  for select
  to authenticated
  using (true);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- profiles_admin_all dihapus untuk menghindari risiko rekursi RLS:
-- policy `for all using (public.is_admin())` menyebabkan setiap operasi pada
-- profiles men-trigger is_admin() yang sendirinya query tabel profiles. Walau
-- security definer mestinya bypass RLS, dalam praktik kombinasi ini kadang
-- menyebabkan "permission denied" yang sulit di-debug.
--
-- Alternatif: admin INSERT/UPDATE/DELETE pada profiles dilakukan dengan
-- service_role key (server side) atau pakai dedicated RPC function dengan
-- security definer. Dipasang nanti di FASE 5 saat admin moderation diperlukan.
--
-- drop policy if exists profiles_admin_all on public.profiles;
-- create policy profiles_admin_all on public.profiles
--   for all using (public.is_admin())
--   with check (public.is_admin());

-- ----- reports -----
-- SELECT: publik bisa lihat status approved/resolved. Owner bisa lihat semua row sendiri. Admin bisa lihat semua.
drop policy if exists reports_select_public on public.reports;
create policy reports_select_public on public.reports
  for select
  to authenticated
  using (
    status in ('approved','resolved')
    or user_id = (select auth.uid())
    or public.is_admin()
  );

-- INSERT: user login bisa insert row dengan user_id = auth.uid(). Admin bebas.
drop policy if exists reports_insert_self on public.reports;
create policy reports_insert_self on public.reports
  for insert with check (
    (
      user_id = (select auth.uid())
      and status = 'pending'
      and created_by_admin = false
      and admin_note is null
      and reporter_name is null
      and reporter_nim is null
      and reporter_faculty is null
      and resolved_at is null
    )
    or public.is_admin()
  );

-- UPDATE konten: owner bisa edit row sendiri kalau status belum resolved.
-- GRANT kolom di atas tidak memberi client akses ke status/admin_note, sehingga
-- transisi status hanya dapat dilakukan melalui RPC terkontrol.
drop policy if exists reports_update_self on public.reports;
create policy reports_update_self on public.reports
  for update using (
    (user_id = (select auth.uid()) and status <> 'resolved')
    or public.is_admin()
  ) with check (
    user_id = (select auth.uid())
    or public.is_admin()
  );

-- DELETE: owner bisa hapus row sendiri kalau belum resolved. Admin bebas.
drop policy if exists reports_delete_self on public.reports;
create policy reports_delete_self on public.reports
  for delete using (
    (user_id = (select auth.uid()) and status <> 'resolved')
    or public.is_admin()
  );

-- ----- conversations -----
drop policy if exists conversations_select_participant on public.conversations;
create policy conversations_select_participant on public.conversations
  for select using (
    user_a_id = (select auth.uid())
    or user_b_id = (select auth.uid())
    or public.is_admin()
  );

drop policy if exists conversations_insert_participant on public.conversations;
create policy conversations_insert_participant on public.conversations
  for insert with check (
    (
      (
        user_a_id = (select auth.uid())
        or user_b_id = (select auth.uid())
      )
      and exists (
        select 1
        from public.reports r
        where r.id = report_id
          and r.status in ('approved', 'resolved')
          and r.user_id in (user_a_id, user_b_id)
      )
    )
    or public.is_admin()
  );

drop policy if exists conversations_update_participant on public.conversations;

-- ----- messages -----
drop policy if exists messages_select_participant on public.messages;
create policy messages_select_participant on public.messages
  for select using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (
          c.user_a_id = (select auth.uid())
          or c.user_b_id = (select auth.uid())
        )
    )
    or public.is_admin()
  );

drop policy if exists messages_insert_participant on public.messages;
create policy messages_insert_participant on public.messages
  for insert with check (
    sender_id = (select auth.uid())
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (
          c.user_a_id = (select auth.uid())
          or c.user_b_id = (select auth.uid())
        )
    )
  );

-- UPDATE pesan terbatas (misal untuk mark is_read).
drop policy if exists messages_update_participant on public.messages;
create policy messages_update_participant on public.messages
  for update using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (
          c.user_a_id = (select auth.uid())
          or c.user_b_id = (select auth.uid())
        )
    )
  );

-- ----- notifications -----
drop policy if exists notifications_select_self on public.notifications;
create policy notifications_select_self on public.notifications
  for select using (
    user_id = (select auth.uid())
    or public.is_admin()
  );

drop policy if exists notifications_update_self on public.notifications;
create policy notifications_update_self on public.notifications
  for update using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- INSERT notifications: dilakukan oleh service (admin moderate, trigger chat),
-- bukan dari client biasa. Admin diizinkan; trigger pakai security definer.
drop policy if exists notifications_insert_admin on public.notifications;
create policy notifications_insert_admin on public.notifications
  for insert with check (public.is_admin());

-- ============================================================================
-- 6. REALTIME PUBLICATION
-- ============================================================================
-- Aktifkan Realtime untuk tabel chat & notifikasi (subscribe via postgres_changes).
-- Catatan: di Supabase versi baru, publication 'supabase_realtime' sudah ada by default.
-- Kalau belum, uncomment baris pertama.

-- create publication supabase_realtime;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'messages'
    ) then
      alter publication supabase_realtime add table public.messages;
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'conversations'
    ) then
      alter publication supabase_realtime add table public.conversations;
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'notifications'
    ) then
      alter publication supabase_realtime add table public.notifications;
    end if;
  end if;
end;
$$;

-- ============================================================================
-- 7. STORAGE BUCKETS + POLICIES
-- ============================================================================
-- Bucket report dan avatar memakai URL publik karena URL-nya disimpan di tabel
-- dan dirender langsung oleh React Native. Upload/update/delete tetap dibatasi
-- ke folder pertama yang sama dengan auth.uid().
insert into storage.buckets (id, name, public)
values
  ('report-photos', 'report-photos', true),
  ('avatars', 'avatars', true),
  ('chat-media', 'chat-media', false)
on conflict (id) do update
set public = excluded.public;

-- Bersihkan nama policy dari versi schema lama agar rerun tidak menyisakan
-- akses duplikat yang lebih longgar.
drop policy if exists "report photos auth upload" on storage.objects;
drop policy if exists "report photos owner update" on storage.objects;
drop policy if exists "report photos owner delete" on storage.objects;
drop policy if exists "avatars auth upload" on storage.objects;
drop policy if exists "avatars owner update" on storage.objects;
drop policy if exists "avatars owner delete" on storage.objects;

drop policy if exists report_photos_select_own on storage.objects;
create policy report_photos_select_own on storage.objects
  for select to authenticated
  using (
    bucket_id = 'report-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists report_photos_insert_own on storage.objects;
create policy report_photos_insert_own on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'report-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists report_photos_update_own on storage.objects;
create policy report_photos_update_own on storage.objects
  for update to authenticated
  using (
    bucket_id = 'report-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'report-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists report_photos_delete_own on storage.objects;
create policy report_photos_delete_own on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'report-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists avatars_select_own on storage.objects;
create policy avatars_select_own on storage.objects
  for select to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists avatars_insert_own on storage.objects;
create policy avatars_insert_own on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists avatars_update_own on storage.objects;
create policy avatars_update_own on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists avatars_delete_own on storage.objects;
create policy avatars_delete_own on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- `chat-media` disiapkan sebagai bucket private, tetapi belum diberi policy
-- karena versi aplikasi ini belum memiliki fitur lampiran chat. Dengan begitu
-- client tidak bisa mengunggah atau membaca object chat secara tidak sengaja.

-- ============================================================================
-- 8. FASE 5 — ADMIN RPC FUNCTIONS + NOTIFICATION TRIGGER
-- ============================================================================

-- RPC: Admin approve/reject report. Security definer bypass RLS recursion.
-- Dipanggil dari client biasa (anon key). Caller harus admin.
create or replace function public.update_report_status(
  p_report_id  uuid,
  p_new_status text,
  p_admin_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  -- Gate: hanya admin yang boleh panggil
  if not public.is_admin() then
    raise exception 'Hanya admin yang boleh mengubah status laporan.';
  end if;

  -- Validasi status
  if p_new_status not in ('approved','rejected') then
    raise exception 'Status tidak valid: %', p_new_status;
  end if;

  -- Update report
  update public.reports
  set status     = p_new_status,
      admin_note = p_admin_note
  where id = p_report_id
    and status <> 'resolved'
  returning user_id into v_user_id;

  if not found then
    raise exception 'Laporan tidak ditemukan.';
  end if;

  -- Insert notification ke owner laporan (kalau ada user_id)
  if v_user_id is not null then
    if p_new_status = 'approved' then
      insert into public.notifications (user_id, type, title, body, ref_id)
      values (
        v_user_id,
        'report_approved',
        'Laporan Disetujui',
        'Laporan "' || (select title from public.reports where id = p_report_id) || '" telah disetujui.',
        p_report_id
      );
    elsif p_new_status = 'rejected' then
      insert into public.notifications (user_id, type, title, body, ref_id)
      values (
        v_user_id,
        'report_rejected',
        'Laporan Ditolak',
        case
          when p_admin_note is not null
          then 'Laporan "' || (select title from public.reports where id = p_report_id) || '" ditolak. Alasan: ' || p_admin_note
          else 'Laporan "' || (select title from public.reports where id = p_report_id) || '" ditolak.'
        end,
        p_report_id
      );
    end if;
  end if;
end;
$$;

-- RPC: Admin membuat laporan walk-in (created_by_admin=true).
-- Field reporter_name/nim/faculty diisi manual karena pelapor bukan user sistem.
drop function if exists public.create_admin_report(
  text, text, text, text, text, text, text, text, text, text
);

create function public.create_admin_report(
  p_type            text,
  p_title           text,
  p_category        text,
  p_location        text,
  p_description     text default null,
  p_custody_point   text default null,
  p_photo_url       text default null,
  p_reporter_name   text default null,
  p_reporter_nim    text default null,
  p_reporter_faculty text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  -- Gate: hanya admin
  if not public.is_admin() then
    raise exception 'Hanya admin yang boleh membuat laporan walk-in.';
  end if;

  insert into public.reports (
    user_id, type, title, description, category,
    location, custody_point, photo_url,
    status, created_by_admin,
    reporter_name, reporter_nim, reporter_faculty
  ) values (
    auth.uid(),             -- admin jadi user_id owner (untuk RLS update)
    p_type, p_title, p_description, p_category,
    p_location, p_custody_point, p_photo_url,
    'approved',             -- langsung approved
    true,
    p_reporter_name, p_reporter_nim, p_reporter_faculty
  ) returning id into v_id;

  return v_id;
end;
$$;

-- RPC: Admin mengubah seluruh data inti laporan. Reporter manual hanya boleh
-- berubah untuk laporan walk-in; identitas laporan mahasiswa tetap bersumber
-- dari profiles agar data akun tidak bisa ditimpa lewat form laporan.
drop function if exists public.update_admin_report(
  uuid, text, text, text, text, text, text, text, text, text, text
);

create function public.update_admin_report(
  p_report_id        uuid,
  p_type             text,
  p_title            text,
  p_category         text,
  p_location         text,
  p_description      text default null,
  p_custody_point    text default null,
  p_photo_url        text default null,
  p_reporter_name    text default null,
  p_reporter_nim     text default null,
  p_reporter_faculty text default null
)
returns public.reports
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_report public.reports;
begin
  if not public.is_admin() then
    raise exception 'Hanya admin yang boleh mengubah laporan.';
  end if;

  if p_type not in ('lost', 'found') then
    raise exception 'Jenis laporan tidak valid.';
  end if;

  if nullif(btrim(p_title), '') is null then
    raise exception 'Nama barang wajib diisi.';
  end if;

  if p_category not in (
    'elektronik', 'dokumen', 'dompet_tas', 'kunci',
    'aksesoris', 'pakaian', 'buku_atk', 'lainnya'
  ) then
    raise exception 'Kategori laporan tidak valid.';
  end if;

  if nullif(btrim(p_location), '') is null then
    raise exception 'Lokasi wajib diisi.';
  end if;

  if p_type = 'found' and nullif(btrim(coalesce(p_custody_point, '')), '') is null then
    raise exception 'Titik penitipan wajib diisi untuk barang temuan.';
  end if;

  update public.reports
  set type = p_type,
      title = btrim(p_title),
      description = nullif(btrim(coalesce(p_description, '')), ''),
      category = p_category,
      location = btrim(p_location),
      custody_point = case
        when p_type = 'found'
          then nullif(btrim(coalesce(p_custody_point, '')), '')
        else null
      end,
      photo_url = nullif(btrim(coalesce(p_photo_url, '')), ''),
      reporter_name = case
        when created_by_admin
          then nullif(btrim(coalesce(p_reporter_name, '')), '')
        else reporter_name
      end,
      reporter_nim = case
        when created_by_admin
          then nullif(btrim(coalesce(p_reporter_nim, '')), '')
        else reporter_nim
      end,
      reporter_faculty = case
        when created_by_admin
          then nullif(btrim(coalesce(p_reporter_faculty, '')), '')
        else reporter_faculty
      end
  where id = p_report_id
  returning * into v_report;

  if not found then
    raise exception 'Laporan tidak ditemukan.';
  end if;

  return v_report;
end;
$$;

-- RPC: Admin boleh menyelesaikan laporan aktif mana pun, termasuk laporan
-- walk-in dan laporan mahasiswa. Transisi lain tetap melalui RPC moderasi.
drop function if exists public.admin_mark_report_resolved(uuid);

create function public.admin_mark_report_resolved(p_report_id uuid)
returns public.reports
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_report public.reports;
begin
  if not public.is_admin() then
    raise exception 'Hanya admin yang boleh menyelesaikan laporan.';
  end if;

  update public.reports
  set status = 'resolved',
      resolved_at = now()
  where id = p_report_id
    and status = 'approved'
  returning * into v_report;

  if not found then
    raise exception 'Laporan tidak ditemukan atau statusnya bukan aktif.';
  end if;

  return v_report;
end;
$$;

-- GRANT execute untuk RPC functions
revoke execute on function public.update_report_status(uuid, text, text)
  from public, anon;
revoke execute on function public.create_admin_report(
  text, text, text, text, text, text, text, text, text, text
) from public, anon;
revoke execute on function public.update_admin_report(
  uuid, text, text, text, text, text, text, text, text, text, text
) from public, anon;
revoke execute on function public.admin_mark_report_resolved(uuid)
  from public, anon;
grant execute on function public.update_report_status(uuid, text, text) to authenticated;
grant execute on function public.create_admin_report(text, text, text, text, text, text, text, text, text, text) to authenticated;
grant execute on function public.update_admin_report(uuid, text, text, text, text, text, text, text, text, text, text) to authenticated;
grant execute on function public.admin_mark_report_resolved(uuid) to authenticated;

-- ============================================================================
-- 9. MIGRATION — event_time (jam kejadian)
-- ============================================================================
-- Tambah kolom event_time untuk mencatat jam kejadian hilang/temuan.
-- Format: timestamptz (ISO 8601). Client mengirim HH:MM, service layer
-- menggabungkan dengan tanggal hari ini.
alter table public.reports
  add column if not exists event_time timestamptz;

-- Update RPC create_admin_report: tambah param p_event_time
drop function if exists public.create_admin_report(
  text, text, text, text, text, text, text, text, text, text
);

create function public.create_admin_report(
  p_type             text,
  p_title            text,
  p_category         text,
  p_location         text,
  p_description      text default null,
  p_custody_point    text default null,
  p_photo_url        text default null,
  p_event_time       timestamptz default null,
  p_reporter_name    text default null,
  p_reporter_nim     text default null,
  p_reporter_faculty text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Hanya admin yang boleh membuat laporan walk-in.';
  end if;

  insert into public.reports (
    user_id, type, title, description, category,
    location, custody_point, photo_url, event_time,
    status, created_by_admin,
    reporter_name, reporter_nim, reporter_faculty
  ) values (
    auth.uid(),
    p_type, p_title, p_description, p_category,
    p_location, p_custody_point, p_photo_url, p_event_time,
    'approved',
    true,
    p_reporter_name, p_reporter_nim, p_reporter_faculty
  ) returning id into v_id;

  return v_id;
end;
$$;

-- Update RPC update_admin_report: tambah param p_event_time
drop function if exists public.update_admin_report(
  uuid, text, text, text, text, text, text, text, text, text, text
);

create function public.update_admin_report(
  p_report_id        uuid,
  p_type             text,
  p_title            text,
  p_category         text,
  p_location         text,
  p_description      text default null,
  p_custody_point    text default null,
  p_photo_url        text default null,
  p_event_time       timestamptz default null,
  p_reporter_name    text default null,
  p_reporter_nim     text default null,
  p_reporter_faculty text default null
)
returns public.reports
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_report public.reports;
begin
  if not public.is_admin() then
    raise exception 'Hanya admin yang boleh mengubah laporan.';
  end if;

  if p_type not in ('lost', 'found') then
    raise exception 'Jenis laporan tidak valid.';
  end if;

  if nullif(btrim(p_title), '') is null then
    raise exception 'Nama barang wajib diisi.';
  end if;

  if p_category not in (
    'elektronik', 'dokumen', 'dompet_tas', 'kunci',
    'aksesoris', 'pakaian', 'buku_atk', 'lainnya'
  ) then
    raise exception 'Kategori laporan tidak valid.';
  end if;

  if nullif(btrim(p_location), '') is null then
    raise exception 'Lokasi wajib diisi.';
  end if;

  if p_type = 'found' and nullif(btrim(coalesce(p_custody_point, '')), '') is null then
    raise exception 'Titik penitipan wajib diisi untuk barang temuan.';
  end if;

  update public.reports
  set type = p_type,
      title = btrim(p_title),
      description = nullif(btrim(coalesce(p_description, '')), ''),
      category = p_category,
      location = btrim(p_location),
      custody_point = case
        when p_type = 'found'
          then nullif(btrim(coalesce(p_custody_point, '')), '')
        else null
      end,
      photo_url = nullif(btrim(coalesce(p_photo_url, '')), ''),
      event_time = p_event_time,
      reporter_name = case
        when created_by_admin
          then nullif(btrim(coalesce(p_reporter_name, '')), '')
        else reporter_name
      end,
      reporter_nim = case
        when created_by_admin
          then nullif(btrim(coalesce(p_reporter_nim, '')), '')
        else reporter_nim
      end,
      reporter_faculty = case
        when created_by_admin
          then nullif(btrim(coalesce(p_reporter_faculty, '')), '')
        else reporter_faculty
      end
  where id = p_report_id
  returning * into v_report;

  if not found then
    raise exception 'Laporan tidak ditemukan.';
  end if;

  return v_report;
end;
$$;

-- Re-grant execute setelah recreate functions
revoke execute on function public.create_admin_report(
  text, text, text, text, text, text, text, text, text, text, timestamptz
) from public, anon;
revoke execute on function public.update_admin_report(
  uuid, text, text, text, text, text, text, text, text, text, text, timestamptz
) from public, anon;
grant execute on function public.create_admin_report(text, text, text, text, text, text, text, text, text, text, timestamptz) to authenticated;
grant execute on function public.update_admin_report(uuid, text, text, text, text, text, text, text, text, text, text, timestamptz) to authenticated;

-- ============================================================================
-- DONE
-- ============================================================================
