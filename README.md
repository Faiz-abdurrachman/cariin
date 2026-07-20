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

## Installation

### Prerequisites
- Node.js 18+
- Expo CLI (`npx expo`)
- Supabase project (lihat `supabase-schema.sql`)

### Setup

```bash
# 1. Clone repo
git clone https://github.com/username/cariin.git
cd cariin/cariin-mobile

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Isi .env dengan Supabase URL + Anon Key

# 4. Setup Supabase
# Buka Supabase Dashboard → SQL Editor
# Paste dan run isi supabase-schema.sql

# 5. Verifikasi Storage
# Schema membuat bucket report-photos + avatars (public), chat-media (private),
# serta policy upload yang membatasi setiap user ke folder UUID miliknya.

# 6. Run dev server
npx expo start

# 7. Scan QR code dengan Expo Go (iPhone / Android)
```

---

## Environment Variables (`.env`)

```env
EXPO_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN=student.unu-jogja.ac.id
EXPO_PUBLIC_APP_NAME=Cari.In
EXPO_PUBLIC_APP_ENV=development
```

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
