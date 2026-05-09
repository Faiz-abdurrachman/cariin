# NEXT_STEPS — Pasca FASE 4

> Plan langkah berikutnya. Baca `CHECKPOINT.md` dulu untuk konteks.
> FASE 1, 2, 3, 4 ✅ selesai (auth + core mahasiswa lengkap).

---

## OPSI BERIKUTNYA

User pilih salah satu (atau urut sesuai prioritas dosen):

### A. FASE 4.5 — Chat & Notifikasi (mahasiswa flow lengkap)
**Tujuan:** mahasiswa bisa chat ke pelapor/penemu via tombol "Chat" di Detail screen + dapat notifikasi (laporan approved, pesan baru).

**Tasks:**
1. Storage `chat-media` policy (kalau dukung lampiran)
2. `chat.service.ts` — listConversations, getMessages, sendMessage, subscribeToRoom
3. `notification.service.ts` — list, markAsRead
4. `chatStore.ts` — state messages + realtime channel
5. `ChatBubble.tsx`
6. `InboxScreen.tsx` — list percakapan terurut by `last_at`
7. `ChatRoomScreen.tsx` — realtime chat via `supabase.channel().on('postgres_changes')`
8. `NotificationsScreen.tsx` — list notif + tap → ke Detail/Chat
9. Update Detail screen tombol chat: handle tap → upsert conversation, navigate ke ChatRoom
10. Verifikasi E2E + commit

**Estimasi:** 3-4 jam.

### B. FASE 5 — Admin Screens (tugas dosen wajib)
**Tujuan:** admin bisa moderate laporan (approve/reject), bikin laporan walk-in, lihat dashboard.

**Tasks:**
1. **Restore `profiles_admin_all`** via security-definer RPC function (`set_user_role`, `update_profile`, dst) — bypass rekursi RLS.
2. Update `report.service.ts` add `listAllReports`, `approveReport`, `rejectReport`, `addAdminNote`.
3. `AdminDashboardScreen` — stats (total pending, approved hari ini, dst) + quick actions
4. `AdminReportsScreen` — list semua laporan (filter by status) untuk overview
5. `AdminReviewScreen` — detail per laporan + tombol Approve/Reject + form admin note
6. `AdminCreateLostScreen` & `AdminCreateFoundScreen` — laporan walk-in (created_by_admin=true, isi reporter_name/nim/faculty manual)
7. Notifikasi: trigger DB function untuk insert notification ke `notifications` saat report di-approve/reject
8. Verifikasi flow admin (login admin → dashboard → review pending → approve → notif sampe ke user mahasiswa) + commit

**Estimasi:** 5-6 jam (RLS RPC ribet).

### C. FASE 6 — Polish (kalau A & B udah)
- SettingsScreen (edit profile, change password, toggle push notif)
- HelpScreen (FAQ static)
- UserProfileScreen (profil publik dari Detail/Chat)
- Avatar upload di Profile (UploadAvatar service udah ada)
- Animasi transition, splash final, app icon
- ESLint flat config migration
- expo-doctor pass + EAS build standalone untuk submission

---

## REKOMENDASI

Kalau dosen-deadline mendekat: **FASE 5 dulu (admin wajib)**, baru chat.
Kalau target demo kontekstual mahasiswa: **FASE 4.5 dulu (chat)**, admin nanti.

Tanya user di awal sesi berikutnya.

---

## DEFINISI "FASE BERIKUTNYA SELESAI"

Pakai format yang sama:
- [ ] Service layer lengkap & typed
- [ ] Komponen reusable (kalau perlu)
- [ ] Screens render data dari DB
- [ ] CRUD/state mutations jalan E2E di Expo Go
- [ ] tsc clean
- [ ] Manual test di iPhone tanpa crash
- [ ] Commit FASE
- [ ] Update CHECKPOINT.md + NEXT_STEPS.md
