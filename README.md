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
- ✅ Login via Google OAuth
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

# 5. Setup Storage buckets (manual via Dashboard)
# Buat 3 bucket: report-photos, avatars (public), chat-media (private)

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

# Build Android APK
eas build --platform android --profile preview
```

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
