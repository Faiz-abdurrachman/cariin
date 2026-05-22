# LAPORAN PROGRESS PROYEK MOBILE PROGRAMMING — UTS

## Aplikasi Cari.In — Campus Lost & Found

[ PLACEHOLDER COVER ]

Tambahkan:
- Logo Kampus
- Logo Aplikasi
- Nama
- NIM
- Kelas
- Mata Kuliah
- Tahun Akademik

# IDENTITAS

Nama : Faiz Abdurrachman  
NIM : [ ISI NIM ]  
Kelas : ADE  
Mata Kuliah : Mobile Programming (INF3105)  
Dosen Pengampu : Yana Hendriana, ST., M.Eng.  
Program Studi : Informatika  
Tahun Akademik : 2025/2026 Genap  

Nama Aplikasi : Cari.In — Campus Lost & Found  

Repository GitHub :  
[ PLACEHOLDER LINK GITHUB ]

Video Presentasi :  
[ PLACEHOLDER LINK YOUTUBE ]

# Analisis Permasalahan

Di lingkungan kampus, kehilangan dan penemuan barang merupakan masalah yang cukup sering terjadi. Barang seperti laptop, dompet, kartu tanda mahasiswa (KTM), kunci kendaraan, hingga dokumen penting sering kali hilang di area kampus.

Saat ini proses penyampaian informasi kehilangan barang masih dilakukan secara manual melalui grup WhatsApp, media sosial, ataupun laporan langsung kepada satpam kampus. Metode tersebut dinilai kurang efektif karena informasi mudah tenggelam oleh percakapan lain sehingga sulit ditemukan kembali ketika dibutuhkan.

Selain itu, belum terdapat sistem terpusat yang mampu membantu mahasiswa dalam melaporkan dan mencari barang hilang secara cepat dan aman. Tidak adanya sistem validasi identitas juga meningkatkan risiko terjadinya klaim palsu terhadap barang yang ditemukan.

Masalah utama yang ditemukan dapat dilihat pada tabel berikut.

| No | Masalah | Dampak |
|---|---|---|
| 1 | Informasi cepat tenggelam di grup WhatsApp | Sulit dicari kembali |
| 2 | Tidak ada sistem pencarian terpusat | Laporan tidak terorganisir |
| 3 | Privasi pengguna kurang aman | Nomor HP tersebar di grup publik |
| 4 | Tidak ada validasi identitas | Risiko klaim palsu |
| 5 | Format laporan tidak konsisten | Informasi sering tidak lengkap |

Pihak yang terdampak dari permasalahan ini antara lain:
- mahasiswa,
- satpam kampus,
- serta staff akademik.

[ PLACEHOLDER HASIL OBSERVASI ]

Tambahkan:
- screenshot grup WhatsApp,
- hasil observasi,
- atau dokumentasi pendukung lainnya.

# Analisis Kebutuhan

Berdasarkan hasil analisis masalah yang telah dilakukan, aplikasi Cari.In dirancang untuk memenuhi kebutuhan pengguna dalam proses pelaporan kehilangan dan penemuan barang secara lebih terstruktur.

## Kebutuhan Fungsional

Fitur utama yang dirancang pada aplikasi meliputi:

| Kode | Fitur | Deskripsi |
|---|---|---|
| F-01 | Login dan Registrasi | Menggunakan email kampus |
| F-02 | Laporan Kehilangan | Membuat laporan barang hilang |
| F-03 | Laporan Penemuan | Membuat laporan barang ditemukan |
| F-04 | Feed Laporan | Menampilkan seluruh laporan |
| F-05 | Detail Laporan | Menampilkan detail barang |
| F-06 | Upload Foto | Upload foto barang |
| F-07 | Chat Real-Time | Komunikasi antar pengguna |
| F-08 | Dashboard Admin | Moderasi laporan |
| F-09 | Notifikasi | Informasi update laporan |
| F-10 | Profile User | Pengelolaan akun pengguna |

## Kebutuhan Non-Fungsional

Selain fitur utama, aplikasi juga memiliki kebutuhan non-fungsional untuk memastikan kualitas sistem.

| Kebutuhan | Penjelasan |
|---|---|
| Performa | Aplikasi berjalan responsif |
| Keamanan | Menggunakan autentikasi dan validasi data |
| Usability | UI mudah digunakan |
| Kompatibilitas | Mendukung Android dan iOS |
| Cloud Storage | Data tersimpan secara online |

# Referensi Desain, Survey, dan Observasi

Sebelum proses implementasi dilakukan, penulis melakukan studi banding terhadap beberapa platform lost and found yang sudah ada sebelumnya.

Beberapa referensi yang digunakan antara lain:
- Lost N Found Telkom University,
- TemuKembali UB,
- dan Lost & Found ITS.

Hasil observasi menunjukkan bahwa sebagian besar sistem masih menggunakan media sosial dan belum memiliki aplikasi mobile khusus.

Selain itu, dilakukan survey sederhana terhadap mahasiswa untuk mengetahui kebutuhan utama pengguna terhadap aplikasi lost and found kampus.

[ PLACEHOLDER HASIL SURVEY ]

Tambahkan:
- screenshot Google Form,
- diagram hasil survey,
- jumlah responden,
- dan kesimpulan survey.

# Timeline Proyek

Pengembangan aplikasi dilakukan secara bertahap mulai dari proses perancangan hingga implementasi.

| Minggu | Aktivitas | Status |
|---|---|---|
| 1–2 | Setup environment dan prototype | Selesai |
| 3 | Setup Expo dan Supabase | Selesai |
| 4 | Implementasi autentikasi | Selesai |
| 5 | Implementasi fitur utama mahasiswa | Selesai |
| 6 | Implementasi chat dan notifikasi | Progress |
| 7 | Dashboard admin | Progress |
| 8 | Polish UI dan testing | Progress |
| 9 | Build APK dan deployment | Progress |

[ PLACEHOLDER GANTT CHART ]

Tambahkan:
- timeline visual,
- progress pengerjaan,
- atau milestone project.

# Wireframe dan User Flow

Sebelum implementasi dilakukan, dibuat wireframe dan blueprint alur aplikasi untuk mempermudah proses development.

Flow utama aplikasi terdiri dari:
- autentikasi pengguna,
- navigasi mahasiswa,
- navigasi admin,
- flow laporan kehilangan,
- serta flow laporan penemuan barang.

[ PLACEHOLDER WIREFRAME ]

[ PLACEHOLDER USER FLOW ]

# Desain Interface

Aplikasi Cari.In menggunakan desain modern dengan tampilan sederhana dan mudah digunakan.

Penggunaan warna dibedakan berdasarkan kategori laporan:
- Merah untuk laporan kehilangan,
- Hijau untuk laporan penemuan,
- Indigo untuk dashboard admin.

Framework styling yang digunakan adalah NativeWind dengan pendekatan utility-first styling.

## Tampilan Splash Screen

[ PLACEHOLDER SCREENSHOT SPLASH SCREEN ]

Keterangan:
Halaman awal aplikasi yang menampilkan identitas aplikasi.

## Tampilan Login

[ PLACEHOLDER SCREENSHOT LOGIN ]

Keterangan:
Halaman autentikasi pengguna menggunakan email kampus dan password.

## Tampilan Register

[ PLACEHOLDER SCREENSHOT REGISTER ]

Keterangan:
Halaman registrasi pengguna baru.

## Tampilan Home

[ PLACEHOLDER SCREENSHOT HOME ]

Keterangan:
Halaman utama yang menampilkan seluruh laporan kehilangan dan penemuan barang.

## Tampilan Detail Laporan

[ PLACEHOLDER SCREENSHOT DETAIL LOST ]

[ PLACEHOLDER SCREENSHOT DETAIL FOUND ]

Keterangan:
Halaman detail informasi barang beserta tombol chat.

## Tampilan Create Report

[ PLACEHOLDER SCREENSHOT CREATE REPORT ]

Keterangan:
Halaman untuk membuat laporan kehilangan dan penemuan barang.

## Tampilan Profile

[ PLACEHOLDER SCREENSHOT PROFILE ]

Keterangan:
Halaman profil pengguna dan pengelolaan akun.

## Tampilan Dashboard Admin

[ PLACEHOLDER SCREENSHOT ADMIN DASHBOARD ]

Keterangan:
Dashboard admin untuk moderasi laporan pengguna.

# Hasil Coding

Aplikasi Cari.In dikembangkan menggunakan React Native dengan bantuan Expo SDK.

Backend aplikasi menggunakan Supabase yang menyediakan:
- authentication,
- database PostgreSQL,
- storage,
- serta realtime subscription.

Teknologi utama yang digunakan:
- React Native
- Expo SDK 54
- TypeScript
- Supabase
- NativeWind
- Zustand
- React Navigation

## Struktur Project

Struktur project dibuat modular agar mempermudah proses development dan maintenance aplikasi.

```plaintext
cariin-mobile/
├── src/
│   ├── screens/
│   ├── navigation/
│   ├── components/
│   ├── services/
│   ├── context/
│   ├── store/
│   └── utils/
├── supabase-schema.sql
├── CONTEXT.md
└── app.json
```

## Implementasi Login dan Registrasi

Fitur login digunakan untuk melakukan autentikasi pengguna menggunakan email kampus UNU Yogyakarta.

```typescript
export const isValidCampusEmail = (email: string): boolean => {
  return email.toLowerCase().endsWith('@student.unu-jogja.ac.id');
};
```

[ PLACEHOLDER SCREENSHOT LOGIN IMPLEMENTATION ]

## Implementasi Upload Foto

Fitur upload foto menggunakan Supabase Storage sebagai media penyimpanan cloud.

```typescript
export async function uploadReportPhoto(picked, userId) {
  const path = `${userId}/${Date.now()}.jpg`;
  await supabase.storage.from('report-photos').upload(path, picked);
}
```

[ PLACEHOLDER SCREENSHOT UPLOAD FOTO ]

## Implementasi Chat Real-Time

Fitur chat memungkinkan komunikasi antara pelapor dan penemu barang tanpa perlu bertukar nomor telepon pribadi.

Realtime communication menggunakan Supabase Realtime Subscription.

[ PLACEHOLDER SCREENSHOT CHAT ]

# Rancangan Database

Database aplikasi menggunakan PostgreSQL melalui Supabase.

Beberapa tabel utama yang digunakan:
- profiles
- reports
- conversations
- messages
- notifications

## Entity Relationship Diagram (ERD)

[ PLACEHOLDER ERD ]

Tambahkan:
- relasi tabel,
- primary key,
- foreign key.

## Relasi Database

Relasi utama pada database aplikasi meliputi:

- Satu user memiliki banyak laporan.
- Satu laporan dapat memiliki banyak percakapan.
- Satu percakapan memiliki banyak pesan.
- Satu user memiliki banyak notifikasi.

## Keamanan Database

Untuk menjaga keamanan data pengguna, aplikasi menggunakan:
- JWT Authentication,
- Row Level Security (RLS),
- dan Supabase Storage Policy.

# Progress Pengembangan

Saat laporan ini dibuat, progress pengembangan aplikasi telah mencapai tahap implementasi core feature mahasiswa.

Fitur yang telah selesai:
- autentikasi,
- home feed,
- detail laporan,
- create report,
- profile,
- upload foto,
- navigasi aplikasi.

Fitur yang masih dalam tahap pengembangan:
- chat realtime,
- notifikasi,
- dashboard admin,
- polish UI,
- build APK production.

# Kesimpulan

Berdasarkan hasil progress pengembangan yang telah dilakukan, aplikasi Cari.In berhasil dirancang sebagai aplikasi mobile lost and found berbasis kampus menggunakan React Native dan Supabase.

Aplikasi ini mampu membantu mahasiswa dalam melaporkan dan mencari barang hilang secara lebih terstruktur, aman, dan mudah digunakan.

Selain itu, fitur chat real-time dan dashboard admin memberikan kemudahan tambahan dalam proses komunikasi dan moderasi laporan.

# Lampiran

## Akun Testing

Admin  
Email : admin@cariin.app  
Password : admin123

Mahasiswa  
Email : faiz@student.unu-jogja.ac.id  
Password : faizfaiz

## Link Penting

Prototype HTML :  
https://cariin-lf.vercel.app/

Supabase Dashboard :  
https://supabase.com/dashboard/project/kytsksnyoyffwbksotps

Repository GitHub :  
[ PLACEHOLDER LINK GITHUB ]

Video Presentasi :  
[ PLACEHOLDER LINK YOUTUBE ]

