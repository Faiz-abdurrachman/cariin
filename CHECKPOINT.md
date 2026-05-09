# CHECKPOINT — Cari.In Mobile

> Snapshot kondisi project. Baca file ini + `NEXT_STEPS.md` saat resume.
> Last updated: 2026-05-10 | Branch: `main`

---

## STATUS PROGRES

| Fase | Status | Commit |
|------|--------|--------|
| FASE 1 — Setup Project | ✅ Selesai | `ea6cc33` |
| FASE 2 — Fondasi Navigasi + AuthContext | ✅ Selesai | `682093d` |
| FASE 3 — Auth Screens | ✅ Selesai | `c42101a` |
| FASE 4 — Core Mahasiswa | ✅ Selesai | (lihat `git log -1 --format=%h`) |
| **FASE 4.5 — Chat (Inbox + Realtime)** | 🔜 **Berikutnya (opsional)** | — |
| FASE 5 — Admin Screens | 🔜 Belum mulai | — |
| FASE 6 — Polish & Submission | 🔜 Belum mulai | — |

`git log --oneline -5` untuk lihat hash commit terkini.

---

## QUICK FACTS — Yang harus diingat

### Stack
- Expo SDK **54**, React Native 0.81.5, React 19.1.0
- React Navigation **v7** (Stack + Tab + Drawer)
- NativeWind **v4** (Tailwind for RN)
- Supabase (Auth + Postgres + Storage) — bukan Firebase
- TypeScript strict, alias `@/*` → `src/*`
- Web preview enabled (react-native-web + react-dom + @expo/metro-runtime). Run `npx expo start --web` untuk preview di Chrome.

### Supabase
- Project URL prefix: `kytsksnyoyffwbksotps`
- `.env` ada (URL + ANON_KEY + ALLOWED_EMAIL_DOMAIN=`student.unu-jogja.ac.id`)
- Schema run via `supabase-schema.sql` (5 tabel + RLS + triggers + GRANTs)
- Email Auth: ✅ Enabled, **Confirm email: OFF** (untuk dev)
- Storage buckets: ✅ `report-photos` (public, 6 policies), ✅ `avatars` (public, 6 policies). `chat-media` dibuat tapi belum di-policy (defer FASE 4.5)
- 5 seed reports approved (lihat seed SQL di history) untuk feed publik testing
- Google OAuth: ❌ Belum disetup (opsional, defer ke FASE 6)
- Redirect URLs (`cariin://auth-callback`, `cariin://reset-password`): ❌ Belum dipasang di URL Configuration

### Akun Test (sudah di-seed manual via Dashboard)
| Role | Email | Password | UUID (auth.users.id) |
|------|-------|----------|----------------------|
| admin | `admin@cariin.app` | `admin123` | `c80aa818-4803-42f0-9265-5bb52cc81e19` |
| mahasiswa | `faiz@student.unu-jogja.ac.id` | `faizfaiz` (di-register via app FASE 3) | `14719036-99a4-4b8d-9bf0-8dce43cee0e0` |

UUID-nya stabil — tinggal copas kalau perlu SQL seed/query manual tanpa subselect.

### Issue & Workaround Terdokumentasi
- **`profiles_admin_all` policy** di-comment-out di schema (rekursi RLS via `is_admin()` bikin "permission denied"). Defer ke FASE 5; admin moderasi pakai service_role atau RPC function.
- **`reports_update_self` WITH CHECK** sebelumnya replikasi `status <> 'resolved'` yang nge-block transition markAsResolved. Sudah di-fix di schema FASE 4 — WITH CHECK cuma validate user_id, biar update status ke 'resolved' lolos.
- **Pressable function-form style unreliable** di RN/Expo SDK 54 versi project ini. WAJIB pakai `<Pressable>{({pressed}) => <View>...</View>}</Pressable>` (children-as-function), bukan `style={({pressed}) => ...}` — yg sering bikin tombol invisible atau Image collapse. Lihat FASE 4 PrimaryButton/CreateReport/Success.
- **Modal back button** harus pakai `nav.getParent<RootStackParamList>()?.goBack()` untuk dismiss, bukan `nav.goBack()` di stack lokal — first screen di nested modal stack gak punya history.
- **Auto memory CC** disimpan di `~/.claude/projects/-home-faiz-Semester-4-Mobile-Programming-cariin-cariin-mobile/memory/` — context user/feedback/project.
- **ESLint v9 + .eslintrc.js (legacy)** — perlu env var `ESLINT_USE_FLAT_CONFIG=false` untuk lint. TODO: migrasi ke flat config (`eslint.config.js`) di FASE 6.

---

## ARSITEKTUR — Map cepat

```
RootNavigator (src/navigation/index.tsx)
  └── isLoading → LoadingScreen
  └── !isAuthenticated → AuthNavigator
  │     └── Splash → RoleSelection → Login | Register | ForgotPassword
  └── role==='admin' → AdminNavigator (Drawer indigo)
  │     └── Dashboard | Semua Laporan | Buat Laporan | (Logout custom)
  └── else → MainNavigator (Bottom Tab + Modal)
        ├── HomeTab → HomeStack (HomeFeed + Detail*)
        ├── ChatTab → ChatStack (Inbox/ChatRoom — placeholder, FASE 4.5)
        ├── CreateTab (FAB) → modal CreateModal (CreateLost/Found shared + Success)
        ├── MyPostsTab → MyPostsStack (MyPosts + EditPost + Detail*)
        └── ProfileTab → ProfileStack (Profile + Settings/Help/UserProfile placeholder)
```

State global:
- `AuthContext` (src/context/AuthContext.tsx) — session, user, userProfile, role, isLoading, methods (loginWithEmail, loginWithGoogle, register, logout, resetPassword)
- `feedStore` (Zustand) — reports cache + filter type/category/search untuk HomeFeed
- `chatStore` masih stub (FASE 4.5)

---

## FILE PENTING (referensi)

| File | Isinya |
|------|--------|
| `CONTEXT.md` | Spec lengkap project (jangan diubah; sumber kebenaran) |
| `UI_AUDIT.md` | Inventory 26 screen + spec UI (jangan diubah) |
| `NEXT_STEPS.md` | Plan fase berikutnya (sekarang: FASE 4.5 chat / FASE 5 admin) |
| `supabase-schema.sql` | DDL Postgres + RLS + GRANT + triggers |
| `../cariin-web/*.html` | Prototype HTML 26 screen — referensi visual saat implementasi screen RN |
| `src/utils/constants.ts` | COLORS, CATEGORIES (8), FACULTIES (8), REPORT_STATUS_LABEL, type guards |
| `src/utils/validators.ts` | isValidCampusEmail, isValidPassword, isValidNim + error msg ID |
| `src/utils/formatters.ts` | formatRelativeTime, formatFullDate, categoryLabel/Emoji |
| `src/services/auth.service.ts` | Wrapper Supabase Auth — sudah lengkap |
| `src/services/report.service.ts` | CRUD reports + types Report/ReportInput/ReportFilter (FASE 4) |
| `src/services/upload.service.ts` | Image picker + upload ke Storage (report-photos, avatars) (FASE 4) |
| `src/services/{chat,notification}.service.ts` | **Stub** — diisi di FASE 4.5 |

---

## FILE PLACEHOLDER YANG MASIH HARUS DIISI

### FASE 4.5 — Chat & Notifikasi
- `src/screens/chat/InboxScreen.tsx` — list percakapan
- `src/screens/chat/ChatRoomScreen.tsx` — UI chat realtime via Supabase Realtime
- `src/screens/chat/NotificationsScreen.tsx` — list notif (laporan disetujui/ditolak, pesan baru)
- `src/components/ChatBubble.tsx` — bubble pesan kiri/kanan
- `src/services/chat.service.ts`, `notification.service.ts`
- `src/store/chatStore.ts`
- Storage `chat-media` policies (kalau dukung lampiran chat)

### FASE 5 — Admin
- `AdminDashboardScreen`, `AdminReviewScreen`, `AdminReportsScreen`, `AdminCreateLostScreen`, `AdminCreateFoundScreen`
- Pasang ulang `profiles_admin_all` via service_role atau RPC function security definer

### FASE 6 — Polish (defer)
- `SettingsScreen.tsx` (edit profil, ganti password, toggle push notif)
- `HelpScreen.tsx` (FAQ static)
- `UserProfileScreen.tsx` (profil publik dipake dari Detail/Chat)
- `helpers.ts`, `ConfirmModal`
- ESLint flat config migration

---

## CARA MELANJUTKAN

Cukup ketik:
```
Baca CHECKPOINT.md dan NEXT_STEPS.md, lanjut FASE 4.5 (chat) atau FASE 5 (admin).
```
