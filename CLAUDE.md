# CLAUDE.md — Cari.In Mobile

> File ini di-auto-read oleh Claude Code saat start sesi di repo ini.
> Tujuan: kasih konteks instan tanpa user musti ngulang.

## Project ringkas

**Cari.In** — aplikasi lost & found kampus untuk mahasiswa UNU Yogyakarta.
- Stack: Expo SDK 54, React Native 0.81.5, NativeWind v4, TypeScript strict.
- Backend: Supabase (Auth + Postgres + Storage). Bukan Firebase.
- Navigasi: React Navigation v7 (Stack + Tab + Drawer) — wajib dosen.
- State: Zustand (untuk feed/chat) + React Context (Auth).

## Cara mulai sesi

1. **Baca dulu** dalam urutan ini: `CHECKPOINT.md` → `NEXT_STEPS.md` → file yang relevan dgn task.
2. **Jangan ubah:** `CONTEXT.md` (spec dosen), `UI_AUDIT.md` (inventory screen). Sumber kebenaran.
3. **Referensi visual:** `../cariin-web/*.html` — 26 prototype HTML, sumber design untuk tiap screen RN.
4. **Confirmed terkini:** `git log --oneline -5`. FASE 1, 2, 3 udah committed di branch `main`.

## Aturan kerja

- **Bahasa:** komunikasi dengan user pakai Indonesia casual (lo/gw). User suka step-by-step pelan-pelan dengan screenshot per step kalau setup eksternal (Supabase Dashboard, Expo Go).
- **Tes runtime:** user yang test di Expo Go (iPhone). Sebelum claim "FASE selesai", minta user verify dengan screenshot.
- **TypeScript strict:** `noImplicitAny`, `noUncheckedIndexedAccess` aktif. `any` di-ban via ESLint.
- **Path alias:** import pakai `@/*` (= `src/*`). Jangan relatif panjang.
- **Commit pesan:** format `FASE N: ringkasan` lalu bullet-list perubahan + 1 baris verifikasi (tsc/expo-doctor/manual test). Lihat commit existing buat pattern.
- **Push ke origin:** **JANGAN** kecuali user eksplisit minta. Currently 4 commit ahead, belum push.
- **AGENTS.md** at `/home/faiz/AGENTS.md` (parent) berisi "This is NOT the Next.js you know" — itu konteks untuk project Next.js lain di system, **bukan** untuk Cari.In. Cari.In adalah Expo/RN. Abaikan AGENTS.md kalau lagi kerja di Cari.In.

## Supabase — state penting

- Project URL prefix: `kytsksnyoyffwbksotps.supabase.co`
- `.env` ada (URL + ANON_KEY + ALLOWED_EMAIL_DOMAIN=`student.unu-jogja.ac.id`).
- Schema: 5 tabel (profiles/reports/conversations/messages/notifications) + RLS + triggers + GRANTs. Lihat `supabase-schema.sql`.
- **Email Auth Enabled, Confirm Email OFF** (untuk dev).
- **`profiles_admin_all` policy DI-COMMENT-OUT** di schema karena rekursi RLS via `is_admin()`. Defer ke FASE 5; admin moderation pakai service_role atau RPC function.
- Storage buckets: **belum dibuat** (FASE 4 wajib bikin: `report-photos`, `chat-media`, `avatars`).

## Akun test (sudah seeded manual via Dashboard)

| Role | Email | Password | UUID (auth.users.id) |
|------|-------|----------|----------------------|
| admin | `admin@cariin.app` | `admin123` | `c80aa818-4803-42f0-9265-5bb52cc81e19` |
| mahasiswa | `faiz@student.unu-jogja.ac.id` | `faizfaiz` | `14719036-99a4-4b8d-9bf0-8dce43cee0e0` |

## Quick commands

```bash
cd cariin-mobile

# dev server
npm start

# typecheck
npx tsc --noEmit

# lint (legacy config)
ESLINT_USE_FLAT_CONFIG=false npx eslint "src/**/*.{ts,tsx}"

# expo health check
npx expo-doctor

# clear cache (Metro lengket sering bikin fix gak ke-load)
npx expo start --clear
```

## Pattern penting yang ditemukan

- **Pressable + style function** kadang gagal apply layout. Pakai pola `<Pressable>{({pressed}) => <View style={{...}}>...</View>}</Pressable>` (children render prop) untuk reliability. Lihat `RoleSelectionScreen.RoleCard` dan `PrimaryButton`.
- **PostgrestError BUKAN Error class** — `err instanceof Error` false. Wrap di `auth.service.ts`: `throw new Error(profileErr.message)`.
- **Profile auto-created via DB trigger** `trg_on_auth_user_created`. Register di app cuma signUp + UPDATE profile (kalau session ada).
- **Auth routing pakai role dari DB**, bukan form variant. Form Mahasiswa bisa login admin → tetep ke AdminNavigator (canonical pattern).

## Persisten memory

CC nyimpen memory user/feedback/project di `~/.claude/projects/-home-faiz-Semester-4-Mobile-Programming-cariin-cariin-mobile/memory/`. Update via Write tool kalau dapet info penting baru.
