# CHECKPOINT — Cari.In Mobile

> Snapshot kondisi project tiap akhir fase. Baca file ini + `NEXT_STEPS.md` saat resume sesi (urutan: CLAUDE.md → CHECKPOINT.md → NEXT_STEPS.md).
>
> **Last updated:** 2026-05-23 | **Branch:** `main` | **Local ahead origin:** 2 commits (FASE 4 + FASE 5) — belum push. Quick-fix commit pending.

---

## 1. STATUS PROGRES PER FASE

| Fase | Scope | Status | Commit |
|------|-------|--------|--------|
| FASE 1 | Setup Project (Expo + NativeWind + TS strict, Firebase→Supabase) | ✅ Selesai | `ea6cc33` |
| FASE 2 | Fondasi Navigasi (Stack+Tab+Drawer) + AuthContext | ✅ Selesai | `682093d` |
| FASE 3 | Auth Screens (Splash, RoleSelection, Login, Register, ForgotPassword) | ✅ Selesai | `c42101a` |
| FASE 4 | Core Mahasiswa (Home, Detail, Create, MyPosts, Profile) | ✅ Selesai | `9e511f6` |
| **FASE 4.5** | **Chat & Notifikasi (opsional, mahasiswa flow lengkap)** | 🔜 **Belum mulai** | — |
| **FASE 5** | **Admin Screens (moderate, dashboard, walk-in)** | ✅ **Selesai** | *(commit incoming)* |
| **FASE 6** | **Polish (Settings, Help, UserProfile, EAS build)** | 🔜 **Belum mulai** | — |

`git log --oneline -10` untuk konfirmasi hash terkini.

---

## 2. STACK & TOOLING

- **Frontend:** Expo SDK 54, React Native 0.81.5, React 19.1.0, NativeWind v4 (Tailwind for RN), Zustand 5, React Navigation v7
- **Backend:** Supabase (Auth + Postgres + Storage + Realtime)
- **Bahasa:** TypeScript strict (`noImplicitAny`, `noUncheckedIndexedAccess`)
- **Path alias:** `@/*` → `src/*`
- **Lint:** ESLint v9 + flat config (`eslint.config.js`) ✅ migrated from legacy `.eslintrc.js`. `npm run lint` clean, 0 errors/warnings.
- **Web preview:** `@expo/metro-runtime` masih installed (kalau butuh `npx expo start --web`). `react-native-web` + `react-dom` removed (unused in src).
- **iPhone Expo Go** = primary test device (user manual test).

---

## 3. SUPABASE STATE

- **Project URL prefix:** `kytsksnyoyffwbksotps`
- **Dashboard:** https://supabase.com/dashboard/project/kytsksnyoyffwbksotps
- **`.env`** lokal terisi (URL + ANON_KEY + ALLOWED_EMAIL_DOMAIN=`student.unu-jogja.ac.id` + APP_NAME + APP_ENV)
- **Schema:** lihat `supabase-schema.sql` (idempotent, aman di-rerun). 5 tabel + RLS + triggers + GRANTs.
- **Email Auth:** ✅ Enabled, **Confirm email: OFF** (dev convenience)
- **Google OAuth:** ❌ Belum disetup (defer FASE 6)
- **Redirect URLs deep link:** ❌ Belum dipasang di URL Configuration (defer FASE 6)

### Storage Buckets

| Bucket | Public | Policies | Status |
|--------|--------|----------|--------|
| `report-photos` | Yes | 3 (insert+update+delete by user folder prefix) | ✅ Active |
| `avatars` | Yes | 3 (insert+update+delete by user folder prefix) | ✅ Active |
| `chat-media` | No | 0 | ⏸ Defer FASE 4.5 |

### Akun Seeded

| Role | Email | Password | UUID (auth.users.id) |
|------|-------|----------|----------------------|
| admin | `admin@cariin.app` | `admin123` | `c80aa818-4803-42f0-9265-5bb52cc81e19` |
| mahasiswa | `faiz@student.unu-jogja.ac.id` | `faizfaiz` | `14719036-99a4-4b8d-9bf0-8dce43cee0e0` |

UUID stabil — copas kalau perlu SQL seed/query manual.

### 5 Reports Seeded (FASE 4 testing)
Status semua `approved`, mix lost/found, satu `created_by_admin=true`. Lihat git history untuk full SQL.

---

## 4. ISSUE & WORKAROUND TERDOKUMENTASI

| Issue | Status | Workaround / Catatan |
|-------|--------|---------------------|
| `profiles_admin_all` policy bikin "permission denied" (rekursi RLS via is_admin()) | ✅ Resolved FASE 5 | Di-COMMENT-OUT di schema. Admin moderation pakai RPC security-definer (`update_report_status`, `create_admin_report`). |
| `reports_update_self` WITH CHECK block transition ke `status='resolved'` | ✅ Fixed FASE 4 | WITH CHECK cuma cek `user_id = auth.uid()`, bukan replikasi USING. Schema sudah update. |
| Pressable `style={({pressed}) => ...}` (function-form) sering broken | ✅ Documented | Pakai children-as-function pattern — lihat CLAUDE.md section 4.1. |
| Modal back button no-op di first screen modal | ✅ Fixed FASE 4 | Pakai `nav.getParent<RootStackParamList>()?.goBack()`. |
| Header title `position: absolute` capture tap, tombol back gak jalan | ✅ Fixed FASE 4 | Tambah `pointerEvents="none"` pada Text title overlay. |
| ESLint v9 + legacy config | ✅ Fixed | Migrated ke flat config `eslint.config.js`. `npm run lint` jalan clean tanpa env var. |

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
        │     ├── HomeFeed (4.5)
        │     └── DetailLost / DetailFound (shared via DetailReportScreen)
        ├── ChatTab → ChatStack [FASE 4.5]
        │     └── Inbox | ChatRoom | UserProfile | Notifications
        ├── CreateTab (FAB +) → CreateModal (root-level modal)
        │     ├── CreateLost / CreateFound (shared via CreateReportScreen)
        │     └── Success
        ├── MyPostsTab → MyPostsStack
        │     ├── MyPosts (4.8)
        │     ├── EditPost (4.8)
        │     └── DetailLost / DetailFound
        └── ProfileTab → ProfileStack
              ├── Profile (lengkap, navigate ke Settings/Help)
              ├── Settings | Help | UserProfile [FASE 6 placeholder]
```

State global:
- `AuthContext` (`src/context/AuthContext.tsx`) — session, user, userProfile, role, methods
- `feedStore` (`src/store/feedStore.ts`) — reports cache + filter (HomeFeed)
- `chatStore` (`src/store/chatStore.ts`) — stub, FASE 4.5

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
| `CLAUDE.md` | Pattern + gotcha untuk AI baru. Update kalau ketemu pattern penting baru. |
| `CHECKPOINT.md` | Status snapshot (file ini). Update tiap commit fase baru. |
| `NEXT_STEPS.md` | Plan fase berikutnya step-by-step. Update tiap fase berganti. |

### Code reference
| File | Isi |
|------|-----|
| `src/utils/constants.ts` | COLORS, CATEGORIES (8), FACULTIES, REPORT_STATUS_LABEL, type guards |
| `src/utils/validators.ts` | isValidCampusEmail, isValidPassword, isValidNim |
| `src/utils/formatters.ts` | formatRelativeTime, formatFullDate, categoryLabel/Emoji |
| `src/services/auth.service.ts` | Wrapper Supabase Auth (FASE 3) |
| `src/services/report.service.ts` | CRUD reports + admin functions (approve/reject/createAdmin/stats) (FASE 4+5) |
| `src/services/upload.service.ts` | Image picker + Storage upload (base64→Uint8Array) (FASE 4) |
| `src/services/{chat,notification}.service.ts` | **STUB** — diisi FASE 4.5 |
| `src/components/PrimaryButton.tsx` | Reference pattern Pressable children-as-function |
| `supabase-schema.sql` | DDL Postgres + RLS + GRANT + triggers (idempotent) |

---

## 7. REMAINING WORK (placeholder yang masih `export {};` atau stub)

### FASE 4.5 — Chat & Notifikasi
**Screens:**
- `src/screens/chat/InboxScreen.tsx` — list percakapan terurut by `last_at`
- `src/screens/chat/ChatRoomScreen.tsx` — UI chat realtime via Supabase Realtime channel
- `src/screens/chat/NotificationsScreen.tsx` — list notif + tap → ke Detail/Chat

**Components:**
- `src/components/ChatBubble.tsx` — bubble pesan kiri/kanan dgn timestamp

**Services & Stores:**
- `src/services/chat.service.ts` — listConversations, getMessages, sendMessage, subscribe
- `src/services/notification.service.ts` — list, markAsRead
- `src/store/chatStore.ts` — messages state + active channel

**Backend:**
- Storage `chat-media` policies (kalau lampiran di-support)
- Trigger DB tambahan untuk insert ke `notifications` saat report di-approve/reject (atau di-handle FASE 5)

**Update existing:**
- `DetailReportScreen.tsx` tombol chat: handle tap → upsert conversation, navigate ke ChatRoom (sekarang masih show Alert "Segera hadir")

### FASE 5 — Admin Screens ✅ SELESAI
Semua admin screens sudah diimplementasi. RPC functions (`update_report_status`, `create_admin_report`) sudah di-supabase-schema.sql. Admin moderation pakai security-definer RPC, bukan direct RLS `profiles_admin_all`.

### FASE 6 — Polish
**Screens:**
- `src/screens/profile/SettingsScreen.tsx` — edit nama, ganti password, toggle push notif
- `src/screens/profile/HelpScreen.tsx` — FAQ static
- `src/screens/profile/UserProfileScreen.tsx` — profil publik (dipake dari Detail/Chat)

**Other:**
- Avatar upload integration di Profile (uploadAvatar service udah siap di upload.service.ts)
- Animasi transition, splash final, app icon
- Google OAuth setup (Cloud Console + Supabase provider + redirect URLs)
- ESLint flat config migration ✅ DONE (quick-fix)
- expo-doctor pass + EAS build standalone untuk submission ke dosen

---

## 8. CARA RESUME

Saat sesi baru, ketik salah satu:

```
Baca CHECKPOINT.md dan NEXT_STEPS.md, lanjut FASE 4.5
```

```
Baca CHECKPOINT.md dan NEXT_STEPS.md, lanjut FASE 5
```

```
Baca CHECKPOINT.md dan NEXT_STEPS.md, lanjut FASE 6
```

AI baru bakal otomatis baca CLAUDE.md (auto-load), CHECKPOINT.md, dan NEXT_STEPS.md, lalu kasih rekap plan + tanya scope sebelum eksekusi.

---

## 9. CATATAN UNTUK AI BARU (penting!)

- ⚠️ **Pressable pattern children-as-function WAJIB.** Lihat CLAUDE.md section 4.1. Banyak bug FASE 4 disebabkan ini.
- ⚠️ **Image dimension:** parent View harus punya height eksplisit (number, bukan `'100%'` di nested context).
- ⚠️ **Modal back:** pakai `getParent()?.goBack()`, bukan `nav.goBack()` di screen pertama modal.
- ⚠️ **Title overlay header:** `pointerEvents="none"` di Text yg `position: absolute`.
- ⚠️ **PostgrestError bukan Error:** wrap `throw new Error(error.message)` di service.
- ⚠️ **JANGAN push** ke origin tanpa user eksplisit minta.
- ⚠️ **JANGAN ubah `CONTEXT.md` & `UI_AUDIT.md`** — sumber kebenaran dosen.
- ⚠️ **Setelah edit code, langsung `npx tsc --noEmit`** verify clean sebelum klaim sukses.
- ⚠️ **Sebelum commit, WAJIB update CHECKPOINT.md + NEXT_STEPS.md** reflect state baru.
- ⚠️ **Komunikasi:** Indonesia casual lo/gw, step-by-step pelan-pelan, opsi A/B/C dengan trade-off via `AskUserQuestion`.
