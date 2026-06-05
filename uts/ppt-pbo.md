# Rancangan Presentasi Proyek PBO: Cari.In

Dokumen ini adalah panduan pembuatan Slide PPT dan Script Presentasi untuk mata kuliah **Pemrograman Berorientasi Objek (PBO)**. 

Format di bawah ini disusun *strict* mengikuti template 7 poin yang diinstruksikan.

**Aturan Main (Sesuai Ketentuan Dosen):**
1. Slide HANYA memuat poin-poin singkat atau gambar visual.
2. JANGAN BACA SLIDE. Gunakan script penjelasan di bawah ini saat berbicara.
3. Waktu presentasi 10-15 Menit.

---

## SLIDE 1: Nama Program & Pengenalan (Poin 1)
**Visual di Slide:**
- Logo "Cari.In"
- Tagline: "Platform Lost & Found Kampus Berbasis Mobile"
- Nama Anggota Kelompok & NIM

**Script Penjelasan Lisan:**
> "Halo semuanya. Kami dari kelompok [Nama Kelompok]. Hari ini kami akan mempresentasikan solusi dari masalah yang sering terjadi di lingkungan kampus kita. Program atau aplikasi yang kami rancang bernama **Cari.In**, sebuah aplikasi *Lost & Found* khusus untuk mahasiswa."

---

## SLIDE 2: Latar Belakang Masalah (Poin 2)
**Visual di Slide:**
- Gambar ilustrasi barang jatuh di kampus / chat WA tertumpuk.
- Poin singkat: Sering terjadi, Grup WA tidak efektif, Privasi & Keamanan rentan.

**Script Penjelasan Lisan:**
> "Berdasarkan observasi kami, berikut adalah latar belakang masalahnya:
> - **Permasalahannya:** Informasi kehilangan atau penemuan barang tidak terpusat dan cepat hilang karena hanya di-share lewat grup WhatsApp.
> - **Lokasi:** Terjadi di lingkungan Kampus (kelas, kantin, parkiran, atau perpustakaan).
> - **Terdampak:** Mahasiswa, Dosen, dan Staf Kampus.
> - **Frekuensi:** Sangat sering terjadi setiap harinya.
> - **Dampaknya:** Barang sulit ditemukan kembali karena info tertumpuk chat lain. Selain itu, menyebar nomor HP di grup publik mengancam privasi, dan tidak ada verifikasi yang membuat rawan klaim palsu.
> - **Mengapa perlu diselesaikan:** Karena mahasiswa butuh tempat yang aman, terpusat, dan terpercaya untuk melacak barang mereka tanpa khawatir ditipu."

---

## SLIDE 3: Tujuan Program (Poin 3)
**Visual di Slide:**
- Ikon/Ilustrasi: Keamanan, Terpusat, Cepat.
- Poin Singkat: Platform terpusat, Aman (verifikasi email), Memudahkan pelacakan.

**Script Penjelasan Lisan:**
> "Oleh karena itu, tujuan utama program kami adalah:
> - **Tujuan Utama:** Menciptakan platform tunggal khusus untuk *Lost & Found*.
> - **Masalah yang diselesaikan:** Menghilangkan kebiasaan *spam* di grup WA dan masalah pencurian identitas/privasi.
> - **Bagaimana menyelesaikannya:** Program ini memfilter pengguna menggunakan email domain kampus dan menyediakan fitur chat *in-app* agar nomor HP tidak terekspos.
> - **Manfaat yang diharapkan:** Barang hilang lebih cepat kembali ke pemiliknya dan riwayat pelaporan terdokumentasi dengan baik."

---

## SLIDE 4: Pengguna (User) (Poin 4)
**Visual di Slide:**
- Ikon Mahasiswa (User Utama)
- Ikon Satpam/Staf (Admin/Moderator)

**Script Penjelasan Lisan:**
> "Program ini memiliki dua jenis pengguna:
> 1. **Mahasiswa (Pengguna Utama):** Hak aksesnya adalah bisa membuat laporan kehilangan (Lost) atau penemuan (Found), mencari barang, dan melakukan chat dengan mahasiswa lain.
> 2. **Admin/Satpam (Pengguna Pendukung):** Hak aksesnya adalah memoderasi laporan (Approve/Reject) agar tidak ada spam, dan membuatkan laporan secara *offline/walk-in* jika ada mahasiswa yang lapor langsung ke pos satpam."

---

## SLIDE 5: Fitur Utama (Poin 5)
**Visual di Slide:**
- 3 Ikon Fitur: Sistem Laporan, Chat In-App, Dashboard Admin.

**Script Penjelasan Lisan:**
> "Berikut adalah 3 fitur utama kami:
> - **Fitur 1: Sistem Laporan Lost & Found.** Fungsinya untuk membuat laporan terstruktur dengan wajib upload foto, kategori, dan titik lokasi. Manfaatnya: pencarian lebih mudah karena data rapi dan bisa difilter.
> - **Fitur 2: In-App Chat Realtime.** Fungsinya untuk komunikasi langsung di dalam aplikasi. Manfaatnya: Penemu dan pemilik barang bisa janjian tanpa harus menyebar nomor WhatsApp pribadi (privasi terjaga).
> - **Fitur 3: Admin Moderation.** Fungsinya menyaring laporan sebelum tayang publik. Manfaatnya: Feed aplikasi bersih dari laporan palsu atau spam."

---

## SLIDE 6: Platform & Teknologi (Poin 6)
**Visual di Slide:**
- Logo: Mobile App (React Native), TypeScript, Supabase.

**Script Penjelasan Lisan:**
> "Untuk pembangunannya, kami merencanakannya seperti ini:
> - **^& Tools:** React Native dan Supabase (untuk Database).
> - **Alasan:** Kenapa Mobile? Karena masalah barang hilang (di kantin/parkiran) adalah hal yang *on-the-go*. Dengan HP, mahasiswa bisa langsung foto barang dan lapor di TKP tanpa perlu buka laptop. Kami menggunakan TypeScript karena sangat mendukung penerapan PBO/OOP (Object-Oriented Programming)."

---

## SLIDE 7: Implementasi OOP (PENTING UNTUK MATKUL INI)
**Visual di Slide:**
- **Diagram Kelas (Class Diagram) Sederhana:**
  - Class Induk: `User`
  - Class Anak: `Mahasiswa` dan `Admin` (Inheritance)

**Script Penjelasan Lisan:**
> "Bagaimana penerapan OOP-nya?
> - **Encapsulation:** Data user dan laporan dibungkus dalam class khusus dimana variabelnya *private* dan diakses lewat *method getter/setter*.
> - **Inheritance (Pewarisan):** Kami memiliki class induk `User`. Lalu ada class `Mahasiswa` dan `Admin` yang mewarisi class `User`, namun `Admin` ditambahkan *method* khusus yaitu `approveReport()`.
> - **Polymorphism:** Metode `submitReport()` pada laporan barang hilang (Lost) dan barang ditemukan (Found) bekerja sedikit berbeda (Found butuh lokasi titik penitipan)."

---

## SLIDE 8: Pembagian Tugas (Poin 7)
**Visual di Slide:**
- Nama Anggota 1, 2, 3, 4 (Beserta Role singkat)

**Script Penjelasan Lisan:**
> "Untuk mengerjakan proyek ini, kami membagi tugas sebagai berikut:
> - **[Nama Anggota 1]:** Bertugas di Analisis kebutuhan, perancangan bisnis flow, dan penulisan dokumen Laporan.
> - **[Nama Anggota 2]:** Bertugas di Perancangan sistem (arsitektur PBO) dan pembuatan diagram UML (Use Case & Class Diagram).
> - **[Nama Anggota 3]:** Bertugas di Implementasi program, koding frontend, dan pembuatan fitur.
> - **[Nama Anggota 4]:** Bertugas dalam Testing aplikasi, Perbaikan bug, dan penyusunan materi presentasi."

---

## SLIDE 9: Penutup
**Visual di Slide:**
- Tulisan: "Terima Kasih"
- Tulisan: "Q&A"

**Script Penjelasan Lisan:**
> "Sekian presentasi rancangan program Cari.In dari kami. Kami yakin aplikasi ini adalah solusi nyata untuk lingkungan kampus kita. Silakan jika ada masukan atau pertanyaan."
