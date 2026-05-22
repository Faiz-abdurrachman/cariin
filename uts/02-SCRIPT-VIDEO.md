# SCRIPT VIDEO PRESENTASI UTS — Cari.In

> **Durasi target:** 4–5 menit  
> **Format:** Rekaman screen + facecam (opsional)  
> **Upload:** YouTube (akun pribadi mahasiswa)  
> **Tools:** OBS Studio / QuickTime / screen recording bawaan

---

## 🎬 PERSIAPAN SEBELUM REKAM

### Setup Device
1. Buka Expo Go di iPhone / `npx expo start --web` di Chrome
2. Login sebagai mahasiswa: `faiz@student.unu-jogja.ac.id` / `faizfaiz`
3. Pastikan ada data laporan seeded (5 reports approved)
4. Tutup semua app yang tidak perlu — fokus Cari.In doank

### Setup OBS / Screen Recorder
- Resolution: 1080p
- Audio: microphone ON (jelaskan sambil demo)
- Facecam: opsional, tapi dosen nilai "Komunikasi" 5%

---

## 📝 SCRIPT — PER MENIT

### [0:00–0:30] OPENING — Perkenalan + Judul

**Slide 1:** Cover slide — Logo Cari.In + "Campus Lost & Found App"

**Narasi:**
> "Assalamualaikum, perkenalkan nama saya Faiz Abdurrachman, NIM [isi NIM], dari kelas [isi kelas]. Ini adalah video progress project UTS Mobile Programming saya, dosen Yana Hendriana. Nama aplikasi saya: **Cari.In** — aplikasi lost and found khusus untuk kampus."

---

### [0:30–1:15] LINGKUP 1 — Analisis Permasalahan

**Slide 2:** Screenshot grup WA (chat berantakan) + statistik kehilangan

**Narasi:**
> "Masalah yang saya angkat adalah kehilangan barang di kampus. Data dari ITS Surabaya mencatat 700 laporan dalam 9 bulan. Di Universitas Brawijaya, lebih dari 50% mahasiswa pernah kehilangan barang. Saat ini, mahasiswa hanya bisa melapor melalui grup WhatsApp, dan informasinya cepat tenggelam. Selain itu, tidak ada verifikasi identitas, nomor HP terekspos, dan format laporan tidak konsisten. Ini masalah nyata yang perlu solusi digital."

---

### [1:15–2:00] LINGKUP 2 — Analisis Kebutuhan

**Slide 3:** Tabel kebutuhan fungsional + non-fungsional

**Narasi:**
> "Dari analisis kebutuhan, saya mengidentifikasi 12 fitur fungsional utama, mulai dari registrasi dengan email kampus, pelaporan Lost dan Found, feed utama dengan filter dan pencarian, moderasi admin, in-app chat, sampai notifikasi. Untuk kebutuhan non-fungsional, fokus utama saya di keamanan — JWT authentication, Row Level Security, dan validasi domain email kampus — serta performa, usability, dan kompatibilitas cross-platform via Expo."

---

### [2:00–2:30] LINGKUP 3 — Referensi Desain, Survey & Observasi

**Slide 4:** Studi banding + grafik hasil kuesioner

**Narasi:**
> "Saya melakukan studi banding dengan Lost N Found Telkom University yang punya 11 ribu followers tapi masih manual via DM, dan TemuKembali UB. Dari observasi, saya menemukan bahwa informasi di grup WA bisa tenggelam dalam 1–2 jam. Saya juga menyebarkan kuesioner ke [isi jumlah] responden, dan hasilnya [isi insight utama, misal: 80% responden setuju butuh aplikasi khusus]."

> ⚠️ **ACTION ITEM:** Setelah lu kumpulin data kuesioner, isi angka + insight di sini.

---

### [2:30–3:00] LINGKUP 4 — Timeline

**Slide 5:** Gantt Chart visual

**Narasi:**
> "Timeline project saya selama 9 minggu. Minggu 1–2 untuk setup dan prototype HTML yang sudah deploy di Vercel. Minggu 3 untuk setup Expo dan fondasi navigasi. Minggu 4 untuk autentikasi lengkap. Minggu 5 untuk fitur core mahasiswa — feed, detail, create report, my posts, dan profile. Saat ini saya sudah menyelesaikan FASE 1 sampai 4. Selanjutnya akan dikerjakan chat realtime, admin moderation, dan polish sampai build APK."

---

### [3:00–3:30] LINGKUP 5 — Wireframe

**Slide 6:** Screenshot prototype HTML (cariin-lf.vercel.app)

**Narasi:**
> "Untuk wireframe, saya membuat prototype HTML lengkap sebanyak 26 screens yang di-deploy di Vercel. Ini mencakup seluruh flow: dari splash screen, login, register, home feed, detail laporan, create report, sampai admin dashboard. Prototype ini menjadi acuan visual untuk implementasi di React Native."

> *(Tunjukkan browser buka cariin-lf.vercel.app — scroll beberapa screen)*

---

### [3:30–4:15] LINGKUP 6 — Desain Interface (DEMO APP)

**Slide 7:** Screenshot app React Native + LIVE DEMO

**Narasi:**
> "Sekarang saya akan mendemokan aplikasi yang sudah diimplementasi di React Native menggunakan Expo."

**DEMO SEQUENCE:**

1. **Splash Screen** *(tunggu loading)* → "Ini splash screen Cari.In"
2. **Role Selection** *(tap Mahasiswa)* → "User memilih peran sebagai Mahasiswa"
3. **Login** *(ketik email + password, tap Login)* → "Login dengan email kampus"
4. **Home Feed** *(scroll, tunjuk filter)* → "Feed utama menampilkan laporan aktif. Ada filter Lost/Found dan kategori"
5. **Search** *(ketik keyword)* → "Pencarian berdasarkan judul laporan"
6. **Detail Laporan** *(tap salah satu card)* → "Detail laporan dengan foto, badge status, lokasi, dan info pelapor"
7. **Create Report** *(tap FAB +, isi form)* → "Buat laporan baru, foto wajib, kategori, lokasi"
8. **My Posts** *(tab Laporanku)* → "Daftar laporan milik sendiri, bisa edit atau tandai selesai"
9. **Profile** *(tab Profil)* → "Profil user dengan avatar, NIM, fakultas"

> *(Selama demo, jelaskan singkat setiap screen)*

---

### [4:15–4:40] LINGKUP 7 — Hasil Coding

**Slide 8:** Potongan kode inti

**Narasi:**
> "Untuk implementasi teknis, saya menggunakan arsitektur berlapis: screen, service, context, dan store. Kode ditulis dalam TypeScript strict dengan validasi domain email kampus. Autentikasi menggunakan Supabase Auth dengan JWT, CRUD laporan melalui PostgREST dengan Row Level Security, dan upload foto ke Supabase Storage. Navigasi menggunakan React Navigation v7 dengan tiga jenis navigator: Stack untuk auth, Bottom Tab untuk mahasiswa, dan Drawer untuk admin. State management menggunakan Context API untuk auth dan Zustand untuk data feed."

> *(Tunjukkan VS Code — scroll sedikit file auth.service.ts dan report.service.ts)*

---

### [4:40–5:00] LINGKUP 8 — Rancangan Database

**Slide 9:** ERD diagram

**Narasi:**
> "Database menggunakan Supabase Postgres dengan 5 tabel utama: profiles yang terhubung 1:1 dengan auth.users, reports untuk laporan, conversations dan messages untuk chat, serta notifications. Saya menerapkan Row Level Security di setiap tabel untuk memastikan user hanya bisa mengakses data yang berhak. Ada 17 RLS policy yang mengatur akses berdasarkan role dan kepemilikan."

> *(Tunjukkan ERD diagram di slide)*

---

### [5:00–5:15] CLOSING

**Slide 10:** Summary + Next Steps

**Narasi:**
> "Kesimpulannya, Cari.In sudah menyelesaikan 4 dari 6 fase pengembangan. Fitur core mahasiswa sudah berjalan: dari registrasi, login, feed, detail, buat laporan, sampai kelola laporan sendiri. Selanjutnya akan dikerjakan chat realtime, admin moderation, dan build APK untuk submission. Sekian dari saya, terima kasih."

---

## 🎯 TIPS SAAT REKAM

1. **Jangan baca script monoton** — jelaskan seperti ngobrol sama dosen
2. **Demo app harus smooth** — latihan 2-3 kali sebelum rekam final
3. **Kalau error saat demo** — gak usah panik, jelaskan "ini masih development" terus lanjut
4. **Kualitas audio penting** — dosen nilai komunikasi 5%, pakai mic yang jelas
5. **Durasi 4-5 menit** — jangan terlalu pendek, jangan kepanjangan
6. **Show code sebentar doank** — fokus demo app, kode cuma flash 10-15 detik
7. **Upload YouTube sebagai Unlisted** — gak perlu publik, tapi link bisa diakses

---

## 📋 CHECKLIST SEBELUM REKAM

- [ ] App berjalan lancar di Expo Go / web preview
- [ ] Data test sudah ada (5 laporan approved)
- [ ] Slide presentasi sudah jadi
- [ ] ERD diagram visual sudah jadi
- [ ] Gantt Chart visual sudah jadi
- [ ] Data kuesioner sudah dikumpulkan dan dibuat grafik
- [ ] OBS / screen recorder sudah di-set
- [ ] Latihan dry-run minimal 1x
- [ ] Upload ke YouTube sebagai Unlisted
