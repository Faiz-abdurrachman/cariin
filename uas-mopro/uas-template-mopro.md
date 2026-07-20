# LAPORAN FINAL PROJECT

# Cari.In: Aplikasi Lost & Found Kampus Berbasis Mobile

## Mata Kuliah

**Mobile Programming**

## Dosen Pengampu

**Yana Hendriana**

## Disusun oleh

**Faiz Abdurrachman**
(241111021)

---

**PROGRAM STUDI INFORMATIKA**
**FAKULTAS TEKNOLOGI INFORMASI**
**UNIVERSITAS NAHDLATUL ULAMA YOGYAKARTA**
**2026**

---

# RINGKASAN EKSEKUTIF

Kehilangan barang di lingkungan kampus adalah masalah yang hampir setiap mahasiswa pernah alami. Mulai dari kunci kendaraan yang tertinggal di parkiran, charger yang ketinggalan di ruang kelas, sampai dompet yang jatuh di selasar kampus. Sayangnya, selama ini penanganan barang hilang dan temuan di UNU Yogyakarta masih dilakukan secara manual. Mahasiswa yang kehilangan barang biasanya bertanya ke satpam atau menyebar informasi di grup WhatsApp angkatan. Cara-cara ini punya banyak kelemahan: informasi cepat terkubur oleh obrolan lain, tidak ada sistem pencarian yang terstruktur, tidak ada verifikasi identitas sehingga rawan klaim palsu, dan nomor HP pribadi jadi terekspos di grup publik.

Berdasarkan survei yang dilakukan terhadap 39 mahasiswa UNU Yogyakarta, ditemukan bahwa 51% responden pernah kehilangan barang di kampus. Barang yang paling sering hilang adalah kunci kendaraan, charger HP, dompet, earphone, dan botol minum. Dari mereka yang kehilangan, 67% mengandalkan satpam kampus untuk mencari, sementara 28% mencari lewat grup WhatsApp. Yang lebih memprihatinkan, 82% responden menyatakan nyaman menggunakan email kampus untuk verifikasi akun — artinya mahasiswa sebenarnya sudah siap dengan sistem digital, tapi belum ada platform yang mewadahi.

Dari sinilah Cari.In lahir. Cari.In adalah aplikasi mobile Lost & Found yang dibangun khusus untuk mahasiswa UNU Yogyakarta. Aplikasi ini menyediakan platform terpusat di mana mahasiswa bisa melaporkan barang hilang atau temuan, mencari barang di feed publik yang sudah terfilter, dan berkomunikasi dengan pelapor atau penemu melalui fitur chat in-app — semuanya tanpa harus bertukar nomor HP pribadi.

Dari sisi teknis, aplikasi dikembangkan menggunakan React Native 0.81.5 dengan Expo SDK 54, TypeScript 5.9 strict mode untuk keamanan tipe data, style React Native dengan design tokens serta penggunaan NativeWind secara selektif, dan React Navigation v7 yang mendukung tiga jenis navigasi sekaligus (Stack, Bottom Tab, dan Drawer). Untuk backend, digunakan Supabase yang menyediakan autentikasi, database PostgreSQL dengan Row Level Security, penyimpanan file, dan fitur realtime untuk chat.

Pemeriksaan statis terakhir pada 20 Juli 2026 menghasilkan 0 error TypeScript, 0 error maupun warning ESLint, serta 18/18 pemeriksaan Expo Doctor lulus tanpa issue. Source aplikasi mencakup 30 file screen TSX, termasuk screen autentikasi, mahasiswa, admin, dan wrapper untuk fitur bersama. EAS Build production dari konfigurasi final berhasil menghasilkan APK valid berukuran 80.572.407 byte (76,84 MiB); manifest APK tidak memuat permission `RECORD_AUDIO`. APK tersebut belum diinstal di perangkat fisik. Project Supabase berhasil dipulihkan menjadi `ACTIVE_HEALTHY`; migration fungsi, privilege, RLS, trigger, Storage, dan Realtime berhasil. Smoke test SQL serta client API dengan dua session akun nyata membuktikan Auth, RPC, RLS, Storage, Realtime, dan trigger berjalan, termasuk penolakan akses lintas-user. Redirect Auth sudah tersimpan dan request recovery tercatat mengirim email, tetapi penyelesaian reset lewat deep-link belum diuji. Duplikasi NIM juga sudah dinormalisasi dan unique index NIM aktif; pengujian UI dua perangkat masih terbuka.

---

# DAFTAR ISI

- Ringkasan Eksekutif
- Daftar Isi
- Daftar Tabel
- Daftar Gambar
- Daftar Lampiran
- BAB I Pendahuluan
---

**PROGRAM STUDI INFORMATIKA**
**FAKULTAS TEKNOLOGI INFORMASI**
**UNIVERSITAS NAHDLATUL ULAMA YOGYAKARTA**
**2026**

---

# RINGKASAN EKSEKUTIF

Kehilangan barang di lingkungan kampus adalah masalah yang hampir setiap mahasiswa pernah alami. Mulai dari kunci kendaraan yang tertinggal di parkiran, charger yang ketinggalan di ruang kelas, sampai dompet yang jatuh di selasar kampus. Sayangnya, selama ini penanganan barang hilang dan temuan di UNU Yogyakarta masih dilakukan secara manual. Mahasiswa yang kehilangan barang biasanya bertanya ke satpam atau menyebar informasi di grup WhatsApp angkatan. Cara-cara ini punya banyak kelemahan: informasi cepat terkubur oleh obrolan lain, tidak ada sistem pencarian yang terstruktur, tidak ada verifikasi identitas sehingga rawan klaim palsu, dan nomor HP pribadi jadi terekspos di grup publik.


- BAB II Tinjauan Pustaka
- BAB III Metode Perancangan
- BAB IV Hasil dan Pembahasan
- BAB V Kesimpulan dan Saran
- Daftar Pustaka
- Lampiran

---

# DAFTAR TABEL

| No | Nama Tabel | Halaman |
|----|-----------|---------|
| 1 | Data Survei Mahasiswa UNU Yogyakarta | — |
| 2 | Perbandingan Framework Mobile | — |
| 3 | Perbandingan Backend: Supabase vs Firebase | — |
| 4 | Tahapan Pengembangan per Fase | — |
| 5 | Kebutuhan Fungsional | — |
| 6 | Technology Stack | — |
| 7 | Fitur Autentikasi | — |
| 8 | Kategori Barang | — |
| 9 | Perbedaan Form Lost dan Found | — |
| 10 | Komponen Teknis Chat | — |
| 11 | Jenis Notifikasi | — |
| 12 | Daftar Service | — |
| 13 | Palet Warna | — |
| 14 | Hasil Pengujian Statis | — |
| 15 | Rencana Pengujian Fungsional | — |
| 16 | Status Pengujian Build | — |
| 17 | Dokumentasi Kegiatan | — |

---

# DAFTAR GAMBAR

| No | Nama Gambar | Halaman |
|----|------------|---------|
| 1 | Diagram Arsitektur Three-Layer | — |
| 2 | Class Diagram User (UML) | — |
| 3 | Class Diagram Report (UML) | — |
| 4 | ERD Database (5 Tabel) | — |
| 5 | Navigation Tree Mahasiswa | — |
| 6 | Navigation Tree Admin | — |
| 7 | Screenshot: Splash Screen | — |
| 8 | Screenshot: Role Selection | — |
| 9 | Screenshot: Login Screen | — |
| 10 | Screenshot: Home Feed dengan Filter | — |
| 11 | Screenshot: Detail Laporan | — |
| 12 | Screenshot: Create Report (Lost) | — |
| 13 | Screenshot: Create Report (Found) | — |
| 14 | Screenshot: Chat Room Realtime | — |
| 15 | Screenshot: Inbox Percakapan | — |
| 16 | Screenshot: Notifikasi In-App | — |
| 17 | Screenshot: Admin Dashboard | — |
| 18 | Screenshot: Admin Review (Approve/Reject) | — |
| 19 | Screenshot: My Posts | — |
| 20 | Screenshot: Profil Pengguna | — |
| 21 | Screenshot: Settings | — |
| 22 | Screenshot: Help & FAQ | — |
| 23 | Hasil TypeScript & ESLint Check | — |

---

# DAFTAR LAMPIRAN

| No | Lampiran |
|----|----------|
| 1 | Link Repository GitHub |
| 2 | Status dan Link APK |
| 3 | Video Demo Aplikasi (3-5 menit) |
| 4 | Slide Presentasi |
| 5 | Dokumentasi Kegiatan per Fase |
| 6 | Hasil Survei Kuesioner (Google Form) |

---

# BAB I PENDAHULUAN

## A. Latar Belakang Masalah

Kampus adalah lingkungan dengan mobilitas tinggi. Mahasiswa datang dan pergi antar ruang kelas, laboratorium, perpustakaan, kantin, dan area parkir setiap harinya. Dengan mobilitas setinggi ini, tidak heran kalau insiden kehilangan barang sering terjadi. Entah itu kunci motor yang terlepas dari saku, dompet yang tertinggal di meja kantin, atau charger laptop yang ketinggalan di ruang kelas setelah perkuliahan selesai.

Sayangnya, selama ini tidak ada sistem yang terpusat untuk menangani barang hilang dan temuan di lingkungan kampus UNU Yogyakarta. Mekanisme yang berjalan saat ini masih sangat manual dan terbatas. Mahasiswa yang kehilangan barang biasanya melakukan satu atau beberapa hal berikut: bertanya langsung ke satpam kampus, menyebar pesan di grup WhatsApp angkatan atau prodi, atau pasrah dan tidak melakukan apa-apa. Masing-masing cara ini punya masalahnya sendiri.

Grup WhatsApp, misalnya, memang cepat dalam menyebarkan informasi, tetapi masalahnya informasi tersebut cepat tenggelam oleh obrolan sehari-hari. Belum lagi, grup WhatsApp tidak punya fitur pencarian yang memadai — kalau mahasiswa ingin mencari laporan barang hilang dari minggu lalu, mereka harus scroll manual dari atas. Selain itu, tidak ada verifikasi identitas, sehingga siapa pun bisa mengklaim barang tanpa bukti kepemilikan yang jelas. Yang lebih penting lagi, nomor HP pribadi yang tercantum di profil WhatsApp menjadi terekspos di grup publik, membuka celah untuk penyalahgunaan data pribadi.

Sementara itu, mengandalkan satpam kampus juga bukan solusi jangka panjang. Satpam tidak punya sistem pencatatan yang standar — beberapa mencatat di buku, beberapa hanya mengingat, dan tidak ada cara untuk menghubungkan antara orang yang kehilangan dengan orang yang menemukan. Informasi barang temuan yang diserahkan ke satpam sering kali hanya menunggu di pos satpam tanpa ada publikasi yang memadai.

Berdasarkan survei yang kami lakukan terhadap 39 mahasiswa UNU Yogyakarta pada bulan Mei 2026, ditemukan data yang cukup mengejutkan:

**Tabel 1. Data Survei Mahasiswa UNU Yogyakarta**

| Temuan Survei | Persentase |
|--------------|------------|
| Pernah kehilangan barang di kampus | **51%** |
| Pernah menemukan barang milik orang lain | **41%** |
| Mencari via satpam kampus | **67%** |
| Mencari via Grup WhatsApp | **28%** |
| Menyerahkan temuan ke satpam | **67%** |
| Mengumumkan temuan di Grup WA | **22%** |
| Nyaman menggunakan email kampus untuk verifikasi | **82%** |

Barang yang paling sering hilang meliputi kunci kendaraan, charger HP, dompet, earphone/headset, dan botol minum. Dari data ini, terlihat bahwa lebih dari setengah mahasiswa pernah mengalami kehilangan, namun dua pertiga di antaranya masih mengandalkan metode tradisional (satpam) yang tidak terstruktur.

Yang menarik, 82% responden menyatakan nyaman menggunakan email kampus (@student.unu-jogja.ac.id) untuk verifikasi akun. Ini menunjukkan bahwa mahasiswa sebenarnya sudah siap dan terbuka terhadap solusi digital, hanya saja belum ada platform yang menyediakan layanan tersebut secara terintegrasi.

Berdasarkan analisis di atas, kami mengidentifikasi enam masalah utama:

**Pertama**, informasi kehilangan dan temuan cepat tenggelam di grup WhatsApp. Grup WhatsApp didesain untuk percakapan realtime, bukan untuk database laporan. Pesan yang dikirim hari ini bisa dengan mudah terkubur oleh ratusan pesan lain dalam beberapa jam saja.

**Kedua**, tidak ada sistem pencarian yang terstruktur. Mahasiswa tidak bisa mencari laporan lama berdasarkan kata kunci, kategori barang, atau tanggal kejadian. Informasi yang sudah lewat praktis hilang dan tidak bisa diakses kembali.

**Ketiga**, rawan klaim palsu. Tanpa verifikasi identitas, siapa pun bisa datang dan mengaku sebagai pemilik barang. Tidak ada cara untuk memastikan bahwa orang yang mengklaim barang adalah pemilik yang sah.

**Keempat**, privasi terancam. Nomor HP pribadi yang dipajang di grup WhatsApp bisa disalahgunakan oleh pihak yang tidak bertanggung jawab. Beberapa responden bahkan melaporkan menerima pesan spam setelah nomor mereka tersebar di grup.

**Kelima**, format pelaporan tidak konsisten. Setiap orang punya cara sendiri dalam melaporkan barang hilang — ada yang lengkap dengan foto, ada yang hanya deskripsi singkat, ada yang lupa mencantumkan lokasi. Ini mempersulit proses pencocokan antara barang hilang dan temuan.

**Keenam**, tidak semua mahasiswa sempat atau mau mengunduh aplikasi. Untuk mengatasi ini, perlu ada jalur alternatif di mana satpam atau petugas kampus bisa membuat laporan atas nama mahasiswa yang datang langsung ke pos satpam (walk-in report).

Keenam masalah inilah yang menjadi dasar pengembangan Cari.In. Aplikasi ini dirancang untuk menjadi platform Lost & Found yang terpusat, aman, dan terstruktur, dengan fitur-fitur yang secara langsung menjawab setiap masalah yang telah diidentifikasi.

---

## B. Rumusan Masalah

Berdasarkan latar belakang yang telah diuraikan, rumusan masalah dalam proyek ini adalah:

1. Bagaimana merancang dan membangun aplikasi mobile Lost & Found yang terpusat untuk mahasiswa UNU Yogyakarta, yang dapat menggantikan mekanisme manual berbasis grup WhatsApp dan satpam?
2. Bagaimana menerapkan sistem autentikasi menggunakan email kampus (@student.unu-jogja.ac.id) untuk memastikan verifikasi identitas setiap pengguna?
3. Bagaimana mengimplementasikan fitur chat realtime antar pengguna yang aman, tanpa harus mengekspos nomor HP pribadi ke publik?
4. Bagaimana merancang sistem moderasi admin dengan workflow yang jelas (pending → approve/reject) untuk menjaga kualitas dan validitas setiap laporan?
5. Bagaimana memastikan kualitas dan keandalan kode melalui penerapan TypeScript strict, ESLint, dan pengujian fungsional manual?

---

## C. Tujuan

Sesuai dengan rumusan masalah yang telah ditetapkan, tujuan dari proyek ini adalah:

1. Merancang dan membangun aplikasi mobile Cari.In sebagai platform Lost & Found terpusat yang dapat diakses oleh seluruh mahasiswa UNU Yogyakarta melalui smartphone Android dan iOS.
2. Menerapkan registrasi mahasiswa berbasis domain email kampus (@student.unu-jogja.ac.id), sedangkan akun admin dibuat melalui jalur server dengan metadata role yang tidak dapat diubah oleh client.
3. Mengimplementasikan fitur chat realtime berbasis Supabase Realtime yang memungkinkan komunikasi langsung antara pelapor dan penemu tanpa mengekspos data kontak pribadi.
4. Merancang sistem moderasi admin dengan alur kerja yang jelas: mahasiswa membuat laporan → status "pending" → admin review → approve/reject → notifikasi otomatis ke mahasiswa.
5. Memastikan kualitas kode melalui TypeScript strict mode dengan target 0 error type checking, ESLint 0 warning, dan pengujian fungsional manual di perangkat fisik.

---

## D. Batasan Masalah

Agar pembahasan tetap fokus dan terarah, proyek ini memiliki beberapa batasan sebagai berikut:

**1. Pengguna (User)**
Sistem memiliki dua role pengguna: mahasiswa UNU Yogyakarta (yang terdaftar dengan email @student.unu-jogja.ac.id) dan admin/satpam kampus. Tidak ada role lain seperti dosen atau staf administrasi pada versi ini.

**2. Data yang Diolah**
Sistem mengelola lima jenis data utama: data profil pengguna (profiles), data laporan kehilangan dan penemuan (reports), data percakapan (conversations), data pesan chat (messages), dan data notifikasi (notifications).

**3. Proses Bisnis**
Alur utama aplikasi adalah: mahasiswa membuat laporan → laporan masuk dalam status "pending" → admin memeriksa dan memoderasi laporan → laporan di-approve atau di-reject → notifikasi dikirim ke mahasiswa → laporan yang di-approve muncul di feed publik.

**4. Output yang Dihasilkan**
Output proyek adalah satu kodebase React Native untuk Android dan iOS. Selama pengembangan aplikasi dijalankan melalui Expo Go; APK Android melalui EAS Build menjadi artefak final yang harus dibuat dan diuji sebelum penyerahan.

**5. Metode Pengembangan**
Proyek dikembangkan menggunakan metode Agile dengan pendekatan iteratif per fase. Setiap fase memiliki scope, deliverable, dan kriteria verifikasi yang jelas sebelum lanjut ke fase berikutnya.

**6. Pendekatan Pemrograman**
Aplikasi menggunakan arsitektur three-layer (Presentation, Domain/Service, Data) dengan penerapan Object-Oriented Programming pada layer model domain. Detail OOP mencakup 4 pilar: abstraction, encapsulation, inheritance, dan polymorphism.

**7. Perangkat Keras**
Aplikasi ditargetkan untuk smartphone Android dan iOS yang didukung oleh Expo SDK 54. Batas minimum versi sistem operasi mengikuti konfigurasi native yang dihasilkan Expo dan perlu diverifikasi kembali pada artefak build final.

**8. Perangkat Lunak**
Proyek dikembangkan menggunakan Node.js 18+, Expo SDK 54, Visual Studio Code sebagai IDE, dan Supabase sebagai Backend-as-a-Service. Tidak menggunakan backend server custom.

**9. Teknik Pengujian**
Pengujian dibagi menjadi pengujian statis menggunakan TypeScript type checker dan ESLint, serta pengujian fungsional manual melalui Expo Go. Hasil hanya dinyatakan berhasil setelah checklist pengujian diisi dan bukti eksekusinya disimpan.

---

# BAB II TINJAUAN PUSTAKA

## A. React Native & Expo Framework

React Native adalah framework pengembangan aplikasi mobile yang dikembangkan oleh Meta (sebelumnya Facebook). Framework ini memungkinkan pengembang menulis kode aplikasi mobile menggunakan JavaScript atau TypeScript, yang kemudian akan dirender menggunakan komponen native asli dari masing-masing platform (Android dan iOS). Konsep utamanya adalah "Learn Once, Write Anywhere" — sekali belajar React Native, pengembang bisa membuat aplikasi untuk dua platform sekaligus.

Salah satu keunggulan React Native dibandingkan pendekatan hybrid berbasis WebView adalah kemampuannya merender komponen UI native. Project Cari.In mengaktifkan New Architecture React Native, sehingga komunikasi JavaScript dan native menggunakan mekanisme modern React Native seperti JSI, bukan bergantung pada penjelasan bridge lama sebagai satu-satunya jalur komunikasi.

Expo, di sisi lain, adalah platform pengembangan yang dibangun di atas React Native. Expo menyediakan managed workflow yang sangat memudahkan proses development — pengembang tidak perlu menyentuh kode native sama sekali untuk mengakses fitur-fitur seperti kamera, galeri, notifikasi, atau sensor. Expo juga menyediakan tooling lengkap seperti Expo Go untuk testing di perangkat fisik, EAS Build untuk build otomatis di cloud, dan update over-the-air tanpa harus melalui proses review toko aplikasi.

**Tabel 2. Perbandingan Framework Mobile**

| Framework | Bahasa | Platform | Satu Kodebase? | Performa | Learning Curve |
|-----------|--------|----------|----------------|----------|----------------|
| React Native | JavaScript/TypeScript | Android, iOS | ✅ Ya | Mendekati native | Rendah-Sedang |
| Flutter | Dart | Android, iOS, Web, Desktop | ✅ Ya | Tinggi | Sedang |
| Kotlin Multiplatform | Kotlin | Android, iOS | ✅ Ya | Native | Tinggi |
| Native (Swift/Kotlin) | Swift/Kotlin | Masing-masing | ❌ Tidak | Native | Tinggi |

Untuk proyek Cari.In, dipilih React Native dengan Expo karena beberapa pertimbangan. Pertama, tim pengembang sudah memiliki pengalaman dengan ekosistem React, sehingga learning curve menjadi lebih rendah. Kedua, managed workflow Expo memungkinkan tim fokus pada logika bisnis tanpa direpotkan konfigurasi native yang rumit. Ketiga, dukungan TypeScript yang matang memungkinkan penerapan OOP secara penuh — sesuatu yang menjadi salah satu fokus utama dalam pengembangan aplikasi ini.

---

## B. Supabase (Backend as a Service)

Supabase adalah platform backend open-source yang sering disebut sebagai alternatif Firebase. Perbedaan mendasarnya terletak pada jenis database yang digunakan: Firebase menggunakan Firestore yang berbasis dokumen NoSQL, sementara Supabase menggunakan PostgreSQL yang merupakan database relasional.

Keputusan untuk memilih Supabase dibandingkan Firebase didasarkan pada beberapa pertimbangan teknis. Yang pertama dan paling penting adalah kebutuhan akan database relasional. Aplikasi Cari.In memiliki entitas-entitas yang saling berhubungan: satu user bisa punya banyak laporan, satu laporan bisa punya banyak percakapan, satu percakapan bisa punya banyak pesan. Relasi one-to-many ini jauh lebih natural direpresentasikan dalam tabel relasional daripada koleksi dokumen NoSQL.

Kedua, Supabase menyediakan Row Level Security (RLS) secara native di level database. RLS memungkinkan kebijakan akses ditentukan per baris, sedangkan privilege kolom dan RPC digunakan untuk operasi sensitif. Pada Cari.In, client mahasiswa tidak memperoleh akses langsung untuk mengubah kolom `role`, `status`, atau data moderasi; perubahan status dilakukan melalui RPC yang memverifikasi pemilik atau role admin.

Ketiga, Supabase memiliki fitur Realtime yang menggunakan WebSocket untuk mendengarkan perubahan database. Ini sangat berguna untuk fitur chat — setiap kali ada pesan baru masuk, database secara otomatis mengirim notifikasi ke klien yang sedang terhubung, tanpa perlu polling atau koneksi WebSocket terpisah.

**Tabel 3. Perbandingan Backend: Supabase vs Firebase**

| Fitur | Supabase | Firebase |
|-------|----------|----------|
| Tipe Database | PostgreSQL (Relasional) | Firestore (NoSQL) |
| Autentikasi | Email, Google, GitHub, dll | Email, Google, Apple, dll |
| Realtime | WebSocket (CDC) | WebSocket (Firestore) |
| Storage | Object Storage terkelola | Google Cloud Storage |
| Kontrol akses data | PostgreSQL RLS + privilege SQL | Firestore Security Rules |
| Harga | Memiliki free tier sesuai ketentuan penyedia | Memiliki free tier sesuai ketentuan penyedia |
| Open Source | ✅ Ya (dapat self-host) | ❌ Tidak |

---

## C. React Navigation

React Navigation adalah library standar yang digunakan untuk navigasi di aplikasi React Native. Library ini menyediakan berbagai jenis navigator yang bisa dikombinasikan untuk membangun arsitektur navigasi yang kompleks.

Tiga jenis navigator utama yang digunakan dalam Cari.In adalah:

**Stack Navigator** bekerja seperti tumpukan kartu. Setiap kali pengguna membuka halaman baru, halaman tersebut ditumpuk di atas halaman sebelumnya. Tombol back akan mengeluarkan halaman teratas dari tumpukan dan kembali ke halaman sebelumnya. Stack Navigator digunakan untuk alur autentikasi (Splash → RoleSelection → Login) dan untuk halaman detail (Home → DetailReport).

**Bottom Tab Navigator** menampilkan tab-tab navigasi di bagian bawah layar. Setiap tab mewakili bagian utama aplikasi. Untuk mahasiswa, ada 5 tab: Home, Pesan, Buat (+), Laporanku, dan Profil. Untuk admin, ada 5 tab yang berbeda: Dashboard, Laporan, Buat (+), Pesan, dan Profil.

**Drawer Navigator** menampilkan menu yang bisa digeser dari samping kiri. Drawer Navigator digunakan khusus untuk admin, membungkus Bottom Tab yang sudah ada. Ini memberikan akses cepat ke menu Beranda, Tentang Cari.In, dan Keluar.

---

## D. Arsitektur Three-Layer

Arsitektur three-layer (tiga lapisan) adalah pola arsitektur yang memisahkan aplikasi menjadi tiga lapisan yang berbeda tanggung jawab. Pola ini memastikan bahwa setiap bagian aplikasi hanya fokus pada satu tanggung jawab tertentu, sehingga memudahkan pengembangan, pengujian, dan pemeliharaan.

**Lapisan pertama — Presentation Layer** berisi komponen UI seperti screen dan komponen reusable. Lapisan ini hanya bertanggung jawab untuk menampilkan data dan menangkap interaksi pengguna. Presentation layer tidak boleh mengandung logika bisnis atau akses database secara langsung.

**Lapisan kedua — Domain/Service Layer** berisi model domain (seperti User, Report), service yang membungkus akses data, dan state management (context dan store). Lapisan ini menjadi jembatan antara UI dan database.

**Lapisan ketiga — Data Layer** berisi database PostgreSQL yang dikelola oleh Supabase, lengkap dengan fitur Row Level Security untuk menjaga keamanan data di level database.

Manfaat dari arsitektur ini adalah: jika suatu saat terjadi perubahan di satu lapisan (misalnya migrasi dari Supabase ke backend lain), lapisan lain tidak perlu diubah selama interface antar lapisan tetap konsisten.

---

# BAB III METODE PERANCANGAN

## A. Metode yang Digunakan

Proyek ini dikembangkan menggunakan metode Agile Development dengan pendekatan iteratif berbasis fase. Pemilihan metode Agile didasarkan pada beberapa pertimbangan.

Pertimbangan pertama adalah ukuran tim. Tim pengembang terdiri dari 6 orang dengan pembagian tugas yang jelas. Agile memungkinkan setiap anggota tim bekerja secara paralel pada tugas masing-masing tanpa harus menunggu tahapan sebelumnya selesai sepenuhnya.

Pertimbangan kedua adalah sifat proyek yang modular. Aplikasi Cari.In dapat dipecah menjadi modul-modul independen: autentikasi, feed, create report, chat, notifikasi, admin, dan profil. Setiap modul bisa dikerjakan dalam fase terpisah dan diuji secara independen.

Pertimbangan ketiga adalah fleksibilitas. Selama pengembangan, kami menemukan beberapa perubahan kebutuhan. Misalnya, Google OAuth yang awalnya direncanakan ternyata dihapus karena konflik dengan Unique Value Proposition (UVP) utama aplikasi, yaitu validasi domain email kampus. Agile memungkinkan kami beradaptasi dengan perubahan ini tanpa mengganggu jadwal keseluruhan.

---

## B. Tahapan Perancangan

Proyek dibagi menjadi 7 fase pengembangan yang berjalan secara berurutan namun dengan overlap di beberapa bagian:

**Tabel 4. Tahapan Pengembangan per Fase**

| Fase | Scope Utama | Durasi | Status | 
|------|------------|--------|--------|
| FASE 1 | Setup project, konfigurasi TypeScript strict, NativeWind, Supabase client | 3 hari | ✅ Selesai |
| FASE 2 | Navigasi (Stack + Tab + Drawer), AuthContext, routing berdasarkan role | 4 hari | ✅ Selesai |
| FASE 3 | Auth screens: Splash, RoleSelection, Login, Register, ForgotPassword, ResetPassword | 4 hari | ✅ Implementasi selesai |
| FASE 4 | Core mahasiswa: Home, Detail, Create, MyPosts, Profile (5 screen utama) | 7 hari | ✅ Selesai |
| FASE 4.5 | Chat realtime + notifikasi in-app (Inbox, ChatRoom, Notifications) | 5 hari | ✅ Selesai |
| FASE 5 | Admin: Dashboard, Review, All Reports, Walk-in, Drawer navigator | 5 hari | ✅ Selesai |
| FASE 6 | Polish: Settings, Help, UserProfile, hardening RLS, bug fixes, EAS Build | 3 hari | 🟡 Berjalan; APK berhasil, testing final belum |

### B.1 Analisis Kebutuhan (FASE 1)

Fase pertama dimulai dengan penyebaran kuesioner kepada 39 mahasiswa UNU Yogyakarta untuk memvalidasi masalah dan mengidentifikasi kebutuhan pengguna. Hasil survei menunjukkan bahwa 51% responden pernah kehilangan barang di kampus, dan 82% nyaman menggunakan email kampus untuk verifikasi. Data ini menjadi dasar perancangan fitur-fitur aplikasi.

Dari hasil analisis, disusun daftar kebutuhan fungsional:

**Tabel 5. Kebutuhan Fungsional**

| Modul | Fitur | Prioritas | Deskripsi |
|-------|-------|-----------|-----------|
| Auth | Register | Tinggi | Mendaftar dengan email kampus @student.unu-jogja.ac.id |
| Auth | Login | Tinggi | Masuk dengan email dan password |
| Auth | Role Selection | Tinggi | Memilih peran (Mahasiswa/Admin) sebelum login |
| Auth | Forgot Password | Sedang | Reset password via email |
| Feed | List Laporan | Tinggi | Menampilkan laporan publik yang sudah di-approve admin |
| Feed | Filter Kategori | Tinggi | Filter berdasarkan 8 kategori barang |
| Feed | Search | Sedang | Pencarian berdasarkan kata kunci dengan debounce 300ms |
| Report | Create Lost | Tinggi | Form laporan kehilangan dengan foto |
| Report | Create Found | Tinggi | Form laporan temuan dengan foto + titik penitipan |
| Report | Edit/Hapus | Tinggi | Mengelola laporan milik sendiri |
| Report | Mark Resolved | Tinggi | Menandai laporan sebagai selesai |
| Chat | Inbox | Tinggi | Daftar percakapan aktif |
| Chat | Chat Room | Tinggi | Pesan realtime antar pengguna |
| Notif | Notifikasi | Sedang | Pemberitahuan approve, reject, pesan baru |
| Admin | Dashboard | Tinggi | Statistik laporan (pending, approved, rejected) |
| Admin | Review | Tinggi | Approve/reject laporan dengan catatan |
| Admin | Walk-in | Sedang | Buat laporan atas nama mahasiswa |
| Profile | Avatar | Sedang | Upload foto profil |
| Profile | Settings | Sedang | Edit nama, ganti password |

### B.2 Perancangan Sistem (FASE 2)

Setelah kebutuhan fungsional ditetapkan, tahap selanjutnya adalah perancangan sistem yang mencakup perancangan database dan arsitektur navigasi.

**Perancangan Database**

Database dirancang dengan 5 tabel utama yang saling berelasi:

```
┌──────────┐      ┌──────────┐      ┌──────────────┐      ┌──────────┐
│ profiles │ 1──N │  reports │ 1──N │ conversations│ 1──N │ messages │
│ (User)   │────→│(Laporan) │────→│(Percakapan)  │────→│ (Pesan)  │
└──────────┘      └──────────┘      └──────────────┘      └──────────┘
     │                                                     
     │ 1──N                                                 
     └──────────────────────────────────────────────────┐
                                                        │
                                                        ▼
                                               ┌──────────────┐
                                               │ notifications│
                                               │ (Notifikasi) │
                                               └──────────────┘
```

**[Gambar 1: ERD Database Cari.In]**

File `supabase-schema.sql` mendefinisikan Row Level Security (RLS) untuk kelima tabel dan memadukannya dengan pembatasan privilege kolom. Setelah schema terbaru diterapkan ke project Supabase, pengguna biasa tidak dapat mengubah `profiles.role`, `reports.status`, data moderasi, identitas peserta conversation, maupun isi pesan lama. Operasi sensitif seperti approve/reject dan mark resolved menggunakan RPC yang memvalidasi role atau kepemilikan.

**Perancangan Navigasi**

Navigasi aplikasi dirancang dengan struktur bercabang berdasarkan status autentikasi dan role pengguna:

```
RootNavigator
├── [Loading] → LoadingScreen
├── [Not Authenticated] → AuthNavigator (Stack)
│     └── Splash → RoleSelection → Login / Register / ForgotPassword / ResetPassword
├── [Role: Mahasiswa] → MainNavigator (Bottom Tab)
│     ├── HomeTab (HomeFeed, Detail, ChatRoom, UserProfile)
│     ├── ChatTab (Inbox, ChatRoom, UserProfile, Notifications)
│     ├── CreateTab (FAB button → CreateModal)
│     ├── MyPostsTab (MyPosts, EditPost, Detail)
│     └── ProfileTab (Profile, Settings, Help, UserProfile, ChatRoom, Detail)
└── [Role: Admin] → AdminNavigator (Drawer → Bottom Tab)
      ├── DashboardTab (Dashboard, Review)
      ├── ReportsTab (Semua Laporan)
      ├── CreateTab (FAB button → CreateLost/CreateFound)
      ├── ChatTab (Inbox, ChatRoom)
      └── AdminProfileTab (Profile, ChangePassword, Logout)
```

**[Gambar 2: Navigation Tree Mahasiswa]**
**[Gambar 3: Navigation Tree Admin]**

### B.3 Implementasi (FASE 3-6)

Implementasi dilakukan secara bertahap per fase. Setiap fase mencakup pembuatan screen, komponen, service, dan pengujian. Detail implementasi dibahas pada Bab IV.

### B.4 Pengujian

Strategi pengujian dibagi dalam dua tahap. Tahap pertama, yang sudah dijalankan, adalah pemeriksaan statis menggunakan TypeScript (`tsc --noEmit`) dan ESLint. Tahap kedua adalah pengujian fungsional manual melalui Expo Go menggunakan checklist `TESTING-MANUAL.md`.

Pengujian statis memeriksa type error dan pelanggaran lint pada source yang dicakup konfigurasi. Pemeriksaan ini tidak menggantikan pengujian runtime.

Checklist fungsional mencakup registrasi, login, feed, pembuatan laporan, chat dua akun, notifikasi, profil, dan moderasi admin. Status bukti setiap skenario disajikan pada Bab IV.

---

# BAB IV HASIL DAN PEMBAHASAN

## A. Implementasi

### A.1 Technology Stack

**Tabel 6. Technology Stack yang Digunakan**

| Layer | Teknologi | Versi | Fungsi |
|-------|-----------|-------|--------|
| **Framework** | React Native + Expo | RN 0.81.5 / SDK 54 | Kerangka aplikasi mobile |
| **Language** | TypeScript | 5.9 (strict) | Type safety & OOP |
| **UI/Styling** | React Native styles, design tokens, NativeWind selektif | NativeWind 4.2 | Styling antarmuka |
| **Navigation** | React Navigation | v7 | Stack + Tab + Drawer |
| **State Management** | Context API + Zustand | v5 | Global state |
| **Backend** | Supabase | — | Auth + DB + Storage + Realtime |
| **Build** | EAS Build | Konfigurasi `eas.json` | APK production final-config Android |
| **Lint** | ESLint v9 (flat config) + Prettier | — | Kualitas kode |

### A.2 Arsitektur Three-Layer

Aplikasi ini dibangun menggunakan arsitektur three-layer yang memisahkan tanggung jawab menjadi tiga lapisan. Setiap lapisan hanya berkomunikasi dengan lapisan di bawahnya melalui interface yang sudah ditentukan.

**[Gambar 4: Arsitektur Three-Layer Cari.In]**

Lapisan pertama adalah **Presentation Layer**, yang pada source terakhir terdiri dari 30 file screen TSX dan 14 file komponen. Angka tersebut mencakup screen bersama, wrapper navigasi, dan komponen yang dipakai oleh lebih dari satu alur. Screen bertanggung jawab menangani interaksi dan rendering, sedangkan akses Supabase ditempatkan pada service layer.

Lapisan kedua adalah **Domain / Service Layer**, yang menjadi jembatan antara UI dan database. Lapisan ini terdiri dari beberapa komponen:

Service layer adalah enkapsulasi akses data. Misalnya, ketika HomeScreen ingin menampilkan daftar laporan, ia cukup memanggil `reportService.listReports(filter)` tanpa perlu tahu bagaimana query SQL di belakangnya, filter apa yang digunakan, atau bagaimana error handling-nya. Ini adalah penerapan prinsip encapsulation di level arsitektur.

Lapisan ketiga adalah **Data Layer**, yaitu Supabase yang mencakup PostgreSQL untuk penyimpanan data, Row Level Security untuk keamanan, Storage untuk file, dan Realtime untuk komunikasi realtime.

### A.3 Implementasi Model Domain (OOP)

Meskipun ini adalah laporan Mobile Programming, penerapan OOP cukup signifikan di project ini. Model domain ditempatkan di folder `src/models/` dan terdiri dari dua hierarki class:

**Hierarki User:**
- `User` (abstract class) — class induk yang mendefinisikan field `_id`, `_name`, `_email` dan method abstract `role()`, `getRoleLabel()`, `canModerate()`
- `Mahasiswa extends User` — subclass untuk role mahasiswa
- `Admin extends User` — subclass untuk role admin, dengan method tambahan `approveReport()` dan `rejectReport()`

**[Gambar 5: Class Diagram User (UML)]**

**Hierarki Report:**
- `ReportModel` (abstract class) — class induk dengan field `_title`, `_category`, `_location`
- `LostReport extends ReportModel` — untuk laporan kehilangan
- `FoundReport extends ReportModel` — untuk laporan temuan, dengan tambahan field `_custodyPoint`

**[Gambar 6: Class Diagram Report (UML)]**

Factory pattern digunakan untuk memilih subclass yang tepat saat runtime. Di `AuthContext`, fungsi `createUserModel()` membuat objek `Mahasiswa` atau `Admin` tergantung role pengguna yang login. Demikian pula di `CreateReportScreen`, fungsi `createReportModel()` membuat `LostReport` atau `FoundReport` tergantung tipe laporan yang dipilih.

---

## A.4 Implementasi Autentikasi

Sistem autentikasi merupakan gerbang utama aplikasi. Dibangun menggunakan **Supabase Auth** dengan metode email/password. Ada beberapa keputusan teknis yang diambil selama pengembangan fitur ini.

**Pertama, validasi domain email.** Registrasi mahasiswa hanya menerima domain `@student.unu-jogja.ac.id`. Validasi dilakukan di client-side dengan `endsWith()` untuk memberikan feedback cepat, lalu trigger `handle_new_user` pada database memeriksa domain kembali. Akun admin harus dibuat melalui jalur server menggunakan app metadata, sehingga metadata client tidak dapat dipakai untuk menaikkan role. Pendekatan ini dipilih karena:

- Mahasiswa UNU Yogyakarta memang hanya punya email dengan domain tersebut
- Mengurangi pendaftaran akun mahasiswa dari luar domain kampus
- Memudahkan verifikasi identitas saat klaim barang

**Kedua, role-based routing.** Setelah login, sistem membaca kolom `role` dari tabel `profiles`. Berdasarkan nilai role tersebut, aplikasi mengarahkan user ke navigasi yang berbeda:

- Role `mahasiswa` → `MainNavigator` (Bottom Tab dengan 5 menu)
- Role `admin` → `AdminNavigator` (Drawer + Bottom Tab)
- Profile masih dimuat → role sementara diinferensikan dari domain session; setelah profile tersedia, nilai `profiles.role` menjadi sumber utama

Proses ini di-handle oleh `AuthContext.tsx` yang menjadi pusat state autentikasi. Context ini menyimpan session, user profile, dan role, serta menyediakan method login, register, logout, dan reset password.

**Ketiga, session persistence.** Pada Android dan iOS, token session Supabase disimpan menggunakan `expo-secure-store`, yang memanfaatkan penyimpanan aman platform. Untuk preview web digunakan fallback AsyncStorage. SecureStore mengurangi risiko penyimpanan token plaintext, tetapi keamanan perangkat tetap bergantung pada kunci layar dan keamanan akun pengguna.

**Tabel 7. Fitur Autentikasi**

| Fitur | Implementasi | Status |
|-------|--------------|--------|
| Register dengan validasi domain | `endsWith()` di client + trigger database | ✅ Diimplementasikan |
| Login email/password | Supabase `signInWithPassword` | ✅ |
| Forgot password | Email recovery + deep-link `cariin://reset-password` + update password | ✅ Diimplementasikan |
| Session restore | SecureStore + AuthContext | ✅ |
| Logout | `supabase.auth.signOut()` + clear state | ✅ |
| Role-based redirect | Otomatis ke MainNavigator / AdminNavigator | ✅ |

**[Gambar 7: Screenshot Splash Screen]**
**[Gambar 8: Screenshot Role Selection]**
**[Gambar 9: Screenshot Login Screen]**

---

## A.5 Implementasi Feed & Detail Laporan

### Feed (HomeScreen)

Halaman utama mahasiswa menampilkan daftar laporan publik berstatus `approved` atau `resolved`. Implementasi menggunakan **FlatList** dari React Native dengan beberapa optimasi:

- **Pull-to-refresh:** User bisa tarik ke bawah untuk reload data
- **Search debounce 300ms:** Setiap input pencarian ditunda 300ms sebelum query dikirim, mencegah request berlebihan
- **Filter:** Tiga jenis filter — tipe (Semua/Hilang/Ditemukan), kategori (8 kategori), dan pencarian pada judul, lokasi, atau deskripsi
- **Zustand store:** Data feed disimpan di `feedStore` menggunakan Zustand, bukan React state biasa. Ini memungkinkan data tetap ada meskipun user navigasi antar screen

Filter kategori menggunakan komponen `ScrollView` horizontal dengan chip yang bisa dipilih. Setiap kategori memiliki ikon MaterialCommunityIcons yang berbeda:

**Tabel 8. Kategori Barang**

| Kategori | Icon MaterialCommunityIcons |
|----------|-----------------------------|
| Elektronik | `laptop` |
| Dokumen | `file-document-outline` |
| Dompet/Tas | `wallet-outline` |
| Kunci | `key` |
| Aksesoris | `watch` |
| Pakaian | `tshirt-crew` |
| Buku/ATK | `book-open-page-variant-outline` |
| Lainnya | `dots-horizontal` |

**[Gambar 10: Screenshot Home Feed]**

### Detail (DetailReportScreen)

Halaman detail laporan menampilkan foto utama dengan tinggi 320px, badge status, label kategori, lokasi, deskripsi, dan informasi pelapor.

Salah satu pola UI yang digunakan project adalah **children-as-function** pada `Pressable`. Pola ini memisahkan area sentuh dari `View` visual dan memudahkan pengaturan opacity ketika tombol ditekan:

```typescript
// Alternatif function-form pada prop style
<Pressable style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
  <Text>Submit</Text>
</Pressable>

// Pola yang dipilih project: children-as-function
<Pressable onPress={...}>
  {({ pressed }) => (
    <View style={{ opacity: pressed ? 0.85 : 1 }}>
      <Text>Submit</Text>
    </View>
  )}
</Pressable>
```

**[Gambar 11: Screenshot Detail Laporan]**

---

## A.6 Implementasi Create Report

Form pembuatan laporan menangani dua tipe sekaligus: **Lost** (Hilang) dan **Found** (Temuan) dalam satu komponen `CreateReportScreen.tsx`. Pemilihan tipe dilakukan melalui toggle switch di bagian atas form.

**Tabel 9. Perbedaan Form Lost dan Found**

| Field | Lost (Hilang) | Found (Temuan) |
|-------|---------------|----------------|
| Nama Barang | ✅ Wajib | ✅ Wajib |
| Kategori | ✅ Pilih dari 8 kategori | ✅ Pilih dari 8 kategori |
| Lokasi | ✅ "Lokasi terakhir terlihat" | ✅ "Lokasi penemuan" |
| Titik Penitipan | ❌ Tidak ada | ✅ Wajib diisi |
| Foto | ✅ Wajib (kamera/galeri) | ✅ Wajib (kamera/galeri) |
| Deskripsi | ✅ Opsional | ✅ Opsional |

**Flow upload foto:**
1. User tap area foto → muncul ActionSheet: "Ambil Foto" atau "Pilih dari Galeri"
2. Menggunakan `expo-image-picker` dengan opsi `base64: true`
3. String base64 di-decode ke `Uint8Array` via `atob()`
4. Diupload ke Supabase Storage bucket `report-photos` dengan path `{userId}/{timestamp}-{random}.jpg`
5. Public URL disimpan di kolom `photo_url` tabel `reports`

Pendekatan `base64 → Uint8Array` dipilih karena di lingkungan React Native (Hermes engine), `fetch(uri) → blob()` sering bermasalah untuk local file URI di Android.

Bucket dan policy Storage dibuat oleh `supabase-schema.sql`. Operasi upload, update, dan delete pada bucket foto dibatasi ke folder pertama yang sama dengan UUID user terautentikasi.

**[Gambar 12: Screenshot Create Report (Lost)]**
**[Gambar 13: Screenshot Create Report (Found)]**

---

## A.7 Implementasi Chat Realtime

Fitur chat realtime adalah salah satu fitur yang paling kompleks. Menggunakan **Supabase Realtime** dengan mekanisme `postgres_changes` subscription.

### Arsitektur Chat

```
User A kirim pesan
  → INSERT ke tabel `messages`
  → Trigger DB `trg_notify_new_message` (auto-insert notifikasi ke User B)
  → Trigger DB `trg_messages_update_conversation` (update last_message)
  → Supabase Realtime broadcast ke semua subscriber
  → ChatBubble muncul di layar User B tanpa refresh ✅
```

### Komponen Teknis

**Tabel 10. Komponen Teknis Chat**

| Komponen | File | Fungsi |
|----------|------|--------|
| Service | `chat.service.ts` | CRUD conversations & messages, subscribe realtime |
| Store | `chatStore.ts` (Zustand) | State percakapan & pesan, channel management |
| Component | `ChatBubble.tsx` | Render bubble kiri/kanan + timestamp + read indicator |
| Screen | `InboxScreen.tsx` | Daftar percakapan terurut last_at |
| Screen | `ChatRoomScreen.tsx` | FlatList ChatBubble + input bar |

### Tantangan Teknis

**Realtime subscription cleanup:** `ChatRoomScreen` memasang subscription pada `useEffect` berdasarkan `conversationId`. Cleanup effect memanggil `unsubscribe()` saat screen dilepas atau conversation berubah, sehingga channel lama tidak tertinggal.

```typescript
useEffect(() => {
  void fetchMessages(conversationId);
  subscribe(conversationId);
  void markMessagesAsRead(conversationId);

  return () => {
    unsubscribe();
  };
}, [conversationId, fetchMessages, subscribe, unsubscribe]);
```

**Read indicator:** Setiap pesan punya field `is_read`. Saat user membuka ChatRoom, otomatis memanggil `chatService.markMessagesAsRead(conversationId)` yang mengupdate semua pesan dari sender lain yang belum dibaca.

**[Gambar 14: Screenshot Chat Room]**
**[Gambar 15: Screenshot Inbox Percakapan]**

---

## A.8 Implementasi Notifikasi

Sistem notifikasi menggunakan pendekatan **database-driven** — bukan push notification native. Semua notifikasi disimpan di tabel `notifications` dengan mekanisme trigger database.

### Jenis Notifikasi

**Tabel 11. Jenis Notifikasi**

| Type | Trigger | Icon | Warna |
|------|---------|------|-------|
| `report_approved` | Admin approve laporan via RPC | `check-circle` | Hijau |
| `report_rejected` | Admin reject laporan via RPC | `x-circle` | Orange |
| `new_message` | Trigger `trg_notify_new_message` | `message-circle` | Biru |

### Auto-polling

`NotifContext` melakukan polling setiap 15 detik menggunakan `setInterval`. Setiap interval, dipanggil `notificationService.unreadCount()` untuk user yang sedang login. Hasilnya ditampilkan sebagai badge merah di bell icon pada HomeScreen. Preferensi notifikasi disimpan di AsyncStorage; ketika toggle dimatikan, polling dihentikan dan badge direset.

Pendekatan polling dipilih daripada realtime subscription karena:
- Notifikasi tidak perlu realtime-real-time amat (15 detik sudah cukup responsif)
- Mengurangi jumlah koneksi WebSocket yang harus dibuka
- Lebih sederhana implementasinya

**[Gambar 16: Screenshot Notifikasi]**

---

## A.9 Implementasi Admin Moderation

### Dashboard (AdminDashboardScreen)

Dashboard admin menampilkan 4 stat cards di bagian atas:
1. **Pending** (kuning) — laporan menunggu review
2. **Disetujui** (hijau) — laporan aktif di feed
3. **Ditolak** (orange) — laporan ditolak
4. **Total** (biru) — semua laporan

Di bawah stat cards, terdapat 3 tab filter: **Pending**, **Aktif**, **Selesai**. Setiap tab menampilkan count badge. Data statistik dihitung di sisi client dari hasil query `getAdminStats()` yang mengambil semua data reports lalu menghitung jumlah per status.

### Review Screen (AdminReviewScreen)

Halaman review menampilkan detail laporan lengkap dengan dua tombol aksi:

**Approve:** Menyetujui laporan. Memanggil RPC `update_report_status` dengan parameter:
- `p_report_id`: ID laporan
- `p_new_status`: `'approved'`
- `p_admin_note`: Catatan opsional

RPC ini menggunakan `SECURITY DEFINER` — artinya fungsi berjalan dengan privilege pembuat fungsi (bukan user yang memanggil). Ini memungkinkan admin untuk mengubah status laporan meskipun RLS normal memblokir update.

**Reject:** Menolak laporan. Sama seperti approve, tapi `p_new_status` diisi `'rejected'` dan `p_admin_note` WAJIB diisi (alasan penolakan).

### Walk-in Report

Fitur ini ditujukan untuk admin atau satpam yang menerima laporan langsung di pos. Admin dapat mengisi identitas pelapor walk-in berupa nama, NIM, dan fakultas; field identitas tersebut bersifat opsional pada versi saat ini. Laporan dibuat melalui RPC admin dan langsung berstatus `approved`.

**[Gambar 17: Screenshot Admin Dashboard]**
**[Gambar 18: Screenshot Admin Review]**

---

## A.10 Implementasi Profile & Settings

### Profile Screen

Halaman profil menampilkan informasi user: foto avatar (lingkaran), nama lengkap, NIM, email, dan fakultas.

**Avatar Upload:**
1. User tap avatar → muncul ActionSheet
2. Pilih "Ambil Foto" (buka kamera) atau "Pilih dari Galeri"
3. Foto di-crop (aspect 4:3) dengan kualitas 70%
4. Diupload ke Supabase Storage bucket `avatars`
5. Path: `{userId}/avatar.{jpg|png|webp}` sesuai MIME gambar dan menggunakan upsert
6. URL di-append `?t={timestamp}` untuk mencegah cache lama

**Teknik upload:** Sama dengan upload foto laporan — menggunakan `base64 → Uint8Array` karena Hermes engine di React Native.

### Settings Screen

Menu pengaturan mencakup:
- **Edit Nama** — mengubah display name
- **Ganti Password** — terintegrasi dengan Supabase Auth
- **Toggle Notifikasi In-App** — menyimpan preferensi di AsyncStorage dan mengaktifkan/menonaktifkan polling

### Help Screen

Halaman bantuan berisi FAQ (Frequently Asked Questions) dalam format accordion. Setiap pertanyaan bisa di-tap untuk melihat jawabannya. Juga terdapat informasi kontak dukungan dan versi aplikasi.

Public profile juga menyediakan tombol **Kirim Pesan**. Percakapan dikaitkan dengan laporan aktif milik user tersebut karena tabel `conversations` mensyaratkan `report_id`.

**[Gambar 19: Screenshot My Posts]**
**[Gambar 20: Screenshot Profil]**
**[Gambar 21: Screenshot Settings]**
**[Gambar 22: Screenshot Help & FAQ]**

---

## A.11 Service Layer

Operasi Supabase dienkapsulasi dalam service layer. Screen memanggil fungsi service untuk autentikasi, profil, laporan, upload, chat, dan notifikasi; pemisahan ini menerapkan **encapsulation** pada level arsitektur.

### Daftar Service

**Tabel 12. Daftar Service**

| Service | File | Fungsi |
|---------|------|--------|
| **auth.service.ts** | `loginWithEmail`, `register`, `logout`, `resetPassword`, `updatePassword`, `getCurrentUserId` |
| **profile.service.ts** | `getMyProfile`, `getPublicProfile`, `updateMyProfile` |
| **report.service.ts** | `listReports`, `getReportById`, `createReport`, `updateReport`, `deleteReport`, `markAsResolved`, `approveReport`, `rejectReport`, `createAdminReport`, `getAdminStats` |
| **upload.service.ts** | `pickImageFromLibrary`, `takePhoto`, `uploadReportPhoto`, `uploadAvatar` |
| **chat.service.ts** | `listConversations`, `getOrCreateConversation`, `listMessages`, `sendMessage`, `subscribeToMessages`, `markMessagesAsRead` |
| **notification.service.ts** | `listNotifications`, `markAsRead`, `markAllAsRead`, `unreadCount` |

### Error Handling Pattern

Salah satu gotcha yang ditemukan selama pengembangan adalah bahwa objek error dari operasi PostgREST tidak selalu merupakan instance `Error` JavaScript. Objek tersebut tetap masuk ke blok `catch`, tetapi pengecekan `err instanceof Error` pada UI dapat kehilangan pesan aslinya.

Solusi yang diterapkan di semua service:

```typescript
if (error) throw new Error(error.message);
// PostgrestError dibungkus jadi Error biasa agar
// pesannya kebaca di catch block UI.
```

---

## A.12 Design System: Calm Campus

Salah satu keputusan desain adalah mengganti primary color awal yang hampir hitam menjadi biru. Biru dipilih untuk memberi kesan tenang dan tepercaya, sedangkan orange dan emerald dipakai untuk membedakan laporan hilang dan ditemukan secara cepat.

**Tabel 13. Palet Warna Final**

| Warna | Hex | Penggunaan | Tujuan Visual |
|-------|-----|------------|---------------|
| Primary Blue | `#2563EB` | Tombol, navbar, link | Identitas utama dan kepercayaan |
| Soft Blue | `#EFF6FF` | Background | Kontras lembut |
| Teal Sage | `#0D9488` | Admin area | Membedakan area admin |
| Orange Lost | `#F97316` | Badge Hilang | Menandai kondisi hilang |
| Emerald Found | `#059669` | Badge Ditemukan | Menandai kondisi ditemukan |

**Design Tokens** disimpan di `src/utils/constants.ts`:

```typescript
RADIUS: { xs:6, sm:8, md:12, lg:16, xl:20, '2xl':24, full:999 }
SPACING: { xs:4, sm:8, md:12, lg:16, xl:20, '2xl':24, '3xl':32 }
FONT_SIZE: { xs:9, sm:11, base:13, md:15, lg:18, xl:20, '2xl':24 }
SHADOW: { subtle, card, elevated } — all with blue glow
```

Design tokens menjadi referensi warna, radius, spacing, tipografi, dan shadow. Implementasi saat ini menggunakannya bersama inline styles; standardisasi penuh seluruh nilai visual masih menjadi ruang refactor berikutnya.

---

## B. Pengujian Program

### B.1 Pengujian Statis dan Konfigurasi

Pengujian statis yang sudah diverifikasi menggunakan dua tool:

**Tabel 14. Hasil Pengujian Statis per 20 Juli 2026**

| Tool | Command | Hasil Terverifikasi |
|------|---------|-------|
| TypeScript | `npx tsc --noEmit` | **0 errors** |
| ESLint | `npm run lint` | **0 errors, 0 warnings** |
| Expo Doctor | `npx expo-doctor` | **18/18 checks passed** |

TypeScript dijalankan dalam **strict mode** dengan `noImplicitAny` dan `noUncheckedIndexedAccess`. Expo Doctor memeriksa kompatibilitas dependency dan konfigurasi project Expo; seluruh 18 pemeriksaan lulus pada eksekusi terakhir.

**[Gambar 23: Hasil TypeScript & ESLint Check]**

### B.2 Pengujian Fungsional (Manual)

File `TESTING-MANUAL.md` menyediakan checklist pengujian end-to-end. Verifikasi
backend yang dapat dijalankan tanpa perangkat sudah dicatat terpisah; seluruh
skenario UI/perangkat tetap merupakan **rencana/verifikasi yang harus
dilakukan**, bukan hasil berhasil yang sudah dibuktikan.

Eksekusi pada 20 Juli 2026 membuktikan project Supabase `ACTIVE_HEALTHY` dan
smoke test SQL serta client API lulus untuk login dua akun, RPC, RLS, Storage,
dua subscription Realtime, dan trigger. Negative test membuktikan password
salah, domain luar, eskalasi role, RPC admin oleh mahasiswa, dan upload
lintas-user ditolak; perubahan langsung `reports.status` juga diblokir. Request
reset diterima dan email recovery tercatat
terkirim, tetapi link email sampai password baru belum diuji. Pengujian UI
aplikasi tetap belum dilakukan karena environment tidak memiliki dua perangkat
atau simulator.

**Tabel 15. Rencana Pengujian Fungsional**

| Modul | Skenario | Status Bukti |
|-------|----------|-------|
| **Auth** | Login dua akun, password salah, dan penolakan domain luar melalui API | ✅ Terverifikasi backend |
| **Auth** | Register email kampus, restore session, dan logout melalui UI | ⏳ Perlu diuji perangkat |
| **Auth** | Request/email reset | ✅ Terverifikasi backend |
| **Auth** | Link email → deep-link → kata sandi baru | ⏳ Perlu diuji perangkat |
| **Feed** | Scroll, pull-to-refresh, filter, dan search | ⏳ Perlu diuji |
| **Create** | Validasi field/foto dan laporan berstatus pending | ⏳ Perlu diuji |
| **Chat** | Event pesan Realtime dua session dan trigger notifikasi | ✅ Terverifikasi backend |
| **Chat** | UI dua perangkat, pesan dobel, dan read indicator | ⏳ Perlu diuji perangkat |
| **Notif** | Badge, mark read, dan toggle polling | ⏳ Perlu diuji |
| **Admin** | Approve/reject, notifikasi, dan laporan walk-in | ⏳ Perlu diuji |
| **Profile** | Upload avatar, edit nama, dan FAQ accordion | ⏳ Perlu diuji |

### B.3 Pengujian Build

Build production Android dari snapshot konfigurasi final dijalankan melalui EAS Build pada 20 Juli 2026. EAS menyelesaikan build dengan status `FINISHED`. Artifact yang diunduh berhasil melewati pemeriksaan `unzip -t` dan `zipinfo -t` untuk 1.297 entry. Android build-tools membaca package `id.cariin.app`, version `1.0.0`, versionCode 1, minSdk 24, targetSdk 36, dan scheme `cariin`. Daftar permission APK final tidak memuat `android.permission.RECORD_AUDIO`. Verifikasi ini membuktikan artifact dan konfigurasi native, tetapi tidak membuktikan instalasi, startup, login, atau alur backend pada perangkat.

**Tabel 16. Status Pengujian Build**

| Platform | Profile | Ukuran | Status Terverifikasi |
|----------|---------|--------|--------|
| Android | Preview | — | ⏳ Belum dibuild/diverifikasi |
| Android | Production (kandidat lama) | 80.569.203 byte / 76,83 MiB | ✅ Bukti historis compile; sudah digantikan build final-config |
| Android | Production (final-config) | 80.572.407 byte / 76,84 MiB | ✅ EAS Build selesai; archive, package, scheme, SDK, permission, dan SHA-256 terverifikasi; belum install/smoke test |
| iOS | Preview | — | Tidak menjadi target artifact penyerahan |

---

## C. Analisis dan Pembahasan

### 1. Kelebihan Sistem

Setelah melalui proses pengembangan dan pengujian, beberapa kelebihan Cari.In yang teridentifikasi:

**a. Pembatasan Registrasi Mahasiswa**
Client dan trigger database membatasi registrasi mahasiswa ke domain `@student.unu-jogja.ac.id`. Pembatasan domain membantu mengurangi akun dari luar kampus, tetapi proses klaim barang tetap memerlukan verifikasi ciri kepemilikan melalui chat atau petugas.

**b. Privasi Terjaga**
Aplikasi tidak mengumpulkan maupun menampilkan nomor HP. Komunikasi antara pencari dan penemu dilakukan melalui chat in-app.

**c. Moderasi Terpusat**
Laporan mahasiswa dibuat dengan status `pending`. Privilege kolom mencegah client mahasiswa mengubah `status`; approve/reject hanya tersedia melalui RPC admin, sedangkan mahasiswa menandai selesai melalui RPC khusus laporan approved miliknya.

**d. Satu Kodebase Dua Platform**
Dengan React Native + Expo, aplikasi berjalan di Android dan iOS dari satu kodebase yang sama. Ini menghemat waktu pengembangan dan memudahkan maintenance.

**e. Code Quality**
TypeScript strict mode dan ESLint membantu mendeteksi type mismatch, import salah, dan pelanggaran aturan statis sebelum runtime. Keduanya tidak menggantikan pengujian fungsional atau menjamin aplikasi bebas runtime error.

### 2. Kekurangan Sistem

Beberapa keterbatasan yang perlu dicatat untuk pengembangan selanjutnya:

**a. Tidak Ada Google OAuth**
Awalnya direncanakan untuk mendaftar/login menggunakan Google. Namun fitur ini dihapus karena konflik dengan Unique Value Proposition (verifikasi email kampus). Mahasiswa UNU Yogyakarta sudah memiliki email kampus, jadi login Google dirasa kurang relevan.

**b. Belum Ada Push Notification Native**
Saat ini notifikasi hanya bersifat in-app — user harus membuka aplikasi untuk melihat notifikasi. Push notification native (menggunakan Expo Push Notifications atau Firebase Cloud Messaging) belum diimplementasi.

**c. Belum Ada Dark Mode**
Aplikasi hanya memiliki satu tema (light mode). Dark mode belum diimplementasi karena keterbatasan waktu pengembangan.

**d. Belum Ada Multi Bahasa**
UI hanya tersedia dalam Bahasa Indonesia. Belum ada dukungan Bahasa Inggris atau bahasa daerah.

**e. APK Final-Config Belum Diuji di Perangkat**
Artifact production dari konfigurasi izin Android final sudah tersedia dan lolos pemeriksaan integritas, package, scheme, SDK, permission, ukuran, serta SHA-256. Namun instalasi, startup, login, dan alur utama belum dicatat pada checklist perangkat fisik. Backend remote sudah aktif, smoke test SQL/client API lulus, dan redirect Auth sudah diverifikasi; pengujian UI perangkat masih belum dilakukan.

**f. Belum Ada Pengujian Otomatis**
Repository belum memiliki unit test, integration test, maupun end-to-end test otomatis. Pengujian saat ini mengandalkan pemeriksaan statis dan checklist manual.

---

# BAB V KESIMPULAN DAN SARAN

## A. Kesimpulan

Berdasarkan hasil perancangan, implementasi, dan pemeriksaan yang telah memiliki bukti pada repository, dapat ditarik beberapa kesimpulan sebagai berikut:

**Pertama**, Cari.In telah mengimplementasikan modul autentikasi, feed laporan, pembuatan laporan, chat realtime, notifikasi in-app, moderasi admin, serta manajemen profil dalam 30 file screen TSX. Pemeriksaan statis source telah lulus; pengujian fungsional menyeluruh tetap harus diselesaikan menggunakan checklist manual sebelum klaim siap produksi.

**Kedua**, registrasi mahasiswa menggunakan validasi domain `@student.unu-jogja.ac.id` pada client dan trigger database. Akun admin menggunakan app metadata dari jalur server. Role-based routing memisahkan MainNavigator mahasiswa dan AdminNavigator secara otomatis setelah login.

**Ketiga**, fitur chat realtime diimplementasikan menggunakan Supabase Realtime (`postgres_changes`) dengan cleanup subscription saat ChatRoom dilepas. Dua client terautentikasi telah menerima event pesan baru dan trigger membuat notifikasi penerima pada smoke test backend. Perilaku UI realtime dua perangkat, termasuk tampilan dan deduplikasi pesan, tetap harus dibuktikan melalui checklist manual.

**Keempat**, workflow moderasi menggunakan RLS, privilege kolom, dan RPC `SECURITY DEFINER`. Laporan mahasiswa masuk status `pending`; hanya RPC admin yang dapat approve/reject, sedangkan laporan walk-in admin langsung berstatus `approved`. Perubahan status mengirim notifikasi ke pemilik laporan.

**Kelima**, pemeriksaan terakhir menghasilkan 0 error TypeScript, 0 error/warning ESLint, dan 18/18 pemeriksaan Expo Doctor lulus. EAS Build production dari konfigurasi final berhasil menghasilkan APK valid berukuran 76,84 MiB, dan manifest final tidak memuat permission `RECORD_AUDIO`. Backend remote serta smoke test API sudah terverifikasi; pengujian manual UI penuh dan smoke test instalasi masih harus dilengkapi.

---

## B. Saran

Untuk finalisasi dan pengembangan selanjutnya, beberapa saran yang dapat diberikan:

1. **Selesaikan bukti rilis**: Jalankan checklist pengujian manual dua akun serta smoke test APK final-config pada perangkat fisik. Lampirkan output Expo Doctor, link EAS Build, dan screenshot alur utama.

2. **Notifikasi Push**: Mengintegrasikan notifikasi push (Expo Push Notification) agar pengguna tetap mendapat notifikasi meskipun aplikasi tertutup. Saat ini notifikasi hanya bersifat in-app.

3. **Upload Media di Chat**: Menambahkan fitur upload gambar/file di chat. Saat ini chat hanya mendukung teks.

4. **Lokasi Real-time**: Mengintegrasikan Google Maps atau peta untuk menampilkan lokasi kejadian secara visual.

5. **Rating dan Reputasi**: Menambahkan sistem rating atau reputasi pengguna untuk meningkatkan kepercayaan dalam transaksi lost & found.

6. **Google OAuth Opsional**: Pertimbangkan login Google hanya apabila kebijakan akun kampus dan validasi domain tetap dapat ditegakkan pada backend.

7. **Pengujian Otomatis**: Menambahkan unit test dan integration test menggunakan framework seperti Jest atau Detox untuk pengujian yang lebih komprehensif.

---

# DAFTAR PUSTAKA

React Native. (2025). *React Native Documentation*. https://reactnative.dev/docs/getting-started

Expo. (2025). *Expo Documentation SDK 54*. https://docs.expo.dev/

Supabase. (2025). *Supabase Documentation*. https://supabase.com/docs

React Navigation. (2025). *React Navigation v7 Documentation*. https://reactnavigation.org/docs/getting-started/

Zustand. (2025). *Zustand Documentation*. https://github.com/pmndrs/zustand

NativeWind. (2025). *NativeWind v4 Documentation*. https://www.nativewind.dev/

TypeScript. (2025). *TypeScript Documentation*. https://www.typescriptlang.org/docs/

---

# LAMPIRAN

## Lampiran 1: Link Repository GitHub

Repository: `https://github.com/Faiz-abdurrachman/cariin`

## Lampiran 2: Status dan Link APK

Build EAS production Android dari konfigurasi final:

- Build ID: `4d5739ec-b37c-4527-b6cf-c1dc48f0bd6b`
- Build page: `https://expo.dev/accounts/faiz.abdurrachman/projects/cariin/builds/4d5739ec-b37c-4527-b6cf-c1dc48f0bd6b`
- APK: `https://expo.dev/artifacts/eas/pPr_zko1oVS3ZOM_WV2UJs13jhArovBN9YVSuELaB0M.apk`
- Ukuran: `80.572.407 byte` (`76,84 MiB`)
- SHA-256: `6c6d30f0af72d0ba1b29a16a463e1b9bd14176ac74b96fe7c1152d2129479c82`
- Verifikasi file: 1.297 entry archive valid; package `id.cariin.app`;
  version `1.0.0`/versionCode 1; minSdk 24; targetSdk 36; scheme `cariin`;
  permission `RECORD_AUDIO` tidak ada

Perintah build yang digunakan:

```bash
eas build --platform android --profile production
```

> Artifact berasal dari snapshot konfigurasi final dan salinan lokal disimpan di folder `dist/` yang di-ignore. Artifact belum diinstal atau smoke test pada perangkat fisik. Backend remote sudah aktif, smoke test SQL/client API lulus, dan redirect Auth sudah diverifikasi; pengujian UI dua perangkat masih tertunda.

## Lampiran 3: Video Demo Aplikasi

> Status per 20 Juli 2026: belum direkam. Link diisi setelah video demo selesai.

## Lampiran 4: Slide Presentasi

Slide presentasi tersedia di:
- `uas-mopro/PPT-CARIIN.md` (format markdown)
- `uas-mopro/pres/index.html` (format HTML interaktif)

## Lampiran 5: Dokumentasi Kegiatan

**Tabel 17. Dokumentasi Kegiatan**

| No | Kegiatan | Tanggal | Status per 20 Juli 2026 |
|----|----------|---------|--------------------------|
| 1 | Analisis Permasalahan dan Survei Kuesioner | 23 Mei – 3 Juni 2026 | Selesai; bukti survei perlu dilampirkan |
| 2 | Perancangan Database (ERD) & Arsitektur Sistem | 5 – 15 Juni 2026 | Selesai |
| 3 | Perancangan prototype dan MVP | 16 – 24 Juni 2026 | Selesai |
| 4 | Implementasi Aplikasi Mobile & Integrasi Backend | 25 Juni – 5 Juli 2026 | Selesai |
| 5 | Implementasi Fitur Chat Realtime & Notifikasi | 6 – 15 Juli 2026 | Implementasi selesai; testing manual perlu bukti |
| 6 | Implementasi Dashboard Admin & Finalisasi | 16 – 25 Juli 2026 | Berjalan; tanggal 25 Juli adalah target |

---

*Laporan ini disusun sebagai syarat Ujian Akhir Semester Mata Kuliah Mobile Programming*
*Program Studi Informatika — Universitas Nahdlatul Ulama Yogyakarta*
*2026*
