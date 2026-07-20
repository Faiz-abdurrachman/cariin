# NEXT_STEPS — Plan Fase Berikutnya

> Plan detail per fase remaining. Baca `CHECKPOINT.md` dulu untuk konteks status.
>
> **Status saat ini:** FASE 1-5 ✅ done. FASE 4.5 ✅ done. FASE 6 🟡 partial;
> schema/Auth/admin CRUD remote serta smoke test backend sudah terverifikasi.
> APK terakhir valid secara statis tetapi mendahului perubahan source terbaru.
>
> **Yang belum:** pengujian UI dua perangkat, alur reset password end-to-end,
> rebuild production terbaru, smoke test instalasi APK (ditunda atas keputusan
> user), video, screenshot, dan bukti submission.

---

## URUTAN REKOMENDASI

| Skenario | Urutan |
|----------|--------|
| Submission final | **FASE 6** (retest UI terbaru → testing dua perangkat + reset E2E → rebuild APK source terbaru → verifikasi → screenshot/video/lampiran) |

## START HERE — AI/SESI BERIKUTNYA

1. Baca `AI_HANDOFF.md` penuh dan gunakan `AI_NEXT_PROMPT.md`.
2. Jalankan audit read-only: `git status --short`, `git diff --check`, proses
   Expo/port 8081, lalu TypeScript/ESLint.
3. Jangan apply ulang schema remote: migration sampai
   `add_admin_report_full_crud` sudah ada. Periksa drift sebelum mutation.
4. Gunakan Expo tunnel yang sudah didukung:

```bash
npx expo start --tunnel --clear
```

5. Retest dahulu bug yang baru diperbaiki:
   - dashboard/drawer/navbar admin;
   - warna chat role dan composer iOS;
   - switch Hilang/Temuan mahasiswa serta walk-in admin;
   - admin Edit Data, Selesaikan, dan Hapus.
6. Lanjutkan critical path dua akun/perangkat dan reset password E2E.
7. Setelah source stabil, rebuild APK production dan ulangi SHA-256,
   integritas, package/scheme/permission. Jangan install sebelum user
   mencabut penundaan.
8. Update checklist hanya berdasarkan bukti aktual; jangan mengubah laporan
   Mopro yang sudah dikumpulkan tanpa instruksi eksplisit.

---

## FASE 6 — Polish Final & Submission

> **Tujuan:** Schema produksi sinkron, seluruh checklist teruji, APK standalone tersedia, dan bukti submission lengkap.
>
> **Estimasi:** bergantung pada akses Supabase, EAS, perangkat uji, dan kestabilan koneksi.

### 6.1 — Supabase Schema & Auth
- [x] Pulihkan project menjadi `ACTIVE_HEALTHY`
- [x] Apply hardening fungsi, privilege, RLS, trigger, Storage, dan Realtime
- [x] Pastikan RPC `get_my_profile` dan `mark_report_resolved` tersedia
- [x] Normalisasi dua profil dengan NIM duplikat dan aktifkan
  `idx_profiles_nim_unique`; akun utama mempertahankan NIM
- [x] Verifikasi registrasi domain luar ditolak oleh trigger database dan tidak
  meninggalkan user/profile
- [x] Verifikasi user biasa tidak dapat membaca field profil sensitif, menaikkan
  `profiles.role`, mengubah `reports.status` langsung, atau memanggil RPC admin
- [x] Tambahkan dan verifikasi `cariin://reset-password` pada redirect URL
  Supabase Auth tanpa mengubah Site URL
- [x] Tambahkan dan uji RPC admin untuk edit penuh serta menyelesaikan laporan
  aktif; migration remote `add_admin_report_full_crud` lulus uji rollback dan
  authorization gate

### 6.2 — Pengujian Fungsional
- [ ] Jalankan dan centang seluruh `TESTING-MANUAL.md`
- [x] Uji backend dengan dua session akun nyata: Auth, RPC, RLS, Storage,
  Realtime, dan trigger lulus; seluruh artefak uji dibersihkan
- [ ] Uji chat realtime melalui UI dengan dua akun/perangkat fisik
- [ ] Uji UI admin Edit Data + Selesaikan untuk laporan walk-in dan mahasiswa
- [ ] Retest switch Hilang/Temuan form mahasiswa dan admin tanpa transisi route
- [ ] Retest dashboard/drawer/navbar, warna chat admin, dan composer iOS
- [ ] Uji reset password dari email sampai kata sandi baru
- [x] Verifikasi request reset diterima dan email recovery terkirim
- [ ] Simpan screenshot/log bukti untuk laporan

### 6.3 — EAS Build
- [x] EAS login sebagai `faiz.abdurrachman`
- [x] Environment variable preview/production tersimpan di EAS
- [x] Build kandidat production → APK 76,83 MiB (integritas archive valid)
- [x] Rebuild production final-config → build
  `4d5739ec-b37c-4527-b6cf-c1dc48f0bd6b`
- [x] Verifikasi APK final-config → 80.572.407 byte (76,84 MiB), archive
  valid, package/scheme benar, `RECORD_AUDIO` tidak ada, SHA-256 tercatat
- [ ] Rebuild production dari source terbaru setelah seluruh perubahan
  UI/admin lolos retest; build `4d5739ec...` tidak memuat perubahan terbaru
- [ ] Test APK di device Android — ditunda atas keputusan user

### 6.4 — Final Polish
- [x] App icon final dikonfigurasi dari `assets/icon.png` untuk app/adaptive/web
- [x] Verifikasi `expo-doctor` pass — 18/18 checks
- [x] `npx tsc --noEmit` + `npm run lint` clean
- [ ] Update README dengan screenshot terbaru
- [x] Final consistency pass untuk `Profile`, `AdminDashboard`, dan screen lain yang masih beda bahasa visual
- [x] FAQ accordion, toggle polling persisten, public-profile chat, share report, dan reset-password deep-link
- [x] Ganti kata sandi admin, deduplikasi pesan realtime, dan policy Storage
- [x] Presentation layer tidak lagi mengakses Supabase langsung

### 6.5 — Submission
- [ ] Video demo 3-5 menit (semua fitur: auth, feed, create, detail, chat, admin moderation)
- [ ] Commit final + push ke GitHub
- [x] APK kandidat production tersedia dari EAS
- [x] APK production historis yang valid secara statis tersedia
- [ ] APK production dari snapshot source terbaru tersedia

### 6 Definition of Done
- [x] Schema terbaru sudah diterapkan dan dites di Supabase
- [x] Trigger notifikasi terverifikasi lewat SQL dan client API
- [ ] APK production sudah direbuild dari source terbaru
- [ ] APK standalone terbaru sudah diuji install dan smoke test
- [x] Source tidak memiliki stub/placeholder fitur yang diketahui
- [ ] Checklist manual lengkap dengan bukti
- [x] Expo Doctor lulus — 18/18 checks
- [ ] Video demo complete
- [ ] GitHub repo public dengan README comprehensive
- [ ] Liquid-glass language konsisten di auth, chat, navbar, laporan, dan admin area

---

## FASE 4.5 — Chat & Notifikasi ✅ SELESAI

> **Tanggal selesai:** 2026-06-29
>
> Implementasi: InboxScreen, ChatRoomScreen (Supabase Realtime subscribe/unsubscribe), NotificationsScreen, chat.service (listConversations, getOrCreateConversation, sendMessage, subscribeToMessages, markMessagesAsRead), notification.service (list, markAsRead, markAllAsRead, unreadCount), chatStore (Zustand), ChatBubble component, NotifContext (unread count + polling 15s).
>
> Update existing: DetailReportScreen Chat button wired to getOrCreateConversation, HomeScreen bell badge unread count.
>
> Backend: Trigger `trg_notify_new_message` ditambahkan di supabase-schema.sql (AFTER INSERT messages → auto insert notifikasi ke receiver).
>
> Verifikasi: `npx tsc --noEmit` clean, `npm run lint` clean (0 errors, 0 warnings).

---

## FORMAT UPDATE TIAP FASE

Saat fase selesai, AI WAJIB:
1. Update `CHECKPOINT.md` table progres + status remaining files
2. Update `NEXT_STEPS.md` — coret checklist fase selesai, update fokus ke berikutnya
3. Update `CLAUDE.md` (kalau ada pattern baru/gotcha penting)
4. Commit dgn format konsisten: `FASE N: <ringkasan singkat>`

---

## CARA RESUME SESI BARU

User ketik:
```
Baca AI_HANDOFF.md dan AI_NEXT_PROMPT.md sampai selesai, lanjut FASE 6
```

AI baru:
1. Auto-load CLAUDE.md (pattern wajib & gotcha)
2. Read CHECKPOINT.md (status)
3. Read NEXT_STEPS.md (plan)
4. Cek `git log --oneline -10` verify state
5. Mulai audit lalu lanjutkan pekerjaan aman tanpa mengulang fase selesai

---

## CATATAN PENTING UNTUK AI BARU

⚠️ **CRITICAL** ⚠️ Wajib baca `CLAUDE.md` section 4:
- Pressable pattern children-as-function
- Image dimension explicit
- Modal back via `getParent()?.goBack()`
- Header title overlay `pointerEvents="none"`
- PostgrestError wrap jadi Error

⚠️ **Realtime cleanup:** `chatStore.subscribe/unsubscribe` — channel harus di-unsubscribe di cleanup effect `ChatRoomScreen`.

⚠️ **NotifContext polling 15 detik** — hanya aktif saat preferensi notifikasi in-app menyala.

⚠️ **Navbar rule:** `Notifications` harus tetap menampilkan navbar utama; yang fullscreen cuma `ChatRoom` dan `UserProfile`.

⚠️ **MyPosts style:** `src/screens/profile/MyPostsScreen.tsx` sudah dipoles ke glass layout, jangan dibikin balik ke layout polos.

⚠️ **JANGAN UBAH** `CONTEXT.md` & `UI_AUDIT.md`.

⚠️ **JANGAN PUSH** tanpa user eksplisit minta.
