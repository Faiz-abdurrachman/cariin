**Laporan Progress Project Besar**

**Pemrograman Berbasis Object**

Judul	: Cari.In Aplikasi Mobile Lost & Found Kampus UNU Yogyakarta

Dokumentasi Kegiatan & Tanggal Kegiatan: 

| No | Foto Kegiatan | Keterangan | Tanggal  |
| :---- | :---- | :---- | :---- |
| 1 | Gambar 1 | Analisis Permasalahan dan Survey Kuesioner | 23 Mei – 3 Juni 2026 |
| 2 | Gambar 2 | Perancangan Database (ERD) & Arsitektur Sistem | 5 – 15 Juni 2026 |
| 3 | Gambar 3 | Perancangan prototype dan MVP | 16 – 24 Juni 2026 |
| 4 | Gambar 4 | Implementasi Aplikasi Mobile & Integrasi Backend | 25 Juni – 5 Juli 2026 |
| 5 | Gambar 5 | Implementasi Fitur Chat Realtime & Notifikasi | 6 – 15 Juli 2026 |
| 6 | Gambar 6 | Implementasi Dashboard Admin & Finalisasi | 16 – 25 Juli 2026 |

Deskripsi Kegiatan:

**1. Kegiatan 1: Analisis Permasalahan, Survey Kuesioner**

Kegiatan ini berfokus pada identifikasi permasalahan nyata yang dialami mahasiswa terkait kehilangan dan penemuan barang di lingkungan kampus UNU Yogyakarta.

1. Identifikasi Masalah: Ditemukan enam masalah utama: informasi kehilangan cepat tenggelam di grup WhatsApp, tidak adanya sistem pencarian terpusat, rawan klaim palsu karena tanpa verifikasi identitas, privasi terancam karena nomor HP tersebar di grup publik, format pelaporan tidak konsisten, serta mahasiswa yang tidak sempat mengunduh aplikasi memerlukan jalur alternatif melalui satpam.  
2. Validasi Data: Kami menyebarkan kuesioner kepada 39 responden mahasiswa UNU Yogyakarta (23–24 Mei 2026). Hasilnya sangat signifikan: 51% responden pernah kehilangan barang (terbanyak: kunci kendaraan, charger, dompet). Sebanyak 28% responden masih mengandalkan grup WhatsApp untuk mencari barang hilang, dan 22% responden masih mengumumkan barang temuan via grup WhatsApp yang berisiko terhadap privasi. Hal terpenting, 82% responden menyatakan nyaman menggunakan email kampus untuk verifikasi akun, yang memvalidasi Unique Value Proposition utama Cari.In.  

*Gambar 1: Analisis Permasalahan dan Survey Kuesioner — screenshot Google Form survey, grafik hasil kuesioner (pie chart 51% pernah kehilangan, bar chart barang paling sering hilang).*

**2. Kegiatan 2: Perancangan Database (ERD) & Arsitektur Sistem**

Kegiatan kedua berfokus pada perancangan arsitektur data dan sistem secara menyeluruh.

1. Perancangan Database (ERD): Mengidentifikasi lima entitas utama: profiles, reports, conversations, messages, dan notifications. Setiap entitas dianalisis hubungan kardinalitasnya (1:1, 1:N). Hasil perancangan divisualisasikan dalam Entity Relationship Diagram (ERD) menggunakan DBML yang mendokumentasikan atribut, tipe data, constraint, index, dan relasi antar tabel.  
2. Arsitektur & Penerapan OOP: Merancang three-layer architecture (Presentation Layer, Service Layer, dan Data Layer menggunakan Supabase). Penerapan 4 pilar OOP menjadi fondasi desain:  
   1. Inheritance: Class User sebagai superclass diwariskan ke subclass Mahasiswa dan Admin.  
   2. Encapsulation: Komponen UI tidak pernah menyentuh database secara langsung; semua operasi dibungkus melalui method service.  
   3. Polymorphism: Method validate() pada model laporan berperilaku berbeda (FoundReport mewajibkan field custody_point/titik penitipan, sedangkan LostReport tidak). Diimplementasi sebagai class LostReport & FoundReport yang meng-override method validate() dari abstract class ReportModel di src/models/Report.ts.  
   4. Abstraction: UI hanya memanggil method deklaratif dari interface service tanpa perlu mengetahui mekanisme query di belakangnya.  
3. Keamanan Data: Dirancang 17 Row Level Security (RLS) policies dan tiga database trigger otomatis.

*Gambar 2: Perancangan Database (ERD) & Arsitektur Sistem — screenshot DBML diagram, ERD visual 5 entitas dengan relasi cardinality, diagram three-layer architecture.*

**3. Kegiatan 3: Perancangan Prototype & MVP**

Kegiatan ketiga berfokus pada perancangan antarmuka visual dan pembuatan prototype interaktif MVP aplikasi Cari.In.

1. Design System: Menggunakan palet warna tiga aksen utama (Orange untuk Lost, Emerald untuk Found, Teal untuk Admin). Tipografi menggunakan font Jakarta Sans dengan standar spacing dan radius yang konsisten. Dirancang 10 komponen UI reusable (PrimaryButton, ReportCard, StatusBadge, dll).  
2. Pembuatan Prototype: Dibangun menggunakan HTML, CSS, dan JavaScript sebanyak 26 screen yang mencakup autentikasi, halaman utama mahasiswa, komunikasi, profil, dan dashboard admin.  
3. Pengujian MVP: Prototype dideploy di Vercel (https://cariin-lf.vercel.app). MVP berfokus pada alur kerja esensial, mulai dari login dengan email kampus, browsing feed, hingga admin melakukan moderasi (Approve/Reject).  

*Gambar 3: Perancangan prototype dan MVP — screenshot prototype HTML (splash screen, home feed, detail laporan, create report, admin dashboard), mockup design system (color palette, typography scale, component library).*

**4. Kegiatan 4: Implementasi Aplikasi Mobile & Integrasi Backend**

Kegiatan keempat berfokus pada implementasi aplikasi mobile menggunakan React Native dan integrasi dengan backend Supabase.

1. Setup Environment: Menginisialisasi project React Native dengan Expo SDK 54, mengonfigurasi TypeScript strict mode, menginstall NativeWind v4 untuk styling, dan menyiapkan Supabase client. Arsitektur project disusun modular: screen, navigation, components, services, context, store, dan utils.  
2. Autentikasi & Navigasi: Mengimplementasikan autentikasi menggunakan Supabase Auth dengan validasi domain email kampus (@student.unu-jogja.ac.id). Navigasi menggunakan React Navigation v7 dengan tiga jenis navigator: Stack Navigator untuk auth flow, Bottom Tab Navigator untuk mahasiswa, dan Drawer Navigator (membungkus Bottom Tab) untuk admin. Sistem role-based routing memisahkan akses mahasiswa dan admin secara otomatis.  
3. Fitur Core Mahasiswa:
   a. Home Feed: Menampilkan laporan publik dengan status approved, dilengkapi filter kategori (8 kategori) dan tipe (Lost/Found), serta search bar dengan debounce 300ms. State management menggunakan Zustand store.
   b. Detail Laporan: Menampilkan foto, badge status, badge kategori, lokasi, deskripsi, dan informasi pelapor. Tombol Chat untuk memulai percakapan dengan pemilik laporan.
   c. Create Report: Form laporan Lost & Found dengan upload foto via Supabase Storage, pemilihan kategori 8 pilihan menggunakan grid icon MaterialCommunityIcons, input lokasi, titik penitipan (Found only), dan deskripsi. Setelah submit, laporan masuk status "Pending" menunggu review admin.
   d. My Posts: Daftar laporan milik user dengan fitur edit, hapus, dan tandai selesai (resolved).
   e. Profile: Menampilkan data user (nama, NIM, email, fakultas) dengan avatar upload via Supabase Storage.
4. Penerapan OOP dalam Implementasi:
   a. Encapsulation: Service layer (auth.service.ts, report.service.ts, upload.service.ts) membungkus seluruh operasi Supabase. Komponen UI tidak pernah memanggil Supabase secara langsung — seluruh akses data melalui service function. Error handling konsisten dengan wrapper throw new Error(error.message) untuk PostgrestError yang bukan instance Error.
   b. Abstraction: Interface TypeScript digunakan untuk type safety: ReportFilter, ReportInput, AdminReportInput, FeedFilter. Komponen UI menggunakan interface props yang didefinisikan secara eksplisit tanpa mengetahui detail implementasi.
   c. Polymorphism: Satu komponen CreateReportScreen menangani dua tipe laporan (Lost & Found) dengan perilaku berbeda — field custodyPoint wajib hanya untuk Found, placeholder text berbeda, dan validasi berbeda. DetailReportScreen juga polymorphic — label CTA berubah ("Info Telah Ditemukan" vs "Chat Penemu") berdasarkan report.type dan status kepemilikan.

*Gambar 4: Implementasi Aplikasi Mobile — screenshot aplikasi React Native di Expo Go (home feed dengan filter, detail laporan, form create report, my posts dengan status badge, profile screen dengan avatar). Screenshot kode (service layer dengan error handling pattern, Zustand store dengan debounce, TypeScript interfaces).*

**5. Kegiatan 5: Implementasi Fitur Chat Realtime & Notifikasi**

Kegiatan kelima berfokus pada implementasi komunikasi realtime antar pengguna dan sistem notifikasi.

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

*Gambar 5: Implementasi Chat & Notifikasi — screenshot ChatRoom dengan bubble kiri/kanan, InboxScreen dengan daftar percakapan, NotificationsScreen dengan badge read/unread, code snippet trigger notify_new_message SQL, diagram alur realtime (User A -> Supabase Realtime -> User B).*

**6. Kegiatan 6: Implementasi Dashboard Admin & Finalisasi**

Kegiatan keenam berfokus pada implementasi dashboard admin untuk moderasi laporan dan finalisasi aplikasi.

1. Admin Dashboard:
   a. Dashboard Screen: Header dengan warna teal sage (#0D9488), 4 stat cards (Pending, Disetujui, Ditolak, Total), tab filter (Pending/Aktif/Selesai) dengan count badge di setiap tab, list laporan dengan pull-to-refresh.
   b. Review Screen: Detail laporan dengan foto hero, badge status, badge kategori, informasi pelapor, lokasi, deskripsi, dan catatan admin. Bottom action bar dengan tombol Tolak (outline merah) dan Setujui (solid hijau). Reject wajib input alasan via modal. Tombol "Chat Pemilik" untuk komunikasi langsung dengan pelapor.
   c. All Reports Screen: Daftar semua laporan dengan filter status (Semua/Pending/Aktif/Ditolak/Selesai) dan search bar.
   d. Walk-in Report: Form admin untuk membuat laporan atas nama mahasiswa yang lapor ke satpam. Field tambahan: nama pelapor, NIM, fakultas. Laporan langsung approved dengan badge "Via Admin".
   e. Admin Navigasi: Drawer Navigator (menu geser kiri: Beranda, Tentang Cari.In, Keluar) yang membungkus Bottom Tab 5 tab (Dashboard, Laporan, Buat, Pesan, Profil) dengan FAB center button raised untuk akses cepat.
2. Design System Final:
   a. Calm Campus Color Palette: Setelah riset neuropsikologi, primary color diganti dari almost-black (#18181B) menjadi biru (#2563EB) yang terbukti menurunkan detak jantung dan membangun trust. Lost menggunakan orange soft (#F97316) untuk urgensi tanpa panic trigger. Found menggunakan emerald (#059669) untuk relief. Admin menggunakan teal sage (#0D9488). Background menggunakan soft blue (#EFF6FF) untuk mengurangi sensory overload.
   b. Icon Migration: Seluruh emoji diganti dengan MaterialCommunityIcons (laptop, wallet-outline, key, watch, tshirt-crew, book-open-page-variant-outline, dots-horizontal) untuk tampilan profesional.
   c. Radius & Shadow Tokens: Distandarisasi dalam constants.ts (RADIUS: xs 6, sm 8, md 12, lg 16, xl 20, 2xl 24, full 999; SHADOW: subtle, card, elevated dengan shadowColor blue).
3. Build & Deployment:
   a. EAS Build: Konfigurasi eas.json dengan profile preview dan production. Build Android APK via eas build --platform android --profile production. Hasil APK 76 MB.
   b. Code Quality: TypeScript strict mode zero error, ESLint v9 flat config zero warning, expo-doctor 18/18 checks passed.
4. Penerapan OOP dalam Admin:
   a. Polymorphism: RPC function update_report_status menerima parameter status dan berperilaku berbeda — jika 'approved', insert notifikasi template approve; jika 'rejected', insert notifikasi dengan alasan wajib.
   b. Abstraction: Admin screens menggunakan service function (approveReport, rejectReport, createAdminReport) tanpa mengetahui bahwa di belakangnya ada RPC security definer yang mem-bypass RLS.
   c. Inheritance: Profil admin mewarisi struktur User yang sama dengan mahasiswa — menggunakan AuthContext yang sama, NotifContext yang sama. Yang membedakan hanya role='admin' yang mengarahkan ke AdminNavigator.

*Gambar 6: Dashboard Admin & Finalisasi — screenshot Admin Dashboard dengan stat cards dan list pending, Admin Review screen dengan tombol approve/reject, Admin Drawer (menu geser) + Bottom Tab dengan FAB raised, code snippet RPC update_report_status, screenshot color palette Calm Campus, APK build result.*

Kontribusi Anggota:

| NO | NAMA | NIM | KONTRIBUSI |
| :--- | :--- | :--- | :--- |
| 1 | Irham Zubaidi Alhuda | 241111006 | Membantu penyusunan laporan progress, dokumentasi kegiatan 4-6, screenshot aplikasi |
| 2 | Galih Witradika | 241111013 | Testing fitur chat realtime, validasi flow notifikasi, dokumentasi bug report |
| 3 | Faiz Abdurrahman | 241111021 | Full-stack development: implementasi auth, feed, detail, create, my posts, profile (FASE 1-4). Implementasi chat realtime dengan Supabase Realtime subscription. Implementasi admin dashboard, review, reports, walk-in. Perancangan color system Calm Campus. Penulisan 17 RLS policies, 4 trigger database (trg_notify_new_message, trg_update_conversation, trg_set_updated_at, trg_handle_new_user), 2 RPC security definer functions. Setup EAS Build dan deployment APK production. |
| 4 | Ibnul Mubarok | 241111026 | Membantu penyusunan laporan progress, pengujian user flow admin, dokumentasi skenario testing |
| 5 | Imroatu Zakiyah | 241111032 | Penyebaran dan pengolahan data kuesioner terhadap 39 responden. Identifikasi 6 permasalahan utama dan validasi data lapangan. Memimpin penyusunan laporan progress, dokumentasi, dan materi presentasi. |
| 6 | Aldo Yulian | 241111037 | Perancangan design system (palet warna, tipografi, spacing). Perancangan 10+ komponen UI reusable. Pembuatan 26 screen prototype interaktif, deployment Vercel, dan pengujian alur navigasi. |

Capaian Kerja: 

1. Hasil survey & analisis masalah: Terhadap 39 responden mahasiswa UNU Yogyakarta, teridentifikasi 6 masalah utama dengan validasi data yang menunjukkan urgensi aplikasi (51% pernah kehilangan barang, 82% setuju penggunaan email kampus).  
2. Design system & komponen UI: Selesai dirancang dengan 10+ reusable components dan palet warna Calm Campus yang konsisten berdasarkan riset neuropsikologi (Blue #2563EB, Teal #0D9488, Orange #F97316, Emerald #059669).  
3. Rancangan ERD 5 Entitas: Selesai dibuat lengkap dengan relasi kardinalitas, 17 RLS policies, 4 database trigger, 2 RPC security definer functions, dan sistem perizinan berlapis.  
4. Prototype HTML 26 Screen Interaktif: Telah dideploy di Vercel (https://cariin-lf.vercel.app) dan diuji secara internal, mencakup seluruh user flow dari proses autentikasi hingga moderasi admin.  
5. Implementasi Aplikasi Mobile: 22 screen React Native berhasil diimplementasi menggunakan Expo SDK 54, React Navigation v7, TypeScript strict, dan Supabase backend. Fitur core mahasiswa (auth, feed, detail, create, my posts, profile) selesai 100%.  
6. Fitur Chat Realtime & Notifikasi: In-app chat menggunakan Supabase Realtime (postgres_changes subscription) berhasil diimplementasi. Notifikasi otomatis via trigger database (notify_new_message, update_report_status RPC). NotifContext dengan polling 15 detik untuk badge unread count.  
7. Dashboard Admin: Admin dashboard dengan 4 stat cards, review screen dengan approve/reject, all reports dengan filter, walk-in report, dan bottom tab navigator selesai diimplementasi.  
8. Code Quality: TypeScript strict mode — zero error. ESLint v9 flat config — zero warning. expo-doctor — 18/18 checks passed.  
9. Build APK: Production APK berhasil di-build via EAS Build (76 MB), siap instalasi di perangkat Android.

Target Minggu Depan: 

1. Target 1: Dokumentasi Teknis & Video Demo: Menyusun dokumentasi teknis final (README.md, CONTEXT.md, USER_FLOW.md) dan merekam video demo 5 menit yang mencakup seluruh user flow (mahasiswa: auth, feed, create, chat, profile; admin: dashboard, review, walk-in). Video diupload ke YouTube sebagai unlisted.  
2. Target 2: Pembuatan Interactive Presentation: Membangun slide presentasi interaktif berbasis HTML/CSS/JavaScript yang di-deploy ke Vercel. Presentasi mencakup 17 slide dengan animasi, keyboard navigation, dan progress bar untuk mendukung sesi presentasi.  
3. Target 3: Pengumpulan Laporan Final: Finalisasi laporan progress project besar yang mencakup seluruh 6 kegiatan, kontribusi anggota, capaian kerja, dan dokumentasi. Penyerahan seluruh deliverables (laporan PDF, PPT interaktif, link video YouTube, link repository GitHub, APK production).  
