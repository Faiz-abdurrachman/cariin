# Prompt Lengkap untuk AI Berikutnya

> Terakhir disinkronkan: 20 Juli 2026 06:44 WIB.
>
> File ini berisi instruksi yang dapat langsung ditempel ke AI/agent baru.
> Jangan tempel token, `.env`, Supabase key, atau credential lain bersamanya.

## Yang Perlu Ditempel

Salin seluruh blok berikut:

```text
Lu melanjutkan project Cari.In Mobile di workspace:

/home/faiz/Semester 4/Mobile Programming/cariin/cariin-mobile

Jangan mulai mengubah code sebelum membaca file berikut sampai selesai dan
berurutan:

1. AI_HANDOFF.md
2. CHECKPOINT.md
3. NEXT_STEPS.md
4. TESTING-MANUAL.md
5. AI_NEXT_PROMPT.md
6. uas-mopro/uas-template-mopro.md — hanya untuk memahami snapshot laporan;
   jangan edit karena versi lama sudah dikumpulkan user
7. CLAUDE.md

Setelah membaca, audit kondisi aktual dengan:

- git status --short
- git diff --check
- git log --oneline -10
- cek proses Expo/ngrok dan port 8081
- npx tsc --noEmit
- npm run lint
- npx expo-doctor bila relevan

Kondisi penting:

- Worktree sangat dirty dan berisi perubahan user/agent dari banyak sesi.
  Pertahankan seluruh perubahan existing. Jangan reset, checkout, clean,
  menghapus file untracked, atau memformat massal.
- Jangan commit, push, membuka PR, atau submit apa pun tanpa izin eksplisit.
- Jangan menampilkan `.env`, key Supabase, PAT, password, signing credential,
  EAS secret, atau token sesi.
- Jangan rewrite project dari nol dan jangan mengulang polish yang sudah
  selesai tanpa bug konkret dari hasil pengujian.
- Jangan mengubah laporan Mopro hanya untuk menyelaraskan source terbaru.
  User sudah mengumpulkan versi sebelumnya.

Status backend yang sudah terbukti:

- Supabase project Cari.In berstatus ACTIVE_HEALTHY.
- Schema remote, RLS, RPC, trigger, Storage, Realtime, unique NIM, dan redirect
  cariin://reset-password sudah diterapkan.
- Migration terbaru: add_admin_report_full_crud.
- RPC update_admin_report dan admin_mark_report_resolved sudah diuji sukses
  dalam transaksi rollback.
- Identity mahasiswa ditolak saat memanggil RPC admin.
- Auth/RLS/RPC/Storage/Realtime/trigger sudah lulus smoke test backend dua
  session; artefak smoke test sudah dibersihkan.
- Jangan apply ulang supabase-schema.sql atau mengubah remote tanpa menemukan
  drift dan bukti bahwa perubahan memang dibutuhkan. Sebelum mutation remote,
  lakukan read-only inspection.

Status source terbaru:

- Admin dashboard overlap sudah diperbaiki dan blob header pengganggu dihapus.
- Drawer leak sudah diperbaiki.
- Ikon AdminReview dibuat bulat tanpa artefak kotak.
- Navbar mahasiswa/admin memakai LiquidTabBar yang sama tanpa tile ikon kotak.
- Chat admin memakai aksen teal; mahasiswa biru.
- Composer chat iOS sudah disesuaikan supaya dekat dengan keyboard.
- Switch Hilang/Temuan mahasiswa memakai local state dan tidak mereset form.
- Switch Hilang/Temuan walk-in admin juga memakai local state, tanpa
  nav.replace atau transisi pindah screen.
- Admin sekarang bisa create, read, edit data/foto, menyelesaikan, dan
  menghapus laporan melalui UI dan RPC terkontrol.
- TypeScript, ESLint, Expo Doctor 18/18, git diff --check, dan export iOS 1.515
  modul terakhir lulus. Ini bukti statis, bukan pengganti manual test.

Status dev server:

- @expo/ngrok ^4.1.3 sudah terpasang lokal.
- Pada akhir sesi sebelumnya, `npx expo start --tunnel --clear` berjalan pada
  port 8081. Kondisi proses dapat berubah; cek dulu dan jangan menjalankan
  server kedua pada port yang sama.
- URL exp.direct bersifat sementara. Jangan hardcode URL tunnel lama.

Status APK:

- Build 4d5739ec-b37c-4527-b6cf-c1dc48f0bd6b valid secara statis:
  archive valid, package id.cariin.app, scheme cariin, minSdk 24, targetSdk 36,
  RECORD_AUDIO tidak ada, SHA-256 sudah dicatat di AI_HANDOFF.md.
- Build itu dibuat SEBELUM perbaikan UI/admin full CRUD terbaru. Jangan sebut
  sebagai APK source terkini/final terbaru.
- Setelah source lolos retest, rebuild production dari source terbaru dan
  ulangi verifikasi ukuran, SHA-256, archive, package, scheme, SDK, dan
  permission.
- Instalasi APK sedang ditunda oleh user. Jangan install sebelum user secara
  eksplisit mencabut penundaan.

Pekerjaan berikutnya, kerjakan berurutan:

1. Audit singkat kondisi aktual dan jelaskan langkah pertama.
2. Pastikan Expo tunnel sehat. Jika server sudah hidup, reuse. Jika tidak,
   jalankan `npx expo start --tunnel --clear`.
3. Bantu user retest UI terbaru pada perangkat:
   - dashboard admin tidak overlap dan tidak ada blob di header;
   - drawer tidak bocor;
   - ikon/navbar tidak terlihat mengotak;
   - chat admin teal dan mahasiswa biru;
   - composer iOS tepat di atas keyboard;
   - switch Hilang/Temuan mahasiswa dan admin tanpa transisi/remount;
   - admin Edit Data, Selesaikan, dan Hapus berhasil.
4. Jalankan critical path `TESTING-MANUAL.md` dengan dua akun/perangkat:
   auth, create/upload, approve/reject, notifikasi, chat realtime, profile,
   persistence, dan role switching.
5. Selesaikan reset password end-to-end dari email → deep-link aplikasi →
   password baru → login ulang.
6. Catat hanya hasil yang benar-benar diuji. Minta screenshot bila evidence
   perangkat dibutuhkan. Jangan mencentang skenario yang belum dijalankan.
7. Setelah bug hasil retest beres, jalankan lagi:
   - npx tsc --noEmit
   - npm run lint
   - npx expo-doctor
   - git diff --check
   - export bundle native
8. Rebuild APK production terbaru, verifikasi artifact, tetapi jangan install
   selama penundaan user masih berlaku.
9. Update README, CHECKPOINT.md, NEXT_STEPS.md, AI_HANDOFF.md, dan
   TESTING-MANUAL.md berdasarkan bukti aktual.
10. Kumpulkan screenshot, susun video demo 3–5 menit, serta daftar link
    repository/APK/video. Commit/push hanya setelah user memberi izin.

Kalau membutuhkan Dashboard Supabase atau perangkat fisik yang tidak tersedia,
jelaskan blocker secara spesifik lalu lanjutkan pekerjaan aman lain. Jangan
mengklaim remote schema, manual test, build terbaru, instalasi APK, atau
submission berhasil tanpa bukti.

Berkomunikasi dalam Bahasa Indonesia casual seperti user. Mulai dengan audit
singkat, jelaskan langkah pertama, lalu langsung lanjutkan pekerjaan yang aman.
```

## Prompt Singkat Alternatif

Gunakan versi ini hanya jika konteks AI baru sangat besar dan file workspace
dapat dibaca langsung:

```text
Baca AI_HANDOFF.md, CHECKPOINT.md, NEXT_STEPS.md, TESTING-MANUAL.md, dan
AI_NEXT_PROMPT.md sampai selesai. Audit dirty worktree dan jangan mengulang
source/remote yang sudah selesai. Fokus FASE 6: retest UI terbaru via Expo
tunnel, testing dua akun/perangkat, reset-password E2E, lalu rebuild APK dari
source terbaru. Build 4d5739ec... valid tetapi mendahului perubahan source
terbaru; instalasi APK tetap ditunda. Jangan ubah laporan Mopro yang sudah
dikumpulkan, jangan tampilkan secret, dan jangan commit/push tanpa izin.
```
