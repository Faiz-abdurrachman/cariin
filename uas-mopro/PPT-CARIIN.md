# 🎯 Slide 1 — Judul
## Cari.In — Campus Lost & Found
### "Cariin barangmu di kampus"

| Label | Detail |
|-------|--------|
| **Mata Kuliah** | Mobile Programming |
| **Dosen** | Yana Hendriana |
| **Semester** | 4 (Genap 2025/2026) |
| **Nama** | Faiz Abdurrachman |
| **NIM** | 2023012321 |

> **[SPEAKER]** Cari.In adalah aplikasi lost & found untuk mahasiswa UNU Yogyakarta. Aplikasi ini membantu mahasiswa melaporkan dan mencari barang hilang/temuan di lingkungan kampus.

---

# 🔥 Slide 2 — Problem
## Masalah yang Dihadapi Mahasiswa

| # | Masalah | Dampak |
|---|---------|--------|
| 1 | Informasi tenggelam di **Grup WA** | Laporan tertumpuk obrolan lain, tidak terstruktur |
| 2 | **Pencarian sulit** | Tidak bisa lacak laporan lama, tidak ada history |
| 3 | **Rawan klaim palsu** | Tidak ada verifikasi identitas, siapa pun bisa klaim |
| 4 | **Privasi terancam** | Nomor HP pribadi terekspos di grup publik |
| 5 | **Tidak standar** | Format laporan tidak konsisten, info sering kurang |
| 6 | **Psikologis** | Mahasiswa panik saat kehilangan — butuh sistem yang menenangkan |

> **[SPEAKER]** Survei terhadap 39 mahasiswa UNU menunjukkan 51% pernah kehilangan barang di kampus. 67% mencari via satpam, 33% via grup WhatsApp. Semua setuju butuh platform terpusat.

---

# 📊 Slide 3 — Validasi Data
## Survey 39 Mahasiswa UNU

```
Pernah kehilangan barang?    Ya: 51%     Tidak: 49%

Barang paling sering hilang:
  🔑 Kunci kendaraan         40%
  🔌 Charger                 35%
  👛 Dompet                  30%
  🎧 Earphone/Headset        25%
  📚 Buku/Modul              20%

Cara mencari:
  🛡️ Satpam kampus           67%
  📱 Grup WhatsApp           33%
  👥 Bertanya teman          15%

Nyaman pakai email kampus?   Ya: 82%     Tidak: 18%
```

> **[SPEAKER]** Data dari 39 responden validasi bahwa masalah ini nyata. Mayoritas mencari via satpam — artinya sistem kami bisa terintegrasi dengan pos satpam.

---

# 💡 Slide 4 — Unique Value Proposition
## Apa yang Bikin Cari.In Berbeda?

| # | UVP | Penjelasan |
|---|-----|------------|
| 1 | 🔒 **Domain Email Kampus** | Register hanya `@student.unu-jogja.ac.id` — verifikasi identitas otomatis |
| 2 | ✅ **Admin Moderation** | Laporan masuk status "Pending" → admin review → approve/reject |
| 3 | 💬 **In-App Chat** | Komunikasi pelapor-penemu tanpa ekspos nomor HP |
| 4 | 📍 **Titik Penitipan** | Field khusus form temuan — barang dititipkan di mana |
| 5 | 🔴🟢 **Diferensiasi UI** | Lost = Orange, Found = Emerald — visual intuitif |
| 6 | 📝 **Admin Walk-in** | Satpam bisa input laporan atas nama mahasiswa |

> **[SPEAKER]** Enam UVP ini membedakan Cari.In dari solusi yang ada. Domain email memastikan hanya mahasiswa terverifikasi, admin moderation mencegah spam, dan chat in-app melindungi privasi.

---

# 🎨 Slide 5 — Design System
## Calm Campus — Psikologi Warna

| Warna | Hex | Fungsi | Psikologi |
|-------|-----|--------|-----------|
| **Primary Blue** | `#2563EB` | Brand, tombol, navbar | Trust, calm, turunkan detak jantung |
| **Teal Sage** | `#0D9488` | Admin area | Profesional, authority |
| **Lost Orange** | `#F97316` | Laporan hilang | Urgensi tanpa panic trigger |
| **Found Emerald** | `#059669` | Laporan temuan | Relief, healing, positif |
| **Soft Blue BG** | `#EFF6FF` | Background | Cegah sensory overload |

```
SEBELUM: zinc-950 (almost black) → formal, berat
SESUDAH: blue-600 + teal-600 → menenangkan, kampus
```

> **[SPEAKER]** Riset neuropsikologi: warna biru terbukti menurunkan kortisol dan detak jantung. Warna merah pure memicu kecemasan — kami ganti ke orange soft. Admin pakai teal sage untuk kesan profesional.

---

# 🏗️ Slide 6 — Tech Stack
## Teknologi yang Digunakan

| Layer | Teknologi |
|-------|-----------|
| **Framework** | React Native 0.81 + **Expo SDK 54** (Managed) |
| **Language** | TypeScript 5.9 (strict mode) |
| **UI/Styling** | NativeWind v4 (Tailwind) + inline styles |
| **Navigation** | React Navigation v7 (Stack + Bottom Tabs) |
| **State** | Context API (Auth, Notif) + **Zustand** v5 (Feed, Chat) |
| **Backend** | **Supabase** (Auth + Postgres + Storage + Realtime) |
| **Realtime** | Supabase Realtime (`postgres_changes`) |
| **Build** | EAS Build (cloud) → APK + Expo Go |
| **Lint** | ESLint v9 (flat config) + Prettier |

```
FRONTEND:    Expo/React Native → Mobile App
AUTH:        Supabase Auth → JWT
DATABASE:    Supabase Postgres → 5 tabel + RLS
STORAGE:     Supabase Storage → 3 bucket
REALTIME:    Supabase Realtime → Chat + Notifikasi
BUILD:       EAS Cloud → APK (Android)
```

---

# 🗄️ Slide 7 — Database Design
## 5 Tabel + RLS + Triggers

```
┌──────────┐     ┌──────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────────┐
│ profiles  │────→│ reports  │────→│ conversations│────→│ messages │     │ notifications│
│ 1-1 auth  │     │ lost/fnd │     │ userA↔userB  │     │ content  │     │ approved/    │
│ .users    │     │ pending  │     │ per report   │     │ is_read  │     │ rejected/    │
│ name,nim  │     │ approved │     │ last_message │     │ realtime │     │ new_message  │
└──────────┘     └──────────┘     └──────────────┘     └──────────┘     └──────────────┘

TRIGGERS:
  ✅ trg_on_auth_user_created  → auto-create profile
  ✅ trg_set_updated_at         → auto-update timestamp  
  ✅ trg_update_conversation    → auto-update last_message
  ✅ trg_notify_new_message     → auto-insert notification

RLS: Semua 5 tabel Row Level Security enabled
RPC: update_report_status, create_admin_report (security definer)
```

> **[SPEAKER]** Lima tabel dengan relasi 1-1 dan 1-N. Setiap tabel dilindungi RLS. Trigger otomatis untuk notifikasi dan update. Admin operasi via RPC security definer untuk bypass RLS secara aman.

---

# 📱 Slide 8 — Arsitektur Navigasi
## Navigation Tree

```
RootNavigator
└── isLoading → LoadingScreen
└── !auth → AuthNavigator (Stack)
│     └── Splash → RoleSelection → Login | Register | Forgot
├── admin → TabNavigator (5 Bottom Tabs)
│     ├── 📊 Dashboard → Review
│     ├── 📋 Semua Laporan
│     ├── ➕ Buat (FAB raised)
│     ├── 💬 Pesan → ChatRoom
│     └── 👤 Profil → Logout
└── mahasiswa → TabNavigator (5 Bottom Tabs)
      ├── 🏠 Home → Detail | ChatRoom | UserProfile
      ├── 💬 Pesan → Inbox | ChatRoom | Notifikasi
      ├── ➕ Buat (FAB raised → Modal)
      ├── 📄 Laporanku → Edit | Detail
      └── 👤 Profil → Settings | Help | UserProfile
```

> **[SPEAKER]** Navigasi dua role terpisah. Admin pakai drawer, mahasiswa pakai bottom tab. FAB center button naik ke atas untuk akses cepat buat laporan.

---

# ⚡ Slide 9 — Fitur Mahasiswa
## 11 Fitur Utama

| # | Fitur | Screen |
|---|-------|--------|
| 1 | **Register** email kampus | Register → Login |
| 2 | **Feed** laporan publik | Home — filter kategori & tipe |
| 3 | **Search** barang | Search bar + debounce |
| 4 | **Detail** laporan | Foto, lokasi, deskripsi, pelapor |
| 5 | **Create Lost** | Form + foto wajib + kategori grid |
| 6 | **Create Found** | Form + foto + titik penitipan |
| 7 | **Chat Realtime** | Inbox → ChatRoom (Supabase Realtime) |
| 8 | **Notifikasi** In-App | Bell badge + list notifikasi |
| 9 | **My Posts** | Kelola laporan sendiri |
| 10 | **Edit/Hapus/Selesai** | Update status laporan |
| 11 | **Profile** | Avatar upload + Settings + Help |

> **[SPEAKER]** Mahasiswa bisa register dengan email kampus, melapor barang, mencari di feed, chat realtime, dan kelola laporan sendiri.

---

# 🛡️ Slide 10 — Fitur Admin
## 6 Fitur Moderasi

| # | Fitur | Screen |
|---|-------|--------|
| 1 | **Dashboard** statistik | 4 stat cards: Pending, Disetujui, Ditolak, Total |
| 2 | **Review** laporan | Detail + Approve (hijau) / Reject (merah) + alasan |
| 3 | **Semua Laporan** | Filter status + search |
| 4 | **Walk-in Report** | Input manual atas nama mahasiswa |
| 5 | **Chat** dengan pelapor | Dari Review → ChatRoom |
| 6 | **Notifikasi Otomatis** | Trigger DB kirim notif ke mahasiswa |

```
FLOW MODERASI:
  Mahasiswa submit → status "Pending"
  → Admin Review → Approve/Reject
  → Trigger auto-notifikasi ke mahasiswa
  → Laporan tayang di Feed publik
```

> **[SPEAKER]** Setiap laporan masuk status pending. Admin review, bisa approve atau reject dengan alasan. Trigger otomatis kirim notifikasi ke mahasiswa.

---

# 💬 Slide 11 — Chat Realtime
## Supabase Realtime + Trigger Notification

```
User A kirim pesan
  → INSERT ke messages
  → trg_update_conversation (update last_message)
  → trg_notify_new_message (INSERT notifikasi ke User B)
  → Supabase Realtime broadcast ke User B
  → ChatBubble muncul tanpa refresh 🔥
```

| Aspek | Implementasi |
|-------|-------------|
| **Channel** | `supabase.channel('messages:conversation_id')` |
| **Event** | `postgres_changes` → INSERT |
| **Subscribe** | `useFocusEffect` (saat ChatRoom fokus) |
| **Unsubscribe** | `useEffect cleanup` (saat leave ChatRoom) |
| **Notifikasi** | Trigger `trg_notify_new_message` |
| **Bell Badge** | `NotifContext` polling 15 detik |

> **[SPEAKER]** Chat realtime pakai Supabase Realtime — channel per conversation. Pesan baru muncul tanpa refresh. Trigger otomatis bikin notifikasi ke receiver. Bell badge auto-update tiap 15 detik.

---

# 🔒 Slide 12 — Keamanan
## Row Level Security + RPC

```sql
-- Mahasiswa hanya lihat laporan APPROVED milik ORANG LAIN
-- Tapi bisa lihat SEMUA laporan MILIK SENDIRI (termasuk pending/rejected)
CREATE POLICY reports_select_public ON public.reports
  FOR SELECT USING (
    status IN ('approved','resolved')   -- publik
    OR user_id = auth.uid()              -- milik sendiri
    OR public.is_admin()                 -- admin
  );

-- Admin bypass RLS via RPC security definer
CREATE FUNCTION update_report_status(...)
  SECURITY DEFINER SET search_path = public;
```

| Layer | Mekanisme |
|-------|-----------|
| **Auth** | JWT via Supabase Auth |
| **Database** | RLS di semua 5 tabel |
| **Admin Ops** | RPC security definer (bypass RLS aman) |
| **Storage** | Policy per bucket per user folder |
| **Domain** | Validasi `@student.unu-jogja.ac.id` di client |

> **[SPEAKER]** Keamanan 4 layer. RLS memastikan user hanya akses data miliknya. Admin operasi via RPC security definer yang dicek `is_admin()` dulu.

---

# 📊 Slide 13 — Statistik Aplikasi
## Data Real dari Database

```
┌──────────────┬──────┐
│ Users        │    4 │
│ Reports      │   10 │
│ Conversations│    6 │
│ Messages     │   20 │
│ Notifications│   25 │
├──────────────┼──────┤
│ Pending      │    0 │
│ Approved     │    6 │
│ Resolved     │    4 │
│ Rejected     │    0 │
└──────────────┴──────┘

Code Quality:
  ✅ npx tsc --noEmit    → 0 errors
  ✅ npm run lint         → 0 warnings
  ✅ npx expo-doctor     → 18/18 passed
  ✅ Metro bundle         → 1.294 modules

APK Production: 76 MB
iOS: Expo Go (no Mac required)
```

> **[SPEAKER]** Aplikasi sudah diuji dengan data real. Semua code quality check passed. APK production build siap install.

---

# 🎬 Slide 14 — Demo Flow
## Skenario Demo 5 Menit

| Waktu | Aktor | Aksi |
|-------|-------|------|
| 0:00 | — | Splash → Role Selection |
| 0:15 | Mahasiswa | Login → Home Feed |
| 0:45 | Mahasiswa | Filter + Detail laporan |
| 1:15 | Mahasiswa | Buat Laporan (foto + kategori + submit) |
| 2:00 | Admin | Login → Dashboard |
| 2:30 | Admin | Review + Approve laporan |
| 3:00 | Mahasiswa | Notifikasi + Inbox + Chat Realtime |
| 4:00 | Mahasiswa | MyPosts → Tandai Selesai |
| 4:30 | — | Profile + Logout |

> **[SPEAKER]** Demo 5 menit mencakup semua fitur utama: auth, create, moderate, chat realtime, notifikasi, dan manage laporan.

---

# 🚀 Slide 15 — Deployment
## Cara Install & Build

### Install via Expo Go (iOS & Android)
```
1. Install Expo Go dari App Store / Play Store
2. Scan QR code dari npx expo start
3. App langsung jalan — no build required
```

### Install APK (Android)
```
1. Download CariIn-v1.apk (76 MB)
2. Buka file → Install
3. Izinkan "Sumber tidak dikenal" jika diminta
```

### Build Ulang
```bash
eas login
eas build --platform android --profile production
```

---

# ✅ Slide 16 — Kesimpulan

## Apa yang sudah dicapai:

| ✅ | Capaian |
|----|---------|
| ✅ | **26 screens** diimplementasi (0 stub/placeholder) |
| ✅ | **11 fitur mahasiswa** + **6 fitur admin** |
| ✅ | **Realtime Chat** via Supabase `postgres_changes` |
| ✅ | **Notifikasi otomatis** via database trigger |
| ✅ | **Design System** berbasis riset psikologi warna |
| ✅ | **Keamanan 4 layer** (Auth, RLS, RPC, Storage) |
| ✅ | **APK Production** 76 MB siap install |
| ✅ | **0 error** TypeScript + ESLint + Expo Doctor |

## Tech Stack yang dipakai:
```
React Native 0.81 + Expo SDK 54 + TypeScript Strict
Supabase (Auth + Postgres + Storage + Realtime)
React Navigation v7 + Zustand v5 + NativeWind v4
```

> **[SPEAKER]** Cari.In berhasil mengimplementasikan seluruh requirement mata kuliah Mobile Programming. Aplikasi siap digunakan dan bisa dikembangkan lebih lanjut.

---

# 🙏 Slide 17 — Penutup

## Terima Kasih

```
Cari.In — "Cariin barangmu di kampus."

Demo: Expo Go / APK Android
Repo: github.com/faiz/cariin
```

**Pertanyaan?**
