# NEXT_STEPS — Rencana FASE 4 (Core Mahasiswa)

> Plan langkah-langkah FASE 4. Baca `CHECKPOINT.md` dulu untuk konteks.
> FASE 1, 2, 3 ✅ selesai (auth flow lengkap, navigator wired, akun seeded).

---

## TUJUAN FASE 4

Implementasi screen utama untuk role mahasiswa:
- Home feed laporan dengan filter & search
- Detail laporan (Lost/Found) + tombol chat
- Form buat laporan (foto wajib)
- Laporanku (laporan saya + edit)
- Profil lengkap (replace tombol Logout sementara)
- (Opsional dipisah: Inbox + Chat di FASE 4.5)

**FASE 4 fokus mahasiswa flow.** Admin moderation di FASE 5. Settings/Help/UserProfile boleh di-defer ke FASE 6 polish.

---

## URUTAN TASK (URUT)

### 4.0 — Pre-flight
1. **Setup Supabase Storage buckets** (manual via Dashboard → Storage):
   - `report-photos` — public read, authenticated write. Buat policy: "Authenticated can insert", "Anyone can select".
   - `chat-media` — authenticated read+write (bukan public). Policy: only conversation participants can read/write.
   - `avatars` — public read, authenticated write. Policy: user can upsert ke path `<auth.uid>/...` sendiri.
2. **Verifikasi `.env` masih lengkap** & app jalan di Expo Go (sanity check setelah istirahat).

### 4.1 — Service layer untuk reports
**File:** `src/services/report.service.ts`

Fungsi yg dibutuhkan:
- `listReports({ type?, category?, status?, search? })` — feed listing dgn filter
- `getReportById(id)` — detail
- `createReport(payload)` — insert ke `reports`, status default `pending`
- `updateReport(id, payload)` — update kalau owner & belum resolved
- `deleteReport(id)` — soft via update status='deleted' atau hard delete
- `markAsResolved(id)` — status → `resolved`

Tipe TS: `Report`, `ReportInput`, dst.

### 4.2 — Service layer untuk upload
**File:** `src/services/upload.service.ts`

Fungsi:
- `pickImage()` — wrap `expo-image-picker.launchImageLibraryAsync` (cropping, kompresi)
- `uploadReportPhoto(uri, userId)` — upload ke bucket `report-photos`, path `<userId>/<uuid>.jpg`, return public URL
- `uploadAvatar(uri, userId)` — bucket `avatars`, path `<userId>/avatar.jpg`

Pakai `expo-file-system` untuk read file → ArrayBuffer → upload via `supabase.storage.from(bucket).upload(...)`.

### 4.3 — Komponen reusable
- `src/components/ReportCard.tsx` — card di feed (foto thumbnail, title, badge type+status, lokasi, waktu)
- `src/components/CategoryGrid.tsx` — grid 8 kategori dgn emoji (dipake di feed filter & form Create)
- `src/components/StatusBadge.tsx` — badge status (pending/approved/rejected/resolved) dgn warna
- `src/components/ViaAdminBadge.tsx` — badge "Dilaporkan via Admin" indigo
- `src/components/EmptyState.tsx` — placeholder kalau feed kosong
- `src/components/LoadingSkeleton.tsx` — skeleton list saat fetching

### 4.4 — Zustand store
**File:** `src/store/feedStore.ts`

State: `reports`, `loading`, `filter` (type/category/status/search). Actions: `fetchReports()`, `setFilter()`, `clearFilter()`. Cache hasil di store biar gak fetch ulang.

### 4.5 — HomeScreen
**File:** `src/screens/main/HomeScreen.tsx` (referensi: `cariin-web/home.html`)

Layout:
- Sticky header: avatar + greeting + bell icon (notifikasi)
- Search bar
- Filter chip: All | Lost | Found
- CategoryGrid horizontal scrollable
- FlatList of ReportCard (pull-to-refresh, infinite scroll opsional)
- Empty state

Navigation: tap card → `DetailLost` atau `DetailFound` (sesuai type).

### 4.6 — DetailLost & DetailFound
**Files:** `DetailLostScreen.tsx`, `DetailFoundScreen.tsx` (referensi: `detail.html`, `detail-dompet.html`)

- Header back + share button
- Foto besar
- Badge type + kategori + status
- Title + description + lokasi + waktu + custodyPoint (Found)
- Reporter info (nama + fakultas, **TANPA nomor HP** per business rule #10)
- Tombol "Chat Penemu/Pelapor" (hanya kalau status=approved per BR #11)

### 4.7 — CreateLost & CreateFound + Success
**Files:** `CreateLostScreen.tsx`, `CreateFoundScreen.tsx`, `SuccessScreen.tsx` (referensi: `create.html`, `create-found.html`, `success.html`)

Form: title, description, kategori, lokasi, custodyPoint (Found only), foto (wajib). Submit → `report.service.createReport()` → navigate ke Success → tap OK → balik ke Home.

Ada tab toggle Lost↔Found di header.

### 4.8 — MyPosts & EditPost
**Files:** `MyPostsScreen.tsx`, `EditPostScreen.tsx` (referensi: `my-posts.html`, `edit-post.html`)

MyPosts: list laporan saya (filter by `user_id = auth.uid()`). Action menu per item: Edit, Hapus, Tandai Selesai. EditPost: form pre-filled, hanya bisa kalau status≠resolved.

### 4.9 — ProfileScreen lengkap
**File:** `ProfileScreen.tsx` (replace yang sekarang cuma Logout)

Sections: avatar + nama + NIM + fakultas, "Edit Profile" → Settings, "Pusat Bantuan" → Help, "Tentang App", "Logout" merah.

### 4.10 — Settings, Help, UserProfile
**Files:** `SettingsScreen.tsx`, `HelpScreen.tsx`, `UserProfileScreen.tsx`

Settings: edit nama, ganti password, toggle notifikasi push.
Help: FAQ static.
UserProfile: profil publik user lain (dipake dari ChatRoom/DetailReport).

### 4.11 — Verifikasi
1. `npx tsc --noEmit` clean
2. Tes E2E di Expo Go:
   - HomeFeed render reports dari DB
   - Filter category & search jalan
   - Tap report → detail → tombol chat (kalau approved)
   - Buat report (foto upload jalan) → success → muncul di MyPosts
   - Edit report → tersimpan
   - Profile lengkap render dgn data dari `userProfile`

### 4.12 — Commit FASE 4

---

## YANG USER PERLU SIAPKAN SEBELUM FASE 4

**WAJIB:**
1. **Storage buckets** di Supabase Dashboard:
   - `report-photos` (public read, auth write) — wajib untuk Create Report dgn foto
   - `avatars` (public read, auth write) — wajib untuk ProfileScreen
   - `chat-media` (private, defer kalau chat di FASE 4.5)

   Policy SQL contoh untuk `report-photos`:
   ```sql
   -- read: anyone
   create policy "report photos public read"
     on storage.objects for select
     using (bucket_id = 'report-photos');

   -- write: authenticated user, file path harus prefix auth.uid()
   create policy "report photos auth write"
     on storage.objects for insert
     to authenticated
     with check (
       bucket_id = 'report-photos'
       and (storage.foldername(name))[1] = auth.uid()::text
     );
   ```

2. **Test data**: bikin minimal 5 row di `reports` (status=approved) via SQL biar HomeFeed gak kosong saat tes pertama. Atau bikin via app saat Create Report jalan.

**OPSIONAL (boleh di FASE 6):**
- Google OAuth setup (Cloud Console + Supabase provider)
- Deep link callback URLs di Authentication → URL Configuration

---

## DURASI ESTIMASI FASE 4

- 4.0 setup: 15 menit (user manual setup buckets)
- 4.1-4.2 services: 45 menit
- 4.3 components: 1 jam
- 4.4 store: 15 menit
- 4.5 HomeScreen: 1 jam
- 4.6 Detail screens: 45 menit
- 4.7 Create + Success: 1.5 jam (image picker + upload tricky)
- 4.8 MyPosts + EditPost: 45 menit
- 4.9 Profile lengkap: 30 menit
- 4.10 Settings/Help/UserProfile: 45 menit
- 4.11 Verifikasi + manual test: 30 menit
- 4.12 Commit: 5 menit

**Total: ~7-8 jam fokus.** Bisa dibreak jadi 2-3 sesi.

---

## DEFINISI "FASE 4 SELESAI"

Checklist:
- [ ] Storage buckets created with policies
- [ ] All services (report, upload) implemented & typed
- [ ] All 8 reusable components done
- [ ] HomeScreen render feed dengan filter & search
- [ ] Detail screens render full info
- [ ] Create flow: form → upload foto → DB insert → Success → balik feed
- [ ] MyPosts: list owned reports + edit + delete
- [ ] ProfileScreen lengkap (replace temp logout)
- [ ] Tab navigation antar Home/Pesan/FAB/Laporanku/Profil semua kebuka tanpa crash
- [ ] tsc clean, expo-doctor pass
- [ ] Commit FASE 4 di `main`

Chat (Inbox + ChatRoom + Notifications) bisa **DEFER** ke FASE 4.5 atau FASE 5 — tergantung waktu.
