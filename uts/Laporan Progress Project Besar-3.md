**Laporan Progress Project Besar #3**

**Pemrograman Berbasis Object**

Judul	: Cari.In Aplikasi Mobile Lost & Found Kampus UNU Yogyakarta
Periode	: 25 Juni – 5 Juli 2026

Dokumentasi Kegiatan & Tanggal Kegiatan: 

| No | Foto Kegiatan | Keterangan | Tanggal  |
| :---- | :---- | :---- | :---- |
| 1 | Gambar 1 | Setup Environment, Arsitektur Project & Konfigurasi Backend | 25 – 28 Juni 2026 |
| 2 | Gambar 2 | Autentikasi Email Kampus & Navigasi Role-Based | 29 Juni – 2 Juli 2026 |
| 3 | Gambar 3 | Implementasi Home Feed, Filter & Detail Laporan | 3 – 5 Juli 2026 |

Deskripsi Kegiatan:

**1. Kegiatan 1: Setup Environment, Arsitektur Project & Konfigurasi Backend**

Kegiatan ini berfokus pada inisialisasi project React Native dan konfigurasi backend Supabase.

1. Inisialisasi Project: Menginisialisasi project React Native menggunakan Expo SDK 54 dengan TypeScript strict mode (noImplicitAny, noUncheckedIndexedAccess). Menginstall NativeWind v4 (Tailwind CSS untuk React Native) dan dependensi utama: React Navigation v7, Zustand v5, Supabase client, Expo Image Picker, dan Expo Secure Store.  

2. Arsitektur Modular: Menyusun struktur project modular — src/screens/ (auth, main, chat, profile, admin), src/navigation/ (RootNavigator, AuthNavigator, MainNavigator, AdminNavigator), src/components/ (14 reusable components), src/services/ (6 service file), src/context/ (AuthContext, NotifContext), src/store/ (feedStore, chatStore), src/utils/ (constants, validators, formatters).  

3. Konfigurasi Supabase Backend: Menyiapkan project Supabase dengan 5 tabel Postgres (profiles, reports, conversations, messages, notifications) melalui supabase-schema.sql. Menulis 17 Row Level Security (RLS) policies untuk mengatur akses data berdasarkan role dan kepemilikan. Membuat 4 database trigger (trg_handle_new_user untuk auto-create profile, trg_set_updated_at untuk auto-update timestamp, trg_update_conversation_last_message, trg_notify_new_message untuk notifikasi chat). Membuat 2 RPC function security definer (update_report_status untuk admin moderation, create_admin_report untuk walk-in). Setup 3 Storage buckets (report-photos, avatars, chat-media) dengan policies per user folder.

4. Penerapan OOP — Abstraction & Encapsulation:
   a. Abstraction: Mendefinisikan interface TypeScript untuk setiap entitas — UserProfile, Report, Conversation, Message, AppNotification. Mendefinisikan interface untuk filter (ReportFilter, FeedFilter) dan input (ReportInput, RegisterPayload, AdminReportInput).
   b. Encapsulation: Service layer (auth.service.ts, report.service.ts, upload.service.ts, chat.service.ts, notification.service.ts) membungkus seluruh operasi Supabase. Komponen UI tidak pernah memanggil Supabase secara langsung. Error handling konsisten — PostgrestError (yang bukan instance Error) di-wrap dengan throw new Error(error.message).

*Gambar 1: Setup Environment — screenshot struktur folder project di VS Code, diagram arsitektur modular, screenshot Supabase dashboard (tabel, RLS policies, trigger, storage buckets), code snippet supabase-schema.sql, code snippet TypeScript interfaces.*

**2. Kegiatan 2: Autentikasi Email Kampus & Navigasi Role-Based**

Kegiatan ini berfokus pada implementasi sistem autentikasi dan navigasi aplikasi.

1. Validasi Domain Email Kampus: Mengimplementasikan validator email kampus di client-side (isValidCampusEmail) yang memvalidasi email berakhiran @student.unu-jogja.ac.id. Environment variable EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN untuk fleksibilitas domain.

2. Supabase Auth Integration: Mengimplementasikan auth.service.ts dengan fungsi loginWithEmail, register, logout, dan resetPassword. Register mengirim raw_user_meta_data (name, nim, faculty) ke Supabase Auth, kemudian trigger handle_new_user auto-create row di tabel profiles. AuthContext sebagai React Context global menyimpan session, userProfile, role, dan isLoading state.

3. Navigasi 3 Role: Mengimplementasikan RootNavigator dengan branching berdasarkan auth state:
   - isLoading → LoadingScreen
   - !isAuthenticated → AuthNavigator (Stack: Splash → RoleSelection → Login/Register/ForgotPassword)
   - role='admin' → AdminNavigator (Bottom Tab: Dashboard, Laporan, Buat, Pesan, Profil)
   - role='mahasiswa' → MainNavigator (Bottom Tab: Home, Chat, FAB Create, MyPosts, Profile)

4. Auth Screens: Mengimplementasikan 5 screen autentikasi:
   - SplashScreen: Tampilan awal dengan fade-in animation dan logo Cari.In, auto-redirect ke RoleSelection
   - RoleSelectionScreen: Dua card untuk memilih peran Mahasiswa atau Admin
   - LoginScreen: Form email + password dengan validasi, variant admin (teal) dan mahasiswa (biru)
   - RegisterScreen: Form lengkap — nama, NIM, email kampus (divalidasi), fakultas dropdown, jurusan, password
   - ForgotPasswordScreen: Input email untuk kirim reset password link

5. Penerapan OOP — Inheritance:
   a. Inheritance: Class User sebagai superclass dengan atribut umum (name, email, nim). Subclass Mahasiswa dan Admin mewarisi atribut User. Role='mahasiswa' mengarah ke MainNavigator, role='admin' mengarah ke AdminNavigator — routing polymorphism berdasarkan role.
   b. Encapsulation: AuthContext menyediakan method loginWithEmail, register, logout, refreshProfile tanpa mengekspos detail implementasi Supabase Auth.

*Gambar 2: Autentikasi & Navigasi — screenshot SplashScreen, RoleSelectionScreen, LoginScreen, RegisterScreen di Expo Go, diagram navigasi tree 3 role, code snippet AuthContext dengan role-based branching, code snippet validasi email kampus.*

**3. Kegiatan 3: Implementasi Home Feed, Filter & Detail Laporan**

Kegiatan ini berfokus pada implementasi halaman utama dan detail laporan.

1. Home Feed: Mengimplementasikan HomeScreen dengan FlatList menampilkan laporan publik berstatus approved/resolved. Setiap item menggunakan komponen ReportCard yang menampilkan foto (height 200px), badge type (Lost/Found), badge Via Admin (jika created_by_admin), judul, deskripsi, waktu relatif, dan lokasi. Data laporan di-cache di feedStore (Zustand) dengan method fetch, refresh, setFilter, clearFilter.

2. Filter & Search: Mengimplementasikan tiga jenis filter:
   - Type filter: Chip "Semua" / "Hilang" / "Ditemukan" — langsung fetch tanpa delay
   - Category filter: Horizontal ScrollView dengan 8 chip kategori (CategoryGrid) — langsung fetch tanpa delay
   - Search bar: TextInput dengan debounce 300ms via setTimeout di feedStore — mencegah bombardir Supabase setiap keystroke

3. Detail Laporan: Mengimplementasikan DetailReportScreen (shared component untuk DetailLost dan DetailFound) dengan:
   - Hero foto 320px dengan tombol back overlay dan badge "MODE REVIEW" (admin)
   - Badge status (StatusBadge), badge type (Lost/Found), badge kategori
   - Judul laporan, info card (lokasi, waktu, titik penitipan), deskripsi
   - Reporter card dengan avatar inisial, nama, NIM, fakultas — tap navigasi ke UserProfile
   - Bottom CTA bar — jika owner: "Kelola di tab Laporanku", jika bukan owner: tombol Chat

4. State Management: feedStore menggunakan Zustand create() dengan closure scope untuk searchTimer (debounce 300ms). Filter state mencakup type ('all'/'lost'/'found'), category (CategoryId | null), dan search (string). Method toServiceFilter memetakan FeedFilter ke ReportFilter untuk PostgREST query.

5. Penerapan OOP — Polymorphism:
   a. Polymorphism: DetailReportScreen berperilaku berbeda berdasarkan report.type — label type "HILANG" (orange) vs "DITEMUKAN" (emerald), CTA label "Info Telah Ditemukan" (lost) vs "Chat Penemu" (found). Filter type di feedStore — setFilter({ type: 'lost' }) vs setFilter({ type: 'found' }) menghasilkan PostgREST query berbeda.

*Gambar 3: Home Feed & Detail — screenshot HomeScreen dengan filter chip aktif, screenshot DetailReportScreen dengan foto hero dan badge, screenshot filter kategori CategoryGrid, code snippet feedStore dengan debounce, code snippet DetailReportScreen dengan polymorphic behavior.*

Kontribusi Anggota:

| NO | NAMA | NIM | KONTRIBUSI |
| :--- | :--- | :--- | :--- |
| 1 | Irham Zubaidi Alhuda | 241111006 | Membantu dokumentasi setup environment, screenshot struktur project, penyusunan laporan progress #3 |
| 2 | Galih Witradika | 241111013 | Testing flow autentikasi (login/register/logout), validasi navigasi 3 role |
| 3 | Faiz Abdurrahman | 241111021 | Inisialisasi project Expo SDK 54 + TypeScript strict. Konfigurasi Supabase backend (5 tabel, 17 RLS policies, 4 trigger, 2 RPC, 3 Storage buckets). Implementasi AuthContext dan RootNavigator. Implementasi 5 auth screens. Implementasi HomeScreen + feedStore + filter + search. Implementasi DetailReportScreen dengan polymorphic behavior. Implementasi ReportCard, CategoryGrid, StatusBadge, ViaAdminBadge components. |
| 4 | Ibnul Mubarok | 241111026 | Membantu penyusunan laporan, pengujian Home Feed, dokumentasi wireframe navigasi |
| 5 | Imroatu Zakiyah | 241111032 | Validasi data survey terhadap fitur aplikasi. Membantu penyusunan capaian kerja. |
| 6 | Aldo Yulian | 241111037 | Perancangan desain komponen ReportCard dan CategoryGrid. Dokumentasi screenshot aplikasi. |

Capaian Kerja: 

1. Project setup berhasil dengan Expo SDK 54, TypeScript strict, NativeWind v4, dan seluruh dependensi terinstall. Arsitektur modular dengan 8 folder utama dan 14 reusable components.  

2. Supabase backend terkonfigurasi penuh — 5 tabel dengan 17 RLS policies, 4 database trigger, 2 RPC functions, 3 Storage buckets dengan policy per user folder. Semua DDL idempotent dalam supabase-schema.sql.  

3. Sistem autentikasi berfungsi — login dengan email kampus (@student.unu-jogja.ac.id), register dengan auto-create profile via trigger, logout, reset password. 5 screen autentikasi diimplementasi.  

4. Navigasi 3 role berfungsi — RootNavigator branching berdasarkan role, admin ke AdminNavigator (5 tab), mahasiswa ke MainNavigator (5 tab + modal).  

5. Home Feed berfungsi — FlatList dengan ReportCard, 3 jenis filter (type, category, search), pull-to-refresh, loading skeleton, empty state, error state. State management menggunakan Zustand feedStore dengan debounce 300ms.  

6. Detail Laporan berfungsi — foto hero, badge status/type/kategori/ViaAdmin, judul, info card, deskripsi, reporter card dengan navigasi ke UserProfile, bottom CTA bar dengan behavior polymorphic.  

Target Minggu Depan: 

1. Target 1: Implementasi Create Report (Lost/Found): Mengimplementasikan form laporan kehilangan dan penemuan dengan upload foto via Supabase Storage, kategori grid 8 pilihan, validasi field, dan success screen. Menerapkan polymorphic behavior — Found mewajibkan custody_point.  

2. Target 2: Implementasi My Posts & Profile: Mengimplementasikan daftar laporan milik user dengan fitur edit, hapus, dan tandai selesai. Mengimplementasikan profile screen dengan avatar upload.  

3. Target 3: Design System Calm Campus: Merancang ulang color palette berbasis riset neuropsikologi — primary dari almost-black ke biru (#2563EB), standarisasi radius, shadow, dan spacing tokens.
