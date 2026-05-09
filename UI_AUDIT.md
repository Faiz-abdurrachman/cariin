# UI_AUDIT.md — Cari.In Prototype Audit
> Hasil review lengkap semua screens HTML prototype.
> Baca bersama CONTEXT.md sebelum mulai coding.
> Last updated: Mei 2026 | Versi: 3.0

---

## STATUS KESELURUHAN

| Total Screens | Sudah Ada & Beres | Sudah Ada & Fixed | Belum Dibuat (★ Baru) |
|:---:|:---:|:---:|:---:|
| 26 | 18 | 5 | 3 |

**23 screen prototype sudah selesai. 3 screen admin baru perlu dibuat.**

---

## STATUS TIAP SCREEN

### Onboarding & Auth

| # | File | Nama Screen | Status | Catatan |
|---|------|-------------|--------|---------|
| 1 | `splash.html` | Splash Screen | ✅ Beres | Tagline: "Cariin barangmu di kampus." |
| 2 | `index.html` | Role Selection | ✅ Beres | 2 opsi: Mahasiswa & Admin |
| 3 | `login.html` | Login Mahasiswa | ✅ Beres | Placeholder email kampus sudah benar |
| 4 | `register.html` | Register | ✅ Fixed | Field Fakultas + Jurusan sudah ditambahkan |
| 5 | `forgot-password.html` | Lupa Password | ✅ Beres | Feedback alert + redirect ke login |

### Main App — Mahasiswa

| # | File | Nama Screen | Status | Catatan |
|---|------|-------------|--------|---------|
| 6 | `home.html` | Home Feed | ✅ Beres | Search bar + filter chip + sample cards |
| 7 | `detail.html` | Detail Temuan | ✅ Fixed | Badge kategori "💻 Elektronik" ditambahkan |
| 8 | `detail-dompet.html` | Detail Hilang | ✅ Fixed | Badge kategori "👜 Dompet/Tas" ditambahkan |
| 9 | `create.html` | Form Kehilangan | ✅ Fixed | Foto wajib + grid 8 kategori ditambahkan |
| 10 | `create-found.html` | Form Penemuan | ✅ Fixed | Grid 8 kategori + titik penitipan diperjelas |
| 11 | `success.html` | Konfirmasi | ✅ Beres | Info status pending moderasi ditampilkan |

### Komunikasi

| # | File | Nama Screen | Status | Catatan |
|---|------|-------------|--------|---------|
| 12 | `messages.html` | Inbox | ✅ Beres | 2 sample chat, unread badge |
| 13 | `chat.html` | Ruang Chat | ✅ Beres | Context item sticky, bubble chat, input area |
| 14 | `notifications.html` | Notifikasi | ✅ Beres | 3 tipe notif: approved, rejected, pesan baru |

### Profil & Akun

| # | File | Nama Screen | Status | Catatan |
|---|------|-------------|--------|---------|
| 15 | `my-posts.html` | Laporanku | ✅ Fixed | Bug HTML attribute tanda kutip diperbaiki |
| 16 | `edit-post.html` | Edit Laporan | ✅ Beres | Pre-filled form, foto dengan tombol hapus |
| 17 | `profile.html` | Profil Pribadi | ✅ Fixed | Bug HTML attribute tanda kutip diperbaiki |
| 18 | `user-profile.html` | Profil Publik | ✅ Beres | Header banner, avatar, daftar laporan aktif |
| 19 | `settings.html` | Pengaturan | ✅ Beres | Edit nama, password, toggle notifikasi |
| 20 | `help.html` | Pusat Bantuan | ✅ Fixed | Copy "Klaim Barang" → "Chat Penemu" diselaraskan |

### Admin Area

| # | File | Nama Screen | Status | Catatan |
|---|------|-------------|--------|---------|
| 21 | `login-admin.html` | Login Admin | ✅ Beres | Aksen indigo, label "Portal Admin" |
| 22 | `admin-dashboard.html` | Dashboard Admin | ✅ Fixed + ⚠️ Update | Tab Pending/Aktif/Selesai sudah ada. **Perlu tambah tombol "Buat Laporan" dan link ke admin-reports.html** |
| 23 | `admin-review.html` | Review Laporan | ✅ Beres + ⚠️ Update | Tombol Setujui/Tolak sudah ada. **Perlu tambah tombol Edit & Hapus untuk admin CRUD** |
| 24 | `admin-reports.html` | Semua Laporan | ★ **BELUM ADA** | Perlu dibuat — lihat spesifikasi di bawah |
| 25 | `admin-create-lost.html` | Admin Buat Laporan Hilang | ★ **BELUM ADA** | Perlu dibuat — lihat spesifikasi di bawah |
| 26 | `admin-create-found.html` | Admin Buat Laporan Temuan | ★ **BELUM ADA** | Perlu dibuat — lihat spesifikasi di bawah |

---

## DETAIL BUG YANG SUDAH DIPERBAIKI (v2.0)

### Bug 1 — register.html: Field Fakultas & Jurusan Missing
**Sebelum:** Form hanya ada Nama, NIM, Email, Password
**Sesudah:** Ditambah grid 2 kolom — dropdown Fakultas + input Jurusan
**Kenapa penting:** Business rule #1 — data user harus lengkap untuk verifikasi identitas kampus

### Bug 2 — create.html: Foto "Opsional" & Tidak Ada Kategori
**Sebelum:** Label foto "(Opsional)", tidak ada field kategori
**Sesudah:** Foto jadi wajib (*), grid 8 kategori dengan emoji ditambahkan
**Kenapa penting:** Business rule #8 — foto wajib. Kategori adalah basis filter feed

### Bug 3 — create-found.html: Tidak Ada Kategori
**Sebelum:** Tidak ada field kategori
**Sesudah:** Grid 8 kategori + info banner privasi + titik penitipan diperjelas
**Kenapa penting:** Konsistensi dengan create.html, UVP privasi dikomunikasikan sejak form

### Bug 4 — my-posts.html & profile.html: Bug HTML Attribute
**Sebelum:** `class="... text-zinc-900" hover:text-zinc-900"` (tanda kutip ganda, syntax rusak)
**Sesudah:** `class="... text-zinc-900 hover:text-zinc-900"` (diperbaiki)
**Kenapa penting:** Hover state tidak berfungsi, browser render class salah

### Bug 5 — detail.html & detail-dompet.html: Tidak Ada Badge Kategori
**Sebelum:** Hanya ada badge "Ditemukan" / "Hilang"
**Sesudah:** Badge kategori ditambahkan di sebelah badge status
**Kenapa penting:** User perlu tahu kategori tanpa harus baca deskripsi

---

## SCREEN BARU YANG PERLU DIBUAT ★

### Screen 24 — admin-reports.html
**Fungsi:** Halaman daftar semua laporan dari semua status, khusus untuk admin. Ini adalah pusat kontrol CRUD admin.

**Elemen UI yang harus ada:**
- Header sticky: judul "Semua Laporan" + back button ke dashboard
- Filter tab atau dropdown: Semua | Pending | Approved | Rejected | Resolved
- Filter tipe: Lost | Found | Semua
- Search bar: cari by nama barang atau nama pelapor
- List laporan dalam format tabel atau card dengan info:
  - Foto thumbnail (kecil)
  - Nama barang
  - Tipe (Lost/Found) dengan badge warna
  - Status (Pending/Approved/Rejected/Resolved) dengan badge warna
  - Nama pelapor + badge "Via Admin" jika `created_by_admin = true`
  - Waktu dibuat
  - Tombol aksi: **Lihat** | **Edit** | **Hapus**
- Empty state jika tidak ada laporan
- Aksen warna: indigo (sesuai admin area)

**Navigasi:**
- Tombol Lihat → `detail.html` atau `detail-dompet.html`
- Tombol Edit → `admin-review.html` (atau modal edit inline)
- Tombol Hapus → modal konfirmasi "Yakin hapus laporan ini?" sebelum eksekusi

---

### Screen 25 — admin-create-lost.html
**Fungsi:** Form untuk admin membuat laporan kehilangan atas nama mahasiswa yang datang langsung ke satpam/pos admin.

**Elemen UI yang harus ada:**
- Header sticky: "Buat Laporan Kehilangan" + back button
- Tab toggle di atas: **Kehilangan** (aktif) | Penemuan → link ke admin-create-found.html
- Info banner indigo: "Laporan yang kamu buat akan langsung tayang tanpa perlu review."
- **Bagian: Info Pelapor** (field yang tidak ada di form mahasiswa)
  - Nama Lengkap Pelapor (input text, wajib)
  - NIM Pelapor (input text, wajib)
  - Fakultas Pelapor (dropdown 8 pilihan, wajib)
- **Bagian: Info Barang**
  - Foto Barang (upload, **opsional** — berbeda dari form mahasiswa yang wajib)
  - Nama Barang (input text, wajib)
  - Kategori (grid 8 kategori dengan emoji, wajib)
  - Lokasi Terakhir Dilihat (input text dengan icon pin, wajib)
  - Deskripsi Detail (textarea, wajib)
- **Bagian: Catatan Admin** (tidak tampil di feed publik)
  - Catatan Internal (textarea, opsional) — untuk info tambahan yang hanya dilihat admin
- Tombol submit: "Buat Laporan" dengan aksen indigo
- Setelah submit → redirect ke `admin-dashboard.html` dengan toast "Laporan berhasil dibuat dan langsung tayang"

**Perbedaan penting dari create.html (form mahasiswa):**

| Aspek | Form Mahasiswa | Form Admin |
|-------|---------------|------------|
| Foto | Wajib | Opsional |
| Info pelapor | Dari akun login | Input manual (nama, NIM, fakultas) |
| Status setelah submit | Pending | Langsung Approved |
| Ada tab toggle | Ya | Ya (ke admin-create-found) |
| Catatan internal | Tidak ada | Ada |

---

### Screen 26 — admin-create-found.html
**Fungsi:** Form untuk admin membuat laporan penemuan ketika ada mahasiswa yang menitipkan barang temuan langsung ke satpam tanpa buka app.

**Elemen UI yang harus ada:**
- Header sticky: "Buat Laporan Penemuan" + back button
- Tab toggle: Kehilangan → link ke admin-create-lost.html | **Penemuan** (aktif)
- Info banner hijau/emerald: "Barang ditemukan yang dititipkan langsung akan langsung tayang di feed."
- **Bagian: Info Penemu** (opsional — penemu mungkin tidak mau identitasnya dicantumkan)
  - Nama Penemu (input text, opsional)
  - NIM Penemu (input text, opsional)
- **Bagian: Info Barang**
  - Foto Barang (upload, opsional)
  - Nama Barang (input text, wajib)
  - Kategori (grid 8 kategori, wajib)
  - Lokasi Ditemukan (input text, wajib)
  - **Titik Penitipan** (input text, **wajib, pre-filled**: "Pos Satpam [nama gedung]") — admin tinggal verifikasi atau ubah
  - Deskripsi Barang (textarea, wajib)
- **Bagian: Catatan Admin**
  - Catatan Internal (textarea, opsional)
- Tombol submit: "Buat Laporan Temuan" dengan aksen hijau/emerald
- Setelah submit → redirect ke `admin-dashboard.html`

---

## UPDATE YANG DIBUTUHKAN DI SCREEN EXISTING

### admin-dashboard.html — 2 perubahan
1. Tambahkan tombol **"+ Buat Laporan"** di header (sebelah kanan) atau sebagai FAB
   - Tap → tampilkan pilihan: "Laporan Kehilangan" atau "Laporan Penemuan"
   - Masing-masing link ke `admin-create-lost.html` atau `admin-create-found.html`
2. Tambahkan link/tombol ke **"Semua Laporan"** yang mengarah ke `admin-reports.html`
   - Bisa di stat card "Total" atau sebagai menu tambahan

### admin-review.html — 2 perubahan
1. Tambahkan tombol **Edit** di halaman review — admin bisa langsung edit detail laporan
2. Tambahkan tombol **Hapus** dengan modal konfirmasi sebelum eksekusi
3. Tampilkan badge **"Via Admin"** (indigo) jika laporan tersebut `created_by_admin = true`

### detail.html & detail-dompet.html — 1 perubahan
1. Jika laporan `created_by_admin = true`, tampilkan badge **"Dilaporkan via Admin"** (indigo) di bawah badge status/kategori

---

## FITUR YANG BELUM ADA (Backlog — Prioritas Rendah)

| Fitur | Prioritas | Keterangan |
|-------|-----------|------------|
| Filter kategori interaktif di home | Sedang | Chip filter ada tapi belum interactive (perlu JS) |
| Empty state di home, messages, notifikasi | Sedang | Perlu UI jika tidak ada data |
| Loading skeleton saat fetch data | Rendah | Setelah backend tersambung |
| Animasi transisi antar halaman | Rendah | CSS transition |
| Pull-to-refresh | Rendah | Setelah backend tersambung |
| Assign laporan admin ke akun mahasiswa | Rendah | Opsional untuk jangka panjang |

---

## KONSISTENSI DESIGN SYSTEM

### ✅ Sudah Konsisten di Semua Screen
- Font: Inter via Google Fonts
- Container: `max-w-md` + `shadow-2xl`
- Bottom nav mahasiswa: 5 tab dengan active state
- Header: sticky + `backdrop-blur-md`
- Cards: `rounded-3xl` + `shadow-sm`
- Warna Lost: `red-100/red-800`
- Warna Found: `emerald-100/emerald-800`
- Warna Admin: `indigo-600`
- Icon: Lucide di semua screen

### ⚠️ Yang Perlu Diperhatikan Saat Integrasi Backend
- Badge "Via Admin" (`bg-indigo-100 text-indigo-700`) harus muncul konsisten di card home, detail, laporanku, dan admin-reports
- Foto dari backend wajib pakai `object-cover` agar tidak merusak layout card
- Empty state harus ditambahkan di: home feed, messages, notifications, my-posts, admin-reports

---

## VERIFIKASI NAVIGASI — SEMUA SCREEN

| Dari | Ke | Via | Status |
|------|----|-----|--------|
| splash | index | meta refresh 2 detik | ✅ |
| index | login | klik card Mahasiswa | ✅ |
| index | login-admin | klik card Admin | ✅ |
| login | register | link "Daftar" | ✅ |
| login | forgot-password | link "Lupa sandi?" | ✅ |
| login | home | tombol Masuk | ✅ |
| register | login | link "Masuk" | ✅ |
| forgot-password | login | submit form | ✅ |
| home | detail-dompet | tap card Lost | ✅ |
| home | detail | tap card Found | ✅ |
| home | create | tap FAB (+) | ✅ |
| create | create-found | tab toggle | ✅ |
| create | success | kirim laporan | ✅ |
| create-found | success | kirim laporan | ✅ |
| detail | chat | tombol Chat | ✅ |
| detail | user-profile | tap nama pelapor | ✅ |
| messages | chat | tap percakapan | ✅ |
| chat | messages | back button | ✅ |
| chat | user-profile | tap nama | ✅ |
| my-posts | edit-post | tombol Edit | ✅ |
| profile | settings | tap menu | ✅ |
| profile | help | tap menu | ✅ |
| profile | index | tap Keluar | ✅ |
| home | notifications | ikon bell | ✅ |
| login-admin | admin-dashboard | login | ✅ |
| admin-dashboard | admin-review | tap card pending | ✅ |
| admin-review | admin-dashboard | back + approve/reject | ✅ |
| admin-dashboard | admin-reports | ★ tombol "Semua Laporan" | ⚠️ Perlu ditambah |
| admin-dashboard | admin-create-lost | ★ tombol "Buat Laporan" | ⚠️ Perlu ditambah |
| admin-dashboard | admin-create-found | ★ tombol "Buat Laporan" | ⚠️ Perlu ditambah |
| admin-create-lost | admin-create-found | tab toggle | ★ Perlu dibuat |
| admin-create-lost | admin-dashboard | submit berhasil | ★ Perlu dibuat |
| admin-create-found | admin-create-lost | tab toggle | ★ Perlu dibuat |
| admin-create-found | admin-dashboard | submit berhasil | ★ Perlu dibuat |
| admin-reports | admin-review | tombol Edit/Hapus | ★ Perlu dibuat |
| admin-reports | detail / detail-dompet | tombol Lihat | ★ Perlu dibuat |

---

## NOTES UNTUK DEVELOPER BACKEND

**Home Feed**
- `GET /api/reports?type=lost&category=elektronik&q=keyword`
- Data per card: `id, type, title, description, location, photo_url, created_at, created_by_admin`
- Urutkan by `created_at DESC`
- Jika `created_by_admin = true`, sertakan `reporter_name` sebagai info pelapor

**Form Submit Mahasiswa**
- `create.html` → `POST /api/reports` dengan `type: "lost"` → status: `pending`
- `create-found.html` → `POST /api/reports` dengan `type: "found"` + `custody_point` wajib → status: `pending`

**Form Submit Admin**
- `admin-create-lost.html` → `POST /api/admin/reports` dengan `type: "lost"`, `created_by_admin: true`, `reporter_name`, `reporter_nim`, `reporter_faculty` → status langsung: `approved`
- `admin-create-found.html` → `POST /api/admin/reports` dengan `type: "found"`, `created_by_admin: true`, `custody_point` wajib → status langsung: `approved`

**Chat**
- Supabase Realtime (`postgres_changes` subscription pada tabel `messages`) untuk real-time
- `report_id` harus ada di state/URL untuk context item di atas chat

**Notifikasi**
- 3 tipe: `report_approved`, `report_rejected`, `new_message`
- Push via Expo Notifications (lokal saat foreground; remote via Expo Push token disimpan di `profiles.expo_push_token`)

**Admin Dashboard Stats**
- `GET /api/admin/stats` → return: `{ pending, approved, rejected, resolved, total }`

**Admin Reports**
- `GET /api/admin/reports?status=pending&type=lost` → support filter status + type + search

---

*Versi: 3.0 | Mei 2026 | App: Cari.In*
*Changelog v3.0: Tambah 3 screen baru admin, spesifikasi detail tiap screen baru,*
*update admin-dashboard & admin-review, update tabel navigasi, notes backend.*
