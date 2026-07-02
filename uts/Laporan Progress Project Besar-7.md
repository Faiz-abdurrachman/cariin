**Laporan Progress Project Besar #7 (FINAL)**

**Pemrograman Berbasis Object**

Judul	: Cari.In Aplikasi Mobile Lost & Found Kampus UNU Yogyakarta
Periode	: 6 – 15 Agustus 2026

Dokumentasi Kegiatan & Tanggal Kegiatan: 

| No | Foto Kegiatan | Keterangan | Tanggal  |
| :---- | :---- | :---- | :---- |
| 1 | Gambar 1 | Build APK Production & Deployment | 6 – 8 Agustus 2026 |
| 2 | Gambar 2 | Testing End-to-End & Bug Fixing | 9 – 12 Agustus 2026 |
| 3 | Gambar 3 | Dokumentasi Teknis & Presentasi Final | 13 – 15 Agustus 2026 |

Deskripsi Kegiatan:

**1. Kegiatan 1: Build APK Production & Deployment**

1. Optimasi Ukuran APK: Menghapus dependency yang tidak diperlukan untuk production — react-dom, react-native-web (hanya untuk web preview), expo-web-browser (Google OAuth dihapus, fokus email kampus). Menghapus script "web" dari package.json. Membersihkan plugin expo-web-browser dari app.json.

2. Konfigurasi EAS Build: Membuat eas.json dengan 2 profile — preview (debug, fast build, 76 MB) dan production (release, optimized, assembleRelease). Konfigurasi app.json — enableProguardInReleaseBuilds untuk kompresi kode, update splash background ke #2563EB (blue).

3. Build Process: Login EAS dengan akun Expo (faiz.abdurrachman). Inisialisasi project EAS (eas init). Build production Android APK via eas build --platform android --profile production. Process: upload project ke EAS server → install dependencies → compile React Native ke native Android → generate APK. Waktu build ~13 menit.

4. Hasil Build: Production APK 76 MB (universal — mencakup 3 arsitektur CPU: x86, ARM32, ARM64). File: CariIn-v1.apk. Dapat diinstal langsung di perangkat Android tanpa Expo Go.

5. Penerapan OOP:
   a. Encapsulation: Konfigurasi build di-encapsulate dalam eas.json dan app.json. Kode aplikasi tidak perlu berubah untuk build — separation of concerns antara development dan deployment.

*Gambar 1: Build APK — screenshot EAS Build dashboard (status finished, 76 MB), screenshot eas.json konfigurasi, screenshot terminal build log, screenshot APK terinstal di Android, screenshot app.json dengan enableProguardInReleaseBuilds.*

**2. Kegiatan 2: Testing End-to-End & Bug Fixing**

1. User Flow Testing: Menguji seluruh flow aplikasi untuk kedua role:
   a. Mahasiswa: Register → Login → Home Feed (filter kategori, tipe, search) → Detail Laporan → Chat Penemu → Create Lost (foto + kategori + submit) → Notifikasi (bell badge) → Inbox (ChatRoom realtime) → My Posts (edit, hapus, tandai selesai) → Profile (avatar upload, settings, logout).
   b. Admin: Login → Dashboard (4 stat cards, tab filter) → Review (approve/reject + alasan) → All Reports (filter + search) → Walk-in Report (input data pelapor) → Admin Chat (dari Review & tab Pesan) → Profil admin.

2. Bug Fixes yang Ditemukan & Diperbaiki:
   a. Cross-stack Navigation: NotificationsScreen tap notif tidak bisa navigasi ke DetailLost (error "not handled by any navigator"). Fix: getParent<MainTabParamList>() → HomeTab → DetailLost.
   b. UserProfile Navigation: DetailReportScreen tap reporter → UserProfile error di MyPostsStack. Fix: getParent<MainTabParamList>() → HomeTab → UserProfile.
   c. Admin Dashboard Refresh: Setelah balik dari Review, dashboard tidak reload tab yang aktif (selalu reset ke Pending). Fix: useFocusEffect reload berdasarkan activeTab saat ini, bukan hardcoded 'pending'.
   d. Admin Review Padding: Konten kepotong oleh action bar bottom (3 tombol). Fix: contentContainerStyle paddingBottom 120 → 200.
   e. RPC Functions Missing: update_report_status dan create_admin_report hilang dari database. Fix: re-create functions via Supabase SQL Editor.
   f. AuthContext Loading: App stuck di splash screen jika Supabase unreachable. Fix: try/catch/finally di loadInitial().

3. Code Quality Verification: TypeScript strict mode — npx tsc --noEmit: 0 errors. ESLint v9 flat config — npm run lint: 0 errors, 0 warnings. expo-doctor — 18/18 checks passed. Metro bundle — 1.294 modules, build time ~2 detik.

4. Penerapan OOP:
   a. Polymorphism: AdminReviewScreen Bottom Bar berperilaku berbeda — pending: tombol Tolak/Setujui/Chat. Non-pending: status message saja. getOrCreateConversation — existing return vs create new.

*Gambar 2: Testing & Bug Fixing — screenshot user flow testing (serangkaian screen), screenshot bug fix code (cross-stack navigation), screenshot expo-doctor 18/18 passed, screenshot tsc --noEmit 0 errors, tabel bug fixes list.*

**3. Kegiatan 3: Dokumentasi Teknis & Presentasi Final**

1. Laporan Progress Project Besar: Menyusun 7 laporan progress (Laporan #1-#7) yang mencakup seluruh perjalanan project dari analisis masalah hingga deployment. Setiap laporan mendokumentasikan 3 kegiatan dengan foto, deskripsi detail, penerapan OOP, kontribusi anggota, capaian kerja, dan target minggu depan.

2. Laporan Akhir Komprehensif: Menyusun LAPORAN-AKHIR.md (487 baris) mencakup 16 bab — identitas project, latar belakang, validasi masalah, analisis kompetitor, UVP, solusi, riset warna, tech stack, arsitektur sistem, database design, fitur mahasiswa & admin, design system, statistik aplikasi, testing, deployment, kesimpulan.

3. User Flow Dokumentasi: Menyusun USER_FLOW.md (8 flow) dengan narasi dan step-by-step — setiap flow mencakup skenario, tabel step (action, layar, narasi), dan timeline demo 5 menit.

4. Interactive Web Presentation: Membangun slide presentasi interaktif (pres/index.html, 428 baris) berbasis HTML/CSS/JavaScript dengan fitur: 17 slide konten, Jakarta Sans font, Cari.In color palette (blue + teal), keyboard navigation (arrow keys, F fullscreen, Esc overview grid), progress bar, slide counter, fade-in animations, mobile swipe support. Deploy via Vercel.

5. Repository & Deliverables: Seluruh source code, dokumentasi, dan deliverables di-push ke GitHub (github.com/Faiz-abdurrachman/cariin). Struktur folder: src/ (source code), supabase-schema.sql (database), uas-mopro/ (dokumentasi UAS Mobile Programming), uts/ (laporan PBO).

6. Penerapan OOP:
   a. Abstraction: Dokumentasi teknis mengabstraksi kompleksitas implementasi — developer lain bisa memahami arsitektur tanpa membaca seluruh kode.
   b. Inheritance: Template laporan PBO (struktur baku: dokumentasi kegiatan, deskripsi, kontribusi, capaian, target) diturunkan ke 7 laporan dengan format konsisten.

*Gambar 3: Dokumentasi & Presentasi — screenshot LAPORAN-AKHIR.md, screenshot USER_FLOW.md, screenshot interactive presentation (pres/index.html), screenshot GitHub repository, screenshot folder uas-mopro/, screenshot Vercel deployment.*

Kontribusi Anggota:

| NO | NAMA | NIM | KONTRIBUSI |
| :--- | :--- | :--- | :--- |
| 1 | Irham Zubaidi Alhuda | 241111006 | Membantu penyusunan laporan #7, dokumentasi build process, screenshot presentasi |
| 2 | Galih Witradika | 241111013 | Testing end-to-end final, validasi seluruh user flow, dokumentasi bug fixes |
| 3 | Faiz Abdurrahman | 241111021 | Build APK production (EAS). Testing end-to-end 2 role. Perbaikan 6 bug (cross-stack nav, dashboard refresh, review padding, RPC restore, auth loading, UserProfile nav). Code quality verification. Penyusunan LAPORAN-AKHIR.md (487 baris), USER_FLOW.md (8 flow), interactive presentation (428 baris HTML/CSS/JS). Push ke GitHub. |
| 4 | Ibnul Mubarok | 241111026 | Membantu penyusunan laporan final, pengujian APK di perangkat Android |
| 5 | Imroatu Zakiyah | 241111032 | Finalisasi laporan progress. Penyusunan materi presentasi. Validasi capaian akhir. |
| 6 | Aldo Yulian | 241111037 | Desain interactive presentation. Dokumentasi screenshot final. Pengujian presentasi. |

Capaian Kerja: 

1. Production APK berhasil di-build (76 MB) dan diuji di perangkat Android. Semua fitur berfungsi.  

2. Testing end-to-end selesai — 2 role (mahasiswa + admin), 15+ user flow, 6 bug ditemukan dan diperbaiki.  

3. Code quality terverifikasi — TypeScript 0 errors, ESLint 0 warnings, expo-doctor 18/18 passed, Metro bundle 1.294 modules.  

4. 7 laporan progress PBO disusun (Laporan #1-#7) mencakup 21 kegiatan dengan dokumentasi foto, deskripsi, penerapan OOP, kontribusi anggota, capaian kerja.  

5. Laporan akhir komprehensif (16 bab, 487 baris), user flow (8 flow), dan interactive presentation (17 slide) disusun.  

6. Seluruh deliverables di-push ke GitHub repository dan siap untuk presentasi.

Target Minggu Depan: 

1. Seluruh deliverables telah selesai. Fokus minggu depan adalah persiapan presentasi dan demo aplikasi.
