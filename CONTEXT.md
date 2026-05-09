# CONTEXT.md — Cari.In (Campus Lost & Found App)
> **Sumber kebenaran tunggal project ini.**
> Baca file ini + `UI_AUDIT.md` sebelum menulis satu baris kode pun.
> Last updated: Mei 2026 | Versi: 5.1 (migrasi total Firebase → Supabase)

---

## 1. IDENTITAS PROJECT

| Field | Detail |
|---|---|
| **Nama Brand** | Cari.In |
| **Nama Teknis** | cariin |
| **Package ID** | id.cariin.app |
| **Tagline** | "Cariin barangmu di kampus." |
| **Mata Kuliah** | Mobile Programming — UNU Yogyakarta |
| **Dosen** | Yana Hendriana |
| **Framework** | React Native 0.83 + Expo Managed Workflow |
| **Status** | Prototype HTML selesai ✅ → React Native in progress 🔜 |
| **Timeline** | 9 minggu (sesuai dosen) |

### Konvensi Nama

| Konteks | Format | Contoh |
|---------|--------|--------|
| UI / Logo / Splash | `Cari.In` | "Selamat datang di Cari.In" |
| Komponen React Native | `PascalCase` | `HomeScreen`, `ReportCard` |
| Variabel / fungsi | `camelCase` | `fetchReports()` |
| File screen | `NamaScreen.tsx` | `LoginScreen.tsx` |
| File service | `nama.service.ts` | `auth.service.ts` |
| Konstanta | `UPPER_SNAKE_CASE` | `ALLOWED_DOMAIN` |

---

## 2. STRUKTUR REPO & FOLDER

### Repository GitHub

```
github.com/username/cariin
│
├── cariin-web/                  ← Prototype HTML (sudah ada, deploy di Vercel)
│   ├── PAGE/                    ← 23 screens HTML referensi visual
│   └── vercel.json
│
└── cariin-mobile/               ← React Native App (ini yang dikerjain)
    ├── CONTEXT.md               ← file ini
    ├── UI_AUDIT.md
    ├── README.md                ← wajib submission dosen
    ├── app.json
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── metro.config.js
    ├── babel.config.js
    ├── .env                     ← jangan di-commit
    ├── .env.example             ← boleh di-commit
    ├── .gitignore
    └── src/
```

### Struktur src/ Lengkap

```
src/
│
├── screens/
│   ├── auth/
│   │   ├── SplashScreen.tsx
│   │   ├── RoleSelectionScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── ForgotPasswordScreen.tsx
│   ├── main/
│   │   ├── HomeScreen.tsx
│   │   ├── DetailLostScreen.tsx
│   │   ├── DetailFoundScreen.tsx
│   │   ├── CreateLostScreen.tsx
│   │   ├── CreateFoundScreen.tsx
│   │   └── SuccessScreen.tsx
│   ├── chat/
│   │   ├── InboxScreen.tsx
│   │   ├── ChatRoomScreen.tsx
│   │   └── NotificationsScreen.tsx
│   ├── profile/
│   │   ├── MyPostsScreen.tsx
│   │   ├── EditPostScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── UserProfileScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── HelpScreen.tsx
│   └── admin/
│       ├── AdminLoginScreen.tsx
│       ├── AdminDashboardScreen.tsx
│       ├── AdminReviewScreen.tsx
│       ├── AdminReportsScreen.tsx
│       ├── AdminCreateLostScreen.tsx
│       └── AdminCreateFoundScreen.tsx
│
├── navigation/
│   ├── index.tsx                ← root navigator
│   ├── AuthNavigator.tsx        ← Stack Navigator
│   ├── MainNavigator.tsx        ← Bottom Tab Navigator
│   ├── AdminNavigator.tsx       ← Drawer Navigator
│   └── types.ts                 ← TypeScript route params
│
├── components/
│   ├── ReportCard.tsx
│   ├── CategoryGrid.tsx
│   ├── StatusBadge.tsx
│   ├── ViaAdminBadge.tsx
│   ├── ChatBubble.tsx
│   ├── EmptyState.tsx
│   ├── LoadingSkeleton.tsx
│   └── ConfirmModal.tsx
│
├── services/
│   ├── supabase.ts              ← inisialisasi Supabase client
│   ├── auth.service.ts          ← Supabase Auth operations
│   ├── report.service.ts        ← Supabase Postgres CRUD laporan
│   ├── chat.service.ts          ← Supabase Realtime chat (postgres_changes)
│   ├── notification.service.ts  ← Expo Notifications (lokal + remote via Expo Push)
│   └── upload.service.ts        ← Supabase Storage foto
│
├── context/
│   ├── AuthContext.tsx           ← global auth state
│   └── NotifContext.tsx          ← unread notif count
│
├── store/
│   ├── feedStore.ts              ← Zustand: laporan + filter
│   └── chatStore.ts              ← Zustand: percakapan + pesan
│
└── utils/
    ├── constants.ts              ← COLORS, CATEGORIES, FACULTIES
    ├── validators.ts             ← isValidCampusEmail
    ├── formatters.ts             ← format tanggal, kategori
    └── helpers.ts
```

---

## 3. REQUIREMENT DOSEN (WAJIB DIPENUHI)

Ini adalah requirement dari PDF dosen yang HARUS ada di project:

### Mandatory Technical Specifications

| Kategori | Requirement | Implementasi di Cari.In |
|----------|-------------|------------------------|
| **UI/UX** | React Native + Flexbox, min. 5 screens | 26 screens ✅ |
| **UI/UX** | React Compiler + Suspense | Expo SDK 51 sudah include ✅ |
| **Navigation** | Stack Navigator | AuthNavigator ✅ |
| **Navigation** | Tab Navigator | MainNavigator (Bottom Tab) ✅ |
| **Navigation** | Drawer Navigator | AdminNavigator ✅ |
| **State** | Context API / Zustand / Redux | AuthContext + Zustand ✅ |
| **Networking** | REST APIs via Axios atau Fetch | Axios + Supabase REST (PostgREST) ✅ |
| **Auth** | JWT Authentication | Supabase Auth (JWT-based) ✅ |
| **Auth** | Google Authentication | Supabase OAuth (Google provider via web flow) ✅ |
| **Database** | Realtime Database CRUD | Supabase Postgres + Realtime subscription ✅ |
| **Storage** | AsyncStorage (offline persistence) | Cache laporan ✅ |
| **Storage** | SecureStorage (JWT/token) | expo-secure-store ✅ |
| **Build** | Expo EAS Build → APK | Untuk submission ✅ |

### Submission Requirements

| Item | Detail |
|------|--------|
| GitHub | Public repo, branch `main` + `develop` |
| APK | Release-ready Android APK via Expo EAS Build |
| README | Project overview + installation guide + screenshots |
| Video Demo | 3–5 menit, semua fitur, emulator atau real device |

### Grading Breakdown

| Kriteria | Bobot | Yang Dinilai |
|----------|-------|--------------|
| Functionality | 40% | CRUD berjalan, tidak crash |
| Code Quality | 25% | Clean code, modular, komentar |
| UI/UX Design | 15% | Intuitif, modern, responsive |
| Performance | 10% | Loading cepat, animasi smooth |
| Dokumentasi & Demo | 10% | README + video demo |

---

## 4. LATAR BELAKANG & VALIDASI MASALAH

| Masalah | Dampak |
|---------|--------|
| Informasi cepat tenggelam di grup WA | Laporan tertumpuk obrolan lain |
| Pencarian sulit | Tidak bisa lacak laporan lama |
| Rawan klaim palsu | Tidak ada verifikasi identitas |
| Privasi terancam | Nomor HP terekspos publik |
| Tidak ada standar pelaporan | Format tidak konsisten |
| Mahasiswa tidak sempat buka app | Butuh jalur laporan via satpam |

### Validasi Market
- Lost N Found Telkom University — 11.000+ followers Instagram, masih manual via DM
- ITS Surabaya — 700 laporan kehilangan dalam 9 bulan
- Universitas Brawijaya — >50% mahasiswa pernah kehilangan barang di kampus

---

## 5. UNIQUE VALUE PROPOSITION

| # | Fitur | Penjelasan |
|---|-------|------------|
| 1 | **Domain Email Kampus** | Register hanya dengan email `@student.unu-jogja.ac.id` |
| 2 | **Admin Moderation** | Laporan mahasiswa masuk `pending` dulu sebelum tayang |
| 3 | **In-App Chat** | Chat real-time tanpa ekspos nomor HP |
| 4 | **Titik Penitipan** | Field khusus form temuan: lokasi fisik barang dititipkan |
| 5 | **Diferensiasi UI** | Lost = merah, Found = hijau — visual intuitif |
| 6 | **Admin CRUD Full** | Admin input laporan atas nama mahasiswa yang lapor ke satpam |

---

## 6. FITUR LENGKAP

### Mahasiswa
- **Auth:** register, login (email kampus + Google), forgot password, verifikasi email
- **Feed:** home feed, search keyword, filter kategori/tipe
- **Detail:** foto, badge status+kategori, lokasi, deskripsi, badge "Via Admin"
- **Laporan Lost:** foto wajib, nama, kategori, lokasi terakhir, deskripsi → pending
- **Laporan Found:** foto wajib, nama, kategori, lokasi temuan, titik penitipan wajib, deskripsi → pending
- **Chat:** inbox, in-app chat real-time (Supabase Realtime), notifikasi
- **Akun:** laporanku, edit laporan, profil, pengaturan, bantuan

### Admin
- **Auth:** login terpisah (aksen indigo)
- **Dashboard:** stat cards, tab Pending/Aktif/Selesai, tombol buat laporan
- **Moderasi:** review pending → setujui atau tolak (wajib isi alasan)
- **CRUD Full:** buat/edit/hapus laporan apapun, laporan admin langsung approved

---

## 7. TECH STACK FINAL (SESUAI DOSEN)

### Core
```
Framework:      React Native 0.83
Platform:       Expo Managed Workflow (SDK 51)
Language:       TypeScript
```

### Navigation — WAJIB DOSEN (Stack + Tab + Drawer)
```
@react-navigation/native
@react-navigation/stack          → AuthNavigator
@react-navigation/bottom-tabs    → MainNavigator
@react-navigation/drawer         → AdminNavigator
react-native-screens
react-native-safe-area-context
react-native-gesture-handler
react-native-reanimated
```

### State Management
```
Context API    → AuthContext (user, role, isLoading)
               → NotifContext (unread count)
Zustand        → feedStore (laporan, filter, search)
               → chatStore (percakapan, pesan aktif)
```

### Backend — Supabase (sesuai dosen: Google Auth + Realtime Database)
```
@supabase/supabase-js (^2.x) + react-native-url-polyfill
├── Supabase Auth
│   ├── Email/Password login
│   └── OAuth Google provider ← WAJIB DOSEN (web flow via expo-web-browser)
├── Supabase Postgres + Realtime  ← Realtime Database CRUD ← WAJIB DOSEN
│   ├── Subscription via postgres_changes untuk chat real-time
│   ├── CRUD lewat PostgREST (auto-generated REST API per tabel)
│   └── Row Level Security (RLS) sebagai access control
├── Supabase Storage    ← foto barang (bucket: report-photos, chat-media, avatars)
└── expo-notifications  ← push notification (lokal + remote via Expo Push token)
```

### Networking — WAJIB DOSEN
```
axios              ← REST API calls ← WAJIB DOSEN
                   → dipakai untuk Supabase PostgREST endpoint (auto-generated REST per tabel)
                   → atau external API jika ada
```

### Storage Lokal — WAJIB DOSEN
```
@react-native-async-storage/async-storage  ← offline cache ← WAJIB DOSEN
expo-secure-store                          ← simpan token JWT ← WAJIB DOSEN
```

### UI & Styling
```
nativewind v4       ← Tailwind CSS untuk React Native
tailwindcss
@expo/vector-icons  ← icons
expo-image-picker   ← akses kamera & galeri
```

### Build & Development
```
Expo EAS Build      ← generate APK ← WAJIB DOSEN
Expo Go             ← testing development (scan QR)
ESLint + Prettier   ← code quality
```

---

## 8. VALIDASI EMAIL DOMAIN

```typescript
// src/utils/validators.ts

export const ALLOWED_DOMAIN = 'student.unu-jogja.ac.id'
// ⚠️ Update domain ini sesuai email kampus aktual UNU Yogyakarta

export const isValidCampusEmail = (email: string): boolean => {
  return email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`)
}

export const EMAIL_DOMAIN_ERROR =
  'Email harus menggunakan alamat resmi kampus (contoh: nama@student.unu-jogja.ac.id)'
```

> Validasi dilakukan client-side sebelum request ke Supabase.
> Cukup untuk project kuliah — backend enforcement bisa lewat trigger Postgres atau RLS policy.

---

## 9. POSTGRES SCHEMA (SUPABASE)

> Schema lengkap + RLS policies ada di file `supabase-schema.sql` (root project). Run di Supabase Dashboard → SQL Editor sebelum mulai integrasi.

### Tabel: profiles
> Extends `auth.users` (Supabase built-in). 1-1 dengan `auth.users.id`.
```
profiles
  id                UUID PK, FK → auth.users(id) ON DELETE CASCADE
  name              TEXT NOT NULL
  nim               TEXT
  email             TEXT NOT NULL
  role              TEXT CHECK (role IN ('mahasiswa', 'admin')) DEFAULT 'mahasiswa'
  faculty           TEXT
  department        TEXT
  avatar_url        TEXT
  is_verified       BOOLEAN DEFAULT false
  expo_push_token   TEXT             -- ganti fcmToken (pakai Expo Push)
  created_at        TIMESTAMPTZ DEFAULT now()
  updated_at        TIMESTAMPTZ DEFAULT now()
```

### Tabel: reports
```
reports
  id                UUID PK DEFAULT gen_random_uuid()
  user_id           UUID FK → profiles(id) ON DELETE SET NULL
  type              TEXT CHECK (type IN ('lost', 'found'))
  title             TEXT NOT NULL
  description       TEXT
  category          TEXT CHECK (category IN (
                      'elektronik','dokumen','dompet_tas','kunci',
                      'aksesoris','pakaian','buku_atk','lainnya'))
  location          TEXT NOT NULL
  custody_point     TEXT             -- wajib jika type='found' (enforced di RLS/trigger)
  photo_url         TEXT
  status            TEXT CHECK (status IN ('pending','approved','rejected','resolved'))
                       DEFAULT 'pending'
  admin_note        TEXT
  created_by_admin  BOOLEAN DEFAULT false
  reporter_name     TEXT             -- jika created_by_admin = true
  reporter_nim      TEXT
  reporter_faculty  TEXT
  resolved_at       TIMESTAMPTZ
  created_at        TIMESTAMPTZ DEFAULT now()
  updated_at        TIMESTAMPTZ DEFAULT now()
```

### Tabel: conversations
```
conversations
  id                UUID PK DEFAULT gen_random_uuid()
  report_id         UUID FK → reports(id) ON DELETE CASCADE
  user_a_id         UUID FK → profiles(id) ON DELETE CASCADE
  user_b_id         UUID FK → profiles(id) ON DELETE CASCADE
  last_message      TEXT
  last_at           TIMESTAMPTZ
  created_at        TIMESTAMPTZ DEFAULT now()
  UNIQUE (report_id, user_a_id, user_b_id)
```

### Tabel: messages
```
messages
  id                UUID PK DEFAULT gen_random_uuid()
  conversation_id   UUID FK → conversations(id) ON DELETE CASCADE
  sender_id         UUID FK → profiles(id)
  content           TEXT NOT NULL
  is_read           BOOLEAN DEFAULT false
  created_at        TIMESTAMPTZ DEFAULT now()
```

### Tabel: notifications
```
notifications
  id                UUID PK DEFAULT gen_random_uuid()
  user_id           UUID FK → profiles(id) ON DELETE CASCADE
  type              TEXT CHECK (type IN ('report_approved','report_rejected','new_message'))
  title             TEXT NOT NULL
  body              TEXT NOT NULL
  is_read           BOOLEAN DEFAULT false
  ref_id            UUID
  created_at        TIMESTAMPTZ DEFAULT now()
```

### RLS (Row Level Security) — ringkasan

- **profiles**: user bisa SELECT semua, UPDATE hanya row sendiri. Admin bisa UPDATE semua.
- **reports**: SELECT publik untuk status='approved' atau 'resolved'. Owner bisa SELECT/UPDATE/DELETE row sendiri (dengan batasan status). Admin bisa SELECT/UPDATE/DELETE semua.
- **conversations**: SELECT/INSERT/UPDATE hanya jika user adalah `user_a_id` atau `user_b_id`.
- **messages**: SELECT/INSERT hanya jika user adalah peserta `conversation`.
- **notifications**: SELECT/UPDATE hanya untuk `user_id = auth.uid()`. INSERT lewat trigger atau service.

---

## 10. NAVIGATION STRUCTURE

### Root Navigator
```typescript
// Logika branching di src/navigation/index.tsx:
// belum login          → AuthNavigator (Stack)
// login sebagai mahasiswa → MainNavigator (Bottom Tab)
// login sebagai admin  → AdminNavigator (Drawer)
// isLoading = true     → LoadingScreen
```

### AuthNavigator (Stack)
```
SplashScreen → RoleSelectionScreen → LoginScreen
                                   → RegisterScreen
                                   → ForgotPasswordScreen
```

### MainNavigator (Bottom Tab — 5 tab)
```
Tab 1: Home
  Stack: HomeScreen → DetailLostScreen / DetailFoundScreen
                    → ChatRoomScreen
                    → UserProfileScreen

Tab 2: Pesan
  Stack: InboxScreen → ChatRoomScreen → UserProfileScreen

Tab 3: FAB (+) — modal screen, bukan tab biasa
  Modal Stack: CreateLostScreen ↔ CreateFoundScreen → SuccessScreen

Tab 4: Laporanku
  Stack: MyPostsScreen → EditPostScreen

Tab 5: Profil
  Stack: ProfileScreen → SettingsScreen / HelpScreen / UserProfileScreen
```

### AdminNavigator (Drawer — aksen indigo)
```
Drawer 1: Dashboard   → AdminDashboardScreen → AdminReviewScreen
Drawer 2: Semua Laporan → AdminReportsScreen
Drawer 3: Buat Laporan  → AdminCreateLostScreen ↔ AdminCreateFoundScreen
Drawer 4: Logout        → kembali ke AuthNavigator
```

---

## 11. DESIGN SYSTEM

### Color Constants
```typescript
// src/utils/constants.ts

export const COLORS = {
  primary:      '#18181B',  // zinc-900
  lost:         '#EF4444',  // red-500
  lostBg:       '#FEE2E2',  // red-100
  lostText:     '#991B1B',  // red-800
  found:        '#22C55E',  // emerald-500
  foundBg:      '#D1FAE5',  // emerald-100
  foundText:    '#065F46',  // emerald-800
  admin:        '#4F46E5',  // indigo-600
  adminLight:   '#EEF2FF',  // indigo-50
  adminText:    '#3730A3',  // indigo-800
  pending:      '#F59E0B',  // amber-500
  approved:     '#22C55E',  // emerald-500
  rejected:     '#EF4444',  // red-500
  resolved:     '#8B5CF6',  // violet-500
  background:   '#F4F4F5',  // zinc-100
  surface:      '#FFFFFF',
  border:       '#E4E4E7',  // zinc-200
  textMuted:    '#71717A',  // zinc-500
}
```

### Kategori & Fakultas
```typescript
export const CATEGORIES = [
  { id: 'elektronik',  label: 'Elektronik',  emoji: '💻' },
  { id: 'dokumen',     label: 'Dokumen',      emoji: '📄' },
  { id: 'dompet_tas',  label: 'Dompet/Tas',   emoji: '👜' },
  { id: 'kunci',       label: 'Kunci',        emoji: '🔑' },
  { id: 'aksesoris',   label: 'Aksesoris',    emoji: '💍' },
  { id: 'pakaian',     label: 'Pakaian',      emoji: '👕' },
  { id: 'buku_atk',    label: 'Buku/ATK',     emoji: '📚' },
  { id: 'lainnya',     label: 'Lainnya',      emoji: '📦' },
]

export const FACULTIES = [
  'Teknik',
  'Ekonomi',
  'Hukum',
  'FISIP',
  'FMIPA',
  'Kedokteran',
  'Pertanian',
  'Lainnya',
]
// ⚠️ Update sesuai fakultas UNU Yogyakarta yang aktual
```

### UI Conventions React Native
```
Border radius:  24px untuk card (rounded-3xl)
                16px untuk input & button (rounded-2xl)
Shadow:         elevation: 2 (Android)
                shadowOpacity: 0.08 (iOS)
Spacing:        kelipatan 4 (4, 8, 12, 16, 20, 24, 32)
Font:           System default / Inter via expo-font
```

---

## 12. BUSINESS RULES

### Auth
1. Email register WAJIB domain kampus — validasi `isValidCampusEmail()` sebelum kirim ke Supabase
2. Dukung login via Email/Password DAN Google Sign-In (requirement dosen — Supabase OAuth web flow)
3. Token sesi otomatis disimpan Supabase di AsyncStorage; PII sensitif (jika ada) di `expo-secure-store`
4. Admin tidak bisa daftar via form — di-seed manual via SQL: insert ke `profiles` dengan `role='admin'`

### Laporan Mahasiswa
5. Laporan mahasiswa WAJIB masuk status `pending` — tidak ada auto-publish
6. Hanya admin yang bisa approve/reject
7. User hanya bisa edit/hapus laporan milik sendiri dan hanya jika belum `resolved`
8. Foto WAJIB untuk laporan mahasiswa
9. `custodyPoint` WAJIB dan hanya untuk laporan `found`
10. Nomor HP tidak boleh tampil di UI publik manapun
11. Chat hanya bisa dibuat jika laporan sudah `approved`

### Laporan Admin
12. Laporan admin langsung `approved` — tidak perlu review
13. Admin bisa edit dan hapus laporan apapun
14. Jika `createdByAdmin = true`, isi `reporterName`, `reporterNim`, `reporterFaculty` secara manual
15. Foto opsional untuk laporan admin
16. Tampilkan badge "Dilaporkan via Admin" (indigo) jika `createdByAdmin = true`

### Umum
17. Laporan `rejected` tidak tampil di feed publik
18. Laporan `resolved` tidak tampil di feed aktif
19. Admin bisa lihat semua laporan semua status di AdminReportsScreen

---

## 13. TIMELINE (9 Minggu Sesuai Dosen)

| Minggu | Aktivitas | Status |
|--------|-----------|--------|
| 1–2 | Setup environment + prototype HTML (sudah selesai) | ✅ |
| 3–5 | Core features: CRUD, Navigation Stack+Tab+Drawer, State | 🔜 |
| 6–7 | Integrasi Supabase: Auth + OAuth Google + Postgres + Realtime + Storage | 🔜 |
| 8 | Unit tests, bug fixing, UI refinement, animasi | 🔜 |
| 9 | Expo EAS Build APK, README, video demo 3–5 menit | 🔜 |

---

## 14. DEPENDENCIES

```json
{
  "dependencies": {
    "expo": "~51.0.0",
    "react": "18.2.0",
    "react-native": "0.83.0",
    "typescript": "^5.3.0",

    "@react-navigation/native": "^6.0.0",
    "@react-navigation/stack": "^6.0.0",
    "@react-navigation/bottom-tabs": "^6.0.0",
    "@react-navigation/drawer": "^6.0.0",
    "react-native-screens": "^3.0.0",
    "react-native-safe-area-context": "^4.0.0",
    "react-native-gesture-handler": "^2.0.0",
    "react-native-reanimated": "^3.0.0",

    "nativewind": "^4.0.0",
    "tailwindcss": "^3.4.0",

    "zustand": "^4.5.0",

    "@supabase/supabase-js": "^2.0.0",
    "react-native-url-polyfill": "^3.0.0",
    "expo-web-browser": "~14.0.0",

    "axios": "^1.6.0",

    "@react-native-async-storage/async-storage": "^1.23.0",
    "expo-secure-store": "^13.0.0",

    "expo-image-picker": "^15.0.0",
    "expo-notifications": "^0.28.0",
    "@expo/vector-icons": "^14.0.0",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0"
  }
}
```

---

## 15. ENVIRONMENT VARIABLES

```env
# .env — jangan di-commit ke GitHub

EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN=student.unu-jogja.ac.id
EXPO_PUBLIC_APP_NAME=Cari.In
EXPO_PUBLIC_APP_ENV=development
```

---

## 16. INSTRUKSI UNTUK CLAUDE CODE

### Cara Mulai Sesi Baru
```
Baca CONTEXT.md dan UI_AUDIT.md dulu.
Referensi visual prototype: [URL VERCEL LO]
Kita kerja di folder cariin-mobile/
```

### Prioritas Pengerjaan
1. Setup Expo + install dependencies + struktur folder
2. Setup NativeWind + TypeScript + ESLint
3. Setup Supabase + constants + validators
4. AuthContext + Root Navigator
5. AuthNavigator: Splash → RoleSelection → Login (+ Google) → Register → Forgot
6. MainNavigator: Bottom Tab + FAB modal
7. AdminNavigator: Drawer indigo
8. HomeScreen: fetch dari Supabase (table `reports`) + ReportCard
9. Create screens: form + upload foto ke Supabase Storage
10. Admin moderation: approve/reject + insert row ke `notifications`
11. Admin CRUD: create manual + edit + delete
12. In-App Chat: Supabase Realtime subscription (`postgres_changes` di tabel `messages`)
13. Push Notification: Expo Notifications (lokal saat foreground, remote via Expo Push token disimpan di `profiles.expo_push_token`)
14. Polish: animasi Reanimated, empty states, skeleton loader
15. Expo EAS Build → APK

### Aturan Wajib
- Komentar kode dalam **Bahasa Indonesia**
- Semua file: **TypeScript** — tidak ada `.js` atau `any`
- Selalu `async/await` + `try-catch`
- Functional component + hooks only
- Styling: NativeWind class utama
- Setiap fase selesai → laporkan progress + tanya konfirmasi
- Jangan asumsi sendiri jika ada ambiguitas — tanya dulu
- Jangan skip validasi domain email
- Jangan auto-publish laporan mahasiswa
- Laporan admin harus langsung approved

### Referensi Visual
* Prototype HTML: https://cariin-lf.vercel.app/
-https://cariin-lf.vercel.app/home.html
https://cariin-lf.vercel.app/create.html
- Warna: lihat `COLORS` di section 11
- Kategori: lihat `CATEGORIES` di section 11
- Layout & flow: lihat UI_AUDIT.md

---

*Versi: 5.1 | Mei 2026 | App: Cari.In*
*Changelog v5.1: Migrasi total Firebase → Supabase. Alasan: Google Cloud Console*
*paksa enable billing untuk Firestore di project baru. Stack baru: Supabase Auth +*
*OAuth Google (web flow) + Postgres + Realtime + Storage + Axios + AsyncStorage*
*+ SecureStorage. Section 7 (Backend), 9 (Schema), 14 (Deps), 15 (Env) di-rewrite.*
*Plugin native @react-native-google-signin/google-signin di-drop — pakai*
*expo-web-browser flow yang jalan di Expo Go tanpa dev build.*