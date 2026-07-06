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
- Logo: React Native (Expo SDK 54), TypeScript, Supabase.
- Ikon: Navigasi Stack + Tab + Drawer · SecureStore (kunci).

**Script Penjelasan Lisan:**
> "Untuk pembangunannya, kami merencanakannya seperti ini:
> - **Tools:** React Native (Expo) untuk aplikasi, TypeScript sebagai bahasa, dan Supabase untuk database & autentikasi.
> - **Alasan Mobile:** Masalah barang hilang bersifat *on-the-go* — mahasiswa bisa langsung foto barang dan lapor di TKP tanpa buka laptop.
> - **Alasan TypeScript:** Bahasa ini mendukung penuh konsep **PBO/OOP** — class, inheritance, abstract, dan access modifier (private/protected) — sehingga model objek kami bisa ditulis secara ketat.
> - **Navigasi:** Kami memakai tiga pola — Stack (alur login), Bottom Tab (mahasiswa & admin), dan Drawer (menu geser admin). Token login (JWT) disimpan aman terenkripsi lewat SecureStore."

---

## SLIDE 7: Implementasi OOP (PENTING UNTUK MATKUL INI)
**Visual di Slide:**
- **Class Diagram** (dari `uas-pbo/class-diagram.md`):
  - Class Induk abstrak: `User` → anak `Mahasiswa` & `Admin` (Inheritance)
  - Class Induk abstrak: `ReportModel` → anak `LostReport` & `FoundReport`
- Catatan kecil: "Kode nyata di folder `src/models/`"

**Script Penjelasan Lisan:**
> "Karena ini mata kuliah PBO, kami menerapkan 4 pilar utamanya, dan semuanya ada wujud kodenya di folder `src/models/`:
> 1. **Abstraction:** Kami punya `abstract class User` dan `abstract class ReportModel` yang tidak bisa di-instansiasi langsung — hanya jadi blueprint.
> 2. **Encapsulation:** Field seperti `_id` dan `_name` kami buat `private`, hanya bisa diakses lewat *getter*, dan *setter* `name` punya validasi (tidak boleh kosong).
> 3. **Inheritance:** Class `Mahasiswa` dan `Admin` sama-sama `extends User`. Tapi `Admin` menambah method khusus yaitu `approveReport()` dan `rejectReport()`.
> 4. **Polymorphism:** Method `canModerate()` mengembalikan `false` untuk Mahasiswa dan `true` untuk Admin. Begitu juga `validate()` — untuk `FoundReport` wajib mengisi titik penitipan, sedangkan `LostReport` tidak. Dan ini benar-benar dipakai di aplikasi, bukan sekadar teori."

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
