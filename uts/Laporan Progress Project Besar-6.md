**Laporan Progress Project Besar #6**

**Pemrograman Berbasis Object**

Judul	: Cari.In Aplikasi Mobile Lost & Found Kampus UNU Yogyakarta
Periode	: 26 Juli – 5 Agustus 2026

Dokumentasi Kegiatan & Tanggal Kegiatan: 

| No | Foto Kegiatan | Keterangan | Tanggal  |
| :---- | :---- | :---- | :---- |
| 1 | Gambar 1 | Admin Dashboard & Stat Cards | 26 – 29 Juli 2026 |
| 2 | Gambar 2 | Admin Review (Approve/Reject) & Chat Pemilik | 30 Juli – 2 Agustus 2026 |
| 3 | Gambar 3 | Admin Reports, Walk-in & Admin Chat | 3 – 5 Agustus 2026 |

Deskripsi Kegiatan:

**1. Kegiatan 1: Admin Dashboard & Stat Cards**

Kegiatan ini berfokus pada implementasi dashboard admin.

1. Dashboard Screen: Mengimplementasikan AdminDashboardScreen dengan header teal (#0D9488), rounded bottom corners (32px), title "Admin Panel" + subtitle "Selamat datang, Admin". Bell icon di kanan atas dengan badge merah notifikasi.

2. Stat Cards: 4 card dalam grid 2x2 — Pending (amber, count), Disetujui (emerald, count), Ditolak (orange, count), Total (teal light, count). Data dari getAdminStats() yang aggregate client-side (pending, approved, rejected, resolved, total).

3. Tab Filter: Segmented control dengan 3 tab — Pending, Aktif, Selesai. Setiap tab menampilkan count badge (pill amber). Tab aktif: white bg + shadow. Tab inactive: transparent. Ganti tab memanggil loadTab() yang fetch reports dengan filter status.

4. List Laporan: FlatList menampilkan PendingCard — thumbnail foto 72px, judul, status dot + label, nama pelapor, waktu relatif. Tap card → AdminReview. Pull-to-refresh.

5. CTA Button: Tombol full-width "Buat Laporan Admin" (teal bg) → navigate ke CreateTab untuk walk-in report.

6. Penerapan OOP — Polymorphism:
   a. Polymorphism: loadTab() menerima parameter TabFilter ('pending' | 'approved' | 'resolved') dan menghasilkan PostgREST query berbeda — { status: 'pending' } vs { status: 'approved' } vs { status: 'resolved' }. PendingCard menampilkan warna dot dan label berbeda berdasarkan report.status.

*Gambar 1: Admin Dashboard — screenshot AdminDashboardScreen (header teal + 4 stat cards), screenshot tab filter (Pending dengan count badge), screenshot PendingCard list, code snippet getAdminStats, code snippet loadTab polymorphic.*

**2. Kegiatan 2: Admin Review (Approve/Reject) & Chat Pemilik**

Kegiatan ini berfokus pada implementasi moderasi laporan.

1. Review Screen: Mengimplementasikan AdminReviewScreen dengan foto hero (260px), back button overlay, badge "MODE REVIEW". Body ScrollView menampilkan badge status (StatusBadge), badge type (Lost/Found), badge kategori, ViaAdminBadge (jika created_by_admin), judul, tanggal, reporter card (avatar inisial + nama + NIM + fakultas), info rows (lokasi, titik penitipan, waktu lapor), deskripsi, dan catatan admin (jika ada).

2. Action Bar — Pending: Bottom bar absolute dengan background semi-transparent. Dua tombol:
   - Tolak: bg #FEF2F2, border #FECACA, text orange (COLORS.lost), Feather x-circle icon. Tap → buka reject modal.
   - Setujui: bg #22C55E (hijau), text putih, Feather check-circle icon, shadow hijau. Tap → Alert konfirmasi → approve.
   - Chat Pemilik: Tombol ketiga di bawah — bg teal (COLORS.admin), Feather message-circle, text putih. Tap → getOrCreateConversation → navigate ChatRoom.

3. Reject Modal: Bottom sheet modal dengan KeyboardAvoidingView. TextInput multiline untuk alasan wajib (placeholder: "Contoh: Foto tidak jelas, informasi tidak lengkap..."). Dua tombol: Batal (text muted) dan Tolak Laporan (bg orange, text putih).

4. Action Bar — Non-Pending: Menampilkan pesan status — "Laporan ini sudah disetujui/ditolak/selesai" (bg #F4F4F5, text muted).

5. RPC Functions: approveReport(id, note?) → supabase.rpc('update_report_status', { p_report_id, p_new_status: 'approved', p_admin_note }). rejectReport(id, note) → supabase.rpc('update_report_status', { p_report_id, p_new_status: 'rejected', p_admin_note }). RPC security definer mengecek is_admin() dulu, lalu UPDATE reports + INSERT notifications.

6. Penerapan OOP — Polymorphism & Abstraction:
   a. Polymorphism: RPC update_report_status berperilaku berbeda berdasarkan p_new_status — 'approved' insert notifikasi template approve, 'rejected' insert notifikasi dengan alasan wajib. AdminReviewScreen ActionBar menampilkan UI berbeda (Tolak/Setujui buttons vs status message) berdasarkan report.status.
   b. Abstraction: Admin screens menggunakan service function (approveReport, rejectReport) tanpa mengetahui RPC security definer di belakangnya.

*Gambar 2: Admin Review — screenshot AdminReviewScreen (foto hero + badges), screenshot action bar pending (Tolak/Setujui/Chat Pemilik), screenshot reject modal dengan TextInput alasan, screenshot code RPC update_report_status.*

**3. Kegiatan 3: Admin Reports, Walk-in & Admin Chat**

1. Admin Reports Screen: Daftar semua laporan dengan filter status chip horizontal (Semua, Pending, Aktif, Ditolak, Selesai). Search bar dengan Feather search icon dan clear button. Tap item → navigate DashboardTab → AdminReview.

2. Admin Walk-in: Form laporan oleh admin (AdminCreateLostScreen, AdminCreateFoundScreen) dengan field tambahan: nama pelapor, NIM, fakultas (input manual). Submit via RPC create_admin_report → status langsung 'approved' + created_by_admin=true.

3. Admin Tabs: Mengganti AdminNavigator dari Drawer ke Bottom Tab 5 tab — Dashboard, Laporan, Buat (FAB raised, teal variant), Pesan (Inbox + ChatRoom), Profil (avatar + Ganti Password + Logout). FAB menggunakan FabButton dengan variant="admin" (teal bg + teal shadow).

4. Admin Chat: Admin bisa chat dengan pelapor dari AdminReview (tombol Chat Pemilik) dan dari tab Pesan (InboxScreen yang sama dengan mahasiswa). Inbox menampilkan conversations di mana admin adalah participant (user_a_id atau user_b_id).

5. Penerapan OOP — Inheritance:
   a. Inheritance: Admin menggunakan AuthContext yang sama dengan mahasiswa — profil, session, role. Yang membedakan hanya role='admin' → AdminNavigator (tab teal). InboxScreen yang sama dipakai admin dan mahasiswa — polymorphic via conversation participants.

*Gambar 3: Admin Reports & Walk-in — screenshot AdminReportsScreen (filter chip + search), screenshot AdminCreateLostScreen (form walk-in dengan field reporter), screenshot Admin Tabs (bottom navigator teal), screenshot Admin Chat dari Review.*

Kontribusi Anggota:

| NO | NAMA | NIM | KONTRIBUSI |
| :--- | :--- | :--- | :--- |
| 1 | Irham Zubaidi Alhuda | 241111006 | Dokumentasi admin dashboard, screenshot, penyusunan laporan #6 |
| 2 | Galih Witradika | 241111013 | Testing flow admin (approve/reject), validasi walk-in report |
| 3 | Faiz Abdurrahman | 241111021 | Implementasi AdminDashboardScreen, AdminReviewScreen, AdminReportsScreen, AdminCreateLostScreen, AdminCreateFoundScreen. Konversi AdminNavigator dari Drawer ke Bottom Tabs. Implementasi tombol Chat Pemilik. RPC functions (update_report_status, create_admin_report). |
| 4 | Ibnul Mubarok | 241111026 | Pengujian admin flow, dokumentasi skenario testing admin |
| 5 | Imroatu Zakiyah | 241111032 | Validasi data moderasi. Penyusunan capaian kerja. |
| 6 | Aldo Yulian | 241111037 | Desain Admin Tabs. Dokumentasi screenshot admin dashboard. |

Capaian Kerja: 

1. Admin Dashboard berfungsi — 4 stat cards, tab filter dengan count badge, list laporan dengan pull-to-refresh, CTA button walk-in.  

2. Admin Review berfungsi — approve/reject dengan RPC, reject wajib alasan via modal, tombol Chat Pemilik. Action bar polymorphic berdasarkan status.  

3. Admin Reports & Walk-in berfungsi — filter status + search, form walk-in dengan field reporter.  

4. Admin Tabs berfungsi — 5 tab bottom navigator (Dashboard, Laporan, Buat, Pesan, Profil) dengan FAB raised teal.  

Target Minggu Depan: 

1. Target 1: Build APK Production & Deployment: Konfigurasi EAS Build, build Android APK production, testing di perangkat fisik.  

2. Target 2: Testing & Bug Fixing: Pengujian end-to-end (user flow mahasiswa + admin), identifikasi dan perbaiki bug, validasi semua screen.  

3. Target 3: Dokumentasi & Presentasi Final: Menyusun dokumentasi teknis final, merekam video demo, membuat interactive presentation.
