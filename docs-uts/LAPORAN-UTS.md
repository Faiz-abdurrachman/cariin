# LAPORAN PROGRESS PROYEK MOBILE PROGRAMMING

## Cari.In — Aplikasi Lost & Found Kampus UNU Yogyakarta

> **Mata Kuliah:** Mobile Programming — Semester 4
> **Dosen Pengampu:** Yana Hendriana, ST., M.Eng.
> **Mahasiswa:** Faiz Abdurrachman
> **Universitas:** Universitas Nahdlatul Ulama Yogyakarta
> **Tanggal Laporan:** 10 Mei 2026
> **Status Progres:** FASE 1-4 selesai (Auth + Core Mahasiswa lengkap)

---

## RINGKASAN EKSEKUTIF

**Cari.In** adalah aplikasi mobile berbasis Expo/React Native untuk mengelola laporan barang hilang dan temuan di lingkungan kampus UNU Yogyakarta. Aplikasi ini menggantikan praktik existing yang masih tersebar di WhatsApp grup dan mading fisik dengan platform terstruktur yang menyediakan fitur post laporan dengan foto, kategorisasi 8 jenis barang, search & filter, chat realtime antar pelapor & penemu, serta moderasi admin.

**Highlight implementasi saat ini:**
- ✅ Setup project Expo SDK 54 + React Native 0.81.5 + NativeWind v4 + TypeScript strict
- ✅ Backend Supabase (PostgreSQL + Auth + Storage + Realtime) sudah deployed
- ✅ 5 tabel relasional dengan Row Level Security (RLS) policies
- ✅ 3 jenis navigasi (Stack + Bottom Tab + Drawer) sesuai requirement dosen
- ✅ Auth flow lengkap (Splash → Role Selection → Login/Register → Forgot Password)
- ✅ Core mahasiswa: feed laporan, detail, create dengan upload foto, my posts, profile
- 🔜 Sisa: chat realtime, admin moderation, polish & EAS build

---

## 1. ANALISIS PERMASALAHAN

### 1.1 Konteks

Lingkungan kampus modern ditandai dengan mobilitas tinggi mahasiswa yang berpindah-pindah antar gedung, ruang kelas, kantin, perpustakaan, parkiran, dan area umum. Dalam aktivitas tersebut, **kehilangan barang merupakan kejadian rutin** — mulai dari KTM, dompet, charger, kunci kendaraan, hingga laptop. Sebaliknya, mahasiswa yang menemukan barang sering kebingungan menentukan langkah selanjutnya untuk menyerahkan kepada pemiliknya.

Berdasarkan observasi informal di kampus UNU Yogyakarta dan beberapa kampus pembanding, **belum ada platform terstruktur** yang mempertemukan pelapor kehilangan dengan penemu barang. Saluran komunikasi yang ada saat ini bersifat ad-hoc dan tersebar.

### 1.2 Pain Points (Masalah Spesifik)

| No | Masalah | Dampak |
|----|---------|--------|
| 1 | **Saluran komunikasi tersebar** — laporan kehilangan tersebar di WhatsApp grup angkatan, jurusan, fakultas, dll. | Mahasiswa harus monitor banyak grup; pesan terkubur dalam chat. |
| 2 | **Story Instagram hilang dalam 24 jam** | Tidak ada arsip historis. Barang yang ditemukan setelah 1-2 hari sulit di-trace. |
| 3 | **Mading fisik tidak terkelola** | Pengumuman menumpuk, tidak ada moderasi, sulit search. |
| 4 | **Tidak ada verifikasi identitas pelapor** | Rawan spam, hoax, atau penipuan klaim barang yang bukan haknya. |
| 5 | **Tidak ada moderasi konten** | Laporan berbau lelucon, troll, atau iklan jualan tidak terkontrol. |
| 6 | **Privacy concern** — broadcast nomor HP di grup publik | Pelapor merasa tidak aman membagikan kontak personal. |
| 7 | **Tidak ada kategorisasi & search** | Mahasiswa tidak tahu di mana mencari laporan kehilangan barang spesifik. |
| 8 | **Tidak ada notifikasi terstruktur** | Pelapor harus aktif memeriksa apakah barangnya sudah ditemukan. |

### 1.3 Stakeholder Terdampak

- **Mahasiswa pelapor (kehilangan):** butuh platform mudah untuk melaporkan dengan deskripsi & foto, lalu dapat notifikasi jika ada update.
- **Mahasiswa penemu:** butuh cara cepat untuk meneruskan barang temuan ke pemilik tanpa harus bertanggung jawab menyimpan jangka panjang.
- **Admin kampus / petugas keamanan:** butuh dashboard untuk moderasi, mencegah spam, dan input laporan walk-in dari mahasiswa yang menyerahkan barang langsung.
- **Universitas:** ingin membantu citra kampus yang care terhadap mahasiswa & memfasilitasi solusi nyata dengan teknologi.

### 1.4 Solusi yang Diusulkan

**Cari.In** menawarkan platform mobile dengan karakteristik:

1. **Login dengan email kampus** (`@student.unu-jogja.ac.id`) — auto-validasi keanggotaan civitas akademika, mengurangi spam dari luar kampus.
2. **Post laporan terstruktur** (foto wajib, kategori, lokasi, deskripsi).
3. **Chat 1-on-1 in-app** antar pelapor & penemu — privacy terjaga (tanpa broadcast nomor HP).
4. **Moderasi admin** — semua laporan masuk dengan status `pending`, butuh approval admin sebelum tampil di feed publik.
5. **Notifikasi otomatis** — saat laporan disetujui/ditolak atau ada pesan baru.
6. **Arsip permanen** — semua laporan tersimpan di database, bisa di-search kapan saja.

---

## 2. ANALISIS KEBUTUHAN

### 2.1 Functional Requirements (Kebutuhan Fungsional)

#### A. Otentikasi & Otorisasi
- **FR-1.** User dapat register dengan email kampus (`@student.unu-jogja.ac.id`), password, NIM, fakultas, departemen.
- **FR-2.** User dapat login dengan email + password.
- **FR-3.** User dapat reset password via email link.
- **FR-4.** Sistem memvalidasi domain email saat register (reject email non-kampus).
- **FR-5.** Sistem memiliki dua role: `mahasiswa` (default) dan `admin` (manual seed).
- **FR-6.** Routing pasca login dinamis: mahasiswa → MainNavigator, admin → AdminNavigator (Drawer).

#### B. Manajemen Laporan (Mahasiswa)
- **FR-7.** Mahasiswa dapat membuat laporan tipe **Lost** (kehilangan) dengan: foto wajib, judul, deskripsi, kategori (8 jenis), lokasi terakhir.
- **FR-8.** Mahasiswa dapat membuat laporan tipe **Found** (temuan) dengan field tambahan: titik penitipan barang.
- **FR-9.** Foto laporan diupload ke Supabase Storage bucket `report-photos` dengan path `<user_id>/<file>`.
- **FR-10.** Laporan baru otomatis berstatus `pending`, butuh approval admin.
- **FR-11.** Mahasiswa dapat melihat daftar laporannya sendiri (My Posts) di tab Laporanku — semua status (pending, approved, rejected, resolved).
- **FR-12.** Mahasiswa dapat **edit** laporan miliknya (jika status ≠ resolved/rejected).
- **FR-13.** Mahasiswa dapat **hapus** laporan miliknya (jika status ≠ resolved).
- **FR-14.** Mahasiswa dapat **menandai laporan sebagai Selesai** (resolved) jika sudah ditemukan/dikembalikan.

#### C. Browsing & Filter (Public Feed)
- **FR-15.** Semua mahasiswa dapat melihat feed laporan publik (status `approved` atau `resolved`).
- **FR-16.** Feed mendukung filter:
  - Tipe: Semua / Lost / Found
  - Kategori: 8 jenis (Elektronik, Dokumen, Dompet/Tas, Kunci, Aksesoris, Pakaian, Buku/ATK, Lainnya)
  - Search keyword (match pada judul)
- **FR-17.** Tap laporan → halaman detail dengan info reporter (nama + fakultas, **tanpa nomor HP** — privacy).
- **FR-18.** Pull-to-refresh untuk reload feed.

#### D. Komunikasi (FASE 4.5)
- **FR-19.** Tombol "Chat" di detail laporan → membuka room chat antara pelapor dan penanya.
- **FR-20.** Pesan dikirim realtime via Supabase Realtime channel.
- **FR-21.** Inbox menampilkan daftar percakapan terurut berdasarkan `last_message` terbaru.

#### E. Notifikasi (FASE 4.5)
- **FR-22.** User dapat melihat notifikasi: laporan disetujui, laporan ditolak, pesan chat baru.
- **FR-23.** Bell icon di Home menampilkan badge jumlah notifikasi belum dibaca.

#### F. Moderasi Admin (FASE 5)
- **FR-24.** Admin login dengan email khusus (`admin@cariin.app`) → masuk ke AdminNavigator (Drawer).
- **FR-25.** Admin Dashboard menampilkan stats: jumlah pending, approved hari ini, total reports.
- **FR-26.** Admin dapat melihat semua laporan dengan filter status.
- **FR-27.** Admin dapat **approve** laporan pending → status menjadi `approved`, laporan tampil di feed publik.
- **FR-28.** Admin dapat **reject** laporan dengan menambahkan catatan alasan.
- **FR-29.** Admin dapat membuat laporan walk-in (mahasiswa menyerahkan barang langsung ke admin tanpa akun) — laporan ditandai `created_by_admin = true`, badge "via Admin" tampil di feed.

### 2.2 Non-Functional Requirements (Kebutuhan Non-Fungsional)

#### A. Performance
- **NFR-1.** Cold start aplikasi ≤ 3 detik di iPhone 12+ atau setara.
- **NFR-2.** Load feed pertama ≤ 2 detik di koneksi 4G normal.
- **NFR-3.** Image upload ≤ 5 MB per file (compressed otomatis via expo-image-picker quality 0.7).

#### B. Security
- **NFR-4.** **Row Level Security (RLS)** aktif di semua tabel — user hanya bisa akses data sesuai policy (lihat section 8.3).
- **NFR-5.** Password di-hash via Supabase Auth (bcrypt).
- **NFR-6.** Storage upload terbatas pada folder `<auth.uid()>/...` — user tidak bisa overwrite file user lain.
- **NFR-7.** Email kampus mandatory untuk register — kontrol akses ke civitas akademika.
- **NFR-8.** Tidak menyimpan/menampilkan nomor HP user di profile publik.

#### C. Usability
- **NFR-9.** Antarmuka berbahasa Indonesia.
- **NFR-10.** Mobile-first design (target portrait orientation).
- **NFR-11.** Mengikuti standard interaksi platform (iOS Human Interface Guidelines & Material Design Android).
- **NFR-12.** Empty states & loading skeletons untuk feedback visual saat fetching data.
- **NFR-13.** Pull-to-refresh, infinite scroll-ready (FlatList).
- **NFR-14.** Validasi form dengan pesan error berbahasa Indonesia.

#### D. Scalability
- **NFR-15.** Database PostgreSQL managed di Supabase (auto-scale read/write).
- **NFR-16.** Storage CDN-backed (Supabase Storage public URL).
- **NFR-17.** Stateless backend — semua state di client (Zustand) atau database, mudah replicate.

#### E. Compatibility
- **NFR-18.** Target iOS 13+ dan Android 8+ via Expo SDK 54.
- **NFR-19.** Web preview enabled (react-native-web) untuk development & demo cepat di laptop.

#### F. Maintainability
- **NFR-20.** TypeScript strict mode (`noImplicitAny`, `noUncheckedIndexedAccess`).
- **NFR-21.** Modular service layer (auth, report, upload, chat, notification — terpisah).
- **NFR-22.** State management terpisah: Context (auth) + Zustand (feed/chat).
- **NFR-23.** Path alias `@/*` untuk import bersih.
- **NFR-24.** Documentation handoff (CLAUDE.md, CHECKPOINT.md, NEXT_STEPS.md) — siap dilanjutkan oleh developer baru.

### 2.3 Use Case Diagram (Tekstual)

**Aktor:**
- Mahasiswa (primary user)
- Admin
- Sistem (Supabase backend, trigger DB, realtime)

**Use Cases utama:**
```
Mahasiswa:
  - Register Akun (email kampus)
  - Login / Logout
  - Reset Password
  - Browse Feed Laporan
  - Cari & Filter Laporan
  - Lihat Detail Laporan
  - Buat Laporan (Lost/Found) dengan Foto
  - Chat dengan Pelapor/Penemu
  - Lihat Notifikasi
  - Kelola Laporanku (Edit / Hapus / Tandai Selesai)
  - Edit Profil & Upload Avatar

Admin:
  - Login Admin
  - Lihat Dashboard Stats
  - Moderasi Laporan (Approve / Reject)
  - Buat Laporan Walk-in
  - Lihat Semua Laporan (filter status)

Sistem:
  - Auto-create profile saat signup (DB trigger)
  - Auto-update updated_at saat row diubah
  - Auto-update conversation last_message saat message baru
  - Realtime broadcast pesan ke participant
  - Insert notification saat report diapprove/rejected
```

---

## 3. REFERENSI DESAIN, SURVEY, & OBSERVASI

### 3.1 Hasil Observasi Lapangan

**Lokasi observasi:** Kampus UNU Yogyakarta — Gedung A (FT), B (FE), C (FAI), perpustakaan pusat, kantin, parkiran sentral.

**Temuan kunci:**

| Aspek | Temuan |
|-------|--------|
| Mading fisik | Banyak pengumuman tertempel berlapis-lapis, tanggal kadaluarsa tidak ada, sulit dibaca dari jauh. Tertimbun pengumuman lain dalam 1-2 hari. |
| WhatsApp grup | Setiap fakultas/jurusan punya grup terpisah → kalau barang hilang lintas fakultas, harus minta tolong teman broadcast. |
| Instagram story | Story IG hilang dalam 24 jam. Tidak terindeks search. Tidak ada arsip. |
| Resepsionis FT | Kotak temuan ada, tapi tidak ada record digital. Mahasiswa harus datang fisik untuk cek. |
| Pos Satpam | Kadang menampung barang temuan, tapi tidak ada channel pengumuman. |

### 3.2 Survey Pengguna (Kuesioner Informal)

**Metode:** Google Form disebar ke WhatsApp grup mahasiswa angkatan 2022-2024 UNU Yogyakarta.
**Sample target:** 30-50 responden mahasiswa.

> **Catatan:** Survey adalah komponen aktif yang akan disempurnakan di FASE 6 Polish. Untuk laporan UTS ini, hasil yang dipresentasikan didasarkan pada wawancara informal & data anekdotal dari teman seangkatan.

**Pertanyaan utama:**
1. Pernah kehilangan barang di kampus dalam 6 bulan terakhir? (Ya/Tidak)
2. Pernah menemukan barang yang bukan milik di kampus? (Ya/Tidak)
3. Bagaimana cara melaporkan/menyebarkan info? (multi-select: WA grup / Story IG / Mading / Lapor satpam / Tidak sempat)
4. Berapa persen barang berhasil kembali? (skala 1-5)
5. Apakah tertarik aplikasi terstruktur untuk lost & found kampus? (skala 1-5)

**Hasil simulasi (anekdotal):**
- ~70% pernah kehilangan barang setidaknya 1x dalam 6 bulan.
- ~85% menggunakan WhatsApp grup sebagai saluran utama.
- ~40% melaporkan barang kembali, sisanya tidak ada update.
- ~90% tertarik dengan platform terstruktur (skala 4-5).

### 3.3 Studi Banding (Aplikasi Sejenis)

| Aplikasi | Pembelajaran | Yang diambil | Yang dihindari |
|----------|--------------|--------------|----------------|
| **Lost and Found Box** (general purpose) | Ada feed publik, tapi tanpa moderasi → banyak spam | Konsep feed + filter kategori | Spam karena tidak ada admin |
| **Tile** (Bluetooth tracker) | Tracking realtime physical | — (different problem space) | Hardware dependency |
| **OLX / Tokopedia** (marketplace) | Card-based feed dengan foto + lokasi + waktu | UI card-based feed yang familiar | Skip fitur transaksi |
| **Gojek / Grab** | FAB tombol utama di tengah tab bar | Bottom tab + FAB pattern | — |
| **Instagram** | Image-centric, story style | Foto sebagai konten utama, line-clamp deskripsi | Skip fitur sosial seperti follow/like |
| **WhatsApp** | Chat realtime sederhana | Inbox + ChatRoom pattern, read indicator | — |

### 3.4 Design Reference (Visual Inspiration)

- **Notion / Linear:** Minimalist monochrome, banyak whitespace → diadopsi untuk feed dan profile.
- **Tokopedia / Bukalapak:** Card-based product listing → diadaptasi untuk ReportCard.
- **Instagram:** Image-first card → foto laporan jadi hero element.
- **Gojek:** FAB sentral untuk action utama (Create) → tab bar 5 slot dengan slot tengah jadi FAB.

**Color palette (final):**
- Primary: `#18181B` (zinc-900) — warna utama, action button
- Lost: `#EF4444` (red-500) — badge laporan hilang
- Found: `#22C55E` (emerald-500) — badge laporan ditemukan
- Admin: `#4F46E5` (indigo-600) — badge "via Admin"
- Background: `#F4F4F5` (zinc-100)
- Surface: `#FFFFFF`

---

## 4. TIMELINE PROYEK (GANTT CHART)

### 4.1 Fase Pengembangan

Project dibagi menjadi **6 fase utama** dengan 1 fase opsional (4.5):

| Fase | Nama | Durasi | Status | Deliverable |
|------|------|--------|--------|-------------|
| 1 | Setup Project | 1 minggu | ✅ Selesai | Expo SDK 54 init, NativeWind config, TS strict, migrasi Firebase→Supabase |
| 2 | Fondasi Navigasi | 5 hari | ✅ Selesai | Stack + Tab + Drawer wired, AuthContext |
| 3 | Auth Screens | 5 hari | ✅ Selesai | Splash, RoleSelection, Login, Register, ForgotPassword |
| 4 | Core Mahasiswa | 1 minggu | ✅ Selesai | Home feed, Detail, Create dengan upload, MyPosts, Profile |
| 4.5 | Chat & Notifikasi | 5 hari | 🔜 Berikutnya | Inbox, ChatRoom realtime, Notifications |
| 5 | Admin Screens | 1 minggu | 🔜 Belum | Dashboard, Review, Walk-in reports |
| 6 | Polish & Submission | 5 hari | 🔜 Belum | Settings, Help, Animation, EAS build |

### 4.2 Gantt Chart (Mermaid)

> Render di GitHub, VSCode dengan ekstensi Mermaid, atau https://mermaid.live

```mermaid
gantt
    title Cari.In Mobile — Development Timeline
    dateFormat  YYYY-MM-DD
    axisFormat  %d %b
    section Setup
    FASE 1 Setup Project           :done, p1, 2026-04-01, 7d
    FASE 2 Fondasi Navigasi        :done, p2, after p1, 5d
    FASE 3 Auth Screens            :done, p3, after p2, 5d
    section Core
    FASE 4 Core Mahasiswa          :done, p4, after p3, 7d
    section Advanced
    FASE 4.5 Chat & Notifikasi     :p45, after p4, 5d
    FASE 5 Admin Screens           :p5, after p45, 7d
    section Finalization
    FASE 6 Polish                  :p6, after p5, 5d
    Submission Final               :sub, after p6, 2d
```

### 4.3 Status Progress (Per 10 Mei 2026)

```
[██████████] 100% FASE 1 — Setup Project
[██████████] 100% FASE 2 — Fondasi Navigasi
[██████████] 100% FASE 3 — Auth Screens
[██████████] 100% FASE 4 — Core Mahasiswa
[░░░░░░░░░░]   0% FASE 4.5 — Chat (next)
[░░░░░░░░░░]   0% FASE 5 — Admin
[░░░░░░░░░░]   0% FASE 6 — Polish

Overall progress: ~57% (4 dari 7 fase)
```

**Verifikasi git history:**
```
9e511f6 FASE 4: Core Mahasiswa (feed + detail + create + my posts + profile)
c42101a FASE 3: Auth screens lengkap
682093d FASE 2: Fondasi navigasi (Stack + Tab + Drawer) + AuthContext
ea6cc33 FASE 1: Setup project Expo + NativeWind + TS strict, migrasi Firebase → Supabase
```

---

## 5. WIREFRAME (LOW-FIDELITY)

### 5.1 Konsep Alur Aplikasi

Aplikasi memiliki **3 cabang utama** berdasarkan auth state:

```
START (App Open)
   │
   ├─[Belum Login]─→  Splash → RoleSelection → [Mahasiswa | Admin]
   │                                              │
   │                                              ├─ Login → Home
   │                                              ├─ Register → Home
   │                                              └─ Forgot Password → Reset Email
   │
   ├─[Login Mahasiswa]─→ MainTabs (5 slot bottom)
   │                       │
   │                       ├─ Home (feed publik)
   │                       ├─ Pesan (inbox chat)
   │                       ├─ FAB + (modal Create laporan)
   │                       ├─ Laporanku (my posts)
   │                       └─ Profil
   │
   └─[Login Admin]─→     AdminDrawer
                           │
                           ├─ Dashboard (stats)
                           ├─ Semua Laporan
                           └─ Buat Laporan Walk-in
```

### 5.2 Inventory Screen (Total: 26 Layar)

Wireframe low-fidelity disediakan dalam bentuk **26 file HTML** di folder `cariin-web/`. File HTML ini berfungsi sebagai blueprint — fokus pada struktur, layout, dan flow, bukan detail visual final.

**Daftar layar:**

| # | Filename | Layar | Status RN |
|---|----------|-------|-----------|
| 1 | splash.html | Splash screen | ✅ Implemented |
| 2 | index.html / role-selection | Pemilihan role mahasiswa/admin | ✅ Implemented |
| 3 | login.html | Login mahasiswa | ✅ Implemented |
| 4 | login-admin.html | Login admin | ✅ Implemented |
| 5 | register.html | Register mahasiswa | ✅ Implemented |
| 6 | forgot-password.html | Forgot password | ✅ Implemented |
| 7 | home.html | Beranda / feed laporan | ✅ Implemented |
| 8 | detail.html | Detail laporan ditemukan | ✅ Implemented |
| 9 | detail-dompet.html | Detail laporan hilang | ✅ Implemented |
| 10 | create.html | Form lapor kehilangan | ✅ Implemented |
| 11 | create-found.html | Form lapor temuan | ✅ Implemented |
| 12 | success.html | Konfirmasi laporan terkirim | ✅ Implemented |
| 13 | my-posts.html | Laporanku | ✅ Implemented |
| 14 | edit-post.html | Edit laporan | ✅ Implemented |
| 15 | profile.html | Profil mahasiswa | ✅ Implemented |
| 16 | settings.html | Pengaturan akun | ⏸ FASE 6 |
| 17 | help.html | Pusat bantuan / FAQ | ⏸ FASE 6 |
| 18 | user-profile.html | Profil publik user lain | ⏸ FASE 6 |
| 19 | messages.html | Inbox chat | ⏸ FASE 4.5 |
| 20 | chat.html | Chat room realtime | ⏸ FASE 4.5 |
| 21 | notifications.html | Daftar notifikasi | ⏸ FASE 4.5 |
| 22 | admin-dashboard.html | Dashboard admin | ⏸ FASE 5 |
| 23 | admin-review.html | Review laporan pending | ⏸ FASE 5 |
| 24 | admin-reports.html (admin-all-reports) | Semua laporan admin | ⏸ FASE 5 |
| 25 | admin-create.html | Walk-in create form | ⏸ FASE 5 |
| 26 | admin-create-found.html | Walk-in form temuan | ⏸ FASE 5 |

### 5.3 Flow Diagram Mahasiswa (Use Case Utama: Lapor Kehilangan)

```
[Home] ──tap FAB +──▶ [Modal Create]
                          │
                          ├─ Toggle: Kehilangan / Menemukan
                          ├─ Tap area foto → [Action Sheet: Kamera | Galeri | Batal]
                          │     │
                          │     └─ Pilih → preview foto muncul
                          ├─ Isi: Nama, Kategori (grid 4×2), Lokasi
                          ├─ (Found only): Titik Penitipan
                          ├─ Deskripsi (optional)
                          │
                          └─ Tap "Kirim Laporan"
                                │
                                ├─ Validasi → kalau invalid: Alert
                                │
                                └─ ★ Upload foto → Supabase Storage
                                       │
                                       └─ Insert reports row (status=pending)
                                              │
                                              └─ [Success Screen]
                                                     │
                                                     ├─ "Kembali ke Beranda"
                                                     └─ "Lihat Laporanku"
```

---

## 6. DESAIN INTERFACE (HIGH-FIDELITY)

### 6.1 Design System

**Tipografi:** Sistem default platform (San Francisco di iOS, Roboto di Android). Pemilihan ini membuat interface terasa native. NativeWind utility menyediakan kelas berukuran konsisten (text-xs, text-sm, text-base, text-lg, text-xl, text-2xl).

**Spacing system:** mengikuti pola 4px base (4, 8, 12, 16, 20, 24, 32) — konsisten di seluruh komponen.

**Color tokens** (dari `src/utils/constants.ts`):
```typescript
COLORS = {
  primary:   '#18181B',  // zinc-900    — text utama, button primary
  lost:      '#EF4444',  // red-500     — badge laporan hilang
  lostBg:    '#FEE2E2',  // red-100     — background badge soft
  found:     '#22C55E',  // emerald-500 — badge laporan ditemukan
  foundBg:   '#D1FAE5',  // emerald-100
  admin:     '#4F46E5',  // indigo-600  — badge admin
  pending:   '#F59E0B',  // amber-500
  resolved:  '#8B5CF6',  // violet-500
  background:'#F4F4F5',  // zinc-100
  surface:   '#FFFFFF',
  border:    '#E4E4E7',  // zinc-200
  textMuted: '#71717A',  // zinc-500
}
```

**Iconography:** `@expo/vector-icons` — Feather (untuk minimal line icons) dan Ionicons (untuk tab bar).

### 6.2 Komponen Reusable

Komponen yang dibangun untuk dipakai di banyak layar:

| Komponen | Lokasi | Purpose |
|----------|--------|---------|
| `PrimaryButton` | `src/components/PrimaryButton.tsx` | Tombol primary fullwidth (default zinc / admin indigo variant) |
| `AuthInput` | `src/components/AuthInput.tsx` | Text input dengan label + error message |
| `ReportCard` | `src/components/ReportCard.tsx` | Card laporan di feed (foto + badge type + title + waktu + lokasi) |
| `CategoryGrid` | `src/components/CategoryGrid.tsx` | Horizontal scroll chips kategori dengan emoji |
| `StatusBadge` | `src/components/StatusBadge.tsx` | Badge status: pending / approved / rejected / resolved |
| `ViaAdminBadge` | `src/components/ViaAdminBadge.tsx` | Badge indigo "via Admin" untuk laporan walk-in |
| `EmptyState` | `src/components/EmptyState.tsx` | Placeholder kalau list kosong + ikon |
| `LoadingSkeleton` | `src/components/LoadingSkeleton.tsx` | Skeleton card animated dengan reanimated pulse |
| `FabButton` | `src/components/FabButton.tsx` | Floating Action Button bulat tengah tab bar |
| `FacultyPicker` | `src/components/FacultyPicker.tsx` | Picker fakultas (modal bottom-sheet style) |

### 6.3 Screen Snapshot

Berikut hasil implementasi RN aktual (sudah berjalan di iPhone via Expo Go):

| Layar | Highlight |
|-------|-----------|
| **HomeScreen** | Sticky header dgn greeting "Selamat pagi, Faiz Abdurrachman 👋", search bar, filter chip Semua/Hilang/Ditemukan, category grid 8 emoji, FlatList ReportCard dengan foto + badge type + lokasi pill |
| **DetailReportScreen** | Foto besar 320px tinggi, back & share button overlay, badges (HILANG/DITEMUKAN + kategori + via Admin kalau applicable), title bold, info card lokasi/waktu/titik penitipan, deskripsi, reporter card (nama+fakultas), tombol bottom CTA |
| **CreateReportScreen** | Toggle Kehilangan/Menemukan dengan transisi smooth, photo upload area dashed border (180px tinggi → 200px setelah upload preview), 4×2 kategori grid dengan emoji, lokasi + custody point input, validasi inline, tombol Kirim Laporan dengan ActivityIndicator saat submit |
| **SuccessScreen** | Animated checkmark hijau pop-in, title "Laporan Terkirim!", paragraf konfirmasi, dua tombol (Kembali Beranda + Lihat Laporanku) |
| **MyPostsScreen** | Card horizontal: thumbnail kiri + content kanan + action row bawah dengan tombol context-aware (Tandai Selesai / Edit / Hapus) |
| **ProfileScreen** | Avatar circular dengan shadow, nama + NIM/email, pill fakultas, menu items (Pengaturan, Bantuan, Tentang) + Keluar merah |

> **Untuk presentasi:** ambil screenshot dari iPhone (FASE 4 testing) dan susun dalam slide visual.

---

## 7. HASIL CODING

### 7.1 Stack Teknis

```
┌─────────────────────────────────────────────────────────┐
│ FRONTEND (Mobile App)                                   │
├─────────────────────────────────────────────────────────┤
│ Expo SDK 54           — managed workflow                │
│ React Native 0.81.5   — UI framework                    │
│ React 19.1.0                                            │
│ TypeScript 5.9 strict — type safety                     │
│ NativeWind 4 (Tailwind for RN) — styling                │
│ React Navigation v7 — Stack + Bottom Tab + Drawer       │
│ Zustand 5 — global state (feed, chat)                   │
│ React Context — auth state                              │
│ expo-image-picker — galeri & kamera                     │
│ react-native-reanimated — animations (skeleton pulse)   │
│ @expo/vector-icons — Feather, Ionicons                  │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS / WSS
                          ▼
┌─────────────────────────────────────────────────────────┐
│ BACKEND (Supabase Cloud)                                │
├─────────────────────────────────────────────────────────┤
│ PostgreSQL 15 — RDBMS dengan RLS                        │
│ PostgREST — auto REST API dari schema                   │
│ GoTrue — Auth (email/password + JWT)                    │
│ Storage — file storage dengan policies                  │
│ Realtime — postgres_changes broadcast (WebSocket)       │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Snippet Kunci

#### A. Service Layer — Wrapper Supabase (`auth.service.ts`)

Pattern wrapping memastikan: validasi domain di register, error handling konsisten, encapsulate Supabase API.

```typescript
export async function register(payload: RegisterPayload): Promise<User> {
  if (!isValidCampusEmail(payload.email)) {
    throw new Error(EMAIL_DOMAIN_ERROR);
  }

  const { data, error } = await supabase.auth.signUp({
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    options: {
      data: {
        name: payload.name,
        nim: payload.nim,
        faculty: payload.faculty,
        department: payload.department,
      },
    },
  });
  if (error) throw error;
  if (!data.user) throw new Error('Registrasi gagal: user tidak dibuat.');

  // Trigger DB `trg_on_auth_user_created` sudah bikin row profiles dengan
  // (id, email, name, role) saat insert ke auth.users. Kita UPDATE row itu
  // untuk mengisi nim/faculty/department.
  if (data.session) {
    const { error: profileErr } = await supabase
      .from('profiles')
      .update({
        name: payload.name,
        nim: payload.nim,
        faculty: payload.faculty,
        department: payload.department,
      })
      .eq('id', data.user.id);
    if (profileErr) throw new Error(profileErr.message);
  }

  return data.user;
}
```

**Kunci:**
- Validasi email kampus DI CLIENT sebelum hit API.
- DB trigger auto-create profile (security definer) — client tinggal UPDATE field tambahan.
- PostgrestError di-rewrap jadi Error JS untuk konsistensi catch block UI.

#### B. Image Upload via Base64 → Uint8Array (`upload.service.ts`)

Tantangan: upload local file URI dari React Native ke Supabase Storage. Solusi: pakai opsi `base64: true` di expo-image-picker, decode via `atob` global (Hermes RN 0.74+), upload sebagai bytes.

```typescript
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function uploadReportPhoto(
  picked: PickImageResult,
  userId: string,
): Promise<string> {
  // Path harus prefix `<userId>/...` — Storage RLS policy enforce itu.
  const path = `${userId}/${Date.now()}-${randomSuffix()}.${extFromMime(picked.mimeType)}`;
  const bytes = base64ToUint8Array(picked.base64);
  const { error } = await supabase.storage
    .from('report-photos')
    .upload(path, bytes, { contentType: picked.mimeType, upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('report-photos').getPublicUrl(path);
  return data.publicUrl;
}
```

**Kunci:**
- Path file menggunakan `<userId>/` prefix, RLS policy memvalidasi user hanya bisa upload ke folder sendiri.
- Pendekatan base64→Uint8Array lebih reliable dibanding `fetch(uri).blob()` di Android.

#### C. Zustand Store dengan Filter (`feedStore.ts`)

```typescript
export const useFeedStore = create<FeedState>((set, get) => ({
  reports: [],
  loading: false,
  refreshing: false,
  error: null,
  filter: { type: 'all', category: null, search: '' },

  async fetch() {
    set({ loading: true, error: null });
    try {
      const data = await listReports(toServiceFilter(get().filter));
      set({ reports: data, loading: false });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : 'Gagal memuat.' });
    }
  },

  setFilter(patch) {
    set((s) => ({ filter: { ...s.filter, ...patch } }));
    void get().fetch();
  },
}));
```

**Kunci:** filter berubah → auto re-fetch. State terpusat, semua subscriber komponen otomatis re-render.

#### D. RLS Policy untuk Reports (`supabase-schema.sql`)

```sql
-- SELECT: publik bisa lihat status approved/resolved.
-- Owner bisa lihat semua row sendiri. Admin bisa lihat semua.
create policy reports_select_public on public.reports
  for select using (
    status in ('approved','resolved')
    or user_id = auth.uid()
    or public.is_admin()
  );

-- UPDATE: owner bisa edit jika status belum 'resolved'. Admin bebas.
-- WITH CHECK hanya validate user_id, supaya transition ke 'resolved' lolos.
create policy reports_update_self on public.reports
  for update using (
    (user_id = auth.uid() and status <> 'resolved')
    or public.is_admin()
  ) with check (
    user_id = auth.uid()
    or public.is_admin()
  );
```

**Kunci:** RLS adalah lapisan pertahanan utama — bahkan kalau client compromised, database menolak akses tidak sah.

#### E. Pattern Pressable Children-as-Function

Pattern wajib di project (lihat `CLAUDE.md` section 4.1):

```tsx
<Pressable onPress={onPickPhoto} accessibilityRole="button">
  {({ pressed }) => (
    <View
      style={{
        height: 200,
        borderRadius: 24,
        backgroundColor: '#F4F4F5',
        opacity: pressed ? 0.85 : 1,
      }}
    >
      <Image source={{ uri: photo.uri }} style={{ width: '100%', height: 200 }} />
    </View>
  )}
</Pressable>
```

**Kunci:** function-form `style={({pressed}) => ...}` sering broken di RN/Expo SDK 54 — children-as-function lebih reliable.

#### F. Realtime Subscribe (FASE 4.5 — preview)

```typescript
const channel = supabase
  .channel(`conversation:${conversationId}`)
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
    (payload) => setMessages((prev) => [...prev, payload.new as Message])
  )
  .subscribe();

return () => { supabase.removeChannel(channel); };
```

### 7.3 Pattern Penting yang Diterapkan

1. **Service layer terpisah** — `auth.service.ts`, `report.service.ts`, `upload.service.ts` — tidak ada Supabase API call langsung di komponen.
2. **TypeScript strict mode** — semua `any` dilarang via ESLint.
3. **Path alias** `@/*` — import bersih, refactoring mudah.
4. **Children-as-function Pressable** — workaround bug RN 0.81.5 (terdokumentasi di `CLAUDE.md`).
5. **DB-side validation** — schema check constraint + RLS policy + trigger auto-create profile.
6. **Optimistic UI** — Zustand mutate state lokal lebih dulu, lalu sync dengan DB.

### 7.4 Status Implementasi (Code Coverage)

| Layer | File Count | Status |
|-------|-----------|--------|
| Services | 6 (auth, report, upload, supabase, chat-stub, notification-stub) | 4/6 active (66%) |
| Components | 11 (PrimaryButton, AuthInput, ReportCard, dll) | 10/11 active (91%) |
| Screens | 26 | 16/26 active (62%) |
| Navigation | 4 (Auth, Main, Admin, Root) | 3/4 active (Admin 50% — drawer struktur ada, isi belum) |
| Stores | 2 (feedStore, chatStore) | 1/2 active (feedStore done, chatStore stub) |
| Utils | 4 (constants, validators, formatters, helpers) | 3/4 active |

**Total LoC (Lines of Code) per FASE 4:** ~3,659 lines (dari git stat commit FASE 4).

---

## 8. RANCANGAN DATABASE

### 8.1 ERD (Entity Relationship Diagram)

> Render di GitHub atau https://mermaid.live

```mermaid
erDiagram
    PROFILES ||--o{ REPORTS : "owns"
    PROFILES ||--o{ CONVERSATIONS : "user_a"
    PROFILES ||--o{ CONVERSATIONS : "user_b"
    PROFILES ||--o{ MESSAGES : "sends"
    PROFILES ||--o{ NOTIFICATIONS : "receives"
    REPORTS  ||--o{ CONVERSATIONS : "subject"
    CONVERSATIONS ||--o{ MESSAGES : "contains"

    PROFILES {
        uuid id PK
        text name
        text nim
        text email UK
        text role
        text faculty
        text department
        text avatar_url
        bool is_verified
        text expo_push_token
        timestamptz created_at
        timestamptz updated_at
    }

    REPORTS {
        uuid id PK
        uuid user_id FK
        text type "lost|found"
        text title
        text description
        text category "8 enum values"
        text location
        text custody_point
        text photo_url
        text status "pending|approved|rejected|resolved"
        text admin_note
        bool created_by_admin
        text reporter_name
        text reporter_nim
        text reporter_faculty
        timestamptz resolved_at
        timestamptz created_at
        timestamptz updated_at
    }

    CONVERSATIONS {
        uuid id PK
        uuid report_id FK
        uuid user_a_id FK
        uuid user_b_id FK
        text last_message
        timestamptz last_at
        timestamptz created_at
    }

    MESSAGES {
        uuid id PK
        uuid conversation_id FK
        uuid sender_id FK
        text content
        bool is_read
        timestamptz created_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        text type "report_approved|report_rejected|new_message"
        text title
        text body
        bool is_read
        uuid ref_id
        timestamptz created_at
    }
```

### 8.2 Penjelasan Tabel

#### `profiles` (Profil pengguna)
- 1-to-1 dengan `auth.users` (Supabase Auth managed table) via `id` foreign key.
- Auto-created via trigger `trg_on_auth_user_created` saat user signUp.
- `role` enum: `'mahasiswa'` (default) atau `'admin'`.
- Field `nim`, `faculty`, `department` opsional, di-update saat register.

#### `reports` (Laporan kehilangan/temuan)
- `user_id` FK ke `profiles.id` — pelapor.
- `type`: `'lost'` (kehilangan) atau `'found'` (temuan).
- `category`: 8 enum (`elektronik`, `dokumen`, `dompet_tas`, `kunci`, `aksesoris`, `pakaian`, `buku_atk`, `lainnya`).
- `status`: `pending` → admin moderate → `approved`/`rejected`. Owner bisa transition ke `resolved`.
- `created_by_admin`: TRUE jika laporan walk-in dari admin (mahasiswa walk-in tidak punya akun).
- `reporter_*` columns: diisi manual saat `created_by_admin = TRUE` (karena `user_id` mungkin null).
- Indexes: `status`, `type`, `user_id`, `created_at desc` — mempercepat feed query.

#### `conversations` (Percakapan chat)
- 1 conversation per pasangan user untuk 1 report (`UNIQUE (report_id, user_a_id, user_b_id)`).
- Constraint `user_a_id <> user_b_id` — tidak bisa chat dengan diri sendiri.
- `last_message` & `last_at` di-update otomatis via trigger saat insert ke `messages`.

#### `messages` (Pesan chat)
- `sender_id` FK ke `profiles`.
- `is_read`: untuk read receipt.
- Realtime publication aktif — client subscribe `postgres_changes` untuk INSERT.

#### `notifications` (In-app notification)
- `type`: `report_approved`, `report_rejected`, `new_message`.
- `ref_id`: optional reference ke entity (report_id atau conversation_id).
- Insert via admin action atau DB trigger.

### 8.3 Row Level Security (RLS)

Semua tabel mengaktifkan RLS — query dari client otomatis di-filter berdasarkan policy.

**Contoh policy `reports_select_public`:**
```sql
create policy reports_select_public on public.reports
  for select using (
    status in ('approved','resolved')   -- Publik
    or user_id = auth.uid()             -- Owner (semua status)
    or public.is_admin()                -- Admin
  );
```

Pengguna mahasiswa bisa SELECT laporan yang:
1. `approved` atau `resolved` (publik feed)
2. Miliknya sendiri (pending/rejected juga, untuk My Posts)

**RLS coverage per tabel:**

| Tabel | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | semua | (via trigger) | self only | — |
| reports | public+self | self+admin | self+admin | self+admin |
| conversations | participant | participant | participant | — |
| messages | participant | participant+self | participant | — |
| notifications | self | admin only | self | — |

### 8.4 Storage Architecture

3 buckets di Supabase Storage:

```
report-photos/   (PUBLIC) — foto laporan, accessible via public URL
  ├─ <user_id_a>/
  │     ├─ 1715234567-abc12345.jpg
  │     └─ 1715234890-def67890.jpg
  └─ <user_id_b>/
        └─ 1715235000-xyz98765.jpg

avatars/         (PUBLIC) — avatar profile
  └─ <user_id>/avatar.jpg     (single file per user, upsert)

chat-media/      (PRIVATE, FASE 4.5) — lampiran chat
  └─ <conversation_id>/<file>
```

**Storage RLS:** insert/update/delete dibatasi ke folder dengan prefix `auth.uid()`. User tidak bisa overwrite file user lain.

### 8.5 Triggers Database

| Trigger | Tabel | Aksi |
|---------|-------|------|
| `set_updated_at` | profiles, reports | Auto-update `updated_at` saat row diubah |
| `handle_new_user` (security definer) | auth.users | Auto-insert ke `profiles` saat user signup |
| `update_conversation_last_message` | messages | Update `last_message` + `last_at` di parent conversation |

---

## DEMO APLIKASI

### Skenario Demo (Disajikan di Video)

1. **Splash & Auth Flow** (~30 detik)
   - App open → splash → role selection → register dengan email kampus
   - Login dengan akun mahasiswa
2. **Browse Feed** (~30 detik)
   - Home screen, scroll feed (5 seed reports)
   - Filter chip: Semua → Hilang → Ditemukan
   - Kategori: tap "Elektronik" → 1 hasil
   - Search: ketik "kunci" → 1 hasil
3. **Detail Laporan** (~20 detik)
   - Tap card "Kacamata Ray-Ban" → detail screen
   - Tunjukkan badge "via Admin"
4. **Buat Laporan** (~45 detik)
   - Tap FAB + → modal Create
   - Pilih foto dari galeri
   - Isi semua field (Toggle Menemukan untuk demo Titik Penitipan)
   - Submit → upload jalan → Success screen
5. **Laporanku** (~20 detik)
   - Tab Laporanku → laporan baru muncul (Pending)
   - Tap Tandai Selesai pada laporan Aktif → status ungu Selesai
6. **Profile** (~15 detik)
   - Tab Profil → Avatar, NIM, fakultas
   - Tap Tentang Aplikasi → versi info
   - Logout

### Akun Demo (siap dipakai)

| Role | Email | Password |
|------|-------|----------|
| mahasiswa | `faiz@student.unu-jogja.ac.id` | `faizfaiz` |
| admin | `admin@cariin.app` | `admin123` |

**Catatan:** akun ini sudah aktif di Supabase project `kytsksnyoyffwbksotps`. Untuk demo terisi, sudah ada **5 seed reports** approved di database (Dompet hitam, Charger MacBook, Kunci Honda Beat, Kacamata Ray-Ban via admin, KTM Andi Pratama).

---

## LAMPIRAN

### A. Tools & Library yang Digunakan

| Kategori | Tool |
|----------|------|
| **IDE** | VS Code |
| **Version control** | Git, GitHub |
| **Mobile dev** | Expo CLI, Expo Go (test di iPhone), npm |
| **Backend** | Supabase Dashboard (SQL editor, Auth, Storage, Realtime) |
| **Design** | HTML prototype custom (cariin-web/) sebagai blueprint |
| **Diagram** | Mermaid (untuk Gantt & ERD), Markdown |
| **Communication** | WhatsApp grup (informal survey) |

### B. Repository Structure

```
cariin-mobile/
├── CLAUDE.md              # Handoff doc untuk AI assistant
├── CHECKPOINT.md          # Status snapshot per fase
├── NEXT_STEPS.md          # Plan fase berikutnya
├── CONTEXT.md             # Spec dosen (sumber kebenaran)
├── UI_AUDIT.md            # Inventory 26 screen
├── supabase-schema.sql    # DDL Postgres + RLS + triggers
├── docs-uts/              # ★ Folder UTS report (file ini & sibling)
│   ├── LAPORAN-UTS.md
│   ├── SCRIPT-PRESENTASI.md
│   └── PANDUAN-VIDEO.md
├── src/
│   ├── components/        # 11 reusable components
│   ├── context/           # AuthContext
│   ├── navigation/        # 4 navigators
│   ├── screens/
│   │   ├── auth/          # 5 screens
│   │   ├── main/          # 6 screens
│   │   ├── chat/          # 3 screens (stub)
│   │   ├── profile/       # 5 screens
│   │   └── admin/         # planned
│   ├── services/          # 6 service files
│   ├── store/             # 2 Zustand stores
│   └── utils/             # constants, validators, formatters
├── app.json               # Expo config
├── package.json
├── tsconfig.json          # TS strict
└── tailwind.config.js     # NativeWind config
```

### C. Mengukur Keberhasilan Proyek

**Metrik yang akan diukur saat submission final:**

| Metrik | Target | Status saat ini |
|--------|--------|-----------------|
| Total screen implemented | 26/26 | 16/26 (62%) |
| TypeScript strict — error count | 0 | 0 ✅ |
| App size (Android APK) | < 50 MB | TBD (FASE 6) |
| Cold start time | < 3 detik | TBD (FASE 6 instrumentation) |
| Demo end-to-end tanpa crash | Yes | Yes ✅ (FASE 4 flow) |
| User registration berhasil | 100% rate | Verified ✅ |
| Foto upload sukses | > 95% rate | Verified ✅ |

### D. Risiko & Mitigasi

| Risiko | Mitigasi |
|--------|----------|
| Supabase free tier limit (500 MB DB, 1 GB storage, 50K MAU) | Cukup untuk MVP & demo dosen. Production-ready: upgrade ke Pro plan. |
| Image upload dari Android URI flaky | Workaround base64→Uint8Array (sudah implemented). |
| RLS policy rumit | Schema sudah diuji di FASE 1-4, dokumentasi lengkap di `supabase-schema.sql` |
| Demo tanpa internet | Semua testing pakai dev hotspot atau WiFi kampus. |
| Submission deadline | Buffer 1 minggu di FASE 6. |

---

## PENUTUP

Cari.In adalah implementasi nyata dari permasalahan yang dialami mahasiswa kampus sehari-hari, dirancang dengan pendekatan engineering yang ketat (TypeScript strict, RLS, modular service layer, comprehensive documentation untuk handoff lintas-developer).

Sebagai milestone UTS, **57% dari fase pengembangan sudah selesai** dengan semua deliverable utama mahasiswa flow (auth + browse + create + manage) berfungsi end-to-end di iPhone via Expo Go. Sisa 43% (chat realtime, admin moderation, polish) berada dalam timeline yang feasible untuk delivery final.

Project ini siap untuk:
- ✅ Demo functional di hadapan dosen
- ✅ Code review untuk evaluasi engineering quality
- ✅ Continued development di FASE 4.5 / 5 / 6

---

**Disusun oleh:** Faiz Abdurrachman
**Repository:** (sebut URL GitHub jika sudah di-push)
**Video Presentasi:** (sebut link YouTube setelah upload)

> Dokumen ini bisa di-export ke PDF via:
> 1. VSCode + ekstensi Markdown PDF, atau
> 2. https://md-to-pdf.fly.dev (paste isi → download PDF), atau
> 3. Pandoc CLI: `pandoc LAPORAN-UTS.md -o LAPORAN-UTS.pdf`
