# Cari.In — Campus Lost & Found App

> **"Cariin barangmu di kampus."**

Aplikasi **lost & found** untuk lingkungan kampus UNU Yogyakarta. Mahasiswa bisa melaporkan barang hilang/temuan, mencari barang di feed publik, dan berkomunikasi via chat in-app. Admin (satpam) memoderasi semua laporan sebelum tayang.

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Framework** | React Native 0.81 (Expo SDK 54 Managed Workflow) |
| **Language** | TypeScript 5.9 (strict mode) |
| **UI/Styling** | NativeWind v4 (Tailwind CSS) + inline styles |
| **Navigation** | React Navigation v7 (Stack, Bottom Tabs, Drawer) |
| **State** | Context API (Auth) + Zustand v5 (feed, chat) |
| **Backend** | Supabase (Auth + Postgres + Storage + Realtime) |
| **Lint** | ESLint v9 (flat config) + Prettier |

---

## Fitur

### Mahasiswa
- ✅ Register/login dengan email kampus (`@student.unu-jogja.ac.id`)
- ✅ Feed laporan publik (filter kategori, tipe, search)
- ✅ Detail laporan (foto, lokasi, status, kontak pelapor)
- ✅ Buat laporan Lost / Found (unggah foto, pilih kategori)
- ✅ Kelola laporan sendiri (edit, hapus, tandai selesai)
- ✅ Profil pribadi + upload avatar
- ✅ Pengaturan akun & Pusat Bantuan

### Admin
- ✅ Dashboard statistik (pending, disetujui, total)
- ✅ Moderasi laporan (approve/reject dengan alasan)
- ✅ Semua laporan (filter status, search)
- ✅ Walk-in report (buat laporan atas nama mahasiswa)
- ✅ Full CRUD laporan admin (edit data/foto, selesaikan, hapus)
- ✅ Notifikasi otomatis ke mahasiswa saat laporan di-review

---

## Installation — Fresh Clone Setup

### Prerequisites

Pastikan sudah terinstall:

| Tools | Versi | Cek |
|-------|-------|-----|
| **Node.js** | 18+ | `node -v` |
| **npm** | 9+ | `npm -v` |
| **Expo Go** | Terbaru | Install dari App Store / Play Store |
| **Git** | 2.x+ | `git --version` |

### Langkah 1 — Clone Repository

```bash
# Repo ini PRIVATE. Pastikan SSH key atau token GitHub sudah dikonfigurasi.
git clone https://github.com/Faiz-abdurrachman/cariin.git
cd cariin/cariin-mobile
```

### Langkah 2 — Install Dependencies

```bash
npm install
```

Tunggu sampai selesai (biasanya 1-2 menit pertama kali). Ini akan menginstall semua
package termasuk Expo SDK 54, React Native 0.81, NativeWind v4, Supabase client,
dan React Navigation v7.

### Langkah 3 — Setup Environment Variables (`.env`)

Aplikasi **tidak akan berjalan** tanpa `.env`. Copy template lalu isi:

```bash
cp .env.example .env
```

Buka `.env` dan isi semua nilai. File `.env.example` berisi template berikut:

```env
# === Supabase Config ===
EXPO_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...

# === Domain & App Identity ===
EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN=student.unu-jogja.ac.id
EXPO_PUBLIC_APP_NAME=Cari.In
EXPO_PUBLIC_APP_ENV=development
```

**Cara mendapatkan nilai Supabase:**

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Cari.In
3. **Settings → API**
4. Copy **Project URL** → isi `EXPO_PUBLIC_SUPABASE_URL`
5. Copy **anon/public key** (format `sb_publishable_...`) → isi `EXPO_PUBLIC_SUPABASE_ANON_KEY`

> ⚠️ **PENTING**: Pakai **anon key** (publishable), BUKAN `service_role` secret key.
> Secret key bypass RLS dan TIDAK BOLEH di-bundle ke aplikasi mobile.

### Langkah 4 — Setup Supabase Database

1. Buka **Supabase Dashboard → SQL Editor**
2. Klik **New Query**
3. Copy-paste **seluruh isi** `supabase-schema.sql` dari repo ini
4. Klik **Run**

Schema ini idempotent (aman di-run ulang berkali-kali). Ia membuat:
- **5 tabel**: `profiles`, `reports`, `conversations`, `messages`, `notifications`
- **24 RLS policy** — row-level security granular
- **8 RPC function** — admin moderation + profile access
- **3 Storage bucket**: `report-photos` (public), `avatars` (public), `chat-media` (private)
- **Trigger** — auto-create profile, notifikasi pesan baru, update conversation

Verifikasi: buka **Table Editor**, pastikan 5 tabel muncul tanpa error.

### Langkah 5 — Setup Supabase Auth Redirect (Reset Password)

Di Supabase Dashboard:
1. **Authentication → URL Configuration**
2. Tambahkan redirect URL: `cariin://reset-password`
3. **Simpan**

### Langkah 6 — Seed Akun Test

Buka **SQL Editor**, jalankan query berikut untuk membuat akun test:

```sql
-- Admin (pakai email non-kampus)
SELECT create_user('admin@cariin.app', 'admin123', 'admin');

-- Mahasiswa (pakai email kampus)
SELECT create_user('faiz@student.unu-jogja.ac.id', 'faizfaiz', 'mahasiswa');
```

> Ganti `create_user` dengan trigger manual bila perlu. Atau daftar langsung
> dari aplikasi untuk akun mahasiswa (register via UI sudah otomatis
> membuat profil).

### Langkah 7 — Jalankan Dev Server

```bash
npx expo start
```

Akan muncul QR code di terminal. Scan dengan **Expo Go** di HP.

**Mode tambahan:**
```bash
# Tunnel — buat akses dari jaringan berbeda (via ngrok)
npx expo start --tunnel

# Clear cache — kalau Metro bundler bermasalah
npx expo start --clear

# Web preview — buka di Chrome laptop
npx expo start --web
```

### Langkah 8 — Verifikasi

```bash
# TypeScript type check
npx tsc --noEmit

# Lint
npm run lint

# Expo health check
npx expo-doctor
```

Ketiganya harus menghasilkan **0 error** sebelum klaim setup berhasil.

---

## Environment Variables

Semua konfigurasi environment ada di file `.env`. Lihat **Langkah 3** di atas untuk
cara setup. Template lengkap tersedia di `.env.example`.

---

## Akun Test

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@cariin.app` | `admin123` |
| Mahasiswa | `faiz@student.unu-jogja.ac.id` | `faizfaiz` |

---

## Build Standalone (APK)

```bash
# Install EAS CLI
npm install -g eas-cli
eas login

# Build kandidat/final Android APK
eas build --platform android --profile production
```

---

## Status Verifikasi Terakhir

Per 20 Juli 2026:

- TypeScript: 0 error
- ESLint: 0 error, 0 warning
- Expo Doctor: 18/18 checks passed
- Build production terakhir yang terverifikasi statis:
  [4d5739ec-b37c-4527-b6cf-c1dc48f0bd6b](https://expo.dev/accounts/faiz.abdurrachman/projects/cariin/builds/4d5739ec-b37c-4527-b6cf-c1dc48f0bd6b)
- APK: 80.572.407 byte (76,84 MiB)
- SHA-256:
  `6c6d30f0af72d0ba1b29a16a463e1b9bd14176ac74b96fe7c1152d2129479c82`
- Archive APK valid, package `id.cariin.app`, scheme `cariin`, minSdk 24,
  targetSdk 36, dan `RECORD_AUDIO` tidak ada pada manifest final.

APK belum diinstal atau smoke test di perangkat. Project Supabase sudah
`ACTIVE_HEALTHY`; migration remote serta smoke test SQL dan client API berhasil
untuk Auth dua akun, RPC, RLS, Storage, Realtime, dan trigger. Request recovery
diterima dan email tercatat terkirim; redirect recovery juga sudah tersimpan.
Penyelesaian reset melalui deep-link serta manual test UI dua perangkat belum
dijalankan. Instalasi APK sedang ditunda.

Catatan: build `4d5739ec...` dibuat sebelum perbaikan UI/admin full CRUD
terbaru. Source terkini kembali lulus TypeScript, ESLint, Expo Doctor,
`git diff --check`, dan export bundle iOS, tetapi APK production terbaru belum
direbuild.

## Screenshots

Screenshot perangkat untuk dokumentasi laporan belum tersedia. Bagian ini
disengaja tetap tanpa gambar sampai flow dijalankan pada perangkat dan buktinya
benar-benar dikumpulkan.

---

## Project Structure

```
src/
├── screens/        # Layar aplikasi (auth, main, chat, profile, admin)
├── components/     # Komponen reusable UI
├── services/       # Layer abstraksi Supabase API
├── navigation/     # React Navigation config
├── context/        # Global state (AuthContext, NotifContext)
├── store/          # Zustand stores (feed, chat)
└── utils/          # Constants, validators, formatters
```

---

## Submission Info

| Item | Detail |
|------|--------|
| **Mata Kuliah** | Mobile Programming — UNU Yogyakarta |
| **Dosen** | Yana Hendriana |
| **Semester** | 4 (Genap 2025/2026) |
| **Package ID** | `id.cariin.app` |
| **Scheme** | `cariin://` |

---

## License

Proyek ini dibuat untuk keperluan akademik (tugas mata kuliah).
