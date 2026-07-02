**Laporan Progress Project Besar #4**

**Pemrograman Berbasis Object**

Judul	: Cari.In Aplikasi Mobile Lost & Found Kampus UNU Yogyakarta
Periode	: 6 – 15 Juli 2026

Dokumentasi Kegiatan & Tanggal Kegiatan: 

| No | Foto Kegiatan | Keterangan | Tanggal  |
| :---- | :---- | :---- | :---- |
| 1 | Gambar 1 | Implementasi Create Report (Lost/Found) & Upload Foto | 6 – 9 Juli 2026 |
| 2 | Gambar 2 | Implementasi My Posts, Edit & Profile Mahasiswa | 10 – 12 Juli 2026 |
| 3 | Gambar 3 | Design System Calm Campus & Migrasi Warna | 13 – 15 Juli 2026 |

Deskripsi Kegiatan:

**1. Kegiatan 1: Implementasi Create Report (Lost/Found) & Upload Foto**

Kegiatan ini berfokus pada implementasi form pelaporan kehilangan dan penemuan barang.

1. Create Report Form: Mengimplementasikan CreateReportScreen sebagai shared component untuk CreateLost dan CreateFound. Form ditampilkan dalam modal (presentation='modal' di RootStack) yang diakses melalui FAB center button (+) di bottom tab. Menampilkan type toggle (Kehilangan/Menemukan) dengan animasi switch, foto upload picker (dashed border, icon image, tap untuk kamera/galeri), input nama barang, kategori grid 8 pilihan dengan MaterialCommunityIcons, input lokasi, titik penitipan (wajib untuk Found), dan deskripsi detail.

2. Upload Foto: Mengimplementasikan upload.service.ts dengan fungsi takePhoto (expo-image-picker kamera), pickImageFromLibrary (galeri), dan uploadReportPhoto (base64 → Uint8Array → Supabase Storage bucket report-photos). Foto disimpan dengan path {userId}/{timestamp}.jpg. Diterapkan validasi foto wajib untuk mahasiswa (opsional untuk admin walk-in).

3. Form Validation & Submit: Validasi client-side — nama barang wajib, kategori wajib, lokasi wajib, foto wajib (mahasiswa), titik penitipan wajib (Found). Setelah submit, createReport() insert ke tabel reports dengan status default 'pending'. Auto-refresh feedStore setelah submit. Navigasi ke SuccessScreen.

4. Success Screen: Menampilkan konfirmasi hijau dengan icon checkmark, pesan "Laporan Terkirim! Menunggu review admin.", dan dua tombol: "Kembali ke Beranda" (dismiss modal) dan "Lihat Laporanku" (navigasi ke MyPostsTab).

5. Penerapan OOP — Polymorphism:
   a. Polymorphism: CreateReportScreen menangani dua tipe laporan dengan perilaku berbeda — Lost tidak memerlukan custody_point, Found mewajibkan field custody_point. Placeholder text berbeda ("Tempat terakhir terlihat..." vs "Tempat ditemukan..."). Deskripsi placeholder berbeda ("Ciri-ciri khusus, isi dompet..." vs "Kondisi barang, ciri khas..."). Toggle switch menggunakan nav.replace() untuk beralih antara CreateLost dan CreateFound.

*Gambar 1: Create Report — screenshot form CreateLost dengan foto terupload, screenshot form CreateFound dengan field custody_point, screenshot kategori grid 8 pilihan dengan MaterialCommunityIcons, screenshot SuccessScreen dengan checkmark hijau, code snippet upload.service.ts (base64 → Uint8Array), code snippet CreateReportScreen polymorphic validation.*

**2. Kegiatan 2: Implementasi My Posts, Edit & Profile Mahasiswa**

Kegiatan ini berfokus pada implementasi pengelolaan laporan milik user dan profil.

1. My Posts: Mengimplementasikan MyPostsScreen dengan FlatList menampilkan semua laporan milik user (semua status: pending, approved, rejected, resolved). Setiap item menampilkan thumbnail foto, badge status (StatusBadge), judul, tipe, dan waktu. Action bar per item — tombol Edit (hanya jika bukan resolved), Hapus (konfirmasi Alert), dan Tandai Selesai (hanya jika approved, ubah status ke resolved dengan resolved_at timestamp). Data di-reload via useFocusEffect setiap screen fokus.

2. Edit Post: Mengimplementasikan EditPostScreen dengan form pre-filled dari data report. Field yang bisa diedit: nama barang, lokasi, titik penitipan (Found), deskripsi. Foto hanya read-only — tidak bisa diganti di MVP. Submit memanggil updateReport() dengan partial patch (hanya field yang berubah). Setelah sukses, auto-goBack dan MyPostsScreen reload.

3. Profile Screen: Mengimplementasikan ProfileScreen dengan ScrollView menampilkan:
   - Avatar 96px (bulat, border putih, shadow) — tap untuk upload via kamera/galeri → uploadAvatar() ke bucket avatars → refreshProfile()
   - Nama user (bold, 20px), NIM + email, badge fakultas
   - Menu cards: Pengaturan Akun (navigate ke SettingsScreen), Pusat Bantuan (navigate ke HelpScreen), Tentang Aplikasi (Alert)
   - Tombol Logout (merah) dengan Alert konfirmasi

4. Settings & Help: Mengimplementasikan SettingsScreen (edit nama, ganti password via supabase.auth.updateUser, toggle notifikasi) dan HelpScreen (FAQ accordion 5 item, kontak dukungan email, versi aplikasi).

5. Penerapan OOP — Encapsulation:
   a. Encapsulation: Service layer membungkus operasi update — updateReport() hanya menerima id dan partial patch, memvalidasi kepemilikan via RLS di database. markAsResolved() membungkus update status ke 'resolved' dengan resolved_at timestamp. uploadAvatar() membungkus proses pick → convert → upload → getPublicUrl dalam satu fungsi.
   b. Inheritance: ProfileScreen dan SettingsScreen menggunakan AuthContext yang sama — userProfile di-share ke seluruh komponen. update profil via supabase.from('profiles').update() dan refreshProfile() di AuthContext memastikan data konsisten di seluruh app.

*Gambar 2: My Posts & Profile — screenshot MyPostsScreen dengan action bar (Edit/Hapus/Selesai), screenshot EditPostScreen dengan form pre-filled, screenshot ProfileScreen dengan avatar dan menu cards, screenshot SettingsScreen, screenshot HelpScreen FAQ accordion, code snippet markAsResolved, code snippet uploadAvatar.*

**3. Kegiatan 3: Design System Calm Campus & Migrasi Warna**

Kegiatan ini berfokus pada perancangan ulang design system berdasarkan riset psikologi warna.

1. Riset Neuropsikologi Warna: Melakukan studi literatur tentang dampak warna pada kondisi psikologis pengguna yang cemas/panik (kehilangan barang). Temuan:
   - Biru menurunkan detak jantung & tekanan darah, mengaktifkan respons parasimpatis (calming)
   - Hijau memulihkan atensi (Attention Restoration Theory), menurunkan kortisol
   - Merah pure memicu lonjakan adrenalin & panic trigger — harus diganti
   - Hitam pure dikaitkan dengan depresi & isolasi — harus diganti slate gelap

2. Calm Campus Color Palette:
   - Primary: #18181B (almost-black) → #2563EB (blue-600) — trust, calm, keamanan
   - Lost: #EF4444 (red-500) → #F97316 (orange-500) — urgensi tanpa panic trigger
   - Found: #22C55E → #059669 (emerald-600) — relief, healing
   - Admin: #4F46E5 (indigo) → #0D9488 (teal-600) — profesional, authority
   - Background: #F4F4F5 → #EFF6FF (blue-50) — cegah sensory overload
   - Surface: #FFFFFF (tetap) — kontras card
   - Border: #E4E4E7 → #BFDBFE (blue-200) — subtle separation
   - TextMuted: #71717A → #64748B (slate-500) — lebih readable

3. Design Tokens Standardisasi: Menambahkan RADIUS tokens (xs:6, sm:8, md:12, lg:16, xl:20, 2xl:24, full:999), SPACING tokens (xs:4, sm:8, md:12, lg:16, xl:20, 2xl:24, 3xl:32), FONT_SIZE tokens (xs:9, sm:11, base:13, md:15, lg:18, xl:20, 2xl:24, 3xl:28), SHADOW tokens (subtle, card, elevated — semuanya dengan shadowColor blue untuk trust halo effect).

4. Icon Migration: Mengganti seluruh emoji di kategori dengan MaterialCommunityIcons — elektronik (laptop), dokumen (file-document-outline), dompet/tas (wallet-outline), kunci (key), aksesoris (watch), pakaian (tshirt-crew), buku/ATK (book-open-page-variant-outline), lainnya (dots-horizontal).

5. Komponen Terdampak: PrimaryButton (blue bg + blue glow shadow), StatusBadge (rejected orange #FFF7ED bukan red #FEE2E2), ReportCard (blue shadow + border slate), FabButton (blue bg + blue shadow), EmptyState (bg primaryLight #DBEAFE), CategoryGrid (MaterialCommunityIcons + blue chip active), SplashScreen (blue bg + white text fade-in animation), StatusBar (dark mode).

6. Penerapan OOP — Abstraction:
   a. Abstraction: Design tokens dienkapsulasi dalam constants.ts — COLORS, RADIUS, SPACING, FONT_SIZE, SHADOW sebagai single source of truth. Komponen UI mengimpor tokens tanpa hardcode nilai. Perubahan satu nilai di constants.ts langsung menyebar ke seluruh aplikasi.

*Gambar 3: Design System — screenshot color palette Calm Campus (swatches biru, teal, orange, emerald), screenshot perbandingan before/after (zinc-950 → blue-600 di tombol, red-500 → orange-500 di badge lost), screenshot CategoryGrid dengan MaterialCommunityIcons, screenshot SplashScreen blue, code snippet constants.ts dengan design tokens.*

Kontribusi Anggota:

| NO | NAMA | NIM | KONTRIBUSI |
| :--- | :--- | :--- | :--- |
| 1 | Irham Zubaidi Alhuda | 241111006 | Membantu dokumentasi form create report, screenshot aplikasi, penyusunan laporan progress #4 |
| 2 | Galih Witradika | 241111013 | Testing flow create report (Lost & Found), validasi form, testing upload foto |
| 3 | Faiz Abdurrahman | 241111021 | Implementasi CreateReportScreen (form Lost/Found, upload foto, validasi, success screen). Implementasi MyPostsScreen, EditPostScreen, ProfileScreen, SettingsScreen, HelpScreen. Riset neuropsikologi warna & perancangan color palette Calm Campus. Standarisasi design tokens (RADIUS, SPACING, FONT_SIZE, SHADOW). Migrasi emoji → MaterialCommunityIcons. Update 15+ komponen UI dengan warna baru. |
| 4 | Ibnul Mubarok | 241111026 | Membantu penyusunan laporan, pengujian MyPosts flow (edit, hapus, tandai selesai) |
| 5 | Imroatu Zakiyah | 241111032 | Validasi design system terhadap hasil riset warna. Membantu penyusunan capaian kerja. |
| 6 | Aldo Yulian | 241111037 | Finalisasi color palette visual. Dokumentasi perbandingan before/after design. Screenshot komponen UI. |

Capaian Kerja: 

1. Create Report berfungsi — form Lost/Found dengan upload foto via Supabase Storage, kategori grid 8 pilihan dengan MaterialCommunityIcons, validasi field lengkap, success screen. Type toggle dengan switch animasi.  

2. My Posts berfungsi — daftar laporan milik user dengan action bar (Edit/Hapus/Tandai Selesai). Edit dengan form pre-filled. Hapus dengan Alert konfirmasi. Tandai Selesai update status ke resolved.  

3. Profile berfungsi — avatar upload via kamera/galeri → uploadAvatar → refreshProfile. Menu Settings (edit nama, ganti password), Help (FAQ accordion 5 item), dan Logout.  

4. Color palette Calm Campus diterapkan — primary #2563EB (blue), lost #F97316 (orange soft), found #059669 (emerald), admin #0D9488 (teal). Berbasis riset neuropsikologi.  

5. Design tokens distandarisasi — RADIUS (7 nilai), SPACING (7 nilai), FONT_SIZE (8 nilai), SHADOW (3 tier). Semua dalam constants.ts sebagai single source of truth.  

6. Emoji berhasil dimigrasi ke MaterialCommunityIcons di seluruh aplikasi (CategoryGrid, CreateReportScreen, Admin create forms, HomeScreen greeting).  

Target Minggu Depan: 

1. Target 1: Implementasi Chat Realtime — Service Layer & Store: Mengimplementasikan chat.service.ts (listConversations, getOrCreateConversation, sendMessage, subscribeToMessages, markMessagesAsRead) dan chatStore Zustand (messages per conversation, active channel, realtime subscribe/unsubscribe).  

2. Target 2: Implementasi Chat Realtime — UI: Mengimplementasikan InboxScreen (daftar percakapan terurut last_at), ChatRoomScreen (FlatList inverted + input bar + KeyboardAvoidingView + realtime subscription), dan ChatBubble component (bubble kiri/kanan + timestamp + read indicator).  

3. Target 3: Implementasi Sistem Notifikasi: Mengimplementasikan notification.service.ts, NotifContext (unread count + polling 15 detik), NotificationsScreen (list notifikasi + icon per type + tap navigasi), trigger database notify_new_message, dan badge bell di HomeScreen.
