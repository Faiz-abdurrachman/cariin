# CHECKPOINT — Cari.In Mobile

> Snapshot kondisi project tiap akhir fase. Baca file ini + `NEXT_STEPS.md` saat resume sesi (urutan: CLAUDE.md → CHECKPOINT.md → NEXT_STEPS.md).
>
> **Last updated:** 2026-07-20 06:44 WIB | **Branch:** `main` | **Local ahead origin:** worktree dirty dengan polish UI, hardening schema, recovery password, admin full CRUD, dan dokumentasi handoff; belum push.

---

## 1. STATUS PROGRES PER FASE

| Fase | Scope | Status | Commit |
|------|-------|--------|--------|
| FASE 1 | Setup Project (Expo + NativeWind + TS strict, Firebase→Supabase) | ✅ Selesai | `ea6cc33` |
| FASE 2 | Fondasi Navigasi (Stack+Tab+Drawer) + AuthContext | ✅ Selesai | `682093d` |
| FASE 3 | Auth Screens (Splash, RoleSelection, Login, Register, ForgotPassword) | ✅ Selesai | `c42101a` |
| FASE 4 | Core Mahasiswa (Home, Detail, Create, MyPosts, Profile) | ✅ Selesai | `9e511f6` |
| **FASE 4.5** | **Chat & Notifikasi (realtime, mahasiswa flow lengkap)** | ✅ **Selesai** | *(commit incoming)* |
| FASE 5 | Admin Screens (moderate, dashboard, walk-in) | ✅ Selesai | `4547443` |
| **FASE 6** | **Polish, hardening RLS, testing, EAS build, dan submission** | 🟡 **Partial** | *(commit incoming)* |

`git log --oneline -10` untuk konfirmasi hash terkini.

---

## 2. STACK & TOOLING

- **Frontend:** Expo SDK 54, React Native 0.81.5, React 19.1.0, NativeWind v4 (Tailwind for RN), Zustand 5, React Navigation v7
- **Backend:** Supabase (Auth + Postgres + Storage + Realtime)
- **Bahasa:** TypeScript strict (`noImplicitAny`, `noUncheckedIndexedAccess`)
- **Path alias:** `@/*` → `src/*`
- **Lint:** ESLint v9 + flat config (`eslint.config.js`). `npm run lint` clean, 0 errors/warnings.
- **Expo Doctor:** 18/18 checks passed pada 2026-07-20.
- **Web preview:** `@expo/metro-runtime` tersedia (`npx expo start --web`).
- **Manual test:** jalankan melalui Expo Go/tunnel; hasil aktual harus dicatat di
  `TESTING-MANUAL.md`.
- **Current UI focus:** implementasi polish terbaru selesai secara statis;
  fokus berikutnya retest perangkat, bukan redesign ulang.

---

## 3. SUPABASE STATE

- **Project URL prefix:** `kytsksnyoyffwbksotps`
- **Dashboard:** https://supabase.com/dashboard/project/kytsksnyoyffwbksotps
- **`.env`** lokal terisi (URL + ANON_KEY + ALLOWED_EMAIL_DOMAIN=`student.unu-jogja.ac.id` + APP_NAME + APP_ENV)
- **Schema:** lihat `supabase-schema.sql` (idempotent, aman di-rerun). 5 tabel + RLS + triggers + GRANTs.
- **Email Auth:** ✅ Enabled, **Confirm email: OFF** (dev convenience)
- **Google OAuth:** ❌ Tidak diimplementasikan — login memakai email/password; registrasi mahasiswa dibatasi domain kampus.
- **Redirect URLs deep link:** ✅ `cariin://reset-password` tersimpan di Auth
  `uri_allow_list`; PATCH dan GET verifikasi HTTP 200, Site URL tidak berubah.
- **Konektivitas remote per 2026-07-20:** project berhasil dipulihkan melalui
  Supabase MCP dari `INACTIVE` menjadi `ACTIVE_HEALTHY`.
- **Migration remote:** ✅ `cariin_fase6_functions_privileges_rls`,
  `cariin_fase6_storage_realtime`, dan
  `cariin_fase6_function_execution_hardening` berhasil. Migration
  `add_admin_report_full_crud` juga sudah diterapkan dan diverifikasi.
- **Unique NIM:** ✅ NIM dipertahankan pada akun mahasiswa utama, dua profil
  duplikat dinormalisasi menjadi `NULL`, dan `idx_profiles_nim_unique` aktif.
  Jumlah profil tetap 5 dan tidak ada nilai NIM duplikat.
- **Runtime backend:** ✅ Dua session akun nyata lulus login, RPC, RLS, Storage,
  Realtime, dan trigger. Negative auth/authorization test ditolak sesuai
  harapan; cleanup terakhir menunjukkan nol artefak smoke test.

### Storage Buckets

| Bucket | Public | Policies | Status |
|--------|--------|----------|--------|
| `report-photos` | Yes | select+insert+update+delete by folder UUID | ✅ Remote |
| `avatars` | Yes | select+insert+update+delete by folder UUID | ✅ Remote |
| `chat-media` | No | 0 | ⏸ Defer (MVP text-only) |

### New Trigger (FASE 4.5)

- Remote memiliki 6 RPC aplikasi, 14 policy public, 8 policy Storage, dan 3
  bucket.
- Smoke test read-only RLS/RPC lulus; RPC approve → notifikasi → mark-resolved
  lulus dalam transaksi yang di-rollback.
- Smoke test client API lulus untuk `get_my_profile`, isolasi field sensitif,
  penolakan eskalasi role/perubahan langsung status report/RPC admin, laporan
  walk-in admin, Storage dua bucket, dua subscription Realtime, dan trigger
  conversation/notifikasi.
- Request recovery diterima dan email tercatat terkirim; deep-link sampai
  password baru masih perlu perangkat.
- Supabase Security Advisor masih memberi warning untuk tujuh fungsi
  `SECURITY DEFINER` yang memang diekspos ke role `authenticated`; authorization
  gate RPC sudah diuji. Warning lain: leaked-password protection Auth belum
  aktif. Performance Advisor terakhir hanya melaporkan satu index message belum
  terpakai pada database kecil, bukan error schema.

### Akun Seeded

| Role | Email | Password | UUID (auth.users.id) |
|------|-------|----------|----------------------|
| admin | `admin@cariin.app` | `admin123` | `c80aa818-4803-42f0-9265-5bb52cc81e19` |
| mahasiswa | `faiz@student.unu-jogja.ac.id` | `faizfaiz` | `14719036-99a4-4b8d-9bf0-8dce43cee0e0` |

---

## 4. ISSUE & WORKAROUND TERDOKUMENTASI

| Issue | Status | Workaround / Catatan |
|-------|--------|---------------------|
| `profiles_admin_all` policy bikin "permission denied" (rekursi RLS via is_admin()) | ✅ Resolved FASE 5 | Di-COMMENT-OUT di schema. Admin moderation pakai RPC security-definer. |
| `reports_update_self` WITH CHECK block transition ke `status='resolved'` | ✅ Fixed FASE 4 | WITH CHECK cuma cek `user_id = auth.uid()`. |
| Pressable `style={({pressed}) => ...}` (function-form) sering broken | ✅ Documented | Pakai children-as-function pattern — CLAUDE.md section 4.1. |
| Modal back button no-op di first screen modal | ✅ Fixed FASE 4 | Pakai `nav.getParent<RootStackParamList>()?.goBack()`. |
| Header title `position: absolute` capture tap | ✅ Fixed FASE 4 | Tambah `pointerEvents="none"` pada Text title overlay. |
| ESLint v9 + legacy config | ✅ Fixed | Migrated ke flat config `eslint.config.js`. |
| `feedStore` searchTimer module-level mutable | ✅ Fixed FASE 6 | Pindah ke closure zustand create. |
| `isValidPassword(null)` TypeError crash | ✅ Fixed FASE 6 | Guard `if (!password) return false`. |
| AuthContext `loadInitial()` no try/catch → stuck splash | ✅ Fixed FASE 6 | Try/catch/finally di loadInitial. |
| Admin pakai Bottom Tab, requirement dosen minta Drawer | ✅ Fixed | `AdminNavigator` jadi Drawer membungkus `AdminTabs` (Beranda + Tentang + Keluar). Hamburger ☰ di header Dashboard. |
| JWT disimpan di AsyncStorage (requirement: SecureStorage) | ✅ Fixed | `supabase.ts` pakai SecureStore adapter (chunked, workaround limit 2KB). AsyncStorage dipindah ke `feedStore` persist (cache offline). |
| `Notifications` sempat kehilangan navbar karena tab bar disembunyikan terlalu agresif | ✅ Fixed | `ChatTab` sekarang hanya fullscreen di `ChatRoom` dan `UserProfile`, `Notifications` tetap tampil navbar utama. |
| `MyPosts` belum satu bahasa visual dengan auth/chat | ✅ Fixed | `src/screens/profile/MyPostsScreen.tsx` dipoles ke glass layout dengan statistik, filter, dan card baru. |
| Project Supabase sempat `INACTIVE`/`NXDOMAIN` | ✅ Dipulihkan FASE 6 | Status remote kini `ACTIVE_HEALTHY`; project ref tidak berubah. |
| Dashboard admin overlap pada viewport perangkat | ✅ Fixed + retest iPhone | Header/actions dan `FlatList` sekarang berada dalam satu `SafeAreaView`; screenshot retest menunjukkan seluruh section tidak overlap. Blob dekoratif atas kemudian dihapus atas feedback user agar tidak mengganggu header. |
| Chat admin masih memakai aksen biru mahasiswa | 🟡 Fixed lokal, perlu retest | `InboxScreen`, `ChatRoomScreen`, dan `ChatBubble` memilih aksen berdasarkan role. |
| Composer chat iOS terlalu jauh dari keyboard | 🟡 Fixed lokal, perlu retest | Keyboard offset custom dihapus dan bottom safe-area ekstra tidak diterapkan saat keyboard terbuka. |
| Blob drawer bocor ke sisi kiri screen saat drawer tertutup | 🟡 Fixed lokal, perlu retest | Blob kanan-atas drawer dihapus dan root/drawer style memakai `overflow: hidden`. |
| Tombol back/hapus AdminReview berartefak kotak di iOS | 🟡 Fixed lokal, perlu retest | Wrapper blur/gradient diganti surface lingkaran 44×44 dengan shadow ringan. |
| Navbar admin berbeda dari liquid navbar mahasiswa dan ikon terasa “ngotak” | 🟡 Fixed lokal, perlu retest | Admin/mahasiswa memakai `LiquidTabBar`; tile aktif dihapus, indikator aktif berupa garis, dan FAB dibuat bulat dengan aksen role. |
| Switch Hilang/Temuan terasa seperti pindah halaman dan mereset form | 🟡 Fixed lokal, perlu retest | `CreateReportScreen` mengganti mode melalui local state, bukan `nav.replace`, sehingga field bersama tetap terjaga. |
| Admin walk-in tidak dapat diedit/diselesaikan dari UI | 🟡 Fixed source + remote, perlu retest perangkat | `AdminEditReportScreen`, tombol Edit/Selesaikan, RPC `update_admin_report`, dan `admin_mark_report_resolved` sudah aktif; success + non-admin rejection diuji dalam transaksi rollback. |
| Switch Hilang/Temuan form walk-in admin terasa pindah halaman dan mereset draft | 🟡 Fixed lokal, perlu retest | `AdminCreateLostScreen` dan `AdminCreateFoundScreen` memakai `reportType` lokal; tidak lagi memanggil `nav.replace`, dan field bersama dipertahankan. |

---

## 5. ARSITEKTUR

```
RootNavigator (src/navigation/index.tsx)
  ├── isLoading → LoadingScreen
  ├── !isAuthenticated → AuthNavigator
  │     └── Splash → RoleSelection → Login | Register | ForgotPassword
  ├── role==='admin' → AdminNavigator (Drawer + aksen teal) [FASE 5 ✅]
  │     └── Dashboard/Review/Edit | Semua Laporan | Buat Walk-In | Chat | Profil
  └── role==='mahasiswa' → MainNavigator (Bottom Tab + Modal)
        ├── HomeTab → HomeStack
        │     ├── HomeFeed (bell badge notif ✅)
        │     ├── DetailLost / DetailFound (shared via DetailReportScreen, tombol Chat ✅)
        │     ├── ChatRoom ✅
        │     └── UserProfile ✅
        ├── ChatTab → ChatStack [FASE 4.5 ✅]
        │     ├── Inbox ✅
        │     ├── ChatRoom ✅
        │     ├── UserProfile ✅
        │     └── Notifications ✅
        ├── CreateTab (FAB +) → CreateModal
        │     ├── CreateLost / CreateFound (shared via CreateReportScreen)
        │     └── Success
        ├── MyPostsTab → MyPostsStack
        │     ├── MyPosts
        │     ├── EditPost
        │     └── DetailLost / DetailFound
        └── ProfileTab → ProfileStack
              ├── Profile (avatar upload ✅)
              ├── Settings ✅
              ├── Help ✅
              └── UserProfile ✅
```

State global:
- `AuthContext` — session, user, userProfile, role, methods
- `NotifContext` ✅ — unread count + auto-refresh tiap 15 detik
- `feedStore` (Zustand) — reports cache + filter
- `chatStore` ✅ (Zustand) — conversations, messages, realtime subscription

UI screens yang baru dipoles:
- `RoleSelectionScreen`
- `LoginScreen` / `RegisterScreen`
- `LiquidTabBar`
- `MyPostsScreen`
- `NotificationsScreen` visibility behavior

---

## 6. FILE PENTING

### Sumber kebenaran (JANGAN UBAH)
| File | Isi |
|------|-----|
| `CONTEXT.md` | Spec lengkap project dari dosen |
| `UI_AUDIT.md` | Inventory 26 screen + spec UI |
| `../cariin-web/*.html` | 26 prototype HTML, sumber visual untuk implementasi screen |

### Update tiap akhir fase
| File | Tujuan |
|------|--------|
| `CLAUDE.md` | Pattern + gotcha untuk AI baru. |
| `CHECKPOINT.md` | Status snapshot (file ini). |
| `NEXT_STEPS.md` | Plan fase berikutnya. |
| `AI_NEXT_PROMPT.md` | Prompt copy-paste dan urutan kerja AI berikutnya. |

### Code reference
| File | Isi |
|------|-----|
| `src/services/chat.service.ts` | **FASE 4.5** — listConversations, getOrCreateConversation, sendMessage, subscribeToMessages, markMessagesAsRead |
| `src/services/notification.service.ts` | **FASE 4.5** — listNotifications, markAsRead, markAllAsRead, unreadCount |
| `src/store/chatStore.ts` | **FASE 4.5** — Zustand: conversations, messages, subscribe/unsubscribe realtime |
| `src/context/NotifContext.tsx` | **FASE 4.5** — unread count global + auto-poll 15s |
| `src/components/ChatBubble.tsx` | **FASE 4.5** — bubble kiri/kanan + timestamp + read indicator |
| `supabase-schema.sql` | DDL + RLS + triggers (baru: `trg_notify_new_message`) |

---

## 7. FASE 6 — REMAINING

### Sudah selesai (Bug Fix & Polish session):
- ✅ SettingsScreen, HelpScreen, UserProfileScreen
- ✅ Avatar upload di ProfileScreen (tap → camera/gallery → uploadAvatar)
- ✅ `eas.json` build config
- ✅ App icon/adaptive icon/favicon diarahkan ke asset brand Cari.In
- ✅ Kandidat EAS production APK berhasil: build `c1217c5d-ac3b-480e-8577-841877bbb68b`, 76,83 MiB
- ✅ Rebuild production final-config berhasil: build
  `4d5739ec-b37c-4527-b6cf-c1dc48f0bd6b`, status `FINISHED`, 80.572.407 byte
  (76,84 MiB), SHA-256
  `6c6d30f0af72d0ba1b29a16a463e1b9bd14176ac74b96fe7c1152d2129479c82`
  — artifact ini dibuat sebelum polish/admin full CRUD terbaru sehingga sekarang
  menjadi bukti historis terverifikasi, bukan build source terkini
- ✅ APK final-config tersimpan lokal di
  `dist/cariin-production-4d5739ec-b37c-4527-b6cf-c1dc48f0bd6b.apk`
  (`dist/` di-ignore Git/EAS)
- ✅ APK final-config lulus `unzip -t`/`zipinfo -t`, terbaca sebagai package
  `id.cariin.app` version `1.0.0` (versionCode 1), scheme `cariin`, minSdk 24,
  targetSdk 36, dan manifest final tidak memuat `RECORD_AUDIO`
- ✅ `README.md` comprehensive
- ✅ SplashScreen fade-in animation
- ✅ Bug fix: AuthContext stuck splash, isValidPassword crash, feedStore searchTimer
- ✅ RoleSelection scroll/syntax fix
- ✅ Navbar behavior: Notifications tetap ada navbar, ChatRoom fullscreen
- ✅ `MyPostsScreen` glass polish
- ✅ Final consistency pass: `ProfileScreen` (glass layout update), `AdminDashboardScreen` (tombol Buat & Semua Laporan), `AdminReviewScreen` (tambah fungsi Hapus Laporan).
- ✅ Admin full CRUD: form edit data/foto termasuk identitas walk-in, tombol
  Selesaikan laporan aktif, dan dua RPC admin-only sudah diterapkan ke remote
- ✅ Reset-password deep-link sampai update password
- ✅ FAQ accordion, toggle notifikasi persisten, public-profile chat, dan share report
- ✅ Akses Supabase pada screen dipindahkan ke service layer
- ✅ Hardening schema: role/status/participant/message fields dilindungi privilege + RPC
- ✅ Bucket dan policy Storage didefinisikan di schema; upload dibatasi ke folder UUID pemilik
- ✅ Ganti kata sandi admin sudah menjadi flow nyata, bukan placeholder
- ✅ Chat menangani race response HTTP/realtime tanpa menduplikasi pesan
- ✅ Laporan Mopro pernah diselaraskan pada snapshot sebelum enhancement admin
  terbaru; versi lama sudah dikumpulkan user dan tidak boleh diubah lagi tanpa
  instruksi eksplisit
- ✅ Schema/Auth remote terverifikasi; redirect recovery aktif
- ✅ Backend diuji dengan dua session akun nyata untuk Auth, RPC, RLS, Storage,
  Realtime, trigger, negative cases, dan cleanup
- 🟡 Tiga regresi UI dari screenshot perangkat sudah diperbaiki di source:
  dashboard overlap, warna chat admin, dan jarak composer iOS; belum boleh
  dinyatakan lulus sebelum screenshot/retest perangkat terbaru
- 🟡 Regresi tambahan sudah diperbaiki statis: drawer leak, ikon review, navbar
  tanpa tile kotak, switch form mahasiswa/admin tanpa route transition, serta
  admin Edit/Selesaikan; seluruhnya masih perlu retest perangkat

### Belum selesai:
- Lanjutkan test UI Auth, Realtime, dan Storage pada dua perangkat
- Selesaikan reset password dari link email sampai password baru
- Jalankan seluruh `TESTING-MANUAL.md` dan simpan bukti
- Rebuild production APK dari source terbaru setelah retest UI selesai
- Install dan smoke test APK production final-config pada perangkat Android
  (ditunda atas keputusan user)
- Update README dengan screenshot terbaru
- Rekam video demo dan siapkan bukti submission
- Jangan menyinkronkan ulang laporan Mopro yang sudah dikumpulkan tanpa
  permintaan eksplisit user

---

## 8. CARA RESUME

Saat sesi baru, ketik salah satu:

```
Baca CHECKPOINT.md dan NEXT_STEPS.md, lanjut FASE 6
```

---

## 9. CATATAN UNTUK AI BARU (penting!)

- ⚠️ **Pressable pattern children-as-function WAJIB.** Lihat CLAUDE.md section 4.1.
- ⚠️ **Image dimension:** parent View harus punya height eksplisit.
- ⚠️ **Modal back:** pakai `getParent()?.goBack()`.
- ⚠️ **Title overlay header:** `pointerEvents="none"`.
- ⚠️ **PostgrestError bukan Error:** wrap `throw new Error(error.message)`.
- ⚠️ **Realtime subscription:** unsubscribe di cleanup effect/biar gak memory leak.
- ⚠️ **NotifContext polling 15 detik** — di-refresh otomatis, gak perlu manual.
- ⚠️ **Trigger `trg_notify_new_message`** perlu di-apply di Supabase Dashboard.
- ⚠️ **JANGAN push** ke origin tanpa user eksplisit minta.
- ⚠️ **JANGAN ubah `CONTEXT.md` & `UI_AUDIT.md`**.
- ⚠️ **Setelah edit code, langsung `npx tsc --noEmit`** verify clean.
- ⚠️ **Sebelum commit, WAJIB update CHECKPOINT.md + NEXT_STEPS.md**.
- ⚠️ **Komunikasi:** Indonesia casual lo/gw.
