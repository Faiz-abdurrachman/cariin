# Naskah Presentasi & Amunisi Q&A PBO: Cari.In

*Catatan: Baca teks ini dengan santai, mengalir seperti orang bercerita, jangan terlihat seperti sedang membaca teks hafalan. Mainkan intonasi.*

---

## BAGIAN 1: SCRIPT PRESENTASI (MENGALIR & ON-POINT)

### Slide 1: Judul
"Halo Bapak/Ibu dosen dan teman-teman semuanya. Kami dari kelompok [Sebutkan Nama Kelompok]. Pernahkah kalian panik karena kehilangan dompet atau kunci motor di kampus? Bingung harus cari ke mana selain nge-spam di grup WA angkatan? Hari ini kami hadir membawa solusinya: **Cari.In**, ekosistem *Lost & Found* khusus mahasiswa."

### Slide 2: Latar Belakang (Statistik Nyata)
"Bicara soal kehilangan barang, ini bukan asumsi kami saja. Kami melakukan observasi dan menyebar survei ke rekan-rekan mahasiswa. Hasilnya nyata: **68%** mahasiswa di kelas kita pernah kehilangan barang di kampus. 

Masalahnya ada di penanganan. Saat ini pencariannya sangat terpecah. Ada yang manual tanya ke satpam, ada yang nebar info di grup WA. Dampaknya apa? Info cepat tenggelam dan barang jarang kembali. Oleh karena itu, kita butuh sebuah sistem penanganan yang terpusat dan terarah."

### Slide 3: Nama Program
"Solusi kami bernama **Cari.In**. Namanya kami buat *catchy* dan melokal agar mudah diingat. Penggunaan *domain* '.In' di sini bukan sekadar gaya-gayaan visual, tapi punya filosofi sebagai *Call to Action*: sebuah ajakan untuk masuk (*In*) ke dalam ekosistem kampus yang aman, dan singkatan tidak resmi dari 'Tolong Cariin dong'."

### Slide 4: Tujuan Program
"Tujuan kami jelas: mengganti budaya lisan dan grup WA yang tidak terorganisir menjadi satu **Platform Terpusat**. 

Dengan Cari.In, laporan didokumentasikan dengan rapi, pencarian barang jadi sangat terstruktur lewat sistem filter, dan yang paling penting: **Keamanan Pengguna**. Tidak perlu lagi menyebar nomor HP pribadi di grup publik yang rawan disalahgunakan."

### Slide 5: Pengguna (User)
"Siapa yang memakai aplikasi ini? Ada dua aktor utama:
Pertama, **Mahasiswa** sebagai pengguna utama. Mereka yang melaporkan barang hilang, mencari barang temuan, dan berkomunikasi.
Kedua, **Admin Sistem atau Satpam**. Mereka yang memvalidasi laporan agar tidak ada spam, serta mengelola kasus yang sudah ditutup atau diselesaikan."

### Slide 6: Fitur Utama
"Untuk mendukung user tersebut, ini 5 fitur inti kami:
1. **Laporan Digital**: Pelaporan terstruktur yang wajib menyertakan foto dan lokasi.
2. **Pencarian & Filter Pintar**: Mahasiswa tidak perlu *scroll* manual, cukup gunakan *keyword* dan kategori barang.
3. **Notifikasi Real-Time**: Langsung ke HP saat ada laporan baru atau *update* status dari satpam.
4. **Private In-App Chat**: Ini fitur krusial kami untuk privasi. Komunikasi antara pelapor dan penemu murni lewat sistem, tanpa tukar nomor WhatsApp.
5. **Dashboard Admin**: Tempat admin menyetujui klaim agar data tetap valid."

### Slide 7: Platform & Teknologi (Alasan Teknis & OOP)
"Mengingat masalah barang hilang sering disadari saat mahasiswa sedang berpindah tempat (*on-the-go*), kami membangun sistem ini berbasis **Mobile**. Mahasiswa bisa langsung memfoto barang temuan pakai kamera HP dari lokasi kejadian.

Untuk teknologinya, kami menggunakan **React Native** dengan **TypeScript**. Kenapa kami sangat menekankan TypeScript? Karena bahasa ini mendukung implementasi **Object-Oriented Programming (PBO)** secara ketat di sisi *client*.

Untuk backend, daripada pusing mengurus server dari nol, kami menggunakan layanan **Supabase**. Keunggulannya, Supabase memakai database relasional **PostgreSQL**, yang sangat cocok untuk memetakan desain *Class* dan Objek kami ke dalam tabel database yang terhubung satu sama lain. Supabase juga menyediakan Autentikasi yang bisa kami kunci hanya untuk email domain kampus kita."

### Slide 8: Implementasi OOP (Pilar Utama PBO)
"Karena ini mata kuliah PBO, kami menerapkan 4 pilar utamanya:
1. **Inheritance**: Kami punya Class dasar `User`. Class `Admin` dan `Mahasiswa` mewarisi sifat `User`, tapi `Admin` ditambahkan *method* khusus seperti `approveLaporan()`.
2. **Encapsulation**: Atribut krusial seperti Token Login kami buat *private*. Komponen UI tidak bisa menembus data ini sembarangan, harus lewat jalan resmi yaitu *getter* dan *setter*.
3. **Polymorphism**: *Method* `submit()` kami buat dinamis. Jika yang di-submit adalah Laporan Temuan, perilakunya berbeda: sistem akan mewajibkan mahasiswa mengisi 'Titik Penitipan Barang' ke Satpam.
4. **Abstraction**: Kami menggunakan *Interface* agar UI aplikasi tidak tahu-menahu soal bahasa *query database* di balik layar, cukup tahu cara menekan tombol dan data pun muncul."

### Slide 9: Pembagian Tugas & Penutup
*(Sebutkan nama asli anggota kelompok dan perannya sesuai di slide baru)*
"Proyek ini dikerjakan secara tim oleh [Nama 1] sebagai PM, [Nama 2] untuk desain, [Nama 3] mengurus backend, dll.
Sekian rancangan Cari.In, platform yang kami yakini bisa menyelesaikan masalah nyata dengan penerapan logika PBO yang terstruktur. Terima kasih, silakan jika ada pertanyaan."

---

## BAGIAN 2: AMUNISI Q&A DOSEN KILLER

*Jika dosen mulai menyerang dengan pertanyaan menjebak, gunakan jawaban di bawah ini yang memadukan alasan teknis dan logika arsitektur.*

### 💥 Q1: "Kenapa nggak bikin pakai Website aja? Toh lebih gampang diakses dari laptop tanpa harus install aplikasi?"
**Jawaban Mematikan:**
"Izin menjawab, Pak/Bu. *Use-case* utama aplikasi barang hilang terjadi secara insidental dan *on-the-go*. Contohnya: ada mahasiswa lari ke kelas dan menjatuhkan kunci motor di tangga. Mahasiswa lain menemukannya. Jika sistemnya Web, mahasiswa penemu harus buka laptop, nyalakan *tethering*, lalu lapor. Sangat tidak praktis. Dengan Mobile App, dia bisa langsung mencabut HP dari saku, foto kunci motornya, tekan *submit*, dan mengirimkan *push notification* ke pemiliknya secara seketika."

### 💥 Q2: "Coba jelaskan ulang kenapa kalian milih React Native + TypeScript dibanding Flutter?"
**Jawaban Mematikan:**
"Kami membandingkan keduanya, Pak/Bu. Flutter (dengan bahasa Dart) memang bagus, tapi kami memilih React Native dengan **TypeScript** karena TypeScript memaksa penulisan kode menggunakan *interface*, *type-checking*, dan pendefinisian *Class* yang ketat. Ini sangat relevan dengan capaian pembelajaran mata kuliah PBO. Selain itu, ekosistem *library* React Native sangat luas, memudahkan kami untuk memperluas fitur ke depannya."

### 💥 Q3: "Di slide dibilang pakai Supabase yang berbasis PostgreSQL. Kenapa nggak pakai Firebase aja yang gampang dan NoSQL?"
**Jawaban Mematikan:**
"Sebenarnya ini keputusan arsitektural yang sangat krusial, Pak/Bu. Firebase menggunakan NoSQL (Dokumen), di mana data biasanya disimpan bersarang (*nested*). Padahal, dalam pemodelan PBO aplikasi kami, entitasnya sangat relasional: 1 User bisa punya Banyak Laporan, dan 1 Laporan bisa punya Banyak Obrolan (Chat).
Jika menggunakan NoSQL, mengelola relasi objek yang rumit ini akan sangat menyulitkan dan boros *query*. Oleh karena itu, kami memilih Supabase dengan **PostgreSQL** karena ia adalah *Relational Database Management System (RDBMS)*. Struktur Tabel di Postgres dapat di- *mapping* (ORM) secara sempurna satu-banding-satu dengan struktur *Class Object* kami di TypeScript."

### 💥 Q4: "Bukankah fitur 'Chat Terenkripsi' itu terlalu muluk-muluk untuk tugas kuliah?"
**Jawaban Mematikan:**
"Betul, Pak/Bu. Setelah kami mengevaluasi ulang *scope* pengerjaannya, kami sepakat mengubah penyebutannya menjadi **Private In-App Chat**. Alih-alih membuat algoritma *End-to-End Encryption* (seperti RSA) dari nol yang akan membebani server, kami berfokus pada enkripsi *In-Transit* (HTTPS/WSS) dan proteksi *Row Level Security (RLS)* di level database. Jadi, chat tetap aman dari publik tanpa over-engineering yang tidak realistis untuk jangka waktu tugas ini."

### 💥 Q5: "Di bagian Abstraksi (Abstraction), maksudnya 'UI tidak tahu menahu soal query' itu apa?"
**Jawaban Mematikan:**
"Maksudnya kami memisahkan *Logic* dan *Tampilan* (seperti pola MVC/MVVM). Layar tombol di HP tidak menulis sintaks `SELECT * FROM laporan`. Layar hanya memanggil sebuah *Interface* bernama `ReportService.getSemuaLaporan()`. Kerumitan tentang bagaimana aplikasi menghubungi *server* Supabase disembunyikan (diabstraksi) di dalam *Class ReportService* tersebut. Sehingga jika besok kami ganti *database*, kami tidak perlu membongkar seluruh kode tampilan (UI), cukup *class service*-nya saja."