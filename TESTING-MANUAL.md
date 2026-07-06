# Manual Testing Flow — Cari.In Mobile

> Checklist E2E lengkap untuk verifikasi semua kondisi sebelum submit / rekam video demo.
> Legend: 🆕 = fitur/perubahan baru (Drawer, SecureStore, offline cache) · ⭐ = critical path (wajib jalan) · ⚠️ = edge case
>
> **Device utama:** Expo Go (iPhone/Android). Jalankan `npx expo start --clear`.

---

## 0. Persiapan

- [ ] `npx expo start --clear` (WAJIB `--clear` — ada perubahan storage engine + babel)
- [ ] Supabase Dashboard: pastikan `supabase-schema.sql` sudah di-run (5 tabel + RLS + trigger `trg_notify_new_message`)
- [ ] Storage buckets aktif: `report-photos`, `avatars` (public)
- [ ] Akun test siap:
  - Admin: `admin@cariin.app` / `admin123`
  - Mahasiswa: `faiz@student.unu-jogja.ac.id` / `faizfaiz`
- [ ] (Opsional) Siapkan HP kedua / akun mahasiswa kedua untuk test chat 2 arah

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
- [ ] Switch ke tab "Ditemukan" di form
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
- [ ] Isi drawer: header (shield + nama admin + "Administrator") + **Beranda**, **Tentang Cari.In**, garis, **Keluar**

### 8.2 Navigasi Drawer 🆕
- [ ] Tap "Tentang Cari.In" → layar info app (Aplikasi, Versi 1.0.0, Package, Kampus, Stack)
- [ ] 🆕 Di layar About, tombol ☰ → buka drawer lagi (bukan dead-end)
- [ ] Tap "Beranda" → balik ke Bottom Tab admin
- [ ] ⭐ Bottom Tab admin (Dashboard/Laporan/Buat/Pesan/Profil) tetap jalan normal di dalam drawer
- [ ] Tap "Keluar" → konfirmasi → logout ke AuthNavigator

---

## 9. ADMIN — DASHBOARD & MODERASI ⭐

### 9.1 Dashboard
- [ ] Stat cards: Pending / Disetujui / Ditolak / Total (angka sesuai data)
- [ ] Tab Pending / Aktif / Selesai → list berubah
- [ ] Bell notif admin berfungsi
- [ ] Tombol "Buat Laporan Admin" → ke form walk-in

### 9.2 Moderasi (AdminReview) ⭐
- [ ] Tap laporan pending → AdminReviewScreen (detail lengkap)
- [ ] ⭐ **Approve** → laporan jadi `approved` → muncul di feed publik mahasiswa
- [ ] ⭐ **Reject** wajib isi alasan → laporan jadi `rejected`
- [ ] ⚠️ Reject tanpa alasan → validasi menolak
- [ ] Cek: mahasiswa pemilik dapat notifikasi approved/rejected (via trigger/RPC)

### 9.3 Walk-in Report ⭐
- [ ] Buat laporan (AdminCreateLost/Found) atas nama pelapor (nama/NIM/fakultas manual)
- [ ] ⭐ Submit → laporan langsung `approved` (created_by_admin=true)
- [ ] Cek di feed: badge "Via Admin" muncul

### 9.4 Semua Laporan (AdminReports)
- [ ] Tab "Laporan" → semua laporan semua status
- [ ] Filter status + search berfungsi

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
6. Moderasi: approve laporan pending → muncul di feed (CRUD update + RPC) [30s]
7. Walk-in report admin (CRUD create) [20s]
8. Kill app → buka → masih login (SecureStore persist) [15s]

---

> Kalau ada langkah yang GAGAL, catat nomornya + screenshot → kasih ke AI buat di-debug.
