# Slide 1 — Judul

## Cari.In
### Aplikasi Lost & Found Kampus Berbasis Mobile

**Mata Kuliah:** Mobile Programming  
**Dosen:** Yana Hendriana  
**Program Studi Informatika — Universitas Nahdlatul Ulama Yogyakarta**  
**2026**

**Disusun oleh:**

- Faiz Abdurrachman — 241111021

> *Cariin barangmu di kampus.*

---

# Slide 2 — Latar Belakang

## Masalah kehilangan barang di kampus

- Informasi barang hilang dan temuan masih tersebar di grup WhatsApp atau pos satpam.
- Pesan cepat tenggelam dan sulit dicari kembali.
- Format laporan tidak seragam sehingga pencocokan barang menjadi sulit.
- Klaim barang belum memiliki alur verifikasi yang jelas.
- Nomor HP pribadi berisiko terekspos di grup publik.

**Kebutuhan:** satu tempat untuk melapor, mencari, memverifikasi, dan berkomunikasi.

---

# Slide 3 — Validasi Masalah

## Hasil survei 39 mahasiswa UNU Yogyakarta

| Temuan | Hasil |
|---|---:|
| Pernah kehilangan barang di kampus | **51%** |
| Pernah menemukan barang milik orang lain | **41%** |
| Mencari melalui satpam kampus | **67%** |
| Mencari melalui grup WhatsApp | **28%** |
| Menyerahkan barang temuan ke satpam | **67%** |
| Nyaman memakai email kampus untuk verifikasi | **82%** |

Barang yang sering hilang: kunci kendaraan, charger, dompet, earphone, dan botol minum.

---

# Slide 4 — Solusi

## Cari.In sebagai platform terpusat

Cari.In menghubungkan mahasiswa, penemu barang, dan admin kampus dalam satu aplikasi mobile.

| Masalah | Solusi di Cari.In |
|---|---|
| Informasi tercecer | Feed laporan yang terstruktur |
| Sulit mencari laporan | Search dan filter kategori |
| Klaim palsu | Akun email kampus + moderasi admin |
| Privasi nomor HP | Chat langsung di dalam aplikasi |
| Laporan tidak seragam | Form khusus Lost dan Found |
| Tidak sempat memakai aplikasi | Admin dapat membuat laporan walk-in |

---

# Slide 5 — Alur Utama Aplikasi

## Dari laporan sampai barang ditemukan

```text
Daftar / Login
      ↓
Buat laporan Lost atau Found
      ↓
Status: Pending
      ↓
Admin melakukan review
      ↓
Approve / Reject + notifikasi
      ↓
Laporan tampil di feed publik
      ↓
Pengguna berkomunikasi lewat chat
      ↓
Laporan ditandai selesai
```

Admin juga dapat membuat laporan langsung untuk kasus walk-in di pos kampus.

---

# Slide 6 — Fitur Mahasiswa

## Fitur yang tersedia

- Registrasi dan login dengan email kampus `@student.unu-jogja.ac.id`.
- Feed laporan dengan search, filter tipe, dan filter kategori.
- Detail laporan: foto, lokasi, deskripsi, dan informasi pelapor.
- Buat laporan **Hilang** atau **Temuan** dengan unggah foto.
- Kelola laporan sendiri: edit, hapus, dan tandai selesai.
- Chat realtime tanpa membagikan nomor HP.
- Notifikasi in-app, profil, pengaturan, dan FAQ bantuan.

---

# Slide 7 — Fitur Admin

## Moderasi laporan kampus

- Dashboard statistik: pending, disetujui, ditolak, dan total laporan.
- Review laporan dengan aksi **Approve** atau **Reject**.
- Alasan penolakan disimpan sebagai catatan admin.
- Daftar semua laporan dengan filter status dan pencarian.
- Walk-in report untuk membuat laporan atas nama mahasiswa.
- Notifikasi otomatis dikirim setelah laporan direview.

---

# Slide 8 — Teknologi

## Technology stack

| Bagian | Teknologi |
|---|---|
| Framework | React Native 0.81.5 + Expo SDK 54 |
| Bahasa | TypeScript 5.9, strict mode |
| Navigasi | React Navigation v7: Stack, Tab, Drawer |
| State | Context API + Zustand v5 |
| Backend | Supabase Auth, PostgreSQL, Storage, Realtime |
| Styling | React Native styles, design tokens, NativeWind selektif |
| Build | EAS Build |

Satu codebase ditujukan untuk Android dan iOS.

---

# Slide 9 — Arsitektur Sistem

## Three-layer architecture

```text
Presentation Layer
Screens, navigators, dan reusable components
                ↓
Domain / Service Layer
auth, profile, report, upload, chat, notification service
                ↓
Data Layer
Supabase Auth, PostgreSQL, Storage, Realtime
```

Pemisahan ini membuat screen fokus pada tampilan dan interaksi, sedangkan akses data ditangani oleh service layer.

**Penerapan OOP:**

- `User` → `Mahasiswa` dan `Admin`
- `ReportModel` → `LostReport` dan `FoundReport`
- Abstract class, inheritance, encapsulation, polymorphism, dan factory pattern

---

# Slide 10 — Database & Keamanan

## Data terhubung, akses tetap dibatasi

```text
profiles 1—N reports 1—N conversations 1—N messages
    └──────────────────── 1—N notifications
```

- Lima tabel utama: `profiles`, `reports`, `conversations`, `messages`, `notifications`.
- Row Level Security diterapkan pada seluruh tabel.
- Mahasiswa hanya mengakses data sesuai kepemilikan dan status laporan.
- Operasi sensitif seperti approve/reject menggunakan RPC `SECURITY DEFINER`.
- Role admin ditentukan dari jalur server, bukan input bebas dari client.

---

# Slide 11 — Hasil Implementasi & Pengujian

## Status pengembangan per 19 Juli 2026

### Sudah diverifikasi

- Modul auth, feed, create report, chat, notifikasi in-app, admin, dan profil tersedia.
- **29** screen TSX dan **14** komponen reusable sudah dibuat.
- TypeScript: **0 error**
- ESLint: **0 error, 0 warning**
- Expo Doctor: **18/18 checks passed**

### Belum selesai diverifikasi

- Pengujian fungsional manual end-to-end.
- Pengujian chat menggunakan dua akun/perangkat.
- Build dan smoke test APK Android melalui EAS.

---

# Slide 12 — Kelebihan & Keterbatasan

## Evaluasi singkat

### Kelebihan

- Laporan lebih terstruktur daripada grup chat.
- Identitas dibatasi dengan domain email kampus.
- Komunikasi tidak memerlukan nomor HP.
- Moderasi admin menjaga laporan yang tampil di feed.
- React Native + Expo mendukung satu codebase untuk dua platform.

### Keterbatasan

- Notifikasi masih in-app, belum push notification native.
- Belum ada dark mode dan multi-bahasa.
- Chat masih berbasis teks, belum mendukung media.
- Belum ada automated testing.
- APK final belum memiliki artifact/link yang terverifikasi.

---

# Slide 13 — Kesimpulan & Pengembangan Lanjutan

## Kesimpulan

Cari.In berhasil membangun dasar platform Lost & Found kampus yang terpusat, dengan fitur pelaporan, pencarian, chat, notifikasi, dan moderasi admin.

Validasi email kampus, RLS, dan chat in-app dirancang untuk meningkatkan kepercayaan sekaligus menjaga privasi pengguna.

## Langkah berikutnya

1. Menyelesaikan checklist pengujian manual.
2. Build dan uji APK Android pada perangkat fisik.
3. Menambahkan push notification native.
4. Menambahkan upload media di chat dan pengujian otomatis.

---

# Slide 14 — Penutup

## Terima kasih

### Cari.In
### *Cariin barangmu di kampus.*

**Repository:** `https://github.com/Faiz-abdurrachman/cariin`

**Pertanyaan?**
