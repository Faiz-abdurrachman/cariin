**Laporan Progress Project Besar #3**

**Pemrograman Berbasis Object**

Judul	: Cari.In Aplikasi Mobile Lost & Found Kampus UNU Yogyakarta
Periode	: 25 Juni – 25 Juli 2026

Dokumentasi Kegiatan & Tanggal Kegiatan: 

| No | Foto Kegiatan | Keterangan | Tanggal  |
| :---- | :---- | :---- | :---- |
| 1 | Gambar 1 | Implementasi Aplikasi Mobile & Integrasi Backend | 25 Juni – 5 Juli 2026 |
| 2 | Gambar 2 | Implementasi Fitur Chat Realtime & Notifikasi | 6 – 15 Juli 2026 |
| 3 | Gambar 3 | Implementasi Dashboard Admin & Finalisasi | 16 – 25 Juli 2026 |

Deskripsi Kegiatan:

**1. Kegiatan 1: Implementasi Aplikasi Mobile & Integrasi Backend**

Kegiatan ini berfokus pada implementasi aplikasi mobile menggunakan React Native dan integrasi dengan backend Supabase.

1. Setup Environment: Menginisialisasi project React Native dengan Expo SDK 54, mengonfigurasi TypeScript strict mode, menginstall NativeWind v4 untuk styling, dan menyiapkan Supabase client. Arsitektur project disusun modular: screen, navigation, components, services, context, store, dan utils.  

2. Autentikasi & Navigasi: Mengimplementasikan autentikasi menggunakan Supabase Auth dengan validasi domain email kampus (@student.unu-jogja.ac.id). Navigasi menggunakan React Navigation v7 dengan tiga jenis navigator: Stack Navigator untuk auth flow, Bottom Tab Navigator untuk mahasiswa, dan Tab Navigator untuk admin. Sistem role-based routing memisahkan akses mahasiswa dan admin secara otomatis.  

3. Fitur Core Mahasiswa (5 fitur utama):
   a. Home Feed: Menampilkan laporan publik dengan status approved, dilengkapi filter kategori (8 kategori) dan tipe (Lost/Found), serta search bar dengan debounce 300ms. State management menggunakan Zustand store.
   b. Detail Laporan: Menampilkan foto, badge status, badge kategori, lokasi, deskripsi, dan informasi pelapor. Tombol Chat untuk memulai percakapan dengan pemilik laporan.
   c. Create Report: Form laporan Lost & Found dengan upload foto via Supabase Storage, pemilihan kategori 8 pilihan menggunakan grid icon MaterialCommunityIcons, input lokasi, titik penitipan (Found only), dan deskripsi. Setelah submit, laporan masuk status "Pending" menunggu review admin.
   d. My Posts: Daftar laporan milik user dengan fitur edit, hapus, dan tandai selesai (resolved).
   e. Profile: Menampilkan data user (nama, NIM, email, fakultas) dengan avatar upload via Supabase Storage.

4. Penerapan OOP dalam Implementasi:
   a. Encapsulation: Service layer (auth.service.ts, report.service.ts, upload.service.ts) membungkus seluruh operasi Supabase. Komponen UI tidak pernah memanggil Supabase secara langsung — seluruh akses data melalui service function. Error handling konsisten dengan wrapper throw new Error(error.message) untuk PostgrestError yang bukan instance Error.
   b. Abstraction: Interface TypeScript digunakan untuk type safety: ReportFilter, ReportInput, AdminReportInput, FeedFilter. Komponen UI menggunakan interface props yang didefinisikan secara eksplisit tanpa mengetahui detail implementasi.
   c. Polymorphism: Satu komponen CreateReportScreen menangani dua tipe laporan (Lost & Found) dengan perilaku berbeda — field custodyPoint wajib hanya untuk Found, placeholder text berbeda, dan validasi berbeda. DetailReportScreen juga polymorphic — label CTA berubah ("Info Telah Ditemukan" vs "Chat Penemu") berdasarkan report.type dan status kepemilikan.

*Gambar 1: Implementasi Aplikasi Mobile — screenshot aplikasi React Native di Expo Go (home feed dengan filter, detail laporan, form create report, my posts dengan status badge, profile screen dengan avatar). Screenshot kode (service layer dengan error handling pattern, Zustand store dengan debounce, TypeScript interfaces).*

**2. Kegiatan 2: Implementasi Fitur Chat Realtime & Notifikasi**

Kegiatan ini berfokus pada implementasi komunikasi realtime antar pengguna dan sistem notifikasi.

1. Chat Realtime: Mengimplementasikan chat realtime menggunakan Supabase Realtime (postgres_changes subscription pada tabel messages). Setiap ChatRoomScreen subscribe ke channel spesifik per conversation_id saat focus, dan unsubscribe saat leave (useEffect cleanup). Pesan baru muncul tanpa refresh manual.
   a. Service Layer: chat.service.ts dengan fungsi listConversations, getOrCreateConversation (upsert conversation dengan unique constraint), sendMessage, subscribeToMessages, dan markMessagesAsRead.
   b. Store: chatStore menggunakan Zustand untuk menyimpan messages per conversation, active channel, dan method appendMessage yang dipanggil dari realtime callback.
   c. Component: ChatBubble menampilkan pesan dengan diferensiasi kiri/kanan (sender vs receiver), timestamp, dan read indicator.
   d. Screen: InboxScreen menampilkan daftar percakapan terurut last_at, ChatRoomScreen dengan FlatList inverted, input bar, dan KeyboardAvoidingView.

2. Notifikasi: Mengimplementasikan sistem notifikasi in-app menggunakan tabel notifications dengan trigger database.
   a. Trigger Database: notify_new_message() — AFTER INSERT pada messages, otomatis mencari receiver dari conversations dan insert notifikasi ke tabel notifications dengan type 'new_message'.
   b. RPC Admin: update_report_status — saat admin approve/reject laporan, otomatis insert notifikasi type 'report_approved' atau 'report_rejected' ke owner laporan.
   c. NotifContext: React Context untuk unread count global dengan auto-polling setiap 15 detik via setInterval. Bell icon di HomeScreen menampilkan badge merah dengan jumlah notifikasi belum dibaca.
   d. NotificationsScreen: Menampilkan daftar notifikasi dengan icon berbeda per type (approved = check-circle hijau, rejected = x-circle orange, new_message = message-circle biru). Tap notifikasi navigasi ke screen terkait (DetailReport atau ChatRoom).

3. Penerapan OOP dalam Chat:
   a. Encapsulation: Seluruh operasi chat (send, receive, subscribe) dienkapsulasi dalam chat.service.ts. UI hanya memanggil method sendMessage tanpa mengetahui mekanisme insert ke tabel messages.
   b. Polymorphism: Fungsi getOrCreateConversation berperilaku berbeda — jika conversation sudah ada (di-select via unique constraint), langsung return existing; jika belum, insert baru. MarkMessagesAsRead hanya update pesan dari sender lain yang belum read.

*Gambar 2: Implementasi Chat & Notifikasi — screenshot ChatRoom dengan bubble kiri/kanan, InboxScreen dengan daftar percakapan, NotificationsScreen dengan badge read/unread, code snippet trigger notify_new_message SQL, diagram alur realtime (User A -> Supabase Realtime -> User B).*

**3. Kegiatan 3: Implementasi Dashboard Admin & Finalisasi**

Kegiatan ini berfokus pada implementasi dashboard admin untuk moderasi laporan dan finalisasi aplikasi.

1. Admin Dashboard:
   a. Dashboard Screen: Header dengan warna teal sage (#0D9488), 4 stat cards (Pending, Disetujui, Ditolak, Total), tab filter (Pending/Aktif/Selesai) dengan count badge di setiap tab, list laporan dengan pull-to-refresh.
   b. Review Screen: Detail laporan dengan foto hero, badge status, badge kategori, informasi pelapor, lokasi, deskripsi, dan catatan admin. Bottom action bar dengan tombol Tolak (outline merah) dan Setujui (solid hijau). Reject wajib input alasan via modal. Tombol "Chat Pemilik" untuk komunikasi langsung dengan pelapor.
   c. All Reports Screen: Daftar semua laporan dengan filter status (Semua/Pending/Aktif/Ditolak/Selesai) dan search bar.
   d. Walk-in Report: Form admin untuk membuat laporan atas nama mahasiswa yang lapor ke satpam. Field tambahan: nama pelapor, NIM, fakultas. Laporan langsung approved dengan badge "Via Admin".
   e. Admin Tabs: Bottom tab navigator 5 tab (Dashboard, Laporan, Buat, Pesan, Profil) dengan FAB center button raised untuk akses cepat.

2. Design System Final:
   a. Calm Campus Color Palette: Setelah riset neuropsikologi, primary color diganti dari almost-black (#18181B) menjadi biru (#2563EB) yang terbukti menurunkan detak jantung dan membangun trust. Lost menggunakan orange soft (#F97316) untuk urgensi tanpa panic trigger. Found menggunakan emerald (#059669) untuk relief. Admin menggunakan teal sage (#0D9488). Background menggunakan soft blue (#EFF6FF) untuk mengurangi sensory overload.
   b. Icon Migration: Seluruh emoji diganti dengan MaterialCommunityIcons (laptop, wallet-outline, key, watch, tshirt-crew, book-open-page-variant-outline, dots-horizontal) untuk tampilan profesional.
   c. Radius & Shadow Tokens: Distandarisasi dalam constants.ts (RADIUS: xs 6, sm 8, md 12, lg 16, xl 20, 2xl 24, full 999; SHADOW: subtle, card, elevated dengan shadowColor blue).

3. Build & Deployment:
   a. EAS Build: Konfigurasi eas.json dengan profile preview dan production. Build Android APK via eas build --platform android --profile production.
   b. Code Quality: TypeScript strict mode zero error, ESLint v9 flat config zero warning, expo-doctor 18/18 checks passed.

4. Penerapan OOP dalam Admin:
   a. Polymorphism: RPC function update_report_status menerima parameter status dan berperilaku berbeda — jika 'approved', insert notifikasi template approve; jika 'rejected', insert notifikasi dengan alasan wajib.
   b. Abstraction: Admin screens menggunakan service function (approveReport, rejectReport, createAdminReport) tanpa mengetahui bahwa di belakangnya ada RPC security definer yang mem-bypass RLS.
   c. Inheritance: Profil admin mewarisi struktur User yang sama dengan mahasiswa — menggunakan AuthContext yang sama, NotifContext yang sama. Yang membedakan hanya role='admin' yang mengarahkan ke AdminNavigator.

*Gambar 3: Dashboard Admin & Finalisasi — screenshot Admin Dashboard dengan stat cards dan list pending, Admin Review screen dengan tombol approve/reject, Admin Tabs bottom navigator dengan FAB raised, code snippet RPC update_report_status, screenshot color palette Calm Campus, APK build result.*

Kontribusi Anggota:

| NO | NAMA | NIM | KONTRIBUSI |
| :--- | :--- | :--- | :--- |
| 1 | Irham Zubaidi Alhuda | 241111006 | Membantu penyusunan laporan progress #3, dokumentasi kegiatan, screenshot aplikasi mobile |
| 2 | Galih Witradika | 241111013 | Testing fitur chat realtime, validasi flow notifikasi, dokumentasi bug report |
| 3 | Faiz Abdurrahman | 241111021 | Full-stack development: implementasi auth, feed, detail, create, my posts, profile. Implementasi chat realtime dengan Supabase Realtime subscription. Implementasi admin dashboard, review, reports, walk-in. Perancangan color system Calm Campus. Penulisan 4 trigger database (trg_notify_new_message, trg_update_conversation, trg_set_updated_at, trg_handle_new_user), 2 RPC security definer functions. Setup EAS Build dan deployment APK production. |
| 4 | Ibnul Mubarok | 241111026 | Membantu penyusunan laporan progress, pengujian user flow admin, dokumentasi skenario testing |
| 5 | Imroatu Zakiyah | 241111032 | Validasi data akhir terhadap hasil implementasi. Membantu penyusunan materi presentasi dan dokumentasi final. |
| 6 | Aldo Yulian | 241111037 | Finalisasi design system Calm Campus. Dokumentasi screenshot aplikasi. Pengujian alur navigasi mobile. |

Capaian Kerja: 

1. Implementasi Aplikasi Mobile: 22 screen React Native berhasil diimplementasi menggunakan Expo SDK 54, React Navigation v7, TypeScript strict, dan Supabase backend. Fitur core mahasiswa (auth, feed, detail, create, my posts, profile) selesai 100%.  

2. Fitur Chat Realtime & Notifikasi: In-app chat menggunakan Supabase Realtime (postgres_changes subscription) berhasil diimplementasi. Notifikasi otomatis via trigger database (notify_new_message, update_report_status RPC). NotifContext dengan polling 15 detik untuk badge unread count.  

3. Dashboard Admin: Admin dashboard dengan 4 stat cards, review screen dengan approve/reject, all reports dengan filter, walk-in report, dan bottom tab navigator selesai diimplementasi.  

4. Design System Calm Campus: Berhasil melakukan migrasi warna berbasis riset neuropsikologi — primary dari almost-black ke biru (#2563EB), admin ke teal sage (#0D9488). Standarisasi RADIUS, SHADOW, dan SPACING tokens. Migrasi seluruh emoji ke MaterialCommunityIcons.  

5. Code Quality: TypeScript strict mode — zero error. ESLint v9 flat config — zero warning. expo-doctor — 18/18 checks passed. Total codebase 55+ file TypeScript dengan ~14.900 baris kode.  

6. Build APK Production: Production APK berhasil di-build via EAS Build, siap instalasi di perangkat Android.  

Target Minggu Depan: 

1. Target 1: Dokumentasi Teknis & Video Demo: Menyusun dokumentasi teknis final (README.md, USER_FLOW.md) dan merekam video demo 5 menit yang mencakup seluruh user flow (mahasiswa: auth, feed, create, chat, profile; admin: dashboard, review, walk-in). Video diupload ke YouTube sebagai unlisted.  

2. Target 2: Pembuatan Interactive Presentation: Membangun slide presentasi interaktif berbasis HTML/CSS/JavaScript yang di-deploy ke Vercel. Presentasi mencakup 17 slide dengan animasi, keyboard navigation, dan progress bar untuk mendukung sesi presentasi.  

3. Target 3: Pengumpulan Laporan Final: Finalisasi laporan progress project besar #3 yang mencakup seluruh 3 kegiatan, kontribusi anggota, capaian kerja, dan dokumentasi. Penyerahan seluruh deliverables (laporan PDF, PPT interaktif, link video YouTube, link repository GitHub, APK production).
