# NEXT_STEPS — Plan Fase Berikutnya

> Plan detail per fase remaining. Baca `CHECKPOINT.md` dulu untuk konteks status.
>
> **Status saat ini:** FASE 1-5 ✅ done. FASE 4.5 ✅ done (Chat & Notifikasi). FASE 6 🟡 partial.
>
> **Yang belum:** Google OAuth setup, app icon final, EAS build APK.

---

## URUTAN REKOMENDASI

| Skenario | Urutan |
|----------|--------|
| Submission final | **FASE 6** (Google OAuth external setup + EAS build + app icon) |

---

## FASE 6 — Polish Final & Submission

> **Tujuan:** Google OAuth fully working, build APK standalone, siap submit ke dosen.
>
> **Estimasi:** 2-3 jam (banyak setup external).

### 6.1 — Google OAuth Setup (external)
- [ ] Google Cloud Console: buat project, enable OAuth, generate client ID (Web application type)
- [ ] Supabase Dashboard → Auth → Providers → Google: isi Client ID + Client Secret
- [ ] Supabase Dashboard → Auth → URL Configuration: tambah redirect URL `cariin://auth-callback`
- [ ] Test login via Google di Expo Go

### 6.2 — Supabase trigger apply
- [ ] Run `supabase-schema.sql` section baru (trigger `trg_notify_new_message`) di SQL Editor
- [ ] Verify notifikasi auto-insert saat pesan baru (test E2E chat)

### 6.3 — EAS Build
- [ ] `eas login` (kalau belum)
- [ ] `eas build --platform android --profile preview` → generate APK
- [ ] Test APK di device Android

### 6.4 — Final Polish
- [ ] App icon final (assets/icon.png, adaptive-icon.png)
- [ ] Verifikasi `expo-doctor` pass
- [ ] `npx tsc --noEmit` + `npm run lint` clean
- [ ] Update README dengan screenshot terbaru

### 6.5 — Submission
- [ ] Video demo 3-5 menit (semua fitur: auth, feed, create, detail, chat, admin moderation)
- [ ] Commit final + push ke GitHub
- [ ] APK ready untuk dosen

### 6 Definition of Done
- [ ] Google OAuth login berfungsi
- [ ] Notifikasi auto-generated (approved/rejected/new_message)
- [ ] APK standalone bisa di-install
- [ ] All screens dari UI_AUDIT.md implemented (0 stub/placeholder tersisa)
- [ ] Video demo complete
- [ ] GitHub repo public dengan README comprehensive

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
Baca CHECKPOINT.md dan NEXT_STEPS.md, lanjut FASE 6
```

AI baru:
1. Auto-load CLAUDE.md (pattern wajib & gotcha)
2. Read CHECKPOINT.md (status)
3. Read NEXT_STEPS.md (plan)
4. Cek `git log --oneline -10` verify state
5. Kasih rekap plan ke user, tanya scope adjustment

---

## CATATAN PENTING UNTUK AI BARU

⚠️ **CRITICAL** ⚠️ Wajib baca `CLAUDE.md` section 4:
- Pressable pattern children-as-function
- Image dimension explicit
- Modal back via `getParent()?.goBack()`
- Header title overlay `pointerEvents="none"`
- PostgrestError wrap jadi Error

⚠️ **Realtime cleanup:** `chatStore.subscribe/unsubscribe` — channel harus di-unsubscribe di cleanup effect `ChatRoomScreen`.

⚠️ **NotifContext polling 15 detik** — badge bell di-refresh otomatis.

⚠️ **JANGAN UBAH** `CONTEXT.md` & `UI_AUDIT.md`.

⚠️ **JANGAN PUSH** tanpa user eksplisit minta.
