# AI HANDOFF — Cari.In Mobile

> Dokumen ini ditujukan langsung kepada AI/agent baru yang akan melanjutkan
> project. Baca sampai selesai sebelum melakukan perubahan.
>
> **Terakhir diperbarui:** 20 Juli 2026 06:44 WIB  
> **Workspace:** `/home/faiz/Semester 4/Mobile Programming/cariin/cariin-mobile`  
> **Branch:** `main`  
> **Status:** FASE 1–5 selesai. Schema, Auth redirect, migration admin full CRUD,
> dan smoke test backend remote sudah terverifikasi. APK production terakhir
> valid secara statis, tetapi dibuat **sebelum** rangkaian perbaikan UI/admin
> terbaru sehingga bukan artifact source terkini. FASE 6 masih membutuhkan
> retest UI/perangkat, reset-password E2E, rebuild APK source terbaru,
> screenshot, video, dan submission.

---

## 0. Misi Lu Sebagai AI Baru

Lu melanjutkan project Cari.In, bukan membangun ulang dari nol.

Prioritas berikutnya, berurutan:

1. Retest perubahan UI terbaru lewat Expo Go/tunnel dan catat bukti aktual.
2. Jalankan pengujian critical path dengan dua akun/perangkat, terutama chat
   realtime dan workflow admin–mahasiswa.
3. Selesaikan reset password dari link email sampai password baru.
4. Setelah source dinyatakan stabil, rebuild APK production dari snapshot
   terbaru dan ulangi verifikasi statis.
5. Install/smoke test APK hanya ketika user mencabut penundaan instalasi.
6. Sinkronkan screenshot, README, laporan, video, dan berkas submission.

Jangan mengulang polish lokal yang sudah selesai kecuali pengujian menemukan
bug konkret. Jangan mengklaim schema remote, instalasi APK, atau skenario manual
berhasil sebelum ada bukti aktual.

---

## 1. Aturan Kerja Wajib

- Baca kondisi repo sebelum mengubah file.
- Pertahankan perubahan lokal karena worktree sedang dirty dan berisi pekerjaan
  user/agent dari beberapa sesi.
- Jangan memakai `git reset --hard`, `git checkout --`, atau menghapus file yang
  tidak berkaitan.
- Jangan commit, push, membuka PR, atau mengubah remote tanpa permintaan user
  yang eksplisit.
- Jangan mengekspos nilai `.env`, Supabase anon key, token, password, signing
  credential, atau EAS secret di chat/log.
- Jangan menaruh service-role key di aplikasi mobile.
- Gunakan Bahasa Indonesia casual `lu/gw` saat berkomunikasi dengan user.
- Setelah mengubah source, minimal jalankan:

```bash
npx tsc --noEmit
npm run lint
git diff --check
```

- Untuk perubahan dependency/config Expo, jalankan juga:

```bash
npx expo-doctor
npx expo config --type public --json
```

---

## 2. Urutan Baca Source of Truth

Baca file berikut secara berurutan:

1. `AI_HANDOFF.md` — dokumen ini.
2. `CHECKPOINT.md` — snapshot teknis dan status fase.
3. `NEXT_STEPS.md` — checklist pekerjaan tersisa.
4. `TESTING-MANUAL.md` — skenario pengujian yang belum dijalankan.
5. `AI_NEXT_PROMPT.md` — instruksi copy-paste dan urutan eksekusi terbaru.
6. `uas-mopro/uas-template-mopro.md` — snapshot laporan yang sudah dikumpulkan;
   baca saja, jangan sinkronkan tanpa instruksi user.
7. `CLAUDE.md` — pola implementasi dan gotcha lama.
8. `CONTEXT.md` — konteks/spec awal; gunakan sebagai referensi historis.
9. `UI_AUDIT.md` — audit visual historis.

Kalau isi file lama bertentangan dengan implementasi source terbaru, source
code + `AI_HANDOFF.md` + `CHECKPOINT.md` + `NEXT_STEPS.md` adalah acuan status.
Jangan menghidupkan kembali requirement historis yang sudah diputuskan tidak
dipakai, misalnya Google OAuth.

---

## 3. Ringkasan Project

- Nama aplikasi: **Cari.In**
- Fungsi: aplikasi lost and found kampus UNU Yogyakarta.
- Role: `mahasiswa` dan `admin`.
- Framework: Expo SDK `54.0.36`, React Native `0.81.5`, React `19.1.0`.
- Bahasa: TypeScript `5.9`, strict mode.
- Backend: Supabase Auth, PostgreSQL, Storage, dan Realtime.
- State: Context API + Zustand.
- Navigation: Stack + Bottom Tab + Drawer.
- Package Android/iOS: `id.cariin.app`.
- App scheme: `cariin://`.
- Visual:
  - mahasiswa memakai aksen biru;
  - admin memakai aksen teal;
  - liquid/frosted glass yang tetap ringan dan readable.
- Source terakhir:
  - 31 file screen TSX;
  - 14 file komponen TSX;
  - 7 service TypeScript.

---

## 4. Kondisi Worktree

Worktree belum di-commit dan berisi banyak perubahan. Anggap semua perubahan
existing sebagai milik user sampai terbukti sebaliknya.

Beberapa file/folder untracked seperti `.omo/`, `references/`, script
`fix_glass*.js`, `promt.md`, dokumen PBO, dan asset lain bukan otomatis sampah.
Jangan hapus hanya karena tidak dipakai runtime.

Perubahan yang memang disengaja:

- `src/utils/helpers.ts` dihapus karena hanya stub tidak terpakai.
- `.easignore` ditambahkan untuk mengecilkan snapshot build dan mengecualikan
  dokumen lokal, `.env`, patch artifact, serta file agent.
- Sisa `SettingsScreen.tsx.orig/.patch/.rej` sudah dibersihkan.
- `AI_HANDOFF.md` memang boleh tetap di luar artifact EAS.
- `src/screens/admin/AdminEditReportScreen.tsx` adalah screen baru yang memang
  belum tracked/commit; jangan dianggap sampah.

Pada saat handoff ini proses berikut masih terdeteksi aktif:

```text
npx expo start --tunnel --clear
Metro port 8081 + ngrok
```

Kondisi proses bersifat sementara. AI baru wajib cek ulang dengan `ps`/port
sebelum mengandalkannya. URL `exp.direct` berubah setiap restart dan tidak boleh
di-hardcode. Dependency lokal `@expo/ngrok ^4.1.3` sudah tersedia.

Sebelum bekerja, jalankan:

```bash
git status --short
git diff --check
```

Jangan merapikan seluruh worktree atau memformat massal tanpa kebutuhan.

---

## 5. Implementasi Lokal yang Sudah Selesai

### 5.1 Auth dan Profile

- Login/register email-password tetap dipakai; Google OAuth tidak
  diimplementasikan.
- Registrasi mahasiswa dibatasi ke
  `@student.unu-jogja.ac.id` pada client dan trigger database.
- Role admin hanya dipercaya dari server-controlled `app_metadata`, bukan
  `user_metadata` client.
- `src/services/profile.service.ts` menjadi pusat operasi profil.
- Profil lengkap user sendiri dibaca melalui RPC `get_my_profile`.
- Screen tidak lagi mengakses Supabase secara langsung.
- Reset password sudah memiliki alur lengkap:
  - email recovery;
  - deep-link `cariin://reset-password`;
  - token recovery diproses `AuthContext`;
  - `ResetPasswordScreen`;
  - update kata sandi.
- Admin juga memiliki screen nyata untuk ganti kata sandi:
  `AdminChangePasswordScreen`, bukan placeholder.
- SecureStore adapter menyimpan session native dengan chunking; web memakai
  AsyncStorage fallback.

File penting:

- `src/context/AuthContext.tsx`
- `src/services/auth.service.ts`
- `src/services/profile.service.ts`
- `src/screens/auth/ResetPasswordScreen.tsx`
- `src/screens/admin/AdminChangePasswordScreen.tsx`

### 5.2 Report dan Admin

- Feed default menampilkan `approved` dan `resolved`.
- Filter `userId`, status, tipe, kategori, serta search sekarang dapat
  dikombinasikan dengan benar.
- Search mencakup judul, lokasi, dan deskripsi.
- Admin `Semua` benar-benar dapat mengambil semua status.
- Mahasiswa menandai selesai melalui RPC `mark_report_resolved`, bukan update
  status langsung.
- Approve/reject admin memakai RPC `update_report_status`.
- Laporan walk-in admin memakai RPC `create_admin_report`.
- Switch Kehilangan/Temuan pada form walk-in admin memakai state lokal, bukan
  `nav.replace`, sehingga tidak ada transisi screen dan draft bersama tetap ada.
- Admin mengedit laporan melalui RPC `update_admin_report` dan form
  `AdminEditReportScreen`; identitas manual hanya dapat berubah pada laporan
  walk-in.
- Admin menyelesaikan laporan aktif mana pun melalui RPC
  `admin_mark_report_resolved`.
- Tombol share detail memakai React Native `Share`.
- Tombol dan flow yang sebelumnya placeholder/no-op telah dibereskan.

File penting:

- `src/services/report.service.ts`
- `src/screens/main/DetailReportScreen.tsx`
- `src/screens/admin/AdminReportsScreen.tsx`
- `src/screens/admin/AdminReviewScreen.tsx`
- `src/screens/admin/AdminEditReportScreen.tsx`

### 5.3 Chat dan Notifikasi

- Profil publik dapat membuka conversation yang terkait laporan aktif.
- Conversation menolak chat dengan diri sendiri.
- Pembuatan conversation menangani race unique constraint.
- Message kosong ditolak di service.
- Race antara response HTTP dan event Realtime tidak lagi menduplikasi pesan.
- Error pengiriman mengembalikan teks ke input dan menampilkan alert.
- Subscription Realtime dibersihkan saat screen dilepas.
- Query notifikasi selalu difilter ke current user, termasuk saat admin.
- Toggle Notifikasi In-App:
  - disimpan di AsyncStorage;
  - menghentikan polling 15 detik;
  - mereset badge ketika dimatikan.
- Ini adalah notifikasi **in-app**, bukan push notification native.

File penting:

- `src/services/chat.service.ts`
- `src/store/chatStore.ts`
- `src/screens/chat/ChatRoomScreen.tsx`
- `src/services/notification.service.ts`
- `src/context/NotifContext.tsx`

### 5.4 UI dan Fitur Pendukung

- `ConfirmModal` sudah menjadi komponen nyata.
- FAQ pada HelpScreen sudah accordion.
- Avatar upload mempunyai error handling dan refresh profile.
- Public profile, Settings, Profile, MyPosts, admin dashboard/review, auth,
  chat, dan navbar sudah dipoles.
- Navbar tetap tampil di Notifications; screen detail/chat tertentu fullscreen.
- App icon, adaptive icon, dan favicon memakai `assets/icon.png`.

---

## 6. Schema dan Keamanan Terbaru

File utama: `supabase-schema.sql`.

Schema terbaru berisi:

- 5 tabel: profiles, reports, conversations, messages, notifications.
- Unique index email dan NIM.
- Trigger `handle_new_user`:
  - validasi domain mahasiswa di server;
  - role admin hanya dari `raw_app_meta_data`;
  - menyalin name, NIM, faculty, department dari signup metadata.
- RPC:
  - `get_my_profile`;
  - `mark_report_resolved`;
  - `update_report_status`;
  - `create_admin_report`;
  - `update_admin_report`;
  - `admin_mark_report_resolved`.
- Privilege kolom:
  - client tidak dapat mengubah `profiles.role`;
  - client tidak dapat mengubah `reports.status`/data moderasi;
  - identitas participant conversation tidak dapat diubah client;
  - pesan lama hanya dapat diubah pada kolom `is_read`;
  - notification hanya dapat diubah pada `is_read`.
- RLS participant/owner/admin.
- Trigger update conversation dan notifikasi pesan.
- Realtime publication dibuat idempotent.
- Bucket:
  - `report-photos` public;
  - `avatars` public;
  - `chat-media` private/reserved.
- Policy Storage membatasi select/insert/update/delete object foto ke folder
  pertama yang sama dengan UUID user.
- `chat-media` belum memiliki policy karena attachment chat belum
  diimplementasikan.

### Bukti Validasi Lokal Schema

Schema sudah diuji pada PostgreSQL 18 sementara dengan stub Supabase
`auth`/`storage`:

- eksekusi pertama: sukses;
- eksekusi kedua: sukses, sehingga alur rerun tervalidasi;
- trigger membuat profil mahasiswa dan admin;
- RPC walk-in admin sukses;
- RPC approve sukses;
- RPC mark resolved oleh owner sukses.

Per 20 Juli 2026, project remote sudah dipulihkan menjadi `ACTIVE_HEALTHY`.
Migration FASE 6 berhasil menerapkan fungsi, privilege, RLS, trigger, Storage,
Realtime, hardening execute, unique index NIM, serta admin full CRUD. Smoke test SQL
RLS/RPC/trigger lulus dan transaksi test di-rollback.

Smoke test client API dengan dua session akun nyata juga lulus:

- login dua akun dan `get_my_profile`;
- field profil sensitif, eskalasi role, dan RPC admin dari mahasiswa diblokir;
- laporan walk-in admin berhasil;
- RPC edit dan selesaikan laporan admin lulus transaksi rollback; identity
  mahasiswa ditolak oleh authorization gate;
- upload/download/remove pada `report-photos` dan `avatars` berhasil, sedangkan
  cross-user upload diblokir;
- dua subscription Realtime menerima pesan baru;
- trigger conversation dan notifikasi `new_message` berjalan;
- password salah dan signup domain luar ditolak;
- request recovery diterima dan email recovery tercatat terkirim;
- seluruh report, message, notification, dan object Storage smoke test sudah
  dibersihkan dan diverifikasi nol.

Advisor terakhir masih memuat warning yang perlu dipahami, bukan diklaim clean:

- tujuh fungsi `SECURITY DEFINER` dapat dieksekusi `authenticated` karena memang
  menjadi API/RLS helper; authorization internal RPC sudah diuji;
- leaked-password protection Supabase Auth masih nonaktif;
- Performance Advisor terakhir hanya mencatat satu index message belum dipakai pada
  database yang masih kecil.

### Blocker Eksternal Tersisa

- Redirect `cariin://reset-password` berhasil ditambahkan melalui Management
  API. PATCH dan GET verifikasi HTTP 200; Site URL existing tidak berubah.
- Unique index NIM aktif setelah dua profil duplikat dinormalisasi menjadi
  `NULL`; jumlah profil tetap 5 dan akun utama mempertahankan NIM.
- Penyelesaian recovery melalui link email dan UI aplikasi belum diuji.
- Dua session Node membuktikan backend multi-client, bukan dua perangkat fisik.
- Manual test UI dua perangkat belum dijalankan.
- Instalasi APK ditunda atas keputusan user.

---

## 7. Konfigurasi Expo dan EAS

### App Config Terbaru

`app.json` saat ini:

- scheme `cariin`;
- package/bundle `id.cariin.app`;
- adaptive icon `assets/icon.png`;
- Android memblokir `android.permission.RECORD_AUDIO`;
- plugin `expo-image-picker` memakai
  `microphonePermission: false`;
- konfigurasi publik terakhir tidak menghasilkan permission microphone.

Konfigurasi permission ini sudah disesuaikan dengan dokumentasi Expo SDK 54.

### EAS

- Account: `faiz.abdurrachman`.
- Project ID:
  `fda197e0-84f6-47f8-9802-a332490a36a2`.
- EAS environment `preview` dan `production` sudah memiliki lima variable
  `EXPO_PUBLIC_*` yang dibutuhkan, disimpan sebagai sensitive.
- Jangan menampilkan nilai variable tersebut.
- `eas.json` memakai environment eksplisit dan Android `buildType: apk`.

### Build Production Terakhir yang Sudah Berhasil

- Build ID: `4d5739ec-b37c-4527-b6cf-c1dc48f0bd6b`
- Build page:
  `https://expo.dev/accounts/faiz.abdurrachman/projects/cariin/builds/4d5739ec-b37c-4527-b6cf-c1dc48f0bd6b`
- Artifact:
  `https://expo.dev/artifacts/eas/pPr_zko1oVS3ZOM_WV2UJs13jhArovBN9YVSuELaB0M.apk`
- Status: `FINISHED`, 20 Juli 2026 01:22:57 WIB.
- Fingerprint:
  `d5ccb8e4a2e019c51f159088640bc85e7bd05e71`.
- Ukuran: `80.572.407 byte` / `76,84 MiB`.
- SHA-256:
  `6c6d30f0af72d0ba1b29a16a463e1b9bd14176ac74b96fe7c1152d2129479c82`.
- Salinan lokal:
  `dist/cariin-production-4d5739ec-b37c-4527-b6cf-c1dc48f0bd6b.apk`
  (`dist/` di-ignore Git dan EAS).
- Verifikasi:
  - `unzip -t` dan `zipinfo -t` lulus untuk 1.297 entry;
  - package `id.cariin.app`, version `1.0.0`, versionCode 1;
  - minSdk 24, targetSdk 36;
  - scheme `cariin` ada pada manifest;
  - `android.permission.RECORD_AUDIO` tidak ada pada permission APK final.

Build ini valid sebagai bukti historis konfigurasi permission/build pada
20 Juli 2026 01:22 WIB, tetapi source berubah setelahnya: perbaikan dashboard,
drawer, navbar, chat, switch form mahasiswa/admin, serta admin full CRUD.
Karena itu build ini **bukan APK dari source terbaru** dan tidak boleh disebut
artifact submission final terkini. Backend Supabase sudah aktif dan smoke test
API lulus.

### Build Kandidat Lama

- Build ID: `c1217c5d-ac3b-480e-8577-841877bbb68b`
- Build page:
  `https://expo.dev/accounts/faiz.abdurrachman/projects/cariin/builds/c1217c5d-ac3b-480e-8577-841877bbb68b`

- Artifact:
  `https://expo.dev/artifacts/eas/064D2ZoH32J1_fZmDlzI06Oz792TsAbTHkp_BeDBwS8.apk`
- Ukuran: `80.569.203 byte` / `76,83 MiB`.
- SHA-256:
  `63961b629eeac49e4f2818c7142225e38ef8a3766003824f2636a0a991a7930e`
- Archive lulus `unzip -t`.

Build lama tersebut hanya bukti historis compile sebelum konfigurasi terakhir
memblokir `RECORD_AUDIO`; jangan memakainya sebagai artifact submission utama.

Link artifact EAS dapat kedaluwarsa. Salinan final-config sudah disimpan di
folder lokal `dist/`.

---

## 8. Validasi Source Terakhir

Hasil terakhir pada 20 Juli 2026:

```text
npx tsc --noEmit  → 0 error
npm run lint      → 0 error, 0 warning
npx expo-doctor   → 18/18 checks passed
git diff --check  → clean
npx expo export --platform ios → sukses, 1.515 modul, bundle Hermes 4,97 MB
```

Pemeriksaan tambahan:

- 31 screen TSX dan 14 komponen TSX.
- Tidak ada screen yang import/memanggil Supabase langsung.
- Tidak ada marker TODO/FIXME/“akan hadir”/stub fitur yang diketahui.
- Tidak ada `.orig`, `.patch`, atau `.rej` tersisa di `src/screens`.
- Nomor tabel laporan berurutan 1–17.
- Nomor gambar laporan berurutan 1–23.
- Code fence laporan seimbang.

Belum ada unit test, integration test, atau E2E otomatis. Jangan menyamakan
hasil static check dengan keberhasilan runtime.

### Regresi UI Terbaru — Perlu Retest Perangkat

Screenshot iPhone menunjukkan tiga bug yang kemudian diperbaiki secara lokal:

- dashboard admin overlap karena header dan list menjadi sibling flex;
- Inbox/ChatRoom admin masih memakai aksen biru mahasiswa;
- composer chat terlalu jauh di atas keyboard iOS.

Screenshot lanjutan menemukan dua regresi tambahan yang juga sudah diperbaiki
lokal:

- blob kanan-atas drawer overflow keluar saat drawer tertutup; blob dihapus dan
  drawer diberi clipping;
- tombol back/hapus AdminReview menghasilkan artefak kotak dari `BlurView` di
  iOS; keduanya diganti surface lingkaran biasa.
- navbar admin/mahasiswa kini memakai `LiquidTabBar` yang sama; tile aktif
  dihapus dan FAB dibuat bulat dengan aksen role;
- switch Kehilangan/Temuan pada form mahasiswa memakai local state, bukan
  `nav.replace`, supaya tidak terasa berpindah halaman dan tidak mereset form.
- form walk-in admin juga memakai `reportType` lokal pada kedua entry screen;
  field bersama tetap tersimpan dan Titik Penitipan hanya tampil untuk Temuan;
- AdminReview sekarang punya Edit Data dan Selesaikan; form edit mencakup
  data/foto laporan serta identitas manual walk-in;
- RPC remote `update_admin_report` dan `admin_mark_report_resolved` berhasil
  diuji dalam transaksi rollback; identity mahasiswa ditolak.

Source sekarang menempatkan dashboard dalam satu hierarchy flex, memilih aksen
chat berdasarkan role, serta memakai keyboard offset nol dan padding bawah
adaptif. TypeScript, ESLint, dan `git diff --check` lulus setelah perubahan.
Jangan menandai ketiganya berhasil di perangkat sebelum user mengirim hasil
retest/screenshot terbaru.

---

## 9. Status Laporan Mopro

File laporan dosen:

`uas-mopro/uas-template-mopro.md`

Laporan lokal pernah diselaraskan dengan source sebelum penambahan
`AdminEditReportScreen`. User menyatakan versi lama sudah terlanjur dikumpulkan.
Karena itu:

- jangan mengubah laporan Mopro lagi hanya demi mengejar source terbaru tanpa
  permintaan eksplisit user;
- jangan mengklaim file yang dikumpulkan memuat admin full CRUD terbaru;
- perubahan source setelah pengumpulan diperlakukan sebagai enhancement
  pasca-submission.

Versi laporan yang sempat diselaraskan mencatat:

- stack dan versi teknologi benar;
- 30 screen dan 14 komponen pada snapshot laporan; source sekarang 31 screen;
- auth, service layer, RLS, chat, notifikasi in-app, profile, admin;
- urutan tabel/gambar;
- EAS build kandidat;
- ukuran dan checksum artifact;
- keterbatasan manual test;
- tidak ada klaim palsu bahwa iPhone/Android sudah lulus testing.

Placeholder screenshot masih sengaja dipertahankan karena screenshot perangkat
belum tersedia. Jangan mengubah placeholder menjadi klaim selesai sebelum ada
bukti.

---

## 10. Pekerjaan Tersisa — Eksekusi Berurutan

### Langkah 1 — Apply Supabase (SELESAI)

1. Schema terbaru sudah diterapkan ke project remote.
2. RPC aplikasi berikut terverifikasi:
   - `get_my_profile`;
   - `mark_report_resolved`;
   - `update_report_status`;
   - `create_admin_report`;
   - `update_admin_report`;
   - `admin_mark_report_resolved`.
3. Bucket dan policy Storage terverifikasi.
4. Redirect URL berikut aktif di Auth URL Configuration:

```text
cariin://reset-password
```

5. Positive/negative test yang sudah dijalankan:
   - email luar kampus ditolak trigger;
   - mahasiswa tidak dapat mengubah role;
   - mahasiswa tidak dapat mengubah status report secara langsung;
   - workflow owner mark resolved dan admin approve/reject lulus pada smoke test
     SQL transaksional;
   - laporan walk-in admin berhasil;
   - admin edit/resolve report berhasil dalam transaksi rollback;
   - mahasiswa ditolak saat memanggil RPC admin full CRUD;
   - user hanya dapat mengubah object Storage di folder UUID sendiri.

Semua data/object yang dibuat smoke test sudah dibersihkan dan diverifikasi nol.

### Langkah 2 — Artifact APK Baseline (SELESAI HISTORIS)

Sebelum build:

```bash
npx tsc --noEmit
npm run lint
npx expo-doctor
npx expo config --type public --json
git diff --check
```

Pastikan output config tetap memuat:

```text
blockedPermissions: android.permission.RECORD_AUDIO
expo-image-picker.microphonePermission: false
```

Perintah yang sudah dijalankan:

```bash
eas build --platform android --profile production --non-interactive --wait
```

Hasil aktual:

1. Build ID `4d5739ec-b37c-4527-b6cf-c1dc48f0bd6b`, status `FINISHED`.
2. APK sudah diunduh ke `dist/`.
3. Ukuran, SHA-256, package, SDK, scheme, permission, dan archive sudah
   diverifikasi seperti bukti di bagian 7.
4. Instalasi dan smoke test perangkat masih belum dijalankan.
5. Source berubah setelah build; rebuild terbaru dipindahkan ke Langkah 4.

### Langkah 3 — Testing Manual

Gunakan `TESTING-MANUAL.md`.

Prioritas critical path:

1. Retest dashboard/drawer/navbar admin pada iPhone dan Android.
2. Retest warna chat per role serta posisi composer iOS.
3. Retest switch form Hilang/Temuan mahasiswa dan walk-in admin tanpa remount.
4. Retest admin Edit Data, Selesaikan, dan Hapus laporan.
5. Register email kampus dan penolakan domain luar.
6. Login mahasiswa/admin dan restore session.
7. Reset password dari email sampai password baru.
8. Create lost/found + upload foto.
9. Admin approve/reject dan notifikasi mahasiswa.
10. Chat realtime dua akun/perangkat tanpa pesan dobel.
11. Toggle notifikasi persisten, avatar, dan ganti password dua role.
12. Rebuild APK production source terbaru setelah semua bug source beres.
13. Install/cold-start APK hanya bila penundaan user dicabut.

Centang hanya skenario yang benar-benar dijalankan. Simpan screenshot/log
sebagai bukti laporan dan video.

Blocker saat ini:

- tidak ada Android/iOS device, ADB, atau simulator yang tersedia;
- redirect Auth sudah diterapkan dan diverifikasi;
- unique NIM remote sudah aktif setelah dua profil duplikat dinormalisasi ke
  `NULL`; jumlah profil tetap 5 dan NIM akun utama dipertahankan.
- instalasi APK sedang ditunda atas keputusan user.

### Langkah 4 — Rebuild APK Source Terbaru

Jalankan hanya setelah retest UI/source stabil:

1. Ulangi TypeScript, ESLint, Expo Doctor, public config, `git diff --check`,
   dan export bundle.
2. Jalankan production build baru dari snapshot source terkini.
3. Unduh artifact dan verifikasi archive, ukuran, SHA-256, package, scheme,
   min/target SDK, serta absence `RECORD_AUDIO`.
4. Update semua referensi Build ID/checksum pada dokumen.
5. Jangan install APK selama user masih menunda instalasi.

### Langkah 5 — Dokumentasi dan Submission

Setelah testing/build final:

- ganti data build kandidat pada laporan dengan build final;
- isi hasil pengujian manual;
- masukkan screenshot untuk Gambar 7–23;
- update README dengan screenshot aktual;
- rekam video demo 3–5 menit;
- simpan link video/repository/APK;
- update `CHECKPOINT.md`, `NEXT_STEPS.md`, dan `AI_HANDOFF.md`;
- commit/push hanya jika user memerintahkan.

---

## 11. Definition of Done FASE 6

FASE 6 baru boleh dianggap selesai bila:

- schema terbaru sudah diterapkan dan diverifikasi di Supabase remote;
- redirect recovery URL sudah aktif;
- registrasi, RPC, RLS, trigger, Realtime, dan Storage lolos pengujian backend;
- seluruh alur UI critical path lolos manual test dua perangkat;
- APK production baru berasal dari snapshot source/config terbaru;
- APK final berhasil diinstal dan lolos smoke test Android;
- checklist manual memiliki bukti;
- screenshot laporan tersedia;
- video demo selesai;
- laporan memakai Build ID/artifact final-config terbaru;
- user menyetujui commit/push/submission bila tindakan tersebut diminta.

Static checks dan build final-config saja belum memenuhi definition of done.

---

## 12. Gotcha Teknis

- Pressable kompleks memakai children-as-function agar state `pressed` stabil.
- Parent `Image`/container harus memiliki dimensi eksplisit.
- Header title absolute harus `pointerEvents="none"` agar tidak menangkap tap.
- Modal first screen kembali melalui parent navigator.
- Supabase `PostgrestError` perlu dibungkus `new Error(error.message)`.
- Realtime channel wajib unsubscribe pada cleanup.
- NotifContext polling hanya aktif ketika login dan toggle menyala.
- `Notifications` mempertahankan bottom navbar; `ChatRoom` fullscreen.
- Report owner tidak boleh mengubah `status` langsung.
- Admin privilege berasal dari profile/app metadata server, bukan input client.
- `chat-media` masih reserved karena chat hanya teks.
- Notifikasi native/push belum diimplementasikan; jangan menyebutnya sudah ada.
- Build page kandidat tetap berguna sebagai bukti compile, tetapi bukan final.
- Build `4d5739ec...` juga bukan snapshot source terbaru setelah perbaikan UI dan
  admin full CRUD; rebuild wajib sebelum menyebut APK terbaru/final.

---

## 13. File Map Penting

| Area | File |
|---|---|
| Root auth routing | `src/navigation/index.tsx` |
| Auth state/recovery | `src/context/AuthContext.tsx` |
| Auth service | `src/services/auth.service.ts` |
| Profile service | `src/services/profile.service.ts` |
| Report service | `src/services/report.service.ts` |
| Chat service/store | `src/services/chat.service.ts`, `src/store/chatStore.ts` |
| Notification | `src/services/notification.service.ts`, `src/context/NotifContext.tsx` |
| Upload | `src/services/upload.service.ts` |
| Admin navigation | `src/navigation/AdminNavigator.tsx` |
| Route types | `src/navigation/types.ts` |
| Supabase schema | `supabase-schema.sql` |
| Expo config | `app.json` |
| EAS config | `eas.json`, `.easignore` |
| Manual test | `TESTING-MANUAL.md` |
| Prompt AI berikutnya | `AI_NEXT_PROMPT.md` |
| Report | `uas-mopro/uas-template-mopro.md` |
| Status | `CHECKPOINT.md`, `NEXT_STEPS.md` |

---

## 14. Prompt Singkat Siap Tempel

Kalau user hanya ingin memberi instruksi singkat ke AI berikutnya, gunakan:

> Baca `AI_HANDOFF.md` sampai selesai, lalu `CHECKPOINT.md`, `NEXT_STEPS.md`,
> `TESTING-MANUAL.md`, dan `AI_NEXT_PROMPT.md`. Audit dirty worktree dan jangan
> mengulang pekerjaan source/remote yang sudah selesai. Lanjutkan FASE 6 dari
> retest UI terbaru memakai Expo tunnel, pengujian dua akun/perangkat, dan reset
> password E2E. Supabase schema/redirect/admin full CRUD sudah diterapkan dan
> diuji; jangan apply ulang tanpa bukti drift. APK `4d5739ec...` valid tetapi
> mendahului perubahan source terbaru, jadi rebuild production hanya setelah
> source stabil. Instalasi APK masih ditunda sampai user mengizinkan. Jangan
> menampilkan secret, mengubah laporan Mopro yang sudah dikumpulkan, atau
> commit/push tanpa izin eksplisit.
