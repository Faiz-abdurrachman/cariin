# NEXT_STEPS — Plan Fase Berikutnya

> Plan detail per fase remaining. Baca `CHECKPOINT.md` dulu untuk konteks status.
>
> **Status saat ini:** FASE 1-4 ✅ done. Mahasiswa bisa register, login, browse feed, baca detail, lapor barang dgn foto, kelola laporan sendiri (Edit/Hapus/Tandai Selesai), lihat profile.
>
> **Yang belum:** chat, admin moderation, polish.

---

## URUTAN REKOMENDASI

Tergantung prioritas user/dosen:

| Skenario | Urutan |
|----------|--------|
| Demo MVP cepat ke dosen | **FASE 5 → 4.5 → 6** (admin wajib, chat opsional, polish terakhir) |
| Mahasiswa flow lengkap dulu | **FASE 4.5 → 5 → 6** (chat dulu biar laporan→komunikasi tuntas, baru admin) |
| Submission final | **FASE 5 → 6 → 4.5** (admin wajib, polish untuk submission, chat kalau sempat) |

**TANYA USER di awal sesi** sebelum eksekusi pakai `AskUserQuestion`.

---

## FASE 4.5 — Chat & Notifikasi

> **Tujuan:** mahasiswa bisa chat ke pelapor/penemu via tombol "Chat" di Detail screen + dapat notifikasi (laporan approved, pesan baru). Pakai Supabase Realtime channel.
>
> **Estimasi:** 3-4 jam fokus.

### 4.5.1 — Pre-flight Supabase
- [ ] Setup Storage `chat-media` policies (kalau dukung lampiran)
  - Authenticated participant only — pakai check via subquery ke `conversations`
  - Atau skip kalau MVP cuma text
- [ ] Verify `messages` & `conversations` Realtime publication aktif (di schema sudah `alter publication supabase_realtime add table public.messages`)
- [ ] Test Realtime channel di Dashboard → Realtime → check subscribe events

### 4.5.2 — Service layer
**File:** `src/services/chat.service.ts`
- [ ] `listConversations()` — semua conversation user (`user_a_id = auth.uid()` OR `user_b_id`)
- [ ] `getOrCreateConversation(reportId, otherUserId)` — upsert conversation
- [ ] `listMessages(conversationId)` — order by created_at asc
- [ ] `sendMessage(conversationId, content)` — insert ke messages, trigger DB auto-update last_message+last_at
- [ ] `subscribeToConversation(conversationId, callback)` — realtime channel via `supabase.channel().on('postgres_changes', ...)`
- [ ] `markMessagesAsRead(conversationId)` — bulk update `is_read=true` untuk pesan dari other user
- [ ] Type definitions: `Conversation`, `Message`

**File:** `src/services/notification.service.ts`
- [ ] `listNotifications()` — order by created_at desc
- [ ] `markAsRead(id)`, `markAllAsRead()`
- [ ] `unreadCount()` — untuk badge bell di header
- [ ] Type: `Notification`

### 4.5.3 — Store
**File:** `src/store/chatStore.ts`
- [ ] State: `messages` (per conversation), `activeChannel`, `loading`
- [ ] Actions: `loadMessages`, `sendMessage`, `subscribe`, `unsubscribe`, `appendMessage` (dipanggil dari realtime callback)

### 4.5.4 — Components
- [ ] `src/components/ChatBubble.tsx` — bubble kiri (other user) / kanan (me) dgn timestamp + read indicator

### 4.5.5 — Screens

**`src/screens/chat/InboxScreen.tsx`**
- [ ] List Conversation dgn avatar lawan bicara, nama, last_message preview, last_at relative time
- [ ] Tap → ChatRoom
- [ ] Empty state kalau belum ada percakapan
- [ ] Pull-to-refresh
- Referensi: `cariin-web/messages.html`

**`src/screens/chat/ChatRoomScreen.tsx`**
- [ ] Header: back + nama lawan + tap → UserProfile
- [ ] FlatList (inverted) of ChatBubble — scroll otomatis ke bawah saat ada pesan baru
- [ ] Input bar bottom + tombol kirim
- [ ] Subscribe Realtime saat focus, unsubscribe saat unfocus (`useFocusEffect`)
- [ ] markMessagesAsRead saat focus
- [ ] KeyboardAvoidingView untuk handle keyboard
- Referensi: `cariin-web/chat.html`

**`src/screens/chat/NotificationsScreen.tsx`**
- [ ] List Notification dgn icon per type (report_approved/rejected/new_message), title, body, time
- [ ] Tap notif → ke screen relevant (DetailReport atau ChatRoom)
- [ ] Mark as read saat tap
- [ ] "Mark all as read" button di header
- Referensi: `cariin-web/notifications.html`

### 4.5.6 — Update existing
- [ ] `DetailReportScreen.tsx` tombol "Chat Penemu/Pelapor": handle tap → `getOrCreateConversation(reportId, report.user_id)` → navigate ke ChatRoom
- [ ] `HomeScreen.tsx` bell icon → unread badge dari `notification.service.unreadCount()`

### 4.5.7 — Verifikasi & commit
- [ ] tsc clean, expo-doctor pass
- [ ] E2E test:
  - User A (mahasiswa) buka Detail laporan User B → Chat → kirim pesan
  - User B login di Expo Go device kedua (atau switch akun) → Inbox harus ada conversation baru → buka → pesan masuk realtime
  - Mark read jalan — badge bell update
- [ ] Commit dgn format `FASE 4.5: Chat realtime + notifikasi`
- [ ] Update CHECKPOINT.md + NEXT_STEPS.md

### 4.5 Definition of Done
- [ ] Tombol Chat di Detail jalan, bukan Alert lagi
- [ ] Inbox render conversations user
- [ ] ChatRoom realtime: pesan dari user lain muncul tanpa refresh manual
- [ ] Notifikasi tab render data
- [ ] Bell icon di Home punya badge unread count
- [ ] Tab Pesan di bottom nav fungsional

---

## FASE 5 — Admin Screens

> **Tujuan:** admin bisa moderate laporan (approve/reject), bikin laporan walk-in, lihat dashboard. Restore `profiles_admin_all` via security-definer RPC.
>
> **Estimasi:** 5-6 jam fokus (RLS RPC ribet).

### 5.1 — Pre-flight Supabase
- [ ] Bikin RPC function `update_report_status(report_id uuid, new_status text, admin_note text)` dengan `security definer + search_path = public`. Check caller is admin via `is_admin()`. Update report + insert notification ke owner.
- [ ] Bikin RPC function `create_admin_report(...)` untuk walk-in laporan dgn `created_by_admin=true`. Set kolom reporter_name/nim/faculty manual.
- [ ] Restore `profiles_admin_all` policy DENGAN security-definer escape hatch — atau pakai service-role server-side. Pilih salah satu strategi.
- [ ] Trigger DB: saat `reports.status` change ke approved/rejected, auto-insert ke `notifications` (type='report_approved' atau 'report_rejected').

### 5.2 — Service layer
**Update `src/services/report.service.ts`:**
- [ ] `listAllReports(filter?)` — admin only, no public/owner gating (RLS sudah handle via is_admin)
- [ ] `approveReport(id, note?)` — call RPC update_report_status
- [ ] `rejectReport(id, note)` — call RPC, note wajib
- [ ] `createAdminReport(input)` — call RPC create_admin_report

### 5.3 — Screens
Referensi visual: `cariin-web/admin-*.html`.

**`src/screens/admin/AdminDashboardScreen.tsx`**
- [ ] Header dgn nama admin + logout
- [ ] Stat cards: pending count, today approved, total reports, active users
- [ ] Quick action buttons → Review pending, Buat laporan, Lihat semua
- [ ] List laporan terbaru pending (top 5)

**`src/screens/admin/AdminReportsScreen.tsx`**
- [ ] List semua laporan dengan filter chip status (Pending | Approved | Rejected | Resolved | Semua)
- [ ] Search bar
- [ ] Tap → AdminReview

**`src/screens/admin/AdminReviewScreen.tsx`**
- [ ] Foto besar + info lengkap (sama struktur DetailReportScreen)
- [ ] Reporter info detail (nama, NIM, fakultas, kontak)
- [ ] Action bar bottom: tombol Approve (hijau) | Reject (merah)
- [ ] Modal input admin_note saat reject (wajib alasan)
- [ ] Submit action → RPC → balik ke list

**`src/screens/admin/AdminCreateLostScreen.tsx` & `AdminCreateFoundScreen.tsx`**
- [ ] Form sama dgn CreateReport mahasiswa, plus field reporter_name/reporter_nim/reporter_faculty (input manual, walk-in)
- [ ] Submit → createAdminReport (set created_by_admin=true)

### 5.4 — Update navigation
**File:** `src/navigation/AdminNavigator.tsx`
- [ ] Drawer routes lengkap: Dashboard | Semua Laporan | Buat Laporan (sub: Lost | Found)
- [ ] Drawer header dgn nama admin + logout

### 5.5 — Verifikasi & commit
- [ ] Login `admin@cariin.app` → masuk AdminNavigator (Drawer indigo)
- [ ] Dashboard render stats akurat
- [ ] Approve laporan pending mahasiswa → notif sampe ke user mahasiswa (cek tab Notifikasi user)
- [ ] Reject dgn note → user dapet notifikasi rejected dengan alasan
- [ ] Bikin laporan walk-in → muncul di feed publik dgn badge "via Admin"
- [ ] tsc clean, expo-doctor pass
- [ ] Commit dgn format `FASE 5: Admin moderation + dashboard + walk-in reports`
- [ ] Update CHECKPOINT.md + NEXT_STEPS.md

### 5 Definition of Done
- [ ] Admin login → AdminNavigator Drawer
- [ ] Dashboard render stat cards
- [ ] Approve/Reject pending laporan jalan, RLS gak block
- [ ] Notifikasi auto-insert via trigger DB ke owner
- [ ] Walk-in laporan via admin (created_by_admin=true)
- [ ] No regression di mahasiswa flow

---

## FASE 6 — Polish & Submission

> **Tujuan:** finishing touches, submission-ready ke dosen. UX detail, animasi, EAS build standalone.
>
> **Estimasi:** 4-5 jam (banyak detail kecil).

### 6.1 — Settings/Help/UserProfile screens
**`src/screens/profile/SettingsScreen.tsx`**
- [ ] Edit nama, NIM, fakultas, departemen
- [ ] Ganti password (verify current → set new via `supabase.auth.updateUser`)
- [ ] Toggle push notif (kalau implement; otherwise placeholder)
- Referensi: `cariin-web/settings.html`

**`src/screens/profile/HelpScreen.tsx`**
- [ ] FAQ static (collapsible accordion)
- [ ] Kontak admin (email)
- [ ] Versi app
- Referensi: `cariin-web/help.html`

**`src/screens/profile/UserProfileScreen.tsx`**
- [ ] Profil publik user lain (dipake dari Detail/ChatRoom tap reporter)
- [ ] Avatar, nama, fakultas, list laporan publik (approved) milik dia
- Referensi: `cariin-web/user-profile.html`

### 6.2 — Avatar upload integration
- [ ] ProfileScreen: tap avatar → ActionSheet (Kamera | Galeri) → uploadAvatar (service udah ada)
- [ ] Update `profiles.avatar_url` setelah upload, refresh AuthContext

### 6.3 — Visual polish
- [ ] Animasi transition antar screen (React Navigation default cukup)
- [ ] Splash final dengan logo Cari.In + tagline
- [ ] App icon iOS + Android (assets/icon.png)
- [ ] Pulse animation di Notification badge
- [ ] Smooth scroll restoration di FlatList

### 6.4 — Auth Polish
- [ ] Setup Google OAuth (Cloud Console + Supabase provider + redirect URLs `cariin://auth-callback`)
- [ ] Pasang redirect URLs di Authentication → URL Configuration
- [ ] Reset password flow lengkap (deep link `cariin://reset-password`)

### 6.5 — Tooling
- [x] ~~Migrate ESLint v9 ke flat config (`eslint.config.js`)~~ ✅ DONE (quick-fix)
- [ ] expo-doctor 100% pass tanpa warning
- [ ] Optional: prettier-plugin-tailwindcss untuk auto-sort className

### 6.6 — EAS Build untuk submission
- [ ] `npx expo install eas-cli` + `eas login`
- [ ] `eas.json` config untuk preview & production build
- [ ] `eas build -p ios --profile preview` (TestFlight) atau android APK
- [ ] Test build standalone di device tanpa Expo Go

### 6.7 — Verifikasi & commit
- [ ] All screens render tanpa crash
- [ ] tsc clean, eslint clean (flat config), expo-doctor pass
- [ ] EAS build sukses
- [ ] Commit dgn format `FASE 6: Polish + Settings/Help + EAS build`
- [ ] Update CHECKPOINT.md + NEXT_STEPS.md (nyatakan project COMPLETE)

### 6 Definition of Done
- [ ] All 26 screens dari UI_AUDIT.md implemented
- [ ] No `export {};` placeholder tersisa
- [ ] Build standalone bisa di-install di device tester
- [ ] Demo end-to-end ke dosen tanpa crash
- [ ] Documentation README.md ada (untuk submission)

---

## FORMAT UPDATE TIAP FASE

Saat fase selesai, AI WAJIB:
1. Update `CHECKPOINT.md` table progres + status remaining files
2. Update `NEXT_STEPS.md` — coret/hapus checklist fase yang baru selesai, geser fokus ke fase berikutnya
3. Update `CLAUDE.md` (kalau ada pattern baru/gotcha penting yang ditemukan)
4. Commit dgn format konsisten: `FASE N: <ringkasan singkat>`
5. Save memory baru kalau ada feedback/preference user yang ditemukan

---

## CARA RESUME SESI BARU

User ketik salah satu:
```
Baca CHECKPOINT.md dan NEXT_STEPS.md, lanjut FASE 4.5
```
```
Baca CHECKPOINT.md dan NEXT_STEPS.md, lanjut FASE 5
```
```
Baca CHECKPOINT.md dan NEXT_STEPS.md, lanjut FASE 6
```

AI baru:
1. Auto-load CLAUDE.md (ada pattern wajib & gotcha)
2. Read CHECKPOINT.md (status)
3. Read NEXT_STEPS.md (plan)
4. Cek `git log --oneline -10` verify state
5. Kasih rekap plan ke user, tanya scope adjustment via `AskUserQuestion`
6. Eksekusi step-by-step dengan verify per step

---

## CATATAN PENTING UNTUK AI BARU

⚠️ **CRITICAL** ⚠️ Project ini punya beberapa gotcha yang sudah didokumentasi di `CLAUDE.md` section 4. **WAJIB BACA SEBELUM CODING:**
- Pressable pattern children-as-function (jangan style function-form)
- Image dimension explicit (jangan `'100%'` di nested context)
- Modal back via `getParent()?.goBack()`
- Header title overlay `pointerEvents="none"`
- PostgrestError wrap jadi Error
- RLS WITH CHECK jangan replikasi USING

⚠️ **JANGAN UBAH** `CONTEXT.md` & `UI_AUDIT.md` — sumber kebenaran dosen.

⚠️ **JANGAN PUSH** ke origin tanpa user eksplisit minta. Commit aja accumulate di local main.

⚠️ **WAJIB UPDATE CHECKPOINT.md + NEXT_STEPS.md** sebelum commit fase baru.

⚠️ **Komunikasi:** Indonesia casual lo/gw, opsi A/B/C dengan trade-off via `AskUserQuestion`, screenshot per step setup eksternal.
