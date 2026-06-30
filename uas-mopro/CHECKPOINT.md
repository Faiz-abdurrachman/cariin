# CHECKPOINT — Cariin Mobile

> Snapshot kondisi project tiap akhir fase. Baca file ini + `NEXT_STEPS.md` saat resume sesi (urutan: CLAUDE.md → CHECKPOINT.md → NEXT_STEPS.md).
>
> **Last updated:** 2026-06-29 | **Branch:** `main` | **Local ahead origin:** FASE 4.5 + bug fixes belum commit + belum push.

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
| **FASE 6** | **Polish (Settings, Help, UserProfile, EAS build)** | 🟡 **Partial** | *(commit incoming)* |

`git log --oneline -10` untuk konfirmasi hash terkini.

---

## 2. STACK & TOOLING

- **Frontend:** Expo SDK 54, React Native 0.81.5, React 19.1.0, NativeWind v4 (Tailwind for RN), Zustand 5, React Navigation v7
- **Backend:** Supabase (Auth + Postgres + Storage + Realtime)
- **Bahasa:** TypeScript strict (`noImplicitAny`, `noUncheckedIndexedAccess`)
- **Path alias:** `@/*` → `src/*`
- **Lint:** ESLint v9 + flat config (`eslint.config.js`). `npm run lint` clean, 0 errors/warnings.
- **Web preview:** `@expo/metro-runtime` tersedia (`npx expo start --web`).
- **iPhone Expo Go** = primary test device (user manual test).

---

## 3. SUPABASE STATE

- **Project URL prefix:** `kytsksnyoyffwbksotps`
- **Dashboard:** https://supabase.com/dashboard/project/kytsksnyoyffwbksotps
- **`.env`** lokal terisi (URL + ANON_KEY + ALLOWED_EMAIL_DOMAIN=`student.unu-jogja.ac.id` + APP_NAME + APP_ENV)
- **Schema:** lihat `supabase-schema.sql` (idempotent, aman di-rerun). 5 tabel + RLS + triggers + GRANTs.
- **Email Auth:** ✅ Enabled, **Confirm email: OFF** (dev convenience)
- **Google OAuth:** ❌ Dihapus — login hanya via email kampus (UVP domain validation)
- **Redirect URLs deep link:** ❌ Belum dipasang di URL Configuration (defer FASE 6)

### Storage Buckets

| Bucket | Public | Policies | Status |
|--------|--------|----------|--------|
| `report-photos` | Yes | 3 (insert+update+delete by user folder prefix) | ✅ Active |
| `avatars` | Yes | 3 (insert+update+delete by user folder prefix) | ✅ Active |
| `chat-media` | No | 0 | ⏸ Defer (MVP text-only) |

### New Trigger (FASE 4.5)

- `trg_notify_new_message` — AFTER INSERT di `messages`, auto-insert notification ke receiver. Sudah di `supabase-schema.sql`, **perlu di-apply di Supabase Dashboard** (run SQL).

### Akun Seeded

| Role | Email | Password | UUID (auth.users.id) |
|------|-------|----------|----------------------|
| admin | `admin@cariin.app` | `admin123` | `c80aa818-4803-42f0-9265-5bb52cc81e19` |
| mahasiswa | `faiz@student.unu-jogja.ac.id` | `faiz` | `14719036-99a4-4b8d-9bf0-8dce43cee0e0` |

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

---

## 5. ARSITEKTUR

```
RootNavigator (src/navigation/index.tsx)
  ├── isLoading → LoadingScreen
  ├── !isAuthenticated → AuthNavigator
  │     └── Splash → RoleSelection → Login | Register | ForgotPassword
  ├── role==='admin' → AdminNavigator (Drawer indigo) [FASE 5 ✅]
  │     └── Dashboard (stats+pending list) | Semua Laporan (filter+search) | Buat Laporan (walk-in) | (Logout custom)
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
- ✅ Google OAuth button di LoginScreen (mahasiswa only)
- ✅ `eas.json` build config
- ✅ `README.md` comprehensive
- ✅ SplashScreen fade-in animation
- ✅ Bug fix: AuthContext stuck splash, isValidPassword crash, feedStore searchTimer

### Belum selesai:
- Google OAuth setup (Cloud Console + Supabase provider + redirect URLs) — external setup
- App icon final
- EAS build standalone APK (butuh `eas build`)
- expo-doctor re-check

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
