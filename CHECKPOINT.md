# CHECKPOINT — Cari.In Mobile

> Ringkasan kondisi project saat sesi dijeda.
> Baca file ini + `NEXT_STEPS.md` sebelum melanjutkan pengerjaan.
> Last updated: 2026-05-09 | Branch: `main` | Last commit: lihat `git log -1`

---

## STATUS PROGRES

| Fase | Status | Commit |
|------|--------|--------|
| FASE 0 — Plan & Konfirmasi | ✅ Selesai | (in-conversation) |
| FASE 1 — Setup Project | ✅ Selesai | lihat `git log` |
| FASE 2 — Fondasi Navigasi | 🔜 Belum mulai | — |
| FASE 3 — Auth Screens | 🔜 Belum mulai | — |
| FASE 4 — Core Mahasiswa | 🔜 Belum mulai | — |
| FASE 5 — Admin Screens | 🔜 Belum mulai | — |
| FASE 6 — Polish & Submission | 🔜 Belum mulai | — |

---

## YANG SUDAH SELESAI DI FASE 1

### 1. Init Project
- Expo project di-init via `create-expo-app` template `blank-typescript` di `/tmp/cariin-init`, lalu file dipindah ke `cariin-mobile/` (CONTEXT.md & UI_AUDIT.md tidak terhapus).
- `app.json` diupdate: `name=Cari.In`, `slug=cariin`, `scheme=cariin`, `package=id.cariin.app`, `bundleIdentifier=id.cariin.app`, plugins `[expo-secure-store, expo-image-picker, expo-notifications]`, splash `backgroundColor=#18181B`.
- `package.json`: `name=cariin-mobile`, scripts `lint`/`format` ditambah.

### 2. Branch Git
- Branch `develop` dibuat dari `main` sebelum setup. Semua kerja FASE 1 ada di `develop`.
- Pre-existing deletions di parent dir (HTML lama + `package.json`/`vercel.json` di root) **TIDAK** ikut di-stage — itu state user sebelum sesi.
- `cariin-mobile/cariin-web/` (folder HTML prototype yang ke-nest) **TIDAK** ikut di-stage. Per CONTEXT.md harusnya jadi sibling `cariin-mobile/`, bukan child.

### 3. Dependency Terinstall
Versi aktual setelah `npx expo install` (auto-aligned ke SDK 54):

**Runtime:**
| Package | Versi |
|---------|-------|
| expo | ~54.0.33 |
| react | 19.1.0 |
| react-native | 0.81.5 |
| expo-status-bar | ~3.0.9 |
| @react-navigation/native | ^7.2.2 |
| @react-navigation/stack | ^7.8.11 |
| @react-navigation/bottom-tabs | ^7.15.11 |
| @react-navigation/drawer | ^7.9.9 |
| react-native-screens | ~4.16.0 |
| react-native-safe-area-context | ~5.6.0 |
| react-native-gesture-handler | ~2.28.0 |
| react-native-reanimated | ~4.1.1 |
| nativewind | ^4.2.3 |
| tailwindcss | ^3.4.19 |
| zustand | ^5.0.13 |
| @supabase/supabase-js | ^2.105.3 |
| react-native-url-polyfill | ^3.0.0 |
| axios | ^1.16.0 |
| @react-native-async-storage/async-storage | 2.2.0 |
| expo-secure-store | ~15.0.8 |
| expo-image-picker | ~17.0.11 |
| expo-notifications | ~0.32.17 |
| @expo/vector-icons | ^15.0.3 |
| date-fns | ^4.1.0 |

**Dev:**
| Package | Versi |
|---------|-------|
| typescript | ~5.9.2 |
| @types/react | ~19.1.0 |
| eslint | latest |
| eslint-config-expo | latest |
| eslint-config-prettier | latest |
| prettier | latest |

### 4. Konfigurasi
- **NativeWind v4** — `tailwind.config.js` (preset + brand colors), `babel.config.js` (jsxImportSource), `metro.config.js` (withNativeWind), `global.css` (3 @tailwind directives), `nativewind-env.d.ts`.
- **TypeScript strict** — `tsconfig.json` dengan `strict: true`, `noImplicitAny: true`, `noUncheckedIndexedAccess: true`, alias `@/*` → `src/*`.
- **ESLint + Prettier** — `.eslintrc.js` extends `expo` + `prettier`, rule `no-explicit-any: error`. `.prettierrc` (semi, single quote, trailing comma all, width 100). `.prettierignore` skip node_modules + cariin-web.
- **Env** — `.env.example` lengkap dengan komentar instruksi. `.gitignore` ditambah baris `.env`.

### 5. Struktur Folder

```
cariin-mobile/
├── App.tsx                  ← entry; render splash sederhana + import global.css
├── app.json                 ← updated (name, package, plugins)
├── babel.config.js          ← NativeWind preset
├── global.css               ← @tailwind directives
├── index.ts                 ← Expo entry default
├── metro.config.js          ← withNativeWind wrapper
├── nativewind-env.d.ts      ← types untuk className prop
├── package.json
├── package-lock.json
├── tailwind.config.js       ← brand colors
├── tsconfig.json            ← strict + alias @/*
├── .env.example
├── .eslintrc.js
├── .gitignore               ← + .env
├── .prettierignore
├── .prettierrc
├── CONTEXT.md               ← spec (jangan diubah)
├── UI_AUDIT.md              ← spec (jangan diubah)
├── CHECKPOINT.md            ← file ini
├── NEXT_STEPS.md            ← rencana FASE 2
├── cariin-web/              ← prototype HTML (UNTRACKED, harus dipindah ke parent)
├── assets/                  ← icon, splash, adaptive-icon, favicon
└── src/
    ├── screens/
    │   ├── auth/            5 file .tsx
    │   ├── main/            6 file .tsx
    │   ├── chat/            3 file .tsx
    │   ├── profile/         6 file .tsx
    │   └── admin/           6 file .tsx
    ├── navigation/          5 file (4 stub + types.ts stub)
    ├── components/          8 file stub
    ├── services/            6 file (supabase.ts BERISI KODE; 5 lain stub)
    ├── context/             2 file stub
    ├── store/               2 file stub
    └── utils/               4 file (constants.ts + validators.ts BERISI KODE; 2 stub)
```

### 6. File yang Sudah Berisi Kode (BUKAN Placeholder)

| File | Isi |
|------|-----|
| `App.tsx` | Splash sederhana untuk verifikasi setup; import `./global.css` |
| `src/utils/constants.ts` | `COLORS`, `CATEGORIES` (8), `FACULTIES` (8), `REPORT_STATUS_LABEL`, tipe `CategoryId`/`ReportStatus`/`ReportType`/`UserRole` |
| `src/utils/validators.ts` | `ALLOWED_DOMAIN` (dari env, fallback `student.unu-jogja.ac.id`), `isValidCampusEmail()`, `isValidPassword()`, `isValidNim()`, error messages Indonesia |
| `src/services/supabase.ts` | Init Supabase client (createClient + AsyncStorage session storage + react-native-url-polyfill) dari env vars |
| `tailwind.config.js` | Brand colors (lost/found/admin/status/etc) |
| `app.json` | Cari.In identity + plugins |

### 7. File Placeholder (Tinggal Diisi)

- **26 screen** di `src/screens/{auth,main,chat,profile,admin}/` — masing-masing render `<View><Text>NamaScreen</Text></View>` agar tidak crash saat di-wire ke navigator.
- **8 komponen** (`ReportCard`, `CategoryGrid`, `StatusBadge`, `ViaAdminBadge`, `ChatBubble`, `EmptyState`, `LoadingSkeleton`, `ConfirmModal`) — `export {}`.
- **5 navigation file** (`index.tsx`, `AuthNavigator.tsx`, `MainNavigator.tsx`, `AdminNavigator.tsx`, `types.ts`) — `export {}`.
- **5 service file** (`auth.service.ts`, `report.service.ts`, `chat.service.ts`, `notification.service.ts`, `upload.service.ts`) — `export {}`.
- **2 context** (`AuthContext.tsx`, `NotifContext.tsx`) — `export {}`.
- **2 store** (`feedStore.ts`, `chatStore.ts`) — `export {}`.
- **2 utils** (`formatters.ts`, `helpers.ts`) — `export {}`.

### 8. Verifikasi yang Sudah Lewat
- ✅ `npx tsc --noEmit` — TypeScript strict compile clean, no errors.
- ✅ `npm install` & `npx expo install` — sukses, no peer dep conflicts yang fatal.

---

## YANG BELUM BISA DIVERIFIKASI

### A. Belum Run di Expo Go / Emulator
Tidak bisa launch interactive dev server dari sesi ini. Yang harus dites manual:
1. `cd cariin-mobile && npm start`
2. Scan QR di Expo Go (Android) atau iOS Simulator
3. Pastikan splash "Setup FASE 1 berhasil ✓" muncul dengan styling NativeWind aktif (background hitam, badge hijau bulat)

**Risiko jika gagal:** Metro bundler error (NativeWind config). Supabase init tidak throw saat env kosong (hanya `console.warn`) — aman untuk FASE 1.

### B. Supabase Belum Diuji End-to-End
`.env` sudah berisi `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY` (publishable key). Tapi schema database (tabel `profiles`, `reports`, `conversations`, `messages`, `notifications`) belum dibuat di Supabase Dashboard, dan RLS policies belum di-set. Lihat `supabase-schema.sql` di root project — wajib di-run di Supabase SQL Editor sebelum FASE 3.

### C. Folder `cariin-web/` Nested di Dalam `cariin-mobile/`
Per `CONTEXT.md` section 2, `cariin-web/` seharusnya **sibling** `cariin-mobile/`, bukan child. Saat ini posisinya di `cariin-mobile/cariin-web/` dan untracked. Belum disentuh — tunggu user putuskan: pindah keluar atau biarkan.

---

## KEPUTUSAN TEKNIS YANG SUDAH DIBUAT

| # | Keputusan | Alasan |
|---|-----------|--------|
| 1 | Pakai Expo SDK **54** (bukan 51 di CONTEXT.md) | SDK 51 + RN 0.83 yang disebut CONTEXT.md tidak compatible (SDK 51 = RN 0.74, RN 0.83 belum ada). SDK 54 adalah versi stabil terbaru per Mei 2026. Dosen tidak cek minor version. |
| 2 | `npx expo install` untuk semua package, BUKAN versi hardcode dari CONTEXT.md section 14 lama | Versi di section 14 lama (`firebase ^10`, `react-navigation ^6`, dll) sudah usang. Pasca migrasi ke Supabase, dependency Firebase di-replace dengan `@supabase/supabase-js` + `react-native-url-polyfill`. |
| 3 | React Navigation v7 (bukan v6) | Versi v7 yang dipasang `expo install` untuk SDK 54. API mirip v6, sedikit breaking di Stack vs Tab. |
| 4 | Migrasi total Firebase → Supabase (sebelumnya Firebase JS SDK v12) | Google Cloud Console paksa enable billing untuk Firestore di project baru. Project pindah ke Supabase yang free tier-nya tanpa kartu kredit. Schema NoSQL (Firestore) di-translate ke Postgres + RLS. `@react-native-google-signin/google-signin` ikut di-drop — Google login pakai Supabase OAuth web flow (jalan di Expo Go tanpa dev build). |
| 5 | NativeWind v4 (bukan v2) | v4 lebih cepat, support lebih banyak Tailwind features. Setup standar 5-file (tailwind config, babel, metro, global.css, env types). |
| 6 | React Compiler + Suspense **TIDAK** di-enable | Masih experimental di RN. Prioritas stabilitas. Skip — bukan blocker untuk requirement dosen. |
| 7 | Path alias `@/*` → `src/*` | Lebih readable daripada relative import dalam panjang (`../../../components/...`). |
| 8 | Domain email pakai placeholder `student.unu-jogja.ac.id` (dari env) | User akan konfirmasi domain riil nanti dan update via `.env` saja, tanpa rebuild. |
| 9 | FACULTIES pakai placeholder dari CONTEXT.md | User akan update setelah cek website UNU Yogyakarta. |
| 10 | 26 screen placeholder berisi component renderable (bukan murni `export {}`) | Saat navigator di-wire di FASE 2, semua route bisa dibuka tanpa crash. |
| 11 | Brand colors dimasukkan ke `tailwind.config.js` extend | Bisa dipakai sebagai class langsung (`bg-lost`, `text-admin-text`, dll) selain via `COLORS` const. |
| 12 | Plugin `@react-native-google-signin/google-signin` DIHAPUS dari `app.json` plugins | Pasca migrasi ke Supabase, Google login pakai OAuth web flow lewat `expo-web-browser` — tidak butuh native module, jalan di Expo Go tanpa dev build. |
| 13 | Commit FASE 1 hanya stage file di `cariin-mobile/` (kecuali `cariin-web/`) — tidak sentuh deletions di parent | Pre-existing deletions itu state user sebelum sesi. Bukan tanggung jawab FASE 1. |

---

## CARA MELANJUTKAN

```
Baca CHECKPOINT.md dan NEXT_STEPS.md, lanjut dari sana.
```

Atau lebih spesifik:

```
Lanjut FASE 2 sesuai NEXT_STEPS.md.
```
