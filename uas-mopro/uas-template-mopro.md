# LAPORAN FINAL PROJECT

# Cari.In: Aplikasi Lost & Found Kampus Berbasis Mobile

## Mata Kuliah

**Mobile Programming**

## Dosen Pengampu

**Yana Hendriana**

## Disusun oleh

**Faiz Abdurrachman**
(241111021)

**Irham Zubaidi Alhuda**
(241111006)

**Galih Witradika**
(241111013)

**Ibnul Mubarok**
(241111026)

**Imroatu Zakkiyah**
(241111032)

**Aldo Yulian Widyadewangga**
(241111037)

---

**PROGRAM STUDI INFORMATIKA**
**FAKULTAS TEKNOLOGI INFORMASI**
**UNIVERSITAS NAHDLATUL ULAMA YOGYAKARTA**
**2026**

---

# RINGKASAN EKSEKUTIF

Cari.In adalah aplikasi mobile **Lost & Found** yang dibangun untuk mahasiswa UNU Yogyakarta. Aplikasi ini menjawab permasalahan nyata: 51% mahasiswa pernah kehilangan barang di kampus, namun penanganannya masih manual melalui grup WhatsApp atau bertanya ke satpam tanpa sistem terpusat.

Cari.In menyediakan platform terstruktur dengan fitur: registrasi menggunakan email kampus (`@student.unu-jogja.ac.id`), feed laporan publik dengan filter kategori dan tipe (Hilang/Temuan), pembuatan laporan dilengkapi foto, chat realtime antar pengguna, notifikasi in-app, serta dashboard admin untuk moderasi laporan.

Aplikasi dikembangkan menggunakan **React Native (Expo SDK 54)** dengan **TypeScript strict**, **NativeWind v4** untuk styling, **React Navigation v7** (Stack + Bottom Tab + Drawer), **Context API + Zustand v5** untuk state management, dan **Supabase** sebagai backend (Auth + PostgreSQL + Storage + Realtime).

Hasil pengujian menunjukkan **0 error TypeScript**, **0 warning ESLint**, dan seluruh 26 layar berjalan sesuai spesifikasi. Aplikasi berhasil di-build menjadi APK Android (76 MB) melalui EAS Build.

---

# DAFTAR ISI

- Ringkasan Eksekutif
- Daftar Isi
- Daftar Tabel
- Daftar Gambar
- Daftar Lampiran
- BAB I Pendahuluan
- BAB II Tinjauan Pustaka
- BAB III Metode Perancangan
- BAB IV Hasil dan Pembahasan
- BAB V Kesimpulan dan Saran
- Daftar Pustaka
- Lampiran

---

# DAFTAR TABEL

| No | Nama Tabel | Halaman |
|----|-----------|---------|
| 1 | Data Survei Mahasiswa | — |
| 2 | Technology Stack | — |
| 3 | Database Schema | — |
| 4 | RLS Policy Matrix | — |
| 5 | Hasil Pengujian Fungsional | — |
| 6 | Perbandingan dengan Sistem Sejenis | — |

---

# DAFTAR GAMBAR

| No | Nama Gambar | Halaman |
|----|------------|---------|
| 1 | Arsitektur Sistem Three-Layer | — |
| 2 | Class Diagram User (UML) | — |
| 3 | Class Diagram Report (UML) | — |
| 4 | Navigation Tree Mahasiswa | — |
| 5 | Navigation Tree Admin | — |
| 6 | ERD Database | — |
| 7 | Screenshot: Splash Screen | — |
| 8 | Screenshot: Login Screen | — |
| 9 | Screenshot: Home Feed | — |
| 10 | Screenshot: Detail Laporan | — |
| 11 | Screenshot: Create Report (Lost) | — |
| 12 | Screenshot: Create Report (Found) | — |
| 13 | Screenshot: Chat Room | — |
| 14 | Screenshot: Notifikasi | — |
| 15 | Screenshot: Admin Dashboard | — |
| 16 | Screenshot: Admin Review | — |
| 17 | Screenshot: Profil | — |
| 18 | Screenshot: My Posts | — |
| 19 | Hasil TypeScript & ESLint Check | — |

---

# DAFTAR LAMPIRAN

| No | Lampiran |
|----|---------|
| 1 | Link Repository GitHub |
| 2 | APK Production |
| 3 | Video Demo Aplikasi |
| 4 | Slide Presentasi |
| 5 | Dokumentasi Kegiatan |

---

# BAB I PENDAHULUAN

## A. Latar Belakang Masalah

Lingkungan kampus dengan mobilitas tinggi menciptakan insiden kehilangan barang yang sering terjadi. Berdasarkan survei terhadap **39 mahasiswa UNU Yogyakarta**, ditemukan fakta:

**Tabel 1. Data Survei Mahasiswa UNU Yogyakarta**

| Temuan | Persentase |
|--------|------------|
| Pernah kehilangan barang di kampus | **51%** |
| Mencari via satpam kampus | **67%** |
| Mencari via Grup WhatsApp | **28%** |
| Pernah menemukan barang orang lain | **41%** |
| Menyerahkan ke satpam | **67%** |
| Mengumumkan di Grup WA | **22%** |
| Nyaman menggunakan email kampus | **82%** |

**Barang paling sering hilang:** Kunci kendaraan, Charger, Dompet, Earphone/Headset, Botol minum.

Permasalahan utama yang teridentifikasi:

| No | Masalah | Dampak |
|----|--------|--------|
| 1 | Informasi cepat tenggelam di grup WhatsApp | Laporan tertumpuk, sulit dilacak |
| 2 | Tidak ada sistem pencarian terstruktur | Tidak bisa mencari laporan lama |
| 3 | Rawan klaim palsu | Tidak ada verifikasi identitas |
| 4 | Privasi terancam | Nomor HP terekspos di grup publik |
| 5 | Format laporan tidak standar | Informasi sering kurang lengkap |
| 6 | Mahasiswa tidak sempat buka aplikasi | Butuh jalur laporan via petugas (walk-in) |

Berdasarkan permasalahan tersebut, dikembangkan **Cari.In** — aplikasi Lost & Found berbasis mobile yang menyediakan platform terpusat, aman, dan terstruktur bagi mahasiswa UNU Yogyakarta.

---

## B. Rumusan Masalah

1. Bagaimana merancang dan membangun aplikasi mobile Lost & Found yang terpusat untuk mahasiswa UNU Yogyakarta?
2. Bagaimana menerapkan sistem autentikasi menggunakan email kampus untuk verifikasi identitas?
3. Bagaimana mengimplementasikan fitur chat realtime yang aman tanpa mengekspos data pribadi?
4. Bagaimana merancang sistem moderasi admin untuk menjaga kualitas laporan?
5. Bagaimana memastikan kualitas kode melalui TypeScript strict, ESLint, dan pengujian fungsional?

---

## C. Tujuan

1. Merancang dan membangun aplikasi mobile Lost & Found yang terpusat untuk mahasiswa UNU Yogyakarta.
2. Menerapkan sistem autentikasi menggunakan email kampus (`@student.unu-jogja.ac.id`) untuk verifikasi identitas.
3. Mengimplementasikan fitur chat realtime berbasis Supabase Realtime yang aman tanpa mengekspos data pribadi.
4. Merancang sistem moderasi admin dengan workflow approve/reject untuk menjaga kualitas laporan.
5. Memastikan kualitas kode melalui TypeScript strict (0 error), ESLint (0 warning), dan pengujian fungsional manual.

---

## D. Batasan Masalah

1. **Pengguna:** Mahasiswa UNU Yogyakarta (role mahasiswa) dan satpam/petugas kampus (role admin).
2. **Data:** Data laporan kehilangan/penemuan barang, data profil pengguna, data percakapan, dan data notifikasi.
3. **Proses bisnis:** Mahasiswa membuat laporan → laporan masuk status "pending" → admin review → approve/reject → laporan tayang di feed publik.
4. **Output:** Aplikasi Android (APK) + preview iOS via Expo Go.
5. **Metode pengembangan:** Agile Development (iteratif per fase).
6. **Pendekatan pemrograman:** Object-Oriented Programming dengan arsitektur three-layer.
7. **Perangkat keras:** Smartphone Android/iOS minimum Android 8 / iOS 15.
8. **Perangkat lunak:** Node.js 18+, Expo SDK 54, Supabase sebagai BaaS.
9. **Teknik pengujian:** TypeScript type checking, ESLint static analysis, pengujian fungsional manual via Expo Go.

---

# BAB II TINJAUAN PUSTAKA

## A. React Native & Expo

React Native adalah framework pengembangan aplikasi mobile berbasis JavaScript/TypeScript yang memungkinkan pembuatan aplikasi untuk Android dan iOS menggunakan satu kode base. Expo adalah platform pengembangan React Native yang menyediakan tooling lengkap termasuk build system, update over-the-air, dan akses ke berbagai API native tanpa konfigurasi manual.

**Tabel Perbandingan Framework Mobile**

| Framework | Bahasa | Platform | Keunggulan |
|-----------|--------|----------|------------|
| React Native | JS/TS | Android, iOS | Satu kodebase, ekosistem besar |
| Flutter | Dart | Android, iOS, Web | Performa tinggi, UI konsisten |
| Kotlin Multiplatform | Kotlin | Android, iOS | Native, berbagi logika |

Cari.In menggunakan **React Native + Expo SDK 54** karena:
- Satu kodebase untuk Android dan iOS
- Managed workflow memudahkan development tanpa konfigurasi native
- Dukungan penuh TypeScript dan OOP
- Ekosistem library yang matang (React Navigation, Zustand, dll)

---

## B. Supabase (Backend as a Service)

Supabase adalah platform backend open-source yang menyediakan database PostgreSQL, autentikasi, penyimpanan file (storage), dan realtime subscriptions. Supabase menjadi alternatif open-source untuk Firebase dengan keunggulan: database relasional (PostgreSQL), Row Level Security (RLS) native, dan dukungan PostgREST API.

**Tabel Perbandingan Backend**

| Fitur | Supabase | Firebase |
|-------|----------|----------|
| Database | PostgreSQL (relasional) | Firestore (NoSQL) |
| Autentikasi | Email, Google, OAuth | Email, Google, OAuth |
| Realtime | WebSocket (postgres_changes) | Firestore realtime |
| Storage | S3-compatible | Google Cloud Storage |
| Harga | Free tier generous | Free tier terbatas |

Cari.In menggunakan **Supabase** karena:
- Database relasional cocok untuk pemetaan objek (User → profiles, Report → reports)
- RLS memberikan keamanan tingkat baris tanpa middleware tambahan
- Realtime subscription mendukung chat tanpa server tambahan
- Free tier cukup untuk skala kampus

---

## C. React Navigation

React Navigation adalah library standar untuk navigasi di React Native. Mendukung tiga jenis navigator yang digunakan di Cari.In:

| Navigator | Fungsi | Route |
|-----------|--------|-------|
| **Stack Navigator** | Navigasi halaman ke halaman (push/pop) | Auth flow, halaman detail |
| **Bottom Tab Navigator** | Navigasi antar tab di bagian bawah | Menu utama mahasiswa & admin |
| **Drawer Navigator** | Menu geser dari samping kiri | Menu navigasi admin |

---

## D. Arsitektur Three-Layer

Arsitektur three-layer memisahkan aplikasi menjadi tiga lapisan:

```
┌──────────────────────────────────────┐
│    PRESENTATION LAYER                │
│    (Screens, Components)             │
├──────────────────────────────────────┤
│    DOMAIN / SERVICE LAYER            │
│    (Models, Services, Stores)        │
├──────────────────────────────────────┤
│    DATA LAYER                        │
│    (Supabase: PostgreSQL + RLS)      │
└──────────────────────────────────────┘
```

Pemisahan ini memberikan manfaat: modularitas, kemudahan pengujian, dan kemampuan mengganti backend tanpa mengubah UI.

---

# BAB III METODE PERANCANGAN

## A. Metode yang Digunakan

Proyek ini menggunakan metode **Agile Development** dengan pendekatan iteratif per fase. Setiap fase memiliki scope, deliverable, dan verifikasi yang jelas.

**Alasan pemilihan Agile:**
1. Proyek dikerjakan oleh tim kecil (6 orang) dengan pembagian tugas jelas
2. Scope proyek dapat dipecah menjadi fase-fase independen
3. Setiap fase dapat diuji dan diverifikasi sebelum lanjut ke fase berikutnya
4. Fleksibel terhadap perubahan kebutuhan selama pengembangan

---

## B. Tahapan Perancangan

Proyek dibagi menjadi **7 fase** pengembangan:

**Tabel Tahapan Pengembangan**

| Fase | Scope | Durasi | Status |
|------|-------|--------|--------|
| **FASE 1** | Setup Project (Expo + NativeWind + TS strict) | 3 hari | ✅ Selesai |
| **FASE 2** | Fondasi Navigasi (Stack + Tab + Drawer) + AuthContext | 4 hari | ✅ Selesai |
| **FASE 3** | Auth Screens (Splash, RoleSelection, Login, Register) | 4 hari | ✅ Selesai |
| **FASE 4** | Core Mahasiswa (Home, Detail, Create, MyPosts, Profile) | 7 hari | ✅ Selesai |
| **FASE 4.5** | Chat & Notifikasi (Inbox, ChatRoom, Notifications) | 5 hari | ✅ Selesai |
| **FASE 5** | Admin Screens (Dashboard, Review, Walk-in) | 5 hari | ✅ Selesai |
| **FASE 6** | Polish (Settings, Help, EAS Build) | 3 hari | ✅ Selesai |

### 1. Analisis Kebutuhan (FASE 1)

Melakukan survei kuesioner terhadap 39 mahasiswa UNU Yogyakarta untuk memvalidasi masalah dan kebutuhan. Hasil survei digunakan untuk merancang spesifikasi fitur.

**Tabel Kebutuhan Fungsional**

| Modul | Fitur | Prioritas |
|-------|-------|-----------|
| **Auth** | Register dengan validasi email kampus | Tinggi |
| **Auth** | Login dengan email/password | Tinggi |
| **Auth** | Forgot password | Sedang |
| **Feed** | List laporan publik dengan filter | Tinggi |
| **Feed** | Search dan filter kategori | Tinggi |
| **Report** | Create laporan Lost/Found dengan foto | Tinggi |
| **Report** | Edit, hapus, tandai selesai | Tinggi |
| **Chat** | In-app chat realtime | Tinggi |
| **Notif** | Notifikasi approve/reject/pesan baru | Sedang |
| **Admin** | Dashboard statistik | Tinggi |
| **Admin** | Review & approve/reject laporan | Tinggi |
| **Admin** | Walk-in report | Sedang |
| **Profile** | Upload avatar, edit profil | Sedang |

### 2. Perancangan Sistem (FASE 2)

**Perancangan Database (ERD)**

```
┌──────────┐     ┌──────────┐     ┌──────────────┐     ┌──────────┐
│ profiles │────→│  reports │────→│ conversations│────→│ messages │
│ (User)   │     │(Laporan) │     │(Percakapan)  │     │ (Pesan)  │
└──────────┘     └──────────┘     └──────────────┘     └──────────┘
                                                              │
                                                              ▼
                                                     ┌──────────────┐
                                                     │ notifications│
                                                     │ (Notifikasi) │
                                                     └──────────────┘
```

**Tabel Database Schema**

| Tabel | Fungsi | Primary Key | Foreign Key |
|-------|--------|-------------|-------------|
| `profiles` | Data profil pengguna | `id` (UUID) | — |
| `reports` | Laporan hilang/temuan | `id` (UUID) | `user_id` → profiles |
| `conversations` | Header percakapan | `id` (UUID) | `report_id` → reports |
| `messages` | Isi pesan chat | `id` (UUID) | `conversation_id` → conversations |
| `notifications` | Notifikasi in-app | `id` (UUID) | `user_id` → profiles |

**Perancangan Navigasi**

```
RootNavigator
├── AuthNavigator (Stack)
│     └── Splash → RoleSelection → Login / Register / ForgotPassword
├── MainNavigator (Bottom Tab) — Mahasiswa
│     ├── HomeTab → HomeStack (HomeFeed, Detail, ChatRoom, UserProfile)
│     ├── ChatTab → ChatStack (Inbox, ChatRoom, UserProfile, Notifications)
│     ├── CreateTab → CreateModal (CreateLost, CreateFound, Success)
│     ├── MyPostsTab → MyPostsStack (MyPosts, EditPost, Detail)
│     └── ProfileTab → ProfileStack (Profile, Settings, Help, UserProfile)
└── AdminNavigator (Drawer → Bottom Tab) — Admin
      ├── DashboardTab → DashboardStack → AdminReview
      ├── ReportsTab → Semua Laporan
      ├── CreateTab → CreateStack (AdminCreateLost, AdminCreateFound)
      ├── ChatTab → ChatStack (Inbox, ChatRoom)
      └── AdminProfileTab → Profile + Logout
```

### 3. Implementasi (FASE 3-6)

Implementasi dilakukan secara bertahap per fase menggunakan TypeScript strict mode. Detail implementasi dijelaskan pada Bab IV.

### 4. Pengujian

Pengujian dilakukan dalam dua tahap:
1. **Pengujian statis:** TypeScript type checking (`tsc --noEmit`) dan ESLint
2. **Pengujian fungsional:** Manual testing di perangkat via Expo Go

---

# BAB IV HASIL DAN PEMBAHASAN

## A. Implementasi

### A.1 Technology Stack

**Tabel Technology Stack**

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| **Framework** | React Native (Expo) | SDK 54 |
| **Language** | TypeScript | 5.9 (strict mode) |
| **UI/Styling** | NativeWind v4 + Custom Design System | — |
| **Navigation** | React Navigation | v7 |
| **State Management** | Context API + Zustand | v5 |
| **Backend** | Supabase (Auth + Postgres + Storage + Realtime) | — |
| **Build** | EAS Build | v20.4.0 |

### A.2 Arsitektur Three-Layer

**[Gambar 1: Arsitektur Three-Layer Cari.In]**

```
┌──────────────────────────────────────────────────┐
│  PRESENTATION LAYER                               │
│  src/screens/ (26 screen)                         │
│  src/components/ (14 komponen reusable)           │
└───────────────────────┬──────────────────────────┘
                        │ Memanggil service function
┌───────────────────────▼──────────────────────────┐
│  DOMAIN / SERVICE LAYER                           │
│  src/models/ (User, Mahasiswa, Admin, Report)     │
│  src/services/ (5 service file)                   │
│  src/context/ (AuthContext, NotifContext)          │
│  src/store/ (feedStore, chatStore)                │
└───────────────────────┬──────────────────────────┘
                        │ Query via Supabase Client
┌───────────────────────▼──────────────────────────┐
│  DATA LAYER                                      │
│  Supabase PostgreSQL + RLS + Storage + Realtime  │
└──────────────────────────────────────────────────┘
```

### A.3 Implementasi Model Domain (OOP)

**[Gambar 2: Class Diagram User (UML)]**

```
┌─────────────────────────────┐
│      «abstract» User         │
├─────────────────────────────┤
│ - _id : string              │
│ - _name : string            │
│ - _email : string           │
├─────────────────────────────┤
│ + get id() / name() / ...   │
│ + set name(value)           │
│ «abstract» + role()         │
│ «abstract» + getRoleLabel() │
│ «abstract» + canModerate()  │
└─────────────┬───────────────┘
              │ (extends)
     ┌────────┴────────┐
     ▼                  ▼
┌────────────┐  ┌──────────────────┐
│ Mahasiswa  │  │     Admin        │
│ role: mhs  │  │  role: admin     │
│ canMod.:   │  │  canMod.: true   │
│   false    │  │  + approveReport │
└────────────┘  │  + rejectReport  │
                └──────────────────┘
```

**[Gambar 3: Class Diagram Report (UML)]**

```
┌───────────────────────────────┐
│    «abstract» ReportModel      │
├───────────────────────────────┤
│ # _title / _category          │
│ # _location / _description    │
├───────────────────────────────┤
│ + get title() / category()    │
│ «abstract» + type()           │
│ «abstract» + validate()       │
└───────────────┬───────────────┘
                │ (extends)
       ┌────────┴────────┐
       ▼                  ▼
┌──────────────┐  ┌──────────────────┐
│  LostReport  │  │   FoundReport    │
│ type: 'lost' │  │  type: 'found'   │
│ validate():  │  │  - _custodyPoint │
│ cek judul +  │  │  validate():     │
│   lokasi     │  │  cek judul +     │
└──────────────┘  │  lokasi +        │
                  │  custodyPoint    │
                  └──────────────────┘
```

### A.4 Implementasi Autentikasi

**Fitur autentikasi meliputi:**
- Register dengan validasi domain `@student.unu-jogja.ac.id`
- Login dengan email/password via Supabase Auth JWT
- Role selection (Mahasiswa/Admin) sebelum login
- Forgot password via Supabase `resetPasswordForEmail`
- Session management via `AuthContext` (Context API)
- Logout dengan clear state

**[Gambar 7: Splash Screen]**
**[Gambar 8: Login Screen]**

### A.5 Implementasi Feed & Detail Laporan

**Fitur feed laporan:**
- FlatList dengan pull-to-refresh
- Search bar dengan debounce 300ms
- Filter tipe (Semua/Hilang/Ditemukan)
- Filter kategori (8 kategori dengan icon)
- Card laporan: foto + badge status + judul + lokasi + waktu

**Fitur detail laporan:**
- Foto hero (320px)
- Badge status & kategori
- Informasi lengkap (lokasi, deskripsi)
- Informasi pelapor (nama, NIM, fakultas)
- Tombol Chat (ke pemilik laporan)

**[Gambar 9: Home Feed]**
**[Gambar 10: Detail Laporan]**

### A.6 Implementasi Create Report

**Fitur pembuatan laporan:**
- Type toggle: Kehilangan / Menemukan dalam 1 form
- Upload foto via Kamera atau Galeri → Supabase Storage
- Pilihan kategori: grid 4-column dengan icon (MaterialCommunityIcons)
- Validasi form: nama wajib, kategori wajib, lokasi wajib, foto wajib
- Field `custodyPoint` hanya muncul untuk tipe "Ditemukan"
- Status submit: `pending` (menunggu review admin)

**[Gambar 11: Create Report (Lost)]**
**[Gambar 12: Create Report (Found)]**

### A.7 Implementasi Chat Realtime

**Fitur chat:**
- Inbox: daftar percakapan, avatar, last_message, last_at
- ChatRoom: FlatList ChatBubble + input bar + send button
- Realtime via Supabase `postgres_changes`: subscribe saat fokus, unsubscribe saat leave
- Read indicator: icon check di bubble pesan sendiri
- Auto mark read saat buka ChatRoom

**Alur realtime:**
```
User A kirim pesan
  → INSERT ke tabel messages
  → Trigger `trg_notify_new_message` (INSERT notifikasi ke User B)
  → Supabase Realtime broadcast ke User B via channel
  → ChatBubble muncul tanpa refresh
```

**[Gambar 13: Chat Room]**

### A.8 Implementasi Notifikasi

**Fitur notifikasi:**
- 3 jenis notifikasi: `report_approved`, `report_rejected`, `new_message`
- Bell badge di Home dengan `NotifContext` polling 15 detik
- List notifikasi dengan icon warna per tipe:
  - ✅ approved = check-circle hijau
  - ❌ rejected = x-circle orange
  - 💬 new_message = message-circle biru
- Tap notifikasi → navigasi ke screen terkait
- Mark all read button

**[Gambar 14: Notifikasi]**

### A.9 Implementasi Admin Moderation

**Fitur admin:**
- **Dashboard:** Header teal, 4 stat cards (Pending, Disetujui, Ditolak, Total), tab filter dengan count badge
- **Review:** Detail laporan + foto hero + tombol Setujui (hijau) / Tolak (merah)
- **Reject:** Modal wajib isi alasan → notifikasi ke owner
- **Walk-in report:** Admin input data pelapor manual → langsung approved
- **Chat pemilik:** Tombol dari Review → langsung ke ChatRoom

**[Gambar 15: Admin Dashboard]**
**[Gambar 16: Admin Review]**

### A.10 Implementasi Profile & Settings

**Fitur profil:**
- Tampilan avatar + nama + NIM + email + fakultas
- Tap avatar → Kamera / Galeri → upload ke Storage `avatars`
- Settings: edit nama, ganti password, toggle notifikasi
- Help: FAQ accordion + kontak email + versi app

**[Gambar 17: Profil]**
**[Gambar 18: My Posts]**

### A.11 Service Layer

**Tabel Service Layer**

| Service | File | Jumlah Fungsi | Fungsi |
|---------|------|--------------|--------|
| Auth | `auth.service.ts` | 4 | loginWithEmail, register, logout, resetPassword |
| Report | `report.service.ts` | 10 | listReports, getReportById, createReport, updateReport, deleteReport, markAsResolved, approveReport, rejectReport, createAdminReport, getAdminStats |
| Upload | `upload.service.ts` | 4 | pickImageFromLibrary, takePhoto, uploadReportPhoto, uploadAvatar |
| Chat | `chat.service.ts` | 6 | listConversations, getOrCreateConversation, listMessages, sendMessage, subscribeToMessages, markMessagesAsRead |
| Notification | `notification.service.ts` | 4 | listNotifications, markAsRead, markAllAsRead, unreadCount |

### A.12 Design System: Calm Campus

**Tabel Color Palette**

| Warna | Hex | Efek Psikologis | Penggunaan |
|-------|-----|-----------------|------------|
| **Primary Blue** | `#2563EB` | Menurunkan detak jantung, trust | Brand, tombol, navbar |
| **Soft Blue** | `#EFF6FF` | Mencegah sensory overload | Background mahasiswa |
| **Teal Sage** | `#0D9488` | Keseimbangan, profesional | Admin area |
| **Orange Lost** | `#F97316` | Urgensi tanpa panic trigger | Badge Hilang |
| **Emerald Found** | `#059669` | Relief, positif | Badge Ditemukan |

**Design Tokens:**
```typescript
RADIUS: { xs:6, sm:8, md:12, lg:16, xl:20, '2xl':24, full:999 }
SPACING: { xs:4, sm:8, md:12, lg:16, xl:20, '2xl':24, '3xl':32 }
FONT_SIZE: { xs:9, sm:11, base:13, md:15, lg:18, xl:20, '2xl':24 }
SHADOW: { subtle, card, elevated } — all with blue glow
```

---

## B. Pengujian Program

### B.1 Pengujian Statis (Kode)

**[Gambar 19: Hasil TypeScript & ESLint Check]**

| Pengujian | Hasil |
|-----------|-------|
| `tsc --noEmit` (type check) | ✅ **0 error** |
| `eslint` (static analysis) | ✅ **0 error, 0 warning** |
| Total file `.ts`/`.tsx` | **67 file** |
| Total baris kode | **~12.800 baris** |

### B.2 Pengujian Fungsional (Manual)

**Tabel Hasil Pengujian Fungsional**

| Modul | Skenario | Hasil |
|-------|----------|-------|
| **Auth** | Register dengan email kampus valid | ✅ Berhasil |
| **Auth** | Register dengan email non-kampus | ✅ Ditolak (validasi) |
| **Auth** | Login dengan email/password benar | ✅ Berhasil |
| **Auth** | Login dengan password salah | ✅ Ditolak |
| **Auth** | Forgot password | ✅ Email terkirim |
| **Auth** | Logout | ✅ Session clear |
| **Feed** | List laporan approved | ✅ Muncul |
| **Feed** | Filter kategori | ✅ Filter bekerja |
| **Feed** | Search dengan keyword | ✅ Hasil sesuai |
| **Feed** | Pull-to-refresh | ✅ Refresh berhasil |
| **Create** | Buat laporan Lost (lengkap) | ✅ Status pending |
| **Create** | Buat laporan Found (lengkap) | ✅ CustodyPoint wajib |
| **Create** | Submit tanpa foto | ✅ Error validasi |
| **Create** | Upload foto dari kamera | ✅ Upload sukses |
| **Detail** | Lihat detail laporan | ✅ Info lengkap |
| **Detail** | Chat dari detail | ✅ Ke ChatRoom |
| **Chat** | Kirim pesan | ✅ Realtime muncul |
| **Chat** | Terima pesan | ✅ Notifikasi masuk |
| **Notif** | Notifikasi approved | ✅ Muncul |
| **Notif** | Notifikasi rejected | ✅ Muncul + alasan |
| **Admin** | Dashboard statistik | ✅ Angka sesuai |
| **Admin** | Approve laporan | ✅ Status berubah |
| **Admin** | Reject dengan alasan | ✅ Notif ke owner |
| **Admin** | Walk-in report | ✅ Langsung approved |
| **Profile** | Upload avatar | ✅ Tersimpan |
| **Profile** | Edit nama | ✅ Tersimpan |
| **MyPosts** | Tandai selesai | ✅ Status resolved |
| **MyPosts** | Edit laporan | ✅ Tersimpan |
| **MyPosts** | Hapus laporan | ✅ Terhapus |

### B.3 Pengujian Build

| Platform | Profile | Size | Status |
|----------|---------|------|--------|
| Android | Preview | 76 MB | ✅ Berhasil |
| Android | Production | 76 MB | ✅ Berhasil |
| iOS | Preview | — | ❌ (butuh Apple Developer $99/th) |

---

## C. Analisis dan Pembahasan

Berdasarkan hasil implementasi dan pengujian, Cari.In telah berhasil memenuhi seluruh kebutuhan fungsional yang dirancang pada tahap analisis. Aplikasi mampu menyediakan platform Lost & Found terpusat yang memvalidasi identitas pengguna melalui email kampus, memoderasi konten melalui admin, dan melindungi privasi melalui chat in-app.

### 1. Kelebihan Sistem

1. **Verifikasi identitas otomatis** — registrasi hanya dengan email `@student.unu-jogja.ac.id` memastikan hanya mahasiswa UNU Yogyakarta yang dapat menggunakan aplikasi.
2. **Privasi terjaga** — komunikasi antar pengguna dilakukan melalui chat in-app tanpa mengekspos nomor HP.
3. **Moderasi terstruktur** — setiap laporan melalui review admin sebelum tayang di feed publik, mencegah spam dan klaim palsu.
4. **Realtime chat** — pesan muncul tanpa refresh berkat Supabase Realtime subscription.
5. **Design system berbasis riset** — pemilihan warna berdasarkan neuropsikologi untuk menenangkan pengguna yang sedang panik.
6. **Kode berkualitas** — TypeScript strict zero error, ESLint zero warning, arsitektur three-layer.

### 2. Kekurangan Sistem

1. **Belum mendukung Google OAuth** — saat ini hanya email/password (direncanakan di fase pengembangan selanjutnya).
2. **Notifikasi hanya in-app** — belum ada push notification (butuh Expo Push Notifications).
3. **Belum ada notifikasi email** — pengguna hanya mendapat notifikasi di dalam aplikasi.
4. **Belum ada fitur delete akun** — pengguna tidak bisa menghapus akun sendiri.
5. **iOS APK belum bisa dibuild** — butuh Apple Developer Program ($99/tahun).
6. **Belum ada admin panel web** — admin hanya bisa mengelola lewat aplikasi mobile.

---

# BAB V KESIMPULAN DAN SARAN

## A. Kesimpulan

Berdasarkan hasil analisis, perancangan, implementasi, dan pengujian, dapat disimpulkan:

1. **Cari.In berhasil dibangun** sebagai aplikasi Lost & Found berbasis mobile untuk mahasiswa UNU Yogyakarta menggunakan React Native (Expo SDK 54) dengan backend Supabase.
2. **Sistem autentikasi berhasil diimplementasikan** dengan validasi domain email kampus (`@student.unu-jogja.ac.id`), memastikan hanya mahasiswa terverifikasi yang dapat menggunakan aplikasi.
3. **Fitur chat realtime berhasil diimplementasikan** menggunakan Supabase Realtime (`postgres_changes` subscription) tanpa mengekspos nomor HP pengguna.
4. **Sistem moderasi admin berhasil diimplementasikan** dengan workflow: mahasiswa submit → pending → admin review → approve/reject → notifikasi otomatis ke pelapor.
5. **Kualitas kode terjamin** dengan TypeScript strict mode (0 error), ESLint v9 (0 warning), dan arsitektur three-layer yang modular.

**Capaian proyek:**
- ✅ 26 screen berfungsi penuh (0 placeholder)
- ✅ 67 file source code (~12.800 baris)
- ✅ 5 tabel database dengan RLS + 4 trigger + 2 RPC
- ✅ APK Android production 76 MB
- ✅ 0 error TypeScript, 0 warning ESLint

---

## B. Saran

Untuk pengembangan selanjutnya, disarankan:

1. **Implementasi push notification** — menggunakan Expo Push Notifications untuk notifikasi di luar aplikasi.
2. **Google OAuth** — integrasi login dengan Google untuk memudahkan registrasi.
3. **Admin panel web** — dashboard berbasis web untuk moderasi yang lebih fleksibel.
4. **Fitur delete akun** — berikan pengguna kontrol untuk menghapus data mereka.
5. **Notifikasi email** — kirim email notifikasi untuk event penting (laporan disetujui/ditolak).
6. **iOS build** — daftar Apple Developer Program untuk build iOS production.
7. **Fitur lokasi realtime** — integrasi peta untuk menampilkan lokasi barang hilang/ditemukan.
8. **Rating dan review** — fitur rating untuk pelapor dan penemu.

---

# DAFTAR PUSTAKA

1. Meta Platforms, Inc. (2026). *React Native 0.81 Documentation*. https://reactnative.dev/docs

2. Expo. (2026). *Expo SDK 54 Documentation*. https://docs.expo.dev

3. Supabase. (2026). *Supabase Documentation*. https://supabase.com/docs

4. React Navigation. (2026). *React Navigation v7 Documentation*. https://reactnavigation.org/docs

5. Zustand. (2026). *Zustand v5 Documentation*. https://github.com/pmndrs/zustand

6. NativeWind. (2026). *NativeWind v4 Documentation*. https://www.nativewind.dev

7. TypeScript. (2026). *TypeScript 5.9 Documentation*. https://www.typescriptlang.org/docs

8. PostgresQL. (2026). *PostgreSQL 15 Documentation*. https://www.postgresql.org/docs/15

9. ESLint. (2026). *ESLint v9 Configuration*. https://eslint.org/docs/latest

---

# LAMPIRAN

## Lampiran 1: Link Repository GitHub

```
Repository: https://github.com/Faiz-abdurrachman/cariin
Branch: main
```

## Lampiran 2: APK Production

```
File: CariIn-v1.apk (76 MB)
Build: EAS Build — Android Production
```

## Lampiran 3: Video Demo Aplikasi

```
Link: [YouTube Unlisted — insert link]
Durasi: 3-5 menit
Cover: Seluruh user flow (mahasiswa + admin)
```

## Lampiran 4: Slide Presentasi

```
File: uas-mopro/PPT-CARIIN.md (17 slide)
Link HTML: uas-mopro/pres/index.html
```

## Lampiran 5: Dokumentasi Kegiatan

| Kegiatan | Tanggal | Dokumentasi |
|----------|---------|-------------|
| Survei kuesioner & analisis masalah | 23 Mei – 3 Juni 2026 | Hasil Google Form |
| Perancangan database & arsitektur | 5 – 15 Juni 2026 | ERD diagram |
| Perancangan prototype & MVP | 16 – 24 Juni 2026 | 26 screen HTML |
| Implementasi aplikasi mobile | 25 Juni – 5 Juli 2026 | Screenshot app |
| Implementasi chat & notifikasi | 6 – 15 Juli 2026 | Screenshot chat |
| Dashboard admin & finalisasi | 16 – 25 Juli 2026 | Screenshot admin |

---

*Laporan ini disusun berdasarkan kondisi kode pada branch `main` (commit terakhir: 06384a3).*
