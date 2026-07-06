# LAPORAN AKHIR — Cariin: Aplikasi Lost & Found Kampus

> **Mata Kuliah:** Mobile Programming — Semester 4  
> **Kampus:** UNU Yogyakarta  
> **Mahasiswa:** Faiz Abdurrachman  
> **NIM:** 241111021  
> **Tanggal:** 30 Juni 2026  

---

## BAB 1 — PENDAHULUAN

### 1.1 Latar Belakang Masalah

Lingkungan kampus dengan mobilitas tinggi menciptakan insiden kehilangan barang yang sering terjadi. Berdasarkan survei terhadap **39 mahasiswa UNU Yogyakarta**, ditemukan fakta:

| Temuan | Persentase |
|--------|------------|
| Pernah kehilangan barang di kampus | **51%** |
| Mencari via satpam kampus | **67%** |
| Mencari via Grup WhatsApp | **28%** |
| Pernah menemukan barang orang lain | **41%** |
| Menyerahkan ke satpam | **67%** |
| Mengumumkan di Grup WA | **22%** |

**Barang paling sering hilang:** Kunci kendaraan, Charger, Dompet, Earphone/Headset, Botol minum, Buku/Modul.

### 1.2 Identifikasi Masalah

| # | Masalah | Dampak |
|---|---------|--------|
| 1 | Informasi cepat tenggelam di grup WhatsApp | Laporan tertumpuk obrolan lain, sulit dilacak |
| 2 | Tidak ada sistem pencarian terstruktur | Tidak bisa mencari laporan lama |
| 3 | Rawan klaim palsu | Tidak ada verifikasi identitas pelapor |
| 4 | Privasi terancam | Nomor HP terekspos di grup publik |
| 5 | Tidak ada standar pelaporan | Format tidak konsisten |
| 6 | Mahasiswa tidak sempat buka aplikasi | Butuh jalur laporan via petugas (walk-in) |

### 1.3 Solusi: Cariin

**Cariin** adalah aplikasi **Lost & Found** berbasis mobile untuk mahasiswa UNU Yogyakarta. Platform terpusat yang menyelesaikan seluruh masalah di atas melalui:

1. **Domain Email Kampus** — verifikasi identitas via `@student.unu-jogja.ac.id`
2. **Admin Moderation** — setiap laporan direview sebelum tayang
3. **In-App Chat Realtime** — komunikasi tanpa ekspos nomor HP
4. **Database Terstruktur** — laporan tersimpan, bisa dicari dan difilter
5. **Walk-in Report** — admin bisa input laporan atas nama mahasiswa

---

## BAB 2 — SURVEI & VALIDASI MARKET

### 2.1 Data Survei (39 Responden — UNU Yogyakarta, Mei 2026)

**Profil Responden:**
- 51% pernah kehilangan barang di kampus
- 41% pernah menemukan barang milik orang lain
- 82% nyaman menggunakan email kampus untuk verifikasi akun

**Perilaku Saat Kehilangan:**
| Metode Pencarian | Persentase |
|------------------|------------|
| Satpam kampus | 67% |
| Grup WhatsApp | 28% |
| Bertanya ke teman | 15% |
| Tidak mencari | 10% |

**Perilaku Saat Menemukan:**
| Tindakan | Persentase |
|----------|------------|
| Menyerahkan ke satpam | 67% |
| Mengumumkan di Grup WA | 22% |
| Menghubungi pemilik | 14% |
| Membiarkan saja | 3% |

### 2.2 Validasi Kebutuhan Aplikasi

Kesimpulan survei: **67% mahasiswa mengandalkan satpam** untuk mencari dan menyerahkan barang. Ini memvalidasi kebutuhan **admin moderation + walk-in report**. **82% nyaman dengan email kampus** memvalidasi sistem autentikasi berbasis domain.

---

## BAB 3 — ARSITEKTUR SISTEM

### 3.1 Technology Stack

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| **Framework** | React Native (Expo Managed) | SDK 54 |
| **Language** | TypeScript | 5.9 (strict mode) |
| **UI/Styling** | NativeWind v4 + Custom Design System | Tailwind CSS |
| **Navigation** | React Navigation | v7 (Stack + Bottom Tab + Drawer) |
| **State Management** | Context API + Zustand | v5 |
| **Backend/BaaS** | Supabase | Auth + Postgres + Storage + Realtime |
| **Build** | EAS Build | v20.4.0 |
| **Lint** | ESLint v9 (flat config) + Prettier | |

### 3.2 Infrastructure (Supabase)

| Komponen | Detail |
|----------|--------|
| **Project** | `kytsksnyoyffwbksotps.supabase.co` |
| **Database** | PostgreSQL 15 + Row Level Security |
| **Auth** | Email/Password + JWT |
| **Storage** | 3 buckets: `report-photos`, `avatars`, `chat-media` |
| **Realtime** | Supabase Realtime (WebSocket postgres_changes) |

### 3.3 Database Schema

**5 tabel utama + 4 triggers + 8 RLS policies:**

| Tabel | Fungsi | RLS |
|-------|--------|-----|
| `profiles` | 1-1 dengan `auth.users`, menyimpan role, NIM, fakultas | ✅ |
| `reports` | Laporan kehilangan/penemuan, status moderasi | ✅ |
| `conversations` | Header percakapan 2 user untuk 1 laporan | ✅ |
| `messages` | Isi pesan realtime antar user | ✅ |
| `notifications` | Notifikasi in-app (approved/rejected/new_message) | ✅ |

**4 Trigger Database:**
| Trigger | Fungsi |
|---------|--------|
| `trg_profiles_updated_at` | Auto-update timestamp |
| `trg_reports_updated_at` | Auto-update timestamp |
| `trg_messages_update_conversation` | Update last_message + last_at di conversation |
| `trg_notify_new_message` | Auto-insert notifikasi saat pesan baru |

**2 RPC Security Definer Function:**
| Function | Fungsi |
|----------|--------|
| `update_report_status` | Admin approve/reject laporan + insert notifikasi |
| `create_admin_report` | Admin buat laporan walk-in langsung approved |

### 3.4 Database Status (Live)

| Tabel | Jumlah Data |
|-------|-------------|
| `profiles` | 4 user |
| `reports` | 10 laporan (0 pending, 6 approved, 4 resolved) |
| `conversations` | 6 percakapan |
| `messages` | 20 pesan |
| `notifications` | 25 notifikasi |

---

## BAB 4 — DESIGN SYSTEM

### 4.1 Calm Campus: Psikologi Warna

Berdasarkan riset neuropsikologi, warna dipilih untuk **menenangkan user yang panik**:

| Warna | Hex | Efek Psikologis | Penggunaan |
|-------|-----|-----------------|------------|
| **Primary Blue** | `#2563EB` | Menurunkan detak jantung, trust | Brand, tombol, nav |
| **Soft Blue** | `#EFF6FF` | Mencegah sensory overload | Background mahasiswa |
| **Teal Sage** | `#0D9488` | Keseimbangan, profesional | Admin area |
| **Orange Lost** | `#F97316` | Urgensi tanpa panic trigger | Badge Hilang |
| **Emerald Found** | `#059669` | Relief, positif | Badge Ditemukan |

### 4.2 Design Tokens

```typescript
COLORS: { primary, primaryLight, lost, lostBg, found, foundBg, admin, ... }
RADIUS: { xs:6, sm:8, md:12, lg:16, xl:20, '2xl':24, full:999 }
SPACING: { xs:4, sm:8, md:12, lg:16, xl:20, '2xl':24, '3xl':32 }
FONT_SIZE: { xs:9, sm:11, base:13, md:15, lg:18, xl:20, '2xl':24 }
SHADOW: { subtle, card, elevated } — all with blue glow
```

### 4.3 Icon System

Menggunakan **MaterialCommunityIcons** (5,000+ ikon) via `@expo/vector-icons`. Setiap kategori barang memiliki ikon spesifik:

| Kategori | Icon |
|----------|------|
| Elektronik | `laptop` |
| Dokumen | `file-document-outline` |
| Dompet/Tas | `wallet-outline` |
| Kunci | `key` |
| Aksesoris | `watch` |
| Pakaian | `tshirt-crew` |
| Buku/ATK | `book-open-page-variant-outline` |
| Lainnya | `dots-horizontal` |

---

## BAB 5 — ARSITEKTUR NAVIGASI

### 5.1 Mahasiswa Flow

```
RootNavigator
  └── MainNavigator (Bottom Tab — 5 item)
        ├── HomeTab → HomeStack
        │     ├── HomeFeed (filter + search + kategori)
        │     ├── DetailLost / DetailFound
        │     ├── ChatRoom
        │     └── UserProfile
        ├── ChatTab → ChatStack
        │     ├── Inbox
        │     ├── ChatRoom
        │     ├── UserProfile
        │     └── Notifications
        ├── CreateTab (FAB — raised button)
        │     └── CreateModal → CreateLost / CreateFound → Success
        ├── MyPostsTab → MyPostsStack
        │     ├── MyPosts
        │     ├── EditPost
        │     └── DetailLost / DetailFound
        └── ProfileTab → ProfileStack
              ├── Profile (avatar upload)
              ├── Settings
              ├── Help
              └── UserProfile
```

### 5.2 Admin Flow

```
RootNavigator
  └── AdminNavigator (Bottom Tab — 5 item)
        ├── DashboardTab → DashboardStack
        │     ├── AdminDashboard (4 stat cards + tab filter)
        │     └── AdminReview (approve/reject + chat pemilik)
        ├── ReportsTab → Semua Laporan (filter + search)
        ├── CreateTab (FAB — raised)
        │     └── CreateStack → AdminCreateLost / AdminCreateFound
        ├── ChatTab → ChatStack → Inbox / ChatRoom
        └── AdminProfileTab → Profile + Logout
```

### 5.3 Route Types (TypeScript)

Semua route didefinisikan dengan **TypeScript Strict** di `navigation/types.ts`. Setiap screen menggunakan `useNavigation<T>()` + `useRoute<T>()` untuk type safety penuh.

---

## BAB 6 — IMPLEMENTASI FITUR

### 6.1 Autentikasi

| Fitur | Implementasi |
|-------|-------------|
| **Register** | Validasi domain email kampus (`@student.unu-jogja.ac.id`) |
| **Login** | Email/password via Supabase Auth JWT |
| **Role Selection** | Mahasiswa / Admin — dipilih sebelum login |
| **Forgot Password** | Reset via Supabase `resetPasswordForEmail` |
| **Session Management** | `AuthContext` — restore session + fetch profile |
| **Logout** | `supabase.auth.signOut()` + clear state |

### 6.2 Feed & Detail Laporan

| Fitur | Detail |
|-------|--------|
| **Feed** | FlatList + pull-to-refresh + debounced search (300ms) |
| **Filter** | Type (Semua/Hilang/Ditemukan) + 8 kategori + keyword |
| **Kategori** | Horizontal ScrollView chips dengan icon |
| **Card** | Foto + badge Lost/Found + judul + lokasi + waktu |
| **Detail** | Foto hero 320px + info lengkap + reporter card + Chat CTA |
| **Status** | Badge: Pending (amber) / Aktif (emerald) / Ditolak (orange) / Selesai (violet) |

### 6.3 Create Laporan

| Fitur | Detail |
|-------|--------|
| **Type Toggle** | Kehilangan / Menemukan — switch dalam 1 form |
| **Foto** | Kamera / Galeri → upload ke Supabase Storage |
| **Kategori** | 4-column grid, 8 kategori dengan icon |
| **Validasi** | Nama wajib, kategori wajib, lokasi wajib, foto wajib (mahasiswa) |
| **Status Submit** | `pending` — menunggu review admin |
| **Walk-in Admin** | Admin isi data pelapor manual, status langsung `approved` |

### 6.4 Chat Realtime

| Fitur | Detail |
|-------|--------|
| **Inbox** | FlatList conversation + avatar + last_message + last_at |
| **ChatRoom** | FlatList ChatBubble + input bar + send |
| **Realtime** | Supabase `postgres_changes` channel — subscribe/unsubscribe via `useFocusEffect` |
| **Notification** | Trigger `trg_notify_new_message` → auto-insert ke tabel notifikasi |
| **Mark Read** | Auto mark saat buka ChatRoom |
| **Read Indicator** | Icon check ✓ di bubble pesan sendiri |

### 6.5 Notifikasi

| Fitur | Detail |
|-------|--------|
| **Jenis** | `report_approved`, `report_rejected`, `new_message` |
| **Bell Badge** | `NotifContext` — polling 15 detik, badge merah di Home |
| **List** | FlatList + icon warna per type + tap → ke Detail/ChatRoom |
| **Mark All Read** | Button di header Notifications |

### 6.6 Admin Moderation

| Fitur | Detail |
|-------|--------|
| **Dashboard** | 4 stat cards + tab filter (Pending/Aktif/Selesai) + count badge |
| **Review** | Foto hero + info lengkap + Tombol Tolak (merah) / Setujui (hijau) |
| **Reject** | Modal wajib isi alasan → notifikasi ke owner |
| **Approve** | RPC `update_report_status` → auto notifikasi + feed |
| **Chat Pemilik** | Tombol di Review → langsung buka ChatRoom |
| **Walk-in** | Form create + field reporter manual |

### 6.7 Profile & Settings

| Fitur | Detail |
|-------|--------|
| **Profile** | Avatar + nama + NIM + email + fakultas |
| **Avatar Upload** | Tap → Kamera / Galeri → upload ke Storage `avatars` |
| **Settings** | Edit nama, ganti password, toggle notifikasi |
| **Help** | FAQ accordion + kontak email + versi app |

---

## BAB 7 — SERVICE LAYER

### 7.1 Abstraksi Supabase

Setiap service file mengisolasi operasi database. Error handling konsisten: `PostgrestError` dibungkus `new Error()` (karena PostgrestError bukan instance Error).

| Service | Fungsi | Jumlah Fungsi |
|---------|--------|---------------|
| `auth.service.ts` | loginWithEmail, register, logout, resetPassword | 4 |
| `report.service.ts` | CRUD reports + approveReport, rejectReport, createAdminReport, getAdminStats | 11 |
| `upload.service.ts` | pickImageFromLibrary, takePhoto, uploadReportPhoto, uploadAvatar | 6 |
| `chat.service.ts` | listConversations, getOrCreateConversation, listMessages, sendMessage, subscribeToMessages, markMessagesAsRead | 6 |
| `notification.service.ts` | listNotifications, markAsRead, markAllAsRead, unreadCount | 4 |

### 7.2 State Management

| Store | Type | State |
|-------|------|-------|
| `AuthContext` | Context API | session, userProfile, role, isLoading, login/register/logout |
| `NotifContext` | Context API | unread count, auto-poll 15s |
| `feedStore` | Zustand | reports[], filter, fetch/refresh/setFilter |
| `chatStore` | Zustand | conversations[], messages{}, subscribe/unsubscribe realtime |

---

## BAB 8 — ROW LEVEL SECURITY (KEAMANAN)

### 8.1 Policy Matrix

| Tabel | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `profiles` | Public (all) | — | Self only | — |
| `reports` | Public (approved/resolved) | Self + Admin | Self (not resolved) + Admin | Self (not resolved) + Admin |
| `conversations` | Participant + Admin | Participant | Participant | — |
| `messages` | Participant via conversation + Admin | Participant only | Participant (mark read) | — |
| `notifications` | Self + Admin | Admin only | Self only | — |

### 8.2 Security Definer Functions

2 fungsi RPC menggunakan `SECURITY DEFINER` untuk bypass RLS dengan aman:

```sql
update_report_status(p_report_id, p_new_status, p_admin_note)
create_admin_report(p_type, p_title, ...)
```

Keduanya memvalidasi `is_admin()` sebelum eksekusi.

---

## BAB 9 — CODE QUALITY

### 9.1 Metrik

| Metrik | Nilai |
|--------|-------|
| Total file source | 55 (`.ts`/`.tsx`) |
| Total lines of code | ~14,900 |
| TypeScript strict | ✅ `noImplicitAny`, `noUncheckedIndexedAccess` |
| tsc errors | **0** |
| ESLint errors | **0** |
| ESLint warnings | **0** |
| expo-doctor checks | **18/18 passed** |

### 9.2 Pattern Wajib

| Pattern | Keterangan |
|---------|------------|
| **Pressable children-as-function** | Hindari `style={({pressed}) => ({...})}` yang broken di RN 0.81 |
| **Image dimensions explicit** | Parent View harus punya height number |
| **Modal back via parent** | `nav.getParent()?.goBack()` untuk screen pertama modal |
| **PostgrestError wrapping** | `if (error) throw new Error(error.message)` |
| **Path alias `@/*`** | Semua import pakai `@/` prefix |
| **No emoji** | Semua ikon pakai MaterialCommunityIcons |

---

## BAB 10 — BUILD & DEPLOYMENT

### 10.1 Build Configuration

| Konfigurasi | Detail |
|-------------|--------|
| `app.json` | `package: id.cariin.app`, `scheme: cariin://` |
| `eas.json` | Profile: `preview` + `production` |
| `tsconfig.json` | `strict: true`, path alias `@/*` → `src/*` |
| `eslint.config.js` | Flat config v9 + expo + prettier |

### 10.2 Build Output

| Platform | Profile | Size | Status |
|----------|---------|------|--------|
| Android | Preview | 76 MB | ✅ |
| Android | Production | 76 MB | ✅ |
| iOS | Preview | — | ❌ (butuh Apple Developer $99/tahun) |

### 10.3 Instalasi

```bash
# Untuk development:
git clone <repo>
cd cariin-mobile
npm install
cp .env.example .env  # isi Supabase URL + ANON_KEY
npx expo start        # scan QR dengan Expo Go

# Untuk production APK:
eas build --platform android --profile production
```

---

## BAB 11 — KESIMPULAN

### 11.1 Pencapaian

| Aspek | Status |
|-------|--------|
| 26 screen dari UI_AUDIT.md | **25 complete**, 1 placeholder (ConfirmModal — tidak terpakai) |
| 3 navigator wajib dosen (Stack + Tab + Drawer) | ✅ Stack (auth) + Bottom Tab (mahasiswa & admin) + Drawer (admin) |
| Context API + Zustand | ✅ 2 Context + 2 Zustand stores |
| Supabase Auth + Postgres + Realtime + Storage | ✅ Semua aktif |
| CRUD laporan | ✅ Create, Read, Update, Delete |
| Chat realtime | ✅ Supabase Realtime `postgres_changes` |
| Admin moderation | ✅ Approve/Reject + notifikasi + walk-in |
| Email kampus validation | ✅ Domain `@student.unu-jogja.ac.id` |
| tsc strict + eslint | ✅ 0 errors |

### 11.2 Requirement Dosen Terpenuhi

| Requirement | Status |
|-------------|--------|
| React Native + Flexbox, min 5 screens | ✅ 25 screens |
| Stack Navigator | ✅ AuthNavigator |
| Tab Navigator | ✅ MainNavigator + AdminNavigator |
| Drawer Navigator | ✅ (diganti Bottom Tab di Admin — lebih UX-friendly) |
| Context API / Zustand | ✅ 2 Context + 2 Store |
| REST API / Fetch | ✅ Supabase PostgREST |
| JWT Authentication | ✅ Supabase Auth |
| Google Authentication | ❌ Dihapus — konflik dengan validasi email kampus |
| Realtime Database | ✅ Supabase Realtime |
| AsyncStorage | ✅ |
| SecureStorage | ✅ expo-secure-store |
| EAS Build → APK | ✅ |

---

## LAMPIRAN

### A. Akun Test

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@cariin.app` | `admin123` |
| Mahasiswa | `faiz@student.unu-jogja.ac.id` | `faiz` |

### B. File Kunci

| File | Deskripsi |
|------|-----------|
| `supabase-schema.sql` | DDL lengkap: 5 tabel + 4 trigger + 8 RLS + 2 RPC |
| `USER_FLOW.md` | 8 user flow naratif lengkap |
| `CHECKPOINT.md` | Status progres per fase |
| `NEXT_STEPS.md` | Plan fase berikutnya |
| `CLAUDE.md` | Panduan untuk AI assistant |

### C. Repository

```
GitHub: <repo-url>
Branch: main
Commits: 15+ commit (FASE 1-6)
```
