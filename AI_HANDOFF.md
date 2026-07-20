# AI HANDOFF — Cari.In Mobile

> Untuk AI/agent baru. Baca sampai selesai. Update: 2026-07-21

---

## WORKSPACE

`/home/faiz/Semester 4/Mobile Programming/cariin/cariin-mobile`

Stack: Expo SDK 54, RN 0.81.5, TypeScript 5.9 strict, Supabase, React Navigation v7

---

## APA YANG TERJADI DI SESI INI

Sesi (2026-07-21) fokus pada bug fixing + hardening:

### Audit & Hardening
- Tambah `ErrorBoundary.tsx` global di App.tsx
- Sinkronkan warna `tailwind.config.js` dengan `constants.ts` (14 token)
- Optimasi FlatList di 3 screen (windowSize, maxToRenderPerBatch, removeClippedSubviews)
- Hapus 4 `eslint-disable` di AdminDashboardScreen → typed `parentNav`
- Fix `AdminTabParamList.CreateTab` type dari `undefined` ke `NavigatorScreenParams`

### Bug Fixes
- SuccessScreen "Lihat Laporanku" cropping → dismiss modal dulu
- Walk-in report "Chat Pemilik" → hide tombol (`!report.created_by_admin`)
- Admin CreateTab double page → gabung 2 screen jadi 1 (`AdminCreate` + `initialType` param)
- UserProfile crash di admin ChatStack → tambah screen
- Inbox gak jelas → tampilin "Re: judul report"
- event_time invalid date → `parseEventTime()` dengan regex HH:MM

### Fitur Baru
- Jam Kejadian (event_time) — DB column, RPC update, UI input di mahasiswa + admin, display di detail

### Database
- `ALTER TABLE reports ADD event_time` via Supabase Management API
- RPC `create_admin_report` + `update_admin_report` di-update (tambah p_event_time)
- GRANT execute re-applied

---

## BUG YANG MASIH TERBUKA

### ChatRoom Back Button (PALING KRITIS)

**Commit:** `afb5330` — fix ke-5, BELUM DITEST

**Isu:** Admin buka ChatRoom dari AdminReview → back ← harusnya ke Inbox. Realita: ke Dashboard atau stuck.

**Yang sudah dicoba dan GAGAL:**
1. `nav.goBack()` — no-op
2. `nav.replace('Inbox')` — bocor ke parent Tab
3. `StackActions.replace('Inbox')` — bocor juga
4. InboxScreen redirect dengan params — params gak nyampe

**Fix saat ini:** `setTimeout(200)` — AdminReviewScreen navigate Inbox dulu, 200ms kemudian navigate ChatRoom. Stack target: [Inbox, ChatRoom], back natural ke Inbox.

**Kalau masih gagal**, alternatif yang BELUM dicoba:
- `InteractionManager.runAfterInteractions()`
- Pindahin ChatRoom dari stack ke modal
- Arsitektur ulang: screen terpisah untuk admin chat

---

## ARSITEKTUR NAVIGASI (PENTING)

```
AdminDrawer
  └─ AdminTabs (Tab)
       ├─ DashboardTab → Stack [Dashboard, Review, EditReport]
       ├─ ChatTab → Stack [Inbox, ChatRoom, UserProfile]
       ├─ CreateTab → Stack [AdminCreate]
       └─ ...
```

ChatRoomScreen dipakai BERSAMA oleh mahasiswa (`ChatStackParamList`) dan admin (`AdminChatStackParamList`). Tipe `nav` selalu `ChatStackParamList`.

---

## ATURAN KERJA

- Bahasa Indonesia casual (lo/gw)
- JANGAN commit/push/reset/clean/format massal tanpa izin
- JANGAN tampilkan .env, key, token, password
- JANGAN ubah laporan Mopro
- Setiap edit code → `npx tsc --noEmit`
- Pattern Pressable: children-as-function (CLAUDE.md 4.1)

---

## FILE KUNCI

| File | Fungsi |
|------|--------|
| `src/screens/admin/AdminReviewScreen.tsx:235` | chatOwner() — setTimeout 200ms |
| `src/screens/chat/ChatRoomScreen.tsx:162` | Back button goBack() |
| `src/screens/chat/InboxScreen.tsx` | List conversation + akses ChatRoom |
| `src/navigation/AdminNavigator.tsx` | Struktur admin nav |
| `src/navigation/types.ts` | Semua tipe param |
| `supabase-schema.sql:939-1097` | Migration event_time |
