# Prompt Lengkap untuk AI Berikutnya

> Update: 21 Juli 2026. Tempel seluruh blok ke AI baru.

---

```text
Lu melanjutkan project Cari.In Mobile di:

/home/faiz/Semester 4/Mobile Programming/cariin/cariin-mobile

JANGAN mulai coding sebelum baca file berikut BERURUTAN:
1. CLAUDE.md — pattern wajib + gotcha
2. CHECKPOINT.md — status terkini
3. NEXT_STEPS.md — ini (plan)
4. TESTING-MANUAL.md — checklist test
5. AI_HANDOFF.md — konteks lengkap
6. AUDIT_REPORT.md — hasil audit 13 kategori
7. AUDIT_FIX_PLAN.md — plan perbaikan

---

## AUDIT WAJIB SEBELUM KERJA

```bash
git status --short
git log --oneline -10
npx tsc --noEmit
npm run lint
```

Hasil terakhir (21 Juli): tsc 0 error, lint 0 error, 0 unpushed commits.

---

## KONDISI PENTING

**Worktree dirty** — banyak perubahan user/agent dari banyak sesi. PERTAHANKAN semua. JANGAN reset/checkout/clean.

**JANGAN** commit/push/PR tanpa izin eksplisit. JANGAN tampilkan secret.

**Backend:** Supabase `kytsksnyoyffwbksotps` ACTIVE_HEALTHY. Schema, RLS, RPC, Storage, Realtime, event_time migration SUDAH diterapkan. JANGAN apply ulang schema tanpa bukti drift.

**Akun test:**
- Admin: admin@cariin.app / admin123
- Mahasiswa: faiz@student.unu-jogja.ac.id / faizfaiz

---

## BUG TERBUKA

### ⚠️ ChatRoom Back Button — BELUM TERVERIFIKASI

Commit `afb5330` — fix ke-5 (4 sebelumnya gagal).
Pendekatan: setTimeout(200ms) untuk 2-step navigate (Inbox dulu, ChatRoom 200ms kemudian).

4 pendekatan yang SUDAH GAGAL:
1. nav.goBack() → no-op (ChatRoom first screen, no history)
2. nav.replace('Inbox') → bocor ke parent Tab, malah switch ke Dashboard
3. StackActions.replace('Inbox') → sama, bocor
4. InboxScreen redirect pattern → params gak nyampe

**Kalau masih gagal**, jangan ulangi pendekatan di atas. Coba:
- `InteractionManager.runAfterInteractions(() => nav.navigate('Inbox'))`
- Atau pindahin ChatRoom dari ChatStack jadi modal presentasi
- Atau ubah arsitektur: admin chat lewat screen dedicated, bukan ChatStack

---

## TUGAS UTAMA

1. **Audit** — cek kondisi, tsc, lint, DB
2. **Test ChatRoom back button** — minta user test di HP
3. **Test regresi** — CreateTab, Success, Jam Kejadian
4. **Testing manual** — TESTING-MANUAL.md, 2 akun
5. **Reset password E2E**
6. **Rebuild APK** dari source terbaru
7. **Dokumentasi** — screenshot, video, update file

---

## WARNING

- `fix_glass*.js`, `promt.md`, `references/` — jangan di-commit
- `AdminCreateLostScreen.tsx` — dead code
- `supabase-schema.sql` section 9 — migration SUDAH di-apply ke remote
- JANGAN ubah laporan Mopro (sudah dikumpulkan user)
- JANGAN rewrite project dari nol
```

---

## Prompt Singkat Alternatif

```text
Baca CLAUDE.md → CHECKPOINT.md → NEXT_STEPS.md → TESTING-MANUAL.md.
Audit kondisi. JANGAN reset/clean/push.
Fokus: test ChatRoom back button (commit afb5330, fix ke-5, untested).
Kalau gagal, coba InteractionManager, jangan ulangi replace/reset/redirect.
Lanjut testing manual FASE 6.
```
