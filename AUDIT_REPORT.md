# AUDIT REPORT: Cari.In Mobile

## Executive Summary
Cari.In Mobile adalah aplikasi React Native (Expo) untuk pelaporan barang hilang dan ditemukan (Lost & Found) khusus mahasiswa UNU Yogyakarta. Secara keseluruhan, kualitas repository sangat baik, sangat terstruktur, dan mengikuti best practices React Native dan arsitektur backend-as-a-service menggunakan Supabase. Tidak ditemukan celah keamanan kritikal (secrets ter-expose) di dalam source code, dan mitigasi untuk bug RLS recursion sudah diimplementasikan dengan baik menggunakan RPC (Remote Procedure Call) functions. Project saat ini berada pada tahap pengerjaan fitur Admin (selesai) dan akan melanjutkan ke Fase 4.5 (Chat & Notifikasi).

## Project Overview
- **Nama Project:** Cari.In
- **Tujuan:** Platform terpusat untuk mencari dan melaporkan barang hilang di lingkungan kampus UNU Yogyakarta.
- **Masalah:** Informasi barang hilang tenggelam di grup WhatsApp, tidak ada verifikasi pelapor, nomor HP pribadi rentan terekspos.
- **Target User:** Mahasiswa UNU Yogyakarta (email `@student.unu-jogja.ac.id`) dan Admin (satpam/petugas).
- **Alur Kerja:** Mahasiswa melaporkan barang (Lost/Found) -> Status "Pending" -> Admin menyetujui -> Tampil di Feed publik -> Mahasiswa lain mengklaim via Chat In-App -> Laporan diselesaikan (Resolved).

## Tech Stack
- **Frontend:** React Native 0.81.5, React 19.1.0, Expo SDK 54 (Managed Workflow)
- **UI/Styling:** NativeWind v4 (Tailwind CSS untuk RN), @expo/vector-icons
- **Navigation:** React Navigation v7 (Stack, Bottom Tabs, Drawer)
- **State Management:** Context API (untuk Auth & Global Config), Zustand v5 (untuk feed dan chat state)
- **Backend/BaaS:** Supabase (Auth, Postgres, Realtime, Storage)
- **Network:** Supabase JS Client (PostgREST)
- **Tooling:** ESLint v9 (Flat Config), Prettier, TypeScript

## Folder Structure Analysis
- `/src/components/`: Komponen UI yang reusable (ReportCard, ChatBubble, PrimaryButton, dll).
- `/src/context/`: Konteks global (AuthContext, NotifContext).
- `/src/navigation/`: Konfigurasi routing (AuthNavigator, MainNavigator, AdminNavigator, Root).
- `/src/screens/`: Layar aplikasi dibagi berdasarkan domain (auth, main, chat, profile, admin).
- `/src/services/`: Abstraksi layer data ke Supabase (auth, report, upload, chat, notification).
- `/src/store/`: State management global dengan Zustand.
- `/src/utils/`: Konstanta (warna, kategori), validator, dan formatter.
- `supabase-schema.sql` & `ERD.dbml`: Dokumentasi dan definisi database yang lengkap dan rapi.

## System Architecture
- **Frontend Architecture:** Component-based UI dengan pemisahan presentational components dan smart components (screens). Navigasi menggunakan sistem hierarki bersarang (Root -> Stack/Tabs/Drawer).
- **State Architecture:** Memanfaatkan Zustand untuk state yang berubah cepat (feed, percakapan) dan Context API untuk state sesi yang stabil (user login).
- **Backend Architecture:** Serverless menggunakan Supabase. Autentikasi via JWT, operasi data melalui REST auto-generated PostgREST, dan event real-time melalui WebSockets.
- **Security Architecture:** Menggunakan Row Level Security (RLS) di level database Postgres. Operasi khusus Admin memanfaatkan PostgreSQL Functions (RPC) berstatus `SECURITY DEFINER` untuk bypass RLS dengan aman tanpa rekursi yang berbahaya.

## Feature Analysis
| Nama Fitur | Cara Kerja | Endpoint/Database |
|---|---|---|
| **Autentikasi** | Mahasiswa login/register dengan verifikasi domain lokal. Admin login dengan kredensial seed. | Supabase Auth, tabel `profiles` |
| **Feed Laporan** | Menampilkan daftar laporan dengan filter/pencarian. Status = Approved. | Tabel `reports` |
| **Buat Laporan** | Form input dengan unggah foto ke Storage. | Tabel `reports`, Bucket `report-photos` |
| **Admin Moderasi** | Admin me-review laporan pending (approve/reject). | RPC `update_report_status` |
| **Admin Walk-in** | Admin mencatat laporan dari mahasiswa yang datang fisik. | RPC `create_admin_report` |
| **Chat & Notif** | (Stubbed - Fase 4.5) Chat real-time antar pengguna. | Tabel `conversations`, `messages`, `notifications` |

## Database Analysis
Terdapat 5 tabel utama yang terdokumentasi di `supabase-schema.sql`:
1. `profiles`: Relasi 1-1 dengan `auth.users`. Menyimpan data profil (NIM, Fakultas, Role).
2. `reports`: Menyimpan laporan kehilangan/penemuan.
3. `conversations`: Header dari sesi obrolan 2 user untuk sebuah laporan.
4. `messages`: Isi pesan real-time.
5. `notifications`: Notifikasi in-app untuk sistem persetujuan laporan.

*Constraint Penting:* Tabel `conversations` memiliki unique constraint `(report_id, user_a_id, user_b_id)` untuk memastikan tidak ada duplikasi obrolan untuk laporan yang sama.

## API Analysis
Proyek tidak menggunakan custom backend REST API konvensional (seperti Express.js), melainkan menggunakan Supabase JS client.
- **Request Body/Response:** Sesuai definisi TypeScript dan schema di Supabase.
- **Authentication Requirement:** Semua mutasi (Insert/Update/Delete) memerlukan Bearer Token JWT (Auth).
- **Error Handling:** Di-handle di level service (contoh: `auth.service.ts` menangkap error dan mengembalikan flag `error`).

## Security Audit
- **Critical:** Tidak ditemukan hardcoded secrets (`EXPO_PUBLIC_*` aman karena terekspos ke klien sebagai Anon Key). Tidak ditemukan indikasi SQL Injection karena Supabase JS client menggunakan parameterisasi.
- **High:** Tidak ada.
- **Medium (Authentication Vulnerability):** Validasi domain email `@student.unu-jogja.ac.id` dilakukan 100% di sisi klien (`src/utils/validators.ts`). Pengguna mahir dapat melakukan bypass dengan memanggil API Supabase Auth secara langsung menggunakan cURL/Postman.
- **Low (RLS Bypass):** Kebijakan RLS untuk Admin yang rawan `permission denied` sudah dimitigasi dengan baik menggunakan RPC.

## Performance Audit
- Aplikasi dimuat sebagai aplikasi Expo berbasis bundler Metro.
- Cache dan offline persistence (Zustand/AsyncStorage) meminimalisir network call berulang.
- Pemanggilan Supabase Auth session saat inisialisasi aplikasi cukup efisien.
- *Perhatian:* Penggunaan real-time (Supabase Realtime) di Fase 4.5 nanti harus memastikan channel `unsubscribe()` dipanggil saat komponen di-unmount untuk mencegah Memory Leak.

## Code Quality Audit
- **Code Duplication:** Minimal. Form Create Lost dan Create Found berbagi logika.
- **Dead Code:** Terdapat beberapa file stubs yang disiapkan untuk Fase 4.5 (`chat.service.ts`, `notification.service.ts`).
- **Typing:** Strict TS yang konsisten (`noImplicitAny`, dll). Tidak ditemukan penggunaan `any` yang berbahaya.

## Technical Debt
- Penundaan integrasi Google OAuth ke Fase 6.
- Logika otorisasi berbasis email terbatas pada front-end.
- Push Notifications token storage sudah dipersiapkan di schema tapi push logic belum sepenuhnya diimplementasi.

## Risks
1. **Keamanan Data (Bypass Validasi):** Tanpa trigger database, siapa pun dapat mendaftar dengan sembarang email jika mereka menggunakan API langsung.
2. **Skalabilitas Real-time:** Banyaknya listener web socket aktif jika banyak ruang obrolan terbuka di `ChatRoomScreen`.

## Recommendations & Quick Wins
1. **Pindahkan Validasi Domain ke Database:** Buat PostgreSQL Trigger `before insert` pada tabel `auth.users` untuk menolak pendaftaran jika `email` tidak diakhiri dengan `student.unu-jogja.ac.id`.
2. **Review FlatList:** Pastikan Feed laporan menggunakan `FlashList` dari Shopify atau minimal `FlatList` dengan `initialNumToRender` dan `windowSize` yang dioptimasi untuk mencegah lag saat scrolling banyak laporan bergambar.

## Long-Term Improvements
1. Integrasi testing (Unit Test menggunakan Jest, E2E menggunakan Maestro).
2. Penerapan CI/CD (GitHub Actions) untuk build otomatis ke Expo EAS.

## Development Roadmap (Sesuai `CHECKPOINT.md`)
- **Fase 1-4:** Selesai (Setup, Navigasi, Core Mahasiswa).
- **Fase 5:** Selesai (Admin Moderasi).
- **Fase 4.5 (Saat Ini):** Mengimplementasikan Chat & Notifikasi Realtime (`InboxScreen`, `ChatRoomScreen`, `chat.service.ts`).
- **Fase 6:** Polish (Settings, Help, Google OAuth, EAS build, UI Animasi).
