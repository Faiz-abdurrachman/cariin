# NEXT_STEPS — Plan Fase 6

> Baca `CHECKPOINT.md` dulu. Update: 2026-07-21

---

## START HERE — AI BARU

```
1. Baca CLAUDE.md (pattern wajib)
2. Baca CHECKPOINT.md (status)
3. Baca file ini (plan)
4. Audit: git status, tsc, lint
5. JANGAN mulai coding sebelum paham konteks
```

---

## URUTAN EKSEKUSI

### 1. Test Bug Fix Terbaru (prioritas)

**ChatRoom back button** — commit `afb5330`, BELUM dites:
- Admin → buka laporan → Chat Pemilik → masuk ChatRoom
- Pencet back ← → harus ke Inbox
- Tutup tab Chat → buka lagi → harus Inbox (bukan nyangkut ChatRoom)
- Kalau GAGAL: analisa root cause, jangan coba-coba replace/reset/redirect lagi

**Regresi lain:**
- Admin CreateTab double page (harus single screen)
- Success → Lihat Laporanku (harus gak cropping)
- Walk-in tidak ada tombol Chat Pemilik
- UserProfile admin gak crash
- Jam Kejadian validasi HH:MM

### 2. Testing Manual (TESTING-MANUAL.md)

Dengan 2 akun di HP:
- Auth flow (login, register, forgot password)
- Create report (lost + found + foto)
- Admin moderate (approve/reject)
- Chat realtime 2 arah
- Notifikasi in-app
- Profile + avatar upload

### 3. Reset Password E2E

- Lupa sandi → email terkirim
- Tap link → deep-link cariin://reset-password
- Password baru → login ulang

### 4. Rebuild APK

Setelah semua source stabil:
```
eas build --platform android --profile production
```
Verifikasi: archive valid, package id.cariin.app, scheme cariin, SHA-256, RECORD_AUDIO tidak ada.

### 5. Dokumentasi & Submission

- Screenshot semua flow
- Video demo 3-5 menit
- Update README
- Push final

---

## CATATAN

- JANGAN push tanpa izin user
- JANGAN ubah laporan Mopro (sudah dikumpulkan)
- JANGAN reset/clean worktree
