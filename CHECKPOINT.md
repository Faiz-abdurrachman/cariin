# CHECKPOINT — Cari.In Mobile

> Snapshot kondisi project. Baca file ini + `NEXT_STEPS.md` saat resume.
> Last updated: 2026-05-09 | Branch: `main` | 4 commit ahead of `origin/main` (belum push)

---

## STATUS PROGRES

| Fase | Status | Commit |
|------|--------|--------|
| FASE 1 — Setup Project | ✅ Selesai | `ea6cc33` |
| FASE 2 — Fondasi Navigasi + AuthContext | ✅ Selesai | `682093d` |
| FASE 3 — Auth Screens | ✅ Selesai | `c42101a` |
| **FASE 4 — Core Mahasiswa** | 🔜 **Berikutnya** | — |
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

### Supabase
- Project URL prefix: `kytsksnyoyffwbksotps`
- `.env` ada (URL + ANON_KEY + ALLOWED_EMAIL_DOMAIN=`student.unu-jogja.ac.id`)
- Schema run via `supabase-schema.sql` (5 tabel: profiles/reports/conversations/messages/notifications + RLS + triggers + GRANTs)
- Email Auth: ✅ Enabled, **Confirm email: OFF** (untuk dev)
- Storage buckets: ❌ **Belum dibuat** (FASE 4 wajib bikin: `report-photos`, `chat-media`, `avatars`)
- Google OAuth: ❌ Belum disetup (opsional, defer ke FASE 6)
- Redirect URLs (`cariin://auth-callback`, `cariin://reset-password`): ❌ Belum dipasang di URL Configuration

### Akun Test (sudah di-seed manual via Dashboard)
| Role | Email | Password |
|------|-------|----------|
| admin | `admin@cariin.app` | `admin123` |
| mahasiswa | `faiz@student.unu-jogja.ac.id` | `test123` (di-register via app FASE 3) |

### Issue & Workaround Terdokumentasi
- **`profiles_admin_all` policy** di-comment-out di schema (rekursi RLS via `is_admin()` bikin "permission denied"). Defer ke FASE 5; admin moderasi pakai service_role atau RPC function.
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
        ├── HomeTab → HomeStack
        ├── ChatTab → ChatStack
        ├── CreateTab (FAB) → modal CreateModal
        ├── MyPostsTab → MyPostsStack
        └── ProfileTab → ProfileStack
```

State global:
- `AuthContext` (src/context/AuthContext.tsx) — session, user, userProfile, role, isLoading, methods (loginWithEmail, loginWithGoogle, register, logout, resetPassword)
- Zustand stores (`feedStore`, `chatStore`) — masih stub, dipake di FASE 4

---

## FILE PENTING (referensi)

| File | Isinya |
|------|--------|
| `CONTEXT.md` | Spec lengkap project (jangan diubah; sumber kebenaran) |
| `UI_AUDIT.md` | Inventory 26 screen + spec UI (jangan diubah) |
| `NEXT_STEPS.md` | Plan fase berikutnya (sekarang: FASE 4 detail) |
| `supabase-schema.sql` | DDL Postgres + RLS + GRANT + triggers |
| `../cariin-web/*.html` | Prototype HTML 26 screen — referensi visual saat implementasi screen RN |
| `src/utils/constants.ts` | COLORS, CATEGORIES (8), FACULTIES (8), REPORT_STATUS_LABEL, type guards |
| `src/utils/validators.ts` | isValidCampusEmail, isValidPassword, isValidNim + error msg ID |
| `src/services/auth.service.ts` | Wrapper Supabase Auth — sudah lengkap |
| `src/services/{report,chat,notification,upload}.service.ts` | **Stub** — diisi di FASE 4 |

---

## FILE PLACEHOLDER YANG MASIH HARUS DIISI

### Screens (untuk FASE 4 — Core Mahasiswa)
- `src/screens/main/HomeScreen.tsx` — feed laporan + search + filter chip + kategori
- `src/screens/main/DetailLostScreen.tsx`, `DetailFoundScreen.tsx` — detail laporan
- `src/screens/main/CreateLostScreen.tsx`, `CreateFoundScreen.tsx` — form lapor (foto wajib)
- `src/screens/main/SuccessScreen.tsx` — konfirmasi laporan masuk
- `src/screens/profile/MyPostsScreen.tsx`, `EditPostScreen.tsx`
- `src/screens/profile/ProfileScreen.tsx` — sekarang punya tombol Logout sementara, FASE 4 ganti UI lengkap
- `src/screens/profile/SettingsScreen.tsx`, `HelpScreen.tsx`, `UserProfileScreen.tsx`
- `src/screens/chat/InboxScreen.tsx`, `ChatRoomScreen.tsx`, `NotificationsScreen.tsx`

### Komponen
- `ReportCard`, `CategoryGrid`, `StatusBadge`, `ViaAdminBadge`, `ChatBubble`, `EmptyState`, `LoadingSkeleton`, `ConfirmModal` — semua masih `export {};`

### Services & Stores
- `report.service.ts`, `chat.service.ts`, `notification.service.ts`, `upload.service.ts`
- `feedStore.ts`, `chatStore.ts`
- `formatters.ts`, `helpers.ts`

### Admin Screens (FASE 5)
- `AdminDashboardScreen`, `AdminReviewScreen`, `AdminReportsScreen`, `AdminCreateLostScreen`, `AdminCreateFoundScreen`

---

## CARA MELANJUTKAN

Cukup ketik:
```
Baca CHECKPOINT.md dan NEXT_STEPS.md, lanjut FASE 4.
```
