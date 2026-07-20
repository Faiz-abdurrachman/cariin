# Manual Testing Flow — Cari.In Mobile

> Checklist E2E lengkap untuk verifikasi semua kondisi sebelum submit / rekam video demo.
> Legend: 🆕 = fitur/perubahan baru (Drawer, SecureStore, offline cache) · ⭐ = critical path (wajib jalan) · ⚠️ = edge case
>
> **Device utama:** Expo Go (iPhone/Android). Untuk lintas jaringan jalankan
> `npx expo start --tunnel --clear`; `@expo/ngrok` sudah terpasang lokal.

### Catatan Eksekusi Aktual — 20 Juli 2026

- Checklist UI/perangkat di bawah **belum dijalankan dan sengaja belum
  dicentang**.
- Project Supabase sudah dipulihkan menjadi `ACTIVE_HEALTHY`; migration fungsi,
  privilege, RLS, trigger, Storage, dan Realtime berhasil diterapkan.
- Smoke test SQL dan client API dengan dua session akun nyata lulus untuk login,
  RPC, RLS, trigger, Storage, dan Realtime. Dua subscription terautentikasi
  menerima pesan baru setelah masa warm-up koneksi.
- RPC admin edit laporan dan menyelesaikan laporan aktif lulus transaksi
  rollback; pemanggilan dengan identitas mahasiswa ditolak.
- Password salah, registrasi domain luar, eskalasi role, pemanggilan RPC admin
  oleh mahasiswa, serta upload ke folder Storage milik akun lain ditolak sesuai
  harapan.
- Request reset password diterima dan log Auth membuktikan email recovery
  dikirim. Klik link email → deep-link aplikasi → simpan password baru tetap
  belum diuji.
- Redirect Auth `cariin://reset-password` sudah tersimpan dan diverifikasi via
  Management API tanpa mengubah Site URL.
- NIM akun utama dipertahankan, dua profil duplikat dinormalisasi menjadi
  `NULL`, dan unique index NIM sudah aktif.
- Semua report, message, notification, dan object Storage yang dibuat smoke test
  sudah dibersihkan; query verifikasi terakhir menghasilkan nol artefak uji.
- Environment ini tidak memiliki perangkat Android/iOS, ADB, atau simulator.
- APK production final-config berhasil dibangun dan diverifikasi statis:
  build `4d5739ec-b37c-4527-b6cf-c1dc48f0bd6b`, package `id.cariin.app`,
  scheme `cariin`, archive valid, dan permission `RECORD_AUDIO` tidak ada.
- Build tersebut dibuat sebelum polish/admin full CRUD terbaru. Rebuild
  production dari source terkini belum dilakukan.
- Dua session Node membuktikan backend multi-client, tetapi **bukan** pengganti
  pengujian UI pada dua perangkat fisik.

---

## 0. Persiapan

- [ ] `npx expo start --tunnel --clear` dan tunggu URL/QR tunnel siap
- [ ] Buka URL tunnel di browser HP bila Expo Go gagal; URL `exp.direct`
  bersifat sementara dan berubah saat restart
- [x] Supabase remote: `supabase-schema.sql` terbaru sudah diterapkan dan
  diverifikasi (5 tabel, 6 RPC aplikasi, 14 policy public, trigger, Realtime, bucket +
  policy Storage)
- [x] Supabase Auth URL Configuration memuat redirect `cariin://reset-password`
- [x] Storage buckets aktif: `report-photos`, `avatars` (public), `chat-media`
  (private/reserved); upload/download/remove dua bucket aktif dan isolasi folder
  antar-user sudah diuji lewat client API
- [ ] Akun test siap:
  - Admin: `admin@cariin.app` / `admin123`
  - Mahasiswa: `faiz@student.unu-jogja.ac.id` / `faizfaiz`
- [ ] (Opsional) Siapkan HP kedua / akun mahasiswa kedua untuk test chat 2 arah

### 0.1 Verifikasi Backend Otomatis/Client API

- [x] Login password dua akun nyata berhasil; password salah ditolak
- [x] `get_my_profile` berhasil dan kolom profil sensitif tidak dapat dibaca
  langsung oleh client
- [x] Mahasiswa tidak dapat menaikkan `profiles.role`
- [x] Mahasiswa tidak dapat mengubah `reports.status` secara langsung
- [x] Mahasiswa tidak dapat memanggil RPC khusus admin
- [x] Admin dapat membuat laporan walk-in melalui `create_admin_report`
- [x] Admin dapat edit dan menyelesaikan laporan melalui RPC khusus; mahasiswa
  ditolak oleh authorization gate
- [x] Upload/download/remove `report-photos` dan `avatars` berhasil pada folder
  sendiri; cross-user upload ditolak
- [x] Dua client terautentikasi menerima event Realtime pesan baru
- [x] Trigger memperbarui `conversations.last_message*` dan membuat notifikasi
  `new_message`
- [x] Request recovery diterima dan email recovery tercatat terkirim
- [x] Signup domain luar ditolak trigger; tidak meninggalkan row `auth.users`
  atau `profiles`
- [x] Cleanup terverifikasi: nol report, message, notification terkait, dan
  object Storage smoke test tersisa

---

## 1. AUTH FLOW ⭐

### 1.1 Splash & Role Selection
- [ ] Buka app → SplashScreen muncul (logo Cari.In, animasi fade-in)
- [ ] Auto lanjut → RoleSelection (2 kartu: Mahasiswa / Admin)
- [ ] Tap kartu "Mahasiswa" → ke Login (aksen biru, badge "Mahasiswa")
- [ ] Back → tap kartu "Admin" → ke Login (aksen indigo, badge "Portal Admin", TANPA link daftar/lupa sandi)

### 1.2 Login — Validasi Error ⚠️
- [ ] Login kosong → tap Masuk → error "Email wajib diisi"
- [ ] Email tanpa `@` → error "Format email tidak valid"
- [ ] Password < 6 char → error "Password minimal 6 karakter"
- [ ] Email/password salah → Alert "Login gagal" (pesan dari Supabase)

### 1.3 Login — Sukses ⭐🆕
- [ ] Login mahasiswa benar → masuk ke feed (Bottom Tab mahasiswa)
- [ ] Login admin benar → masuk ke Drawer admin (Dashboard)
- [ ] 🆕 **Tutup app FULL (kill), buka lagi → masih login** (SecureStore persist JWT)
- [ ] ⚠️ Pertama kali setelah update ini, session lama hilang → harus login ulang (NORMAL)

### 1.4 Register
- [ ] Dari Login mahasiswa → tap "Daftar" → RegisterScreen
- [ ] Isi email NON-kampus (mis. `x@gmail.com`) → error domain kampus
- [ ] NIM bukan angka / < 6 digit → error NIM
- [ ] Data valid + email `@student.unu-jogja.ac.id` → daftar sukses → masuk / diarahkan login
- [ ] ⚠️ Email sudah terdaftar → Alert error dari Supabase

### 1.5 Forgot Password
- [ ] Dari Login → "Lupa sandi?" → ForgotPasswordScreen
- [ ] Email valid → tap kirim → konfirmasi email reset terkirim
- [ ] Tap link email → app terbuka ke ResetPasswordScreen → password baru tersimpan
- [ ] Email kosong/invalid → error

---

## 2. MAHASISWA — FEED (HomeScreen) ⭐

- [ ] Header: greeting sesuai jam (pagi/siang/sore/malam) + nama user
- [ ] Feed menampilkan laporan status approved/resolved (kartu Lost=oranye, Found=hijau)
- [ ] ⭐ **Search**: ketik keyword → list ke-filter (debounce ~300ms)
- [ ] Clear search (tombol X) → list balik penuh
- [ ] Type filter chips: Semua / Hilang / Ditemukan → list berubah
- [ ] Category grid: tap kategori → filter; tap lagi → toggle off
- [ ] ⭐ Pull-to-refresh → data refresh
- [ ] ⚠️ Empty state: filter yang nggak ada hasilnya → "Belum ada laporan"
- [ ] ⚠️ Error state: matiin wifi lalu refresh → "Gagal memuat laporan"
- [ ] Bell icon kanan atas → badge angka kalau ada notif unread → tap → NotificationsScreen
- [ ] 🆕 **Offline cache**: buka feed (ke-cache) → matiin wifi → kill & buka app → feed lama masih tampil

---

## 3. MAHASISWA — DETAIL LAPORAN ⭐

- [ ] Tap kartu Lost → DetailLostScreen (foto, badge status+kategori, lokasi, deskripsi, info pelapor)
- [ ] Tap kartu Found → DetailFoundScreen (+ field "Titik Penitipan")
- [ ] Badge "Via Admin" muncul di laporan yang `created_by_admin`
- [ ] Tombol back berfungsi (title overlay TIDAK nutupin tap back)
- [ ] ⭐ Tombol "Chat" → buka ChatRoom (bikin/lanjut percakapan)
- [ ] ⚠️ Detail laporan sendiri → tombol chat ke diri sendiri tidak muncul / ter-handle

---

## 4. MAHASISWA — BUAT LAPORAN ⭐

### 4.1 Create Lost
- [ ] Tap FAB (+) tengah tab bar → modal CreateLost
- [ ] Upload foto (kamera / galeri) → izin diminta → foto tampil
- [ ] Isi judul, kategori, lokasi, deskripsi
- [ ] ⚠️ Submit tanpa foto/field wajib → validasi menolak
- [ ] ⭐ Submit lengkap → SuccessScreen → laporan masuk status `pending`
- [ ] Tombol tutup modal (X) berfungsi (dismiss ke feed)

### 4.2 Create Found
- [ ] Isi sebagian form Kehilangan → switch ke "Menemukan" → tidak ada transisi
  pindah halaman dan isian bersama tetap tersimpan
- [ ] Aksen berubah orange untuk Kehilangan dan hijau untuk Menemukan
- [ ] ⭐ Field "Titik Penitipan" WAJIB muncul & tervalidasi
- [ ] Submit lengkap → Success → pending

---

## 5. MAHASISWA — LAPORANKU (MyPosts) ⭐

- [ ] Tab "Laporanku" → list SEMUA laporan sendiri (semua status termasuk pending/rejected)
- [ ] Status badge sesuai (Menunggu Review / Aktif / Ditolak / Selesai)
- [ ] Tap laporan → detail
- [ ] ⭐ Edit laporan (yang belum resolved) → EditPostScreen → simpan → data berubah
- [ ] ⭐ Hapus laporan → konfirmasi → hilang dari list
- [ ] ⭐ Tandai Selesai (mark resolved) → status jadi "Selesai"
- [ ] ⚠️ Laporan berstatus "Selesai" → TIDAK bisa edit/hapus lagi (RLS block)

---

## 6. MAHASISWA — CHAT & NOTIFIKASI ⭐

### 6.1 Inbox
- [ ] Tab "Pesan" → InboxScreen → daftar percakapan (last message + waktu)
- [ ] ⚠️ Belum ada chat → empty state

### 6.2 Chat Room (Realtime) ⭐
- [ ] Buka percakapan → riwayat pesan tampil (bubble kiri lawan / kanan sendiri)
- [ ] Kirim pesan → muncul instan di kanan
- [ ] Buka chat sebagai mahasiswa → aksen header/input/bubble sendiri berwarna biru
- [ ] Buka chat sebagai admin → aksen header/input/bubble sendiri berwarna teal/hijau
- [ ] iOS: fokus input → composer tepat di atas keyboard tanpa celah besar atau
  menutupi pesan terakhir
- [ ] ⭐ **Realtime**: dari device/akun kedua kirim pesan → masuk otomatis TANPA refresh
- [ ] Read indicator berubah saat pesan dibaca
- [ ] ⚠️ Keluar & masuk chat lagi → riwayat tetap ada (tidak dobel)
- [ ] ⚠️ Kirim pesan kosong / spasi doang → ter-handle (tidak terkirim)

### 6.3 Notifikasi
- [ ] Lawan kirim pesan → badge bell di Home bertambah (auto-poll 15 detik)
- [ ] NotificationsScreen → list notif (new_message / report_approved / report_rejected)
- [ ] Tap notif → mark as read → badge berkurang
- [ ] "Tandai semua dibaca" → badge jadi 0

---

## 7. MAHASISWA — PROFIL & PENGATURAN

- [ ] Tab "Profil" → data user (nama, NIM, fakultas, email)
- [ ] ⭐ Tap avatar → kamera/galeri → upload → foto berubah (tidak nampil cache lama)
- [ ] Menu Pengaturan (Settings) → ubah nama / password
- [ ] Toggle Notifikasi In-App off → badge/polling berhenti; tutup-buka app → preferensi tetap
- [ ] Menu Bantuan (Help) → FAQ accordion buka-tutup, tombol kontak
- [ ] Buka profil user lain (dari chat/detail) → UserProfileScreen
- [ ] ⭐ Logout → konfirmasi → balik ke AuthNavigator (Splash/Role)

---

## 8. ADMIN — DRAWER NAVIGATOR 🆕⭐

> Ini area PALING BARU. Test teliti.

### 8.1 Buka Drawer
- [ ] Login admin → Dashboard tampil
- [ ] 🆕 Tombol **☰** kiri atas header Dashboard → tap → drawer geser masuk dari kiri
- [ ] 🆕 Swipe dari tepi kiri layar (di Dashboard) → drawer juga kebuka
- [ ] Drawer tertutup → tidak ada blob/dekorasi drawer yang bocor ke sisi kiri
  screen Dashboard, Review, atau tab admin lain
- [ ] Isi drawer: header (shield + nama admin + "Administrator") + **Beranda**, **Tentang Cari.In**, garis, **Keluar**

### 8.2 Navigasi Drawer 🆕
- [ ] Tap "Tentang Cari.In" → layar info app (Aplikasi, Versi 1.0.0, Package, Kampus, Stack)
- [ ] 🆕 Di layar About, tombol ☰ → buka drawer lagi (bukan dead-end)
- [ ] Tap "Beranda" → balik ke Bottom Tab admin
- [ ] ⭐ Bottom Tab admin (Dashboard/Laporan/Buat/Pesan/Profil) tetap jalan normal di dalam drawer
- [ ] Navbar admin memakai liquid bar yang sama dengan mahasiswa, dengan aksen teal
- [ ] Tap "Keluar" → konfirmasi → logout ke AuthNavigator
- [ ] Tab Profil admin → Ganti Password → konfirmasi password → berhasil disimpan

---

## 9. ADMIN — DASHBOARD & MODERASI ⭐

### 9.1 Dashboard
- [ ] Stat cards: Pending / Disetujui / Ditolak / Total (angka sesuai data)
- [ ] Tab Pending / Aktif / Selesai → list berubah
- [x] Header, stat cards, tombol aksi, tab filter, judul section, dan kartu
  laporan tidak saling overlap pada iPhone yang diuji
- [ ] Ulangi pemeriksaan layout dashboard pada Android
- [ ] Bell notif admin berfungsi
- [ ] Tombol "Buat Laporan Admin" → ke form walk-in

### 9.2 Moderasi (AdminReview) ⭐
- [ ] Tap laporan pending → AdminReviewScreen (detail lengkap)
- [ ] Tombol kembali dan hapus tampil bulat tanpa artefak kotak di iOS
- [ ] Ikon Edit → AdminEditReportScreen dan data laporan tersimpan
- [ ] Tombol Hapus → konfirmasi destructive → laporan hilang dari list
- [ ] ⭐ **Approve** → laporan jadi `approved` → muncul di feed publik mahasiswa
- [ ] ⭐ **Reject** wajib isi alasan → laporan jadi `rejected`
- [ ] ⭐ Laporan Aktif → **Selesaikan** → status berubah menjadi `resolved`
- [ ] ⚠️ Reject tanpa alasan → validasi menolak
- [ ] Cek: mahasiswa pemilik dapat notifikasi approved/rejected (via trigger/RPC)

### 9.3 Walk-in Report ⭐
- [ ] Buat laporan (AdminCreateLost/Found) atas nama pelapor (nama/NIM/fakultas manual)
- [ ] Isi sebagian form Kehilangan → switch ke Menemukan → tidak ada transisi
  pindah screen dan seluruh isian bersama tetap tersimpan
- [ ] Switch kembali ke Kehilangan → field Titik Penitipan disembunyikan tanpa
  menghapus draft field lainnya
- [ ] ⭐ Submit → laporan langsung `approved` (created_by_admin=true)
- [ ] Edit laporan walk-in → ubah foto/data barang dan identitas pelapor → data
  detail ikut berubah
- [ ] Selesaikan laporan walk-in → berpindah dari Aktif ke Selesai
- [ ] Cek di feed: badge "Via Admin" muncul

### 9.4 Semua Laporan (AdminReports)
- [ ] Tab "Laporan" → semua laporan semua status
- [ ] Filter status + search berfungsi

### 9.5 Navbar Mahasiswa & Admin
- [ ] Ikon tab menyatu langsung dengan glass bar tanpa tile/kotak individual
- [ ] Tab aktif ditandai warna role + garis kecil, bukan background kotak
- [ ] Tombol `+` tengah berbentuk lingkaran pada mahasiswa dan admin

---

## 10. CROSS-CUTTING / REGRESI 🆕⚠️

- [ ] 🆕 **SecureStore persist**: login → kill app → buka → masih login (native)
- [ ] 🆕 **Web preview** (opsional): `npx expo start --web` → login di browser tetap jalan (fallback AsyncStorage)
- [ ] 🆕 **Offline feed cache**: feed ke-cache → offline → feed lama tampil
- [ ] ⚠️ Switch role: logout admin → login mahasiswa → UI berubah benar (tidak nyangkut UI admin)
- [ ] ⚠️ Session expired / token refresh → app tidak crash, auto-refresh atau minta login
- [ ] ⭐ Navigasi requirement dosen terbukti: **Stack** (auth) + **Tab** (mahasiswa & admin) + **Drawer** (admin) semua kelihatan jalan
- [ ] App tidak crash di seluruh flow (Functionality 40% + Performance 10%)

---

## 11. Ringkasan untuk Video Demo (3-5 menit)

Urutan rekomendasi biar semua requirement kelihatan:
1. Splash → Role → **Login mahasiswa** (JWT auth) [30s]
2. Feed + search + filter + pull refresh (CRUD read + Tab nav) [40s]
3. Buat laporan Lost + upload foto → pending (CRUD create + Storage) [40s]
4. Chat realtime 2 device (Realtime DB) [40s]
5. Logout → **Login admin** → buka **Drawer** (☰) → Tentang → Beranda (Drawer nav) [40s]
6. Moderasi: approve laporan pending → muncul di feed (CRUD update + RPC) [25s]
7. Walk-in admin: switch jenis tanpa pindah screen → create [25s]
8. Admin Edit Data → simpan → Selesaikan laporan aktif [25s]
9. Kill app → buka → masih login (SecureStore persist) [15s]

---

> Kalau ada langkah yang GAGAL, catat nomornya + screenshot → kasih ke AI buat di-debug.
