# User Flow Cari.In — Demo & Video Submission

---

## NARASI PEMBUKA

> "Cari.In adalah aplikasi lost & found untuk mahasiswa UNU Yogyakarta. Mahasiswa login dengan email kampus, melaporkan barang hilang atau temuan, mencari barang di feed, dan berkomunikasi via chat. Admin memoderasi setiap laporan sebelum tayang."

---

# FLOW 1 — MAHASISWA: Lapor Barang Hilang

## Narasi:
> "Faiz adalah mahasiswa yang baru saja kehilangan AirPods di perpustakaan. Ia membuka Cari.In untuk melaporkan."

## Step-by-step:

| Step | Action | Layar | Narasi |
|------|--------|-------|--------|
| 1 | Buka app | **Splash** | "Cari.In — Kampus Lebih Aman" |
| 2 | Auto redirect | **Role Selection** | "Pilih peran: Mahasiswa atau Admin" |
| 3 | Tap **Mahasiswa** | **Login** | "Masuk dengan email kampus" |
| 4 | Isi email: `faiz@student.unu-jogja.ac.id` | Login | "Email kampus sebagai verifikasi identitas" |
| 5 | Isi password: `faiz` | Login | |
| 6 | Tap **Masuk** | **Home Feed** | "Feed menampilkan semua laporan yang sudah disetujui admin" |
| 7 | Tap **+** (FAB tengah) | **Create Lost** | "Form lapor kehilangan — foto wajib, pilih kategori" |
| 8 | Tap foto → **Kamera** | Camera | "Ambil foto barang yang hilang" |
| 9 | Isi **Nama Barang**: "AirPods Pro" | Form | |
| 10 | Tap **Kategori**: Elektronik | Form | "8 kategori tersedia" |
| 11 | Isi **Lokasi**: "Perpustakaan Lt. 2" | Form | |
| 12 | Isi **Deskripsi**: "Casing putih, ada stiker" | Form | "Detail membantu identifikasi" |
| 13 | Tap **Kirim Laporan** | **Success** | "Laporan terkirim! Menunggu review admin." |
| 14 | Tap **Kembali ke Beranda** | Home Feed | "Laporan akan muncul setelah admin menyetujui" |

---

# FLOW 2 — ADMIN: Moderasi Laporan

## Narasi:
> "Admin Cari.In membuka dashboard dan melihat ada laporan baru yang perlu direview."

## Step-by-step:

| Step | Action | Layar | Narasi |
|------|--------|-------|--------|
| 1 | Logout mahasiswa | Profile → Keluar | |
| 2 | Login sebagai admin | **Login** | `admin@cariin.app` / `admin123` |
| 3 | Tap **Masuk Dashboard Admin** | **Admin Dashboard** | "Dashboard admin — indigo header, 4 stat cards" |
| 4 | Lihat tab **Pending (3)** | Dashboard | "3 laporan menunggu review" |
| 5 | Tap laporan **AirPods Pro** | **Admin Review** | "Detail laporan + foto + info pelapor" |
| 6 | Review info: foto, lokasi, pelapor | Review | "Verifikasi kelengkapan data" |
| 7 | Tap **Setujui** | Review | "Laporan disetujui — otomatis tayang di feed" |
| 8 | Konfirmasi **OK** | Alert | "Notifikasi otomatis terkirim ke pelapor" |
| 9 | Kembali ke Dashboard | Dashboard | "Laporan pindah dari Pending ke Aktif" |
| 10 | Tap tab **Aktif** | Dashboard | "Lihat semua laporan yang sudah disetujui" |

---

# FLOW 3 — MAHASISWA: Cek Notifikasi & Chat

## Narasi:
> "Faiz mendapat notifikasi bahwa laporannya disetujui. Ia juga melihat ada pesan dari penemu."

## Step-by-step:

| Step | Action | Layar | Narasi |
|------|--------|-------|--------|
| 1 | Login kembali sebagai faiz | **Home Feed** | "Lihat! Bell icon ada badge merah — ada notifikasi baru" |
| 2 | Tap **🔔 bell** (badge 3) | **Notifications** | "Notifikasi: Laporan Disetujui + 2 Pesan Baru" |
| 3 | Tap notif **"Laporan Disetujui"** | **Detail** | "AirPods Pro sekarang status Aktif — tayang di feed" |
| 4 | Kembali ke Home | Home | |
| 5 | Tap **Tab Pesan** | **Inbox** | "1 percakapan dengan admin" |
| 6 | Tap **admin** | **ChatRoom** | "Chat realtime — admin kirim pesan, langsung muncul" |
| 7 | Ketik: "Terima kasih admin" | ChatRoom | |
| 8 | Tap **Send** | ChatRoom | "Pesan terkirim — notifikasi otomatis ke admin" |
| 9 | Kembali | Inbox | "last_message terupdate realtime" |

---

# FLOW 4 — MAHASISWA: Cari Barang di Feed

## Narasi:
> "Faiz ingin mencari tahu apakah ada yang menemukan kacamata hitam."

## Step-by-step:

| Step | Action | Layar | Narasi |
|------|--------|-------|--------|
| 1 | Di **Home Feed** | Home | |
| 2 | Tap chip **Ditemukan** | Home | "Filter: hanya laporan penemuan" |
| 3 | Scroll ke **Kacamata hitam** | Home | |
| 4 | Tap card | **Detail Found** | "Foto, lokasi, deskripsi, info pelapor" |
| 5 | Tap **Chat Penemu** | **ChatRoom** | "Langsung buka percakapan dengan penemu" |
| 6 | Kirim pesan: "Saya yang punya" | ChatRoom | "Verifikasi kepemilikan via chat" |
| 7 | Kembali | Detail | |

---

# FLOW 5 — MAHASISWA: Kelola Laporanku

## Narasi:
> "Faiz sudah menemukan AirPods-nya. Ia ingin menandai laporan sebagai selesai."

## Step-by-step:

| Step | Action | Layar | Narasi |
|------|--------|-------|--------|
| 1 | Tap **Tab Laporanku** | **My Posts** | "Semua laporan milik Faiz — berbagai status" |
| 2 | Cari **AirPods Pro** | My Posts | "Status: Aktif (disetujui admin)" |
| 3 | Tap **Tandai Selesai** | Action bar | "Barang sudah ditemukan" |
| 4 | Konfirmasi | Alert | "Status berubah jadi Selesai" |
| 5 | Tap **Edit** (opsional) | **Edit Post** | "Bisa edit nama, lokasi, deskripsi" |
| 6 | Tap **Hapus** (opsional) | Alert confirm | "Hapus laporan permanen" |

---

# FLOW 6 — ADMIN: Semua Laporan & Search

## Narasi:
> "Admin ingin mencari semua laporan dengan filter status."

## Step-by-step:

| Step | Action | Layar | Narasi |
|------|--------|-------|--------|
| 1 | Tap **Tab Laporan** | **Semua Laporan** | "List semua laporan dari semua status" |
| 2 | Tap chip **Ditolak** | List filter | "Filter: hanya laporan yang ditolak" |
| 3 | Search: "dompet" | Search bar | "Cari laporan spesifik" |
| 4 | Tap hasil pencarian | **Admin Review** | "Detail laporan + status + catatan admin" |
| 5 | Kembali | Semua Laporan | |

---

# FLOW 7 — ADMIN: Walk-in Report

## Narasi:
> "Seorang mahasiswa datang ke pos satpam melaporkan dompet hilang. Admin mencatat via walk-in."

## Step-by-step:

| Step | Action | Layar | Narasi |
|------|--------|-------|--------|
| 1 | Tap **Tab Buat** (FAB +) | **Create Lost** | "Form walk-in — admin isi data pelapor" |
| 2 | Tap **Tab Kehilangan** | Toggle | "Jenis laporan: Kehilangan" |
| 3 | Isi **Nama Barang**: "Dompet coklat" | Form | |
| 4 | Tap **Kategori**: Dompet/Tas | Grid | |
| 5 | Isi **Lokasi**: "Kantin Pusat" | Form | |
| 6 | Scroll ke **Info Pelapor** | Form | "Walk-in: admin input manual" |
| 7 | Isi Nama: "Budi Santoso" | Form | |
| 8 | Isi NIM: "2023012345" | Form | |
| 9 | Tap **Kirim Laporan** | Success | "Langsung approved — tayang di feed" |
| 10 | Tap **Kembali** | Dashboard | "Laporan muncul di tab Aktif" |

---

# FLOW 8 — PROFILE & AVATAR

## Narasi:
> "Faiz ingin mengganti foto profilnya."

## Step-by-step:

| Step | Action | Layar | Narasi |
|------|--------|-------|--------|
| 1 | Tap **Tab Profil** | **Profile** | "Nama, NIM, email, fakultas" |
| 2 | Tap **avatar** (lingkaran) | ActionSheet | "Pilih sumber foto" |
| 3 | Tap **Ambil Foto** | Camera | "Buka kamera" |
| 4 | Ambil foto | Profile | "Avatar terupdate — upload ke Supabase" |
| 5 | Tap **Pengaturan Akun** | **Settings** | "Edit nama, ganti password, toggle notif" |
| 6 | Tap **Pusat Bantuan** | **Help** | "FAQ + kontak dukungan" |
| 7 | Kembali ke Profile | Profile | |
| 8 | Tap **Keluar** (merah) | Alert | "Konfirmasi logout" |

---

## RINGKASAN DEMO (3-5 Menit)

| Menit | Konten |
|-------|--------|
| 0:00-0:30 | Splash → Role Selection → Login mahasiswa |
| 0:30-1:30 | Home Feed → Filter → Detail → Chat Penemu |
| 1:30-2:30 | Create Laporan (Lost/Found) → Foto → Kategori → Submit |
| 2:30-3:30 | Logout → Login Admin → Dashboard → Approve laporan |
| 3:30-4:30 | Login Mahasiswa → Notifikasi → Inbox → ChatRoom realtime |
| 4:30-5:00 | MyPosts → Tandai Selesai → Profile → Logout |
