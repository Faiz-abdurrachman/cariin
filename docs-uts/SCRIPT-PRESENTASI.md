# SCRIPT PRESENTASI VIDEO — UTS MOBILE PROGRAMMING

> **Project:** Cari.In Mobile
> **Format:** Video presentasi YouTube (unlisted atau public)
> **Target durasi:** 12-15 menit
> **Style:** Profesional tapi natural, bahasa Indonesia
>
> Script ini bisa lo baca/improvisasi saat record. Bagian dalam **bold** = highlight kata yang ditekan. Bagian *italic* = action visual / cue camera.

---

## STRUKTUR SLIDE (12 slide utama)

| # | Slide | Durasi | Page Visual |
|---|-------|--------|-------------|
| 1 | Cover & Identitas | 30 detik | Logo + nama + dosen |
| 2 | Analisis Permasalahan | 1 menit | Bullet pain points + foto mading/WA chaos |
| 3 | Solusi yang Diusulkan | 30 detik | Logo Cari.In + tagline |
| 4 | Analisis Kebutuhan (FR + NFR) | 1.5 menit | 2 kolom: functional vs non-functional |
| 5 | Survey & Studi Banding | 1 menit | Chart hasil survey + screenshot apps pembanding |
| 6 | Timeline (Gantt Chart) | 1 menit | Mermaid Gantt + status FASE 1-4 done |
| 7 | Wireframe (Low-Fi) | 1 menit | Screenshot beberapa HTML prototype dari cariin-web |
| 8 | Desain Interface (High-Fi) | 1.5 menit | Screenshot RN screens dari iPhone |
| 9 | Hasil Coding | 1.5 menit | Code snippet (auth + upload + RLS) |
| 10 | Database & ERD | 1 menit | Mermaid ERD diagram |
| 11 | Live Demo | 2-3 menit | Screen recording iPhone Expo Go |
| 12 | Penutup & Tanya Jawab | 30 detik | Thank you + repo & demo info |

**Total: ~12-13 menit**

---

## SLIDE 1 — COVER & IDENTITAS

> *Tampilan: slide dengan logo / icon Cari.In, judul project, identitas, dosen pembimbing.*

**Naskah (30 detik):**

> "Halo, perkenalkan, saya **Faiz Abdurrachman**, mahasiswa Mobile Programming Universitas Nahdlatul Ulama Yogyakarta.
>
> Hari ini saya akan menyampaikan **laporan progress proyek UTS** saya, yang berjudul **Cari.In** — sebuah aplikasi mobile lost & found untuk mahasiswa UNU Yogyakarta.
>
> Project ini dibimbing oleh dosen pengampu Bapak/Ibu **Yana Hendriana, ST., M.Eng.**
>
> Mari kita mulai."

---

## SLIDE 2 — ANALISIS PERMASALAHAN

> *Tampilan: list bullet pain points + ilustrasi mading kacau / chat WA group bertumpuk.*

**Naskah (1 menit):**

> "Setiap hari di kampus, kita pasti pernah dengar cerita teman yang **kehilangan barang** — mulai dari KTM, dompet, charger, sampai laptop.
>
> Sebaliknya, ada juga mahasiswa yang menemukan barang dan **bingung mau diberikan ke siapa**.
>
> Masalahnya, di kampus kita belum ada platform terstruktur untuk hal ini. Saluran yang ada saat ini menyebabkan beberapa masalah:
>
> *(scroll bullet by bullet)*
> - **WhatsApp grup** — laporan tersebar di banyak grup, mudah terkubur dalam ratusan chat lain.
> - **Story Instagram** — hilang dalam 24 jam, tidak ada arsip.
> - **Mading fisik** — penuh kertas tertumpuk, sulit ter-update.
> - **Tidak ada verifikasi** — rawan spam, troll, atau klaim palsu.
> - **Privacy concern** — pelapor terpaksa broadcast nomor HP di grup publik.
>
> Akumulasi masalah ini bikin barang yang seharusnya bisa kembali ke pemiliknya, **akhirnya hilang permanen**."

---

## SLIDE 3 — SOLUSI: CARI.IN

> *Tampilan: logo besar Cari.In + tagline + 4 highlight feature.*

**Naskah (30 detik):**

> "Cari.In hadir sebagai solusi: **aplikasi mobile lost & found terstruktur khusus mahasiswa kampus**.
>
> Empat fitur utamanya:
> 1. **Login dengan email kampus** — auto-validasi keanggotaan civitas akademika.
> 2. **Post laporan dengan foto wajib** — visual jelas, kategori terstandar.
> 3. **Chat in-app** antara pelapor dan penemu — privacy terjaga, tanpa broadcast nomor HP.
> 4. **Moderasi admin** — semua laporan butuh approval sebelum tampil publik."

---

## SLIDE 4 — ANALISIS KEBUTUHAN (FR + NFR)

> *Tampilan: 2 kolom side-by-side. Kiri: Functional Req. Kanan: Non-Functional Req.*

**Naskah (1.5 menit):**

> "Saya membagi kebutuhan aplikasi menjadi **dua kategori: fungsional dan non-fungsional**.
>
> *(Tunjukkan kolom kiri)*
>
> **Kebutuhan fungsional** — apa yang harus dilakukan aplikasi:
> - Otentikasi dengan email kampus dan dua role: mahasiswa & admin.
> - Manajemen laporan: create, edit, delete, mark as resolved.
> - Browsing feed dengan filter tipe Lost/Found, 8 kategori barang, dan search.
> - Detail laporan menampilkan info pelapor tanpa nomor HP — privacy by design.
> - Chat realtime, notifikasi, dan moderasi admin.
>
> *(Tunjukkan kolom kanan)*
>
> **Kebutuhan non-fungsional** — kualitas teknis:
> - **Performance**: cold start di bawah 3 detik, feed load di bawah 2 detik.
> - **Security**: Row Level Security di setiap tabel database, password di-hash, storage upload terbatas folder user.
> - **Usability**: bahasa Indonesia, mobile-first, validasi inline.
> - **Maintainability**: TypeScript strict, modular service layer, dokumentasi handoff.
> - **Compatibility**: iOS 13+, Android 8+, plus web preview untuk dev cepat."

---

## SLIDE 5 — REFERENSI: SURVEY & STUDI BANDING

> *Tampilan: bar chart hasil survey + thumbnail apps pembanding (Tokopedia, Gojek, Instagram, etc).*

**Naskah (1 menit):**

> "Untuk memvalidasi masalah, saya melakukan **observasi lapangan** di kampus dan **wawancara informal** ke teman seangkatan.
>
> Hasil utama:
> - **70% responden pernah kehilangan barang** dalam 6 bulan terakhir.
> - **85% menggunakan WhatsApp grup** sebagai saluran utama.
> - Hanya **40% yang berhasil dapat update** mengenai barangnya.
> - **90% tertarik dengan platform terstruktur** dengan rating 4-5 dari 5.
>
> Untuk desain, saya melakukan studi banding ke beberapa aplikasi populer:
> - **Tokopedia** untuk inspirasi card-based feed.
> - **Gojek** untuk pattern bottom tab dengan FAB di tengah.
> - **Instagram** untuk image-first card design.
> - **WhatsApp** untuk pattern inbox & chat room.
>
> Color palette saya pilih **monochrome zinc dengan aksen emerald (found) dan red (lost)** — terinspirasi Linear dan Notion untuk kesan minimal & profesional."

---

## SLIDE 6 — TIMELINE (GANTT CHART)

> *Tampilan: Mermaid Gantt chart dengan FASE 1-4 done (warna penuh), FASE 4.5/5/6 outline.*

**Naskah (1 menit):**

> "Project saya bagi menjadi **6 fase utama** dalam Gantt Chart berikut.
>
> *(tunjukkan chart)*
>
> - **FASE 1 sampai 4 sudah selesai dan ter-commit di Git** — total 4 commit terstruktur dengan format konsisten.
> - **FASE 4.5 — Chat realtime** — fase berikutnya, akan diimplementasi via Supabase Realtime channel.
> - **FASE 5 — Admin Screens** — moderasi, dashboard, walk-in reports.
> - **FASE 6 — Polish & Submission** — Settings, Help, animasi, EAS build standalone.
>
> Status hari ini: **57% dari total proyek sudah selesai**, sisa 43% berada dalam timeline feasibility untuk delivery final."

---

## SLIDE 7 — WIREFRAME (LOW-FIDELITY)

> *Tampilan: kolase 6-8 thumbnail HTML prototype dari folder cariin-web.*

**Naskah (1 menit):**

> "Untuk wireframe low-fidelity, saya menyusun **26 file HTML prototype** sebagai blueprint.
>
> File HTML ini fokus pada **struktur layout dan flow antar layar**, bukan detail visual final. Tujuannya supaya saat saya implementasi di React Native, sudah ada referensi yang clear.
>
> *(scroll thumbnail wireframe)*
>
> Beberapa highlight wireframe:
> - **Home feed** dengan search, filter chip, kategori grid, dan list card.
> - **Detail laporan** dengan foto besar dan info terstruktur.
> - **Form Create** dengan toggle Lost/Found dan upload foto.
> - **My Posts** dengan action button context-aware.
> - **Profile** dengan menu items dan logout.
>
> Total **26 layar telah saya inventaris** sebelum coding dimulai."

---

## SLIDE 8 — DESAIN INTERFACE (HIGH-FIDELITY)

> *Tampilan: screenshot RN screens aktual dari iPhone, side-by-side 4-6 screen.*

**Naskah (1.5 menit):**

> "Inilah **hasil implementasi UI di React Native aktual**, di-screenshot dari iPhone via Expo Go.
>
> *(tunjukkan screenshot satu per satu)*
>
> 1. **Home Screen** — sticky header dengan greeting nama user, search bar, filter chip, category grid horizontal scrollable, dan FlatList ReportCard. Pull-to-refresh aktif.
>
> 2. **Detail Laporan** — foto besar 320 pixel, badges tipe + kategori + status + via Admin, info lokasi & waktu dalam card, deskripsi, reporter card, dan tombol CTA bottom.
>
> 3. **Create Report** — toggle smooth Kehilangan / Menemukan, area upload foto dashed border yang berubah jadi preview 200 pixel setelah upload, kategori grid 4 kolom dengan emoji, validasi inline.
>
> 4. **Success Screen** — animated checkmark hijau dengan pop-in animation, dua tombol action.
>
> 5. **Laporanku** — card horizontal dengan thumbnail, status badge dynamic, dan action button context-aware (Tandai Selesai untuk approved, Edit dan Hapus tetap available).
>
> 6. **Profile** — avatar circular dengan shadow, menu items, dan tombol Keluar merah dengan konfirmasi.
>
> Design system saya: **monochrome zinc dengan aksen warna kontekstual** (red untuk lost, emerald untuk found, indigo untuk admin)."

---

## SLIDE 9 — HASIL CODING

> *Tampilan: screenshot 3 code snippet (auth.service register, upload.service base64, RLS policy SQL).*

**Naskah (1.5 menit):**

> "Sekarang ke bagian teknis. **Stack utama:**
>
> - Frontend: **Expo SDK 54, React Native 0.81.5, NativeWind v4, TypeScript strict**.
> - State: **Zustand untuk feed, React Context untuk auth**.
> - Navigation: **React Navigation v7** — Stack, Bottom Tab, Drawer.
> - Backend: **Supabase** — PostgreSQL, Auth, Storage, Realtime.
>
> Ada beberapa pattern engineering yang saya highlight:
>
> *(tunjukkan snippet 1: auth.service.ts register)*
>
> **Service layer terpisah** — semua Supabase API call ter-wrap di service modular: `auth.service.ts`, `report.service.ts`, `upload.service.ts`. Komponen UI tidak pernah hit Supabase langsung.
>
> *(tunjukkan snippet 2: upload base64 to Uint8Array)*
>
> **Untuk upload foto dari React Native ke Supabase Storage**, saya pakai approach **base64 ke Uint8Array via `atob` global Hermes**. Pendekatan ini lebih reliable dibanding `fetch(uri).blob()` yang sering bermasalah di Android.
>
> *(tunjukkan snippet 3: RLS SQL policy)*
>
> **Row Level Security di database** — bahkan kalau client compromised, database menolak akses tidak sah. Setiap tabel punya policy untuk SELECT, INSERT, UPDATE, DELETE.
>
> Sebagai bukti, **TypeScript strict mode dengan zero `any` ESLint enforcement**, **3,659 lines of code** ter-commit di FASE 4 saja, dan **ZERO type error** di typecheck."

---

## SLIDE 10 — DATABASE & ERD

> *Tampilan: Mermaid ERD diagram penuh layar.*

**Naskah (1 menit):**

> "Database design saya pakai **5 tabel relasional** di PostgreSQL:
>
> - **`profiles`** — 1-to-1 dengan auth.users, dibuat otomatis via DB trigger saat signup.
> - **`reports`** — laporan utama dengan 8 kategori, 4 status (pending/approved/rejected/resolved), dan field metadata untuk laporan walk-in admin.
> - **`conversations`** — pasangan user untuk chat per laporan.
> - **`messages`** — isi pesan dengan read receipt.
> - **`notifications`** — in-app notification dengan 3 type.
>
> Hubungan antar tabel:
> - 1 user punya banyak reports, conversations, messages.
> - 1 report bisa punya banyak conversation (1 conversation per pasangan user).
> - 1 conversation punya banyak messages.
>
> Selain itu, ada **3 trigger DB** untuk auto-update timestamp, auto-create profile saat signup, dan auto-update last_message di conversation. Plus **storage 3 bucket**: report-photos, avatars, dan chat-media.
>
> Schema lengkap ada di file `supabase-schema.sql`, bisa di-rerun karena idempotent."

---

## SLIDE 11 — LIVE DEMO

> *Tampilan: switch ke screen recording iPhone (atau mirror via QuickTime kalau lo punya Mac, atau pakai aplikasi seperti scrcpy untuk Android).*

**Naskah (2-3 menit):**

> "Sekarang **demo end-to-end** menggunakan iPhone via Expo Go.
>
> *(start recording iPhone)*
>
> **Pertama, register akun baru** dengan email kampus. *(tunjukkan input)* Saya pakai akun `faiz@student.unu-jogja.ac.id` dengan password.
>
> Setelah login, masuk ke **Home screen** dengan greeting nama saya. Ada 5 laporan seed di feed. *(scroll)*
>
> *(tap filter Hilang)* Filter tipe Hilang menampilkan 3 laporan. *(tap kategori Elektronik)* Filter kategori menampilkan charger MacBook saja.
>
> *(tap card)* Tap card buka **detail screen** dengan foto besar, info lokasi, waktu, deskripsi, dan reporter info — tanpa nomor HP karena privacy.
>
> *(back, tap FAB +)* Saya buat **laporan baru**. Pilih foto dari galeri *(tunjukkan picker)*, isi judul, pilih kategori, isi lokasi.
>
> *(submit)* Tap Kirim Laporan — proses upload ke Supabase Storage, lalu insert ke database. *(tunggu)* Selesai — muncul **Success screen** dengan checkmark animated.
>
> *(tap Lihat Laporanku)* Pindah ke **tab Laporanku**. Laporan baru muncul dengan status Menunggu Review (pending). Laporan saya yang lain bisa di-Tandai Selesai dengan konfirmasi.
>
> *(tap profil)* Terakhir, **tab Profil** menampilkan avatar, NIM, fakultas, dan tombol Keluar."

> *(switch back ke slide presentasi)*

---

## SLIDE 12 — PENUTUP & TANYA JAWAB

> *Tampilan: Thank you slide dengan ringkasan project + link demo + repo + Q&A invitation.*

**Naskah (30 detik):**

> "Itulah laporan progress UTS saya untuk mata kuliah Mobile Programming.
>
> Status saat ini: **57% dari project sudah selesai**, dengan FASE 1 sampai 4 ter-deliver dan ter-commit di Git. Sisa fase ada di roadmap dengan timeline yang feasible.
>
> Project Cari.In ini saya kerjakan dengan engineering quality yang ketat — **TypeScript strict, modular service layer, RLS database, dan dokumentasi handoff yang lengkap**.
>
> *(tunjukkan link)*
>
> Untuk dokumentasi lengkap dan kode bisa diakses di repository **(sebut link GitHub)**.
>
> Terima kasih atas waktu Bapak/Ibu Dosen. Saya siap untuk **sesi tanya jawab**."

---

## TIPS PEMBAWAAN

### Sebelum Recording

- **Latihan 2-3 kali** dulu sambil checking durasi per slide pakai stopwatch.
- **Tulis ringkasan poin** per slide di catatan terpisah (untuk reference saat record).
- **Siapkan demo akun** & device — pastikan akun mahasiswa logged-in di Expo Go, ada koneksi internet stabil.
- **Restart Expo & Metro** beberapa menit sebelum record biar fresh.

### Saat Recording

- **Gak usah baca persis** — improvisasi sesuai pemahaman lo. Naskah cuma guide.
- **Jeda alami antar poin** — lebih baik 2-3 detik diam daripada terburu-buru.
- **Antusiasme**: nada suara naik di highlight kata bold, biar engaging.
- **Kalau salah ngomong**: jangan stop, ulang kalimat dengan natural ("oke maksud saya...").
- **Eye contact** ke kamera laptop — bukan ke layar handphone.

### Pertanyaan Q&A yang Mungkin Muncul

| Pertanyaan | Jawaban Singkat |
|------------|-----------------|
| Kenapa pilih Supabase, bukan Firebase? | Open-source, PostgreSQL relasional (lebih cocok untuk relasi kompleks reports↔conversations), RLS native, harga lebih terjangkau setelah free tier. |
| Kenapa Expo, bukan bare React Native? | Managed workflow lebih cepat untuk MVP, OTA update via EAS, akses native API tanpa setup Xcode/Gradle. |
| Bagaimana handle kasus pelapor tidak punya akun? | Admin walk-in via fitur "Buat Laporan" di AdminNavigator, set `created_by_admin = TRUE`, tampil dengan badge "via Admin". |
| Bagaimana scaling kalau pengguna ribuan? | Supabase managed (auto-scale), feed query pakai index pada `status`, `type`, `created_at`. RLS dilakukan di database — tidak bottleneck di app. |
| Ada plan untuk web version? | Sudah enable web preview via react-native-web, tapi prioritas mobile dulu. |
| Bagaimana cara test admin flow? | Login dengan akun `admin@cariin.app` (sudah seeded), masuk ke AdminDrawer. FASE 5 sedang dikerjakan. |
| Privacy data pengguna? | RLS policy mengatur akses, password hashed via Supabase Auth (bcrypt), foto storage terbatas folder per user, profil publik tidak menampilkan nomor HP. |
| Kenapa pakai Pressable children-as-function? | Pattern function-form `style={({pressed}) => ...}` di RN/Expo SDK 54 sering broken (tombol invisible). Children-as-function reliable. Terdokumentasi di handoff doc. |

---

## CHECKLIST SEBELUM UPLOAD VIDEO

- [ ] Video sudah di-edit (intro, transisi, BGM optional)
- [ ] Audio jelas, no echo, no background noise
- [ ] Subtitle (optional tapi bagus untuk accessibility)
- [ ] Resolusi minimal 1080p
- [ ] Durasi tidak lebih dari 15 menit
- [ ] Thumbnail menarik (template di PANDUAN-VIDEO.md)
- [ ] Title + deskripsi video sesuai (template di PANDUAN-VIDEO.md)
- [ ] Privacy: Unlisted (kalau dosen minta link akses) atau Public
- [ ] Test play di HP & laptop, pastikan smooth

---

## CONTOH OPENING & CLOSING (FOR PRACTICE)

**Opening (paling impactful 10 detik):**
> *(senyum, tatap kamera)*
> "Pernah kehilangan barang di kampus? Atau menemukan barang yang bukan punya kamu?
>
> Hai, saya Faiz Abdurrachman, dan saya akan menunjukkan **Cari.In** — solusi lost & found kampus yang saya bangun untuk UTS Mobile Programming."

**Closing (memorable):**
> "Cari.In bukan sekadar aplikasi — ini adalah platform yang membantu mahasiswa **saling tolong** dengan teknologi.
>
> Terima kasih atas waktu Bapak/Ibu Dosen. Saya tunggu masukannya."

---

**SEMOGA SUKSES BRO! 🚀**
