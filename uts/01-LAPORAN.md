# LAPORAN PROGRESS PROYEK MOBILE PROGRAMMING — UTS

## Identitas

| Field | Isi |
|-------|-----|
| **Nama** | Faiz Abdurrachman |
| **NIM** | _(isi NIM lu)_ |
| **Kelas** | ADE |
| **Mata Kuliah** | Mobile Programming (INF3105) |
| **Dosen** | Yana Hendriana, ST., M.Eng. |
| **Nama Aplikasi** | Cari.In — Campus Lost & Found |
| **Repository** | github.com/Faiz-Abdurrachman/cariin |

---

## 1. Analisis Permasalahan

### 1.1 Identifikasi Masalah

Di lingkungan kampus, kehilangan dan penemuan barang adalah masalah yang sangat umum namun penanganannya masih **manual dan tidak terstruktur**. Berikut masalah utama yang teridentifikasi:

| No | Masalah | Dampak |
|----|---------|--------|
| 1 | **Informasi cepat tenggelam di grup WhatsApp** | Laporan kehilangan tertumpuk oleh obrolan lain, sulit ditemukan kembali |
| 2 | **Tidak ada sistem pencarian terpusat** | Mahasiswa tidak bisa melacak laporan lama, harus scroll manual di chat grup |
| 3 | **Rawan klaim palsu** | Tidak ada verifikasi identitas — siapapun bisa klaim barang milik orang lain |
| 4 | **Privasi terancam** | Nomor HP dan kontak pribadi terekspos secara publik di grup |
| 5 | **Format pelaporan tidak konsisten** | Setiap orang menulis laporan dengan format berbeda-beda, informasi sering tidak lengkap |
| 6 | **Mahasiswa tidak sempat install app** | Perlu jalur pelaporan alternatif melalui satpam/admin kampus |

### 1.2 Siapa yang Terdampak?

- **Mahasiswa** — kehilangan laptop, KTM, dompet, kunci motor, dll.
- **Satpam kampus** — menerima laporan walk-in tapi tidak punya sistem untuk menyebarluaskan informasi
- **Staff akademik** — sering menerima pengaduan kehilangan dokumen

### 1.3 Validasi Masalah (Data & Referensi)

- **Lost N Found Telkom University** — 11.000+ followers Instagram, masih mengandalkan DM manual
- **ITS Surabaya** — 700 laporan kehilangan dalam 9 bulan (sumber: riset internal)
- **Universitas Brawijaya** — >50% mahasiswa pernah kehilangan barang di kampus

### 1.4 Kenapa Penting Diselesaikan?

Kehilangan barang di kampus bukan sekadar masalah kecil. Kehilangan laptop bisa berarti kehilangan tugas akhir. Kehilangan KTM bisa menghambat ujian. Belum ada platform khusus yang mempertemukan pelapor dan penemu dengan aman, terstruktur, dan terverifikasi.

---

## 2. Analisis Kebutuhan

### 2.1 Kebutuhan Fungsional

| Kode | Fitur | Deskripsi | Prioritas |
|------|-------|-----------|-----------|
| F-01 | **Registrasi & Login** | Daftar dengan email kampus (`@student.unu-jogja.ac.id`), login email/password, opsi Google Sign-In | Tinggi |
| F-02 | **Laporan Kehilangan (Lost)** | Form pelaporan: foto wajib, nama barang, kategori, lokasi terakhir, deskripsi | Tinggi |
| F-03 | **Laporan Penemuan (Found)** | Form pelaporan: foto wajib, nama barang, kategori, lokasi temuan, **titik penitipan** (wajib), deskripsi | Tinggi |
| F-04 | **Feed Utama (Home)** | Menampilkan semua laporan aktif (approved), filter berdasarkan kategori dan tipe (Lost/Found), search keyword | Tinggi |
| F-05 | **Detail Laporan** | Foto, badge status+kategori, lokasi, deskripsi, badge "Via Admin", info pelapor | Tinggi |
| F-06 | **Moderasi Admin** | Admin me-review laporan mahasiswa: approve atau reject (wajib alasan). Laporan pending tidak tampil di publik | Tinggi |
| F-07 | **Laporan Admin (Walk-in)** | Admin bisa buat laporan atas nama mahasiswa yang lapor ke satpam. Langsung approved, tampil badge "Via Admin" | Sedang |
| F-08 | **In-App Chat** | Chat real-time antara pelapor dan penemu tanpa ekspos nomor HP | Sedang |
| F-09 | **Notifikasi** | Notifikasi in-app saat laporan di-approve/reject, ada pesan baru | Sedang |
| F-10 | **Kelola Laporan** | User bisa edit/hapus laporan sendiri, menandai sebagai "Selesai" (resolved) | Tinggi |
| F-11 | **Profil & Akun** | Lihat profil, edit data, ganti password, upload avatar | Sedang |
| F-12 | **Admin Dashboard** | Statistik laporan, daftar pending, quick actions | Tinggi |

### 2.2 Kebutuhan Non-Fungsional

| Kode | Kebutuhan | Spesifikasi |
|------|-----------|-------------|
| NF-01 | **Performa** | Loading feed < 2 detik, navigasi antar screen < 300ms, chat real-time latency < 500ms |
| NF-02 | **Keamanan** | JWT authentication via Supabase Auth, Row Level Security (RLS) di database, validasi domain email kampus, foto disimpan di private Storage dengan akses kontrol |
| NF-03 | **Usability** | UI konsisten dengan design system (Lost = merah, Found = hijau), navigasi intuitif (Bottom Tab + Stack + Drawer), onboarding minimal |
| NF-04 | **Kompatibilitas** | Android 6+ dan iOS 13+, Expo Go compatible untuk development, EAS Build untuk APK production |
| NF-05 | **Skalabilitas** | Supabase Postgres bisa handle ribuan laporan, Realtime subscription via WebSocket, Storage bucket terpisah per konteks |
| NF-06 | **Offline Support** | Session disimpan di AsyncStorage, cache laporan di Zustand store |

---

## 3. Referensi Desain, Survey, & Observasi

### 3.1 Studi Banding Aplikasi Serupa

| Aplikasi / Platform | Kelebihan | Kekurangan | Pembelajaran untuk Cari.In |
|---------------------|-----------|------------|---------------------------|
| **Lost N Found Telkom University** (Instagram) | 11K+ followers, reach luas | Manual via DM, tidak terstruktur, tidak ada verifikasi | Perlu platform khusus, bukan media sosial umum |
| **TemuKembali (UB)** | Fitur dasar lengkap | UI kurang intuitif, tidak ada chat in-app | Perlu UI modern + chat built-in |
| **Lost & Found ITS** | Terintegrasi dengan sistem kampus | Web-only, tidak ada mobile app | Mobile-first approach |

### 3.2 Observasi Lapangan

Observasi dilakukan terhadap:
- **Grup WhatsApp angkatan** — Informasi kehilangan sering tenggelam dalam 1-2 jam oleh chat lain
- **Papan pengumunan kampus** — Jarang di-update, tidak real-time
- **Satpam pos keamanan** — Menerima laporan verbal tapi tidak ada sistem pencatatan digital

### 3.3 Survey / Kuesioner

> ⚠️ **ACTION ITEM:** Lu perlu bikin Google Form dengan pertanyaan berikut dan kumpulin minimal 20 responden.

**Pertanyaan yang direkomendasikan:**

1. Apakah Anda pernah kehilangan barang di lingkungan kampus? (Ya/Tidak)
2. Jika ya, barang apa yang hilang? (elektronik/dokumen/dompet/kunci/lainnya)
3. Bagaimana Anda mencari barang yang hilang? (grup WA/media sosial/satpam/lapor ke admin/dll)
4. Apakah Anda pernah menemukan barang di kampus? Apa yang Anda lakukan?
5. Seberapa sering Anda mengalami kehilangan barang di kampus? (per semester)
6. Apakah Anda bersedia menggunakan aplikasi khusus lost & found kampus? (Skala 1-5)
7. Fitur apa yang paling Anda butuhkan? (laporan/chat dengan penemu/notifikasi/search)
8. Apakah Anda nyaman jika harus verifikasi dengan email kampus? (Ya/Tidak)
9. Seberapa penting fitur chat in-app vs bertukar nomor HP? (Skala 1-5)
10. Apakah Anda merasa cara saat ini efektif untuk mencari barang hilang? (Ya/Tidak)

---

## 4. Timeline Proyek (9 Minggu)

### Gantt Chart

> ⚠️ **ACTION ITEM:** Konversi tabel ini ke diagram visual (Canva / Google Sheets / ProjectLibre) buat dipasang di slide.

```
Minggu  │ 1  2  3  4  5  6  7  8  9
────────┼─────────────────────────────
Setup   │██                          
Proto   │   ██                        
Core RN │      ████████               
Auth    │         ████                
Feed    │            ████             
Create  │               ████          
Admin   │                  ████       
Chat    │                     ████    
Polish  │                        ████ 
Build   │                           ██
```

### Detail Milestone

| Minggu | Aktivitas | Deliverable | Status |
|--------|-----------|-------------|--------|
| 1-2 | Setup environment + prototype HTML | Prototype 26 screens di Vercel | ✅ Selesai |
| 3 | Setup Expo + NativeWind + TypeScript strict + Supabase client | Project base berjalan di Expo Go | ✅ Selesai |
| 3 | Fondasi navigasi (Stack + Tab + Drawer) + AuthContext | RootNavigator branching 3 role | ✅ Selesai |
| 4 | Auth screens (Splash, RoleSelection, Login, Register, Forgot) | Flow login/register lengkap | ✅ Selesai |
| 5 | Core mahasiswa: Home feed, Detail, Create report, My Posts, Profile | CRUD laporan + upload foto + profile | ✅ Selesai |
| 6 | Chat & Notifikasi (Supabase Realtime) | In-app chat real-time + notifikasi | 🔜 Next |
| 7 | Admin screens: Dashboard, Moderation, Walk-in reports | Admin bisa approve/reject + buat laporan | 🔜 Next |
| 8 | Polish: Settings, Help, UserProfile, animasi, avatar | Semua screen implementasi | 🔜 Next |
| 9 | EAS Build APK, README, video demo | APK siap submission | 🔜 Next |

---

## 5. Wireframe

### 5.1 Low-Fidelity Wireframe

Wireframe dibuat dalam bentuk **prototype HTML** (26 screens) yang di-deploy di Vercel. Seluruh layout, navigasi, dan flow user sudah divisualisasikan.

**URL Prototype:** https://cariin-lf.vercel.app/

### 5.2 Blueprint Alur Aplikasi

#### Flow Autentikasi
```
Splash → RoleSelection → Login (Email/Google) → MainNavigator (Mahasiswa)
                                        → Register → Validasi Email Kampus → Login
                                        → ForgotPassword → Email Reset
                      → Login Admin → AdminNavigator (Drawer)
```

#### Flow Mahasiswa (Bottom Tab — 5 Tab)
```
Tab 1: Home
  HomeFeed → Filter/Search → DetailLost/DetailFound → Chat

Tab 2: Pesan
  Inbox → ChatRoom → UserProfile
         → Notifications

Tab 3: FAB (+) → Modal
  CreateLost ↔ CreateFound → Success

Tab 4: Laporanku
  MyPosts → EditPost / Detail

Tab 5: Profil
  Profile → Settings / Help / UserProfile
```

#### Flow Admin (Drawer — Aksen Indigo)
```
Drawer: Dashboard → AdminReview (Approve/Reject)
Drawer: Semua Laporan → Filter Status → AdminReview
Drawer: Buat Laporan → AdminCreateLost / AdminCreateFound
Drawer: Logout → kembali ke Auth
```

### 5.3 Struktur Halaman (26 Screens)

**Auth (5 screens):** SplashScreen, RoleSelectionScreen, LoginScreen, RegisterScreen, ForgotPasswordScreen

**Main Mahasiswa (7 screens):** HomeScreen, DetailLostScreen, DetailFoundScreen, CreateLostScreen, CreateFoundScreen, SuccessScreen, LoadingScreen

**Chat (3 screens):** InboxScreen, ChatRoomScreen, NotificationsScreen

**Profile (5 screens):** MyPostsScreen, EditPostScreen, ProfileScreen, UserProfileScreen, SettingsScreen, HelpScreen

**Admin (5 screens):** AdminLoginScreen, AdminDashboardScreen, AdminReviewScreen, AdminReportsScreen, AdminCreateLostScreen, AdminCreateFoundScreen

---

## 6. Desain Interface

### 6.1 Design System

#### Color Palette
| Token | Warna | Hex | Penggunaan |
|-------|-------|-----|------------|
| Primary | Zinc-900 | `#18181B` | Background utama, teks heading |
| Lost | Red-500 | `#EF4444` | Badge, aksen untuk laporan kehilangan |
| Lost BG | Red-100 | `#FEE2E2` | Background card lost |
| Found | Emerald-500 | `#22C55E` | Badge, aksen untuk laporan penemuan |
| Found BG | Emerald-100 | `#D1FAE5` | Background card found |
| Admin | Indigo-600 | `#4F46E5` | Aksen navigasi admin |
| Pending | Amber-500 | `#F59E0B` | Badge status pending |
| Resolved | Violet-500 | `#8B5CF6` | Badge status selesai |
| Background | Zinc-100 | `#F4F4F5` | Background screen |
| Surface | White | `#FFFFFF` | Card background |

#### UI Conventions
- **Border radius:** 24px (card), 16px (input/button)
- **Shadow:** elevation 2 (Android), shadowOpacity 0.08 (iOS)
- **Spacing:** kelipatan 4 (4, 8, 12, 16, 20, 24, 32)
- **Font:** System default + Inter via expo-font
- **Framework styling:** NativeWind v4 (Tailwind CSS untuk React Native)

### 6.2 Screens yang Sudah Diimplementasi

| Screen | Status | Deskripsi |
|--------|--------|-----------|
| SplashScreen | ✅ Done | Logo + tagline Cari.In |
| RoleSelectionScreen | ✅ Done | Pilih Mahasiswa atau Admin, card-based |
| LoginScreen | ✅ Done | Form email+password + tombol Google + link register |
| RegisterScreen | ✅ Done | Form lengkap (nama, NIM, email kampus, fakultas, password) |
| ForgotPasswordScreen | ✅ Done | Input email, kirim reset link |
| HomeScreen | ✅ Done | Feed laporan + search bar + filter chip kategori/tipe |
| DetailLostScreen | ✅ Done | Foto besar + info + badge merah + tombol chat |
| DetailFoundScreen | ✅ Done | Foto besar + info + badge hijau + titik penitipan |
| CreateLostScreen | ✅ Done | Form laporan kehilangan + upload foto wajib |
| CreateFoundScreen | ✅ Done | Form laporan penemuan + titik penitipan wajib |
| SuccessScreen | ✅ Done | Konfirmasi berhasil + tombol kembali ke home |
| MyPostsScreen | ✅ Done | Daftar laporan milik user + filter status |
| EditPostScreen | ✅ Done | Edit laporan yang masih aktif |
| ProfileScreen | ✅ Done | Avatar, nama, NIM, email, fakultas, statistik |

### 6.3 Screens Placeholder (dikerjakan FASE 4.5–6)
InboxScreen, ChatRoomScreen, NotificationsScreen, AdminDashboardScreen, AdminReportsScreen, AdminReviewScreen, AdminCreateLostScreen, AdminCreateFoundScreen, SettingsScreen, HelpScreen, UserProfileScreen

---

## 7. Hasil Coding

### 7.1 Arsitektur Project

```
cariin-mobile/
├── src/
│   ├── screens/         ← 26 screen components (5 auth, 7 main, 3 chat, 6 profile, 5 admin)
│   ├── navigation/      ← React Navigation v7 (Stack + Tab + Drawer)
│   ├── components/      ← 13 reusable components
│   ├── services/        ← Supabase wrappers (auth, report, upload, chat, notification)
│   ├── context/         ← AuthContext + NotifContext (React Context API)
│   ├── store/           ← Zustand stores (feedStore, chatStore)
│   └── utils/           ← Constants, validators, formatters, helpers
├── supabase-schema.sql  ← DDL + RLS + Triggers (idempotent)
├── CONTEXT.md           ← Sumber kebenaran project spec
└── app.json             ← Expo config
```

### 7.2 Tech Stack

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| Framework | Expo SDK 54 (Managed Workflow) | `~54.0.33` |
| Runtime | React Native | `0.81.5` |
| Language | TypeScript strict | `~5.9.2` |
| Navigation | React Navigation v7 | `^7.x` |
| State | Context API + Zustand 5 | `^5.0.13` |
| Styling | NativeWind v4 (Tailwind CSS) | `^4.2.3` |
| Backend | Supabase (Auth + Postgres + Storage + Realtime) | `^2.105.3` |
| Networking | Axios + Supabase PostgREST | `^1.16.0` |
| Storage Lokal | AsyncStorage + expo-secure-store | `2.2.0` / `~15.0.8` |
| Image | expo-image-picker + Supabase Storage | `~17.0.11` |
| Notifications | expo-notifications | `~0.32.17` |
| Build | Expo EAS Build | TBD (FASE 6) |

### 7.3 Potongan Kode Inti

#### Autentikasi — Validasi Email Kampus (src/utils/validators.ts)
```typescript
export const ALLOWED_DOMAIN = 'student.unu-jogja.ac.id';

export const isValidCampusEmail = (email: string): boolean => {
  return email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
};
```

#### Autentikasi — Register Flow (src/services/auth.service.ts)
```typescript
export async function register(payload: RegisterPayload): Promise<User> {
  if (!isValidCampusEmail(payload.email)) {
    throw new Error(EMAIL_DOMAIN_ERROR);
  }
  const { data, error } = await supabase.auth.signUp({
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    options: {
      data: { name: payload.name, nim: payload.nim, ... },
    },
  });
  // ... error handling + update profiles table
}
```

#### CRUD Laporan — List dengan Filter (src/services/report.service.ts)
```typescript
export async function listReports(filter: ReportFilter = {}): Promise<Report[]> {
  let q = supabase.from('reports').select('*, reporter:user_id(name,nim,faculty,avatar_url)');
  // Default: hanya approved+resolved untuk feed publik
  if (!filter.userId && !filter.status) {
    q = q.in('status', ['approved', 'resolved']);
  }
  if (filter.type) q = q.eq('type', filter.type);
  if (filter.search) q = q.ilike('title', `%${escapeLike(filter.search)}%`);
  const { data, error } = await q.order('created_at', { ascending: false });
  // ... error handling
}
```

#### Upload Foto — Base64 ke Supabase Storage (src/services/upload.service.ts)
```typescript
export async function uploadReportPhoto(picked: PickImageResult, userId: string): Promise<string> {
  const path = `${userId}/${Date.now()}-${randomSuffix()}.${ext}`;
  const bytes = base64ToUint8Array(picked.base64);
  await supabase.storage.from('report-photos').upload(path, bytes, { contentType });
  const { data } = supabase.storage.from('report-photos').getPublicUrl(path);
  return data.publicUrl;
}
```

#### State Management — AuthContext (src/context/AuthContext.tsx)
```typescript
export function AuthProvider({ children }: { children: ReactNode }) {
  // Subscribe Supabase auth state + sinkronkan dengan tabel profiles
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (_, newSession) => {
      setSession(newSession);
      if (newSession) {
        const profile = await fetchProfile(newSession.user.id);
        setUserProfile(profile);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  // ... provide context value
}
```

#### Navigasi — Root Branching (src/navigation/index.tsx)
```typescript
// Logic: belum login → AuthNavigator
//        mahasiswa  → MainNavigator (Bottom Tab)
//        admin      → AdminNavigator (Drawer)
```

### 7.4 Statistik Codebase

| Metrik | Jumlah |
|--------|--------|
| Total file source | 60+ file TypeScript |
| Screens | 26 (14 implementasi, 12 placeholder) |
| Komponen reusable | 13 |
| Service layer | 6 file (auth, report, upload, chat, notification, supabase) |
| Tabel database | 5 (profiles, reports, conversations, messages, notifications) |
| RLS policies | 17 policies |
| Storage buckets | 3 (report-photos, avatars, chat-media) |

---

## 8. Rancangan Database

### 8.1 ERD (Entity Relationship Diagram)

> ⚠️ **ACTION ITEM:** Gambar ERD visual di draw.io / dbdiagram.io. Copy relasi di bawah.

```
┌──────────────────────┐       ┌──────────────────────────┐
│    auth.users        │       │       profiles           │
│──────────────────────│  1:1  │──────────────────────────│
│ id (UUID) PK         │◄─────►│ id (UUID) PK, FK         │
│ email                │       │ name                     │
│ encrypted_password   │       │ nim                      │
│ raw_user_meta_data   │       │ email                    │
└──────────────────────┘       │ role (mahasiswa/admin)   │
                               │ faculty                  │
                               │ department               │
                               │ avatar_url               │
                               │ is_verified              │
                               │ expo_push_token          │
                               └────────────┬─────────────┘
                                            │ 1:N
               ┌────────────────────────────┼────────────────────┐
               │                            │                    │
               ▼                            ▼                    ▼
┌──────────────────────┐    ┌─────────────────────┐  ┌──────────────────────┐
│      reports         │    │   conversations     │  │    notifications     │
│──────────────────────│    │─────────────────────│  │──────────────────────│
│ id (UUID) PK         │◄───│ id (UUID) PK        │  │ id (UUID) PK         │
│ user_id FK → profiles│    │ report_id FK        │  │ user_id FK → profiles│
│ type (lost/found)    │    │ user_a_id FK        │  │ type                 │
│ title                │    │ user_b_id FK        │  │ title                │
│ description          │    │ last_message        │  │ body                 │
│ category (8 jenis)   │    │ last_at             │  │ is_read              │
│ location             │    └──────────┬──────────┘  │ ref_id               │
│ custody_point        │               │ 1:N         └──────────────────────┘
│ photo_url            │               ▼
│ status               │    ┌──────────────────────┐
│ admin_note           │    │     messages         │
│ created_by_admin     │    │──────────────────────│
│ reporter_name        │    │ id (UUID) PK         │
│ reporter_nim         │    │ conversation_id FK   │
│ reporter_faculty     │    │ sender_id FK         │
│ resolved_at          │    │ content              │
└──────────────────────┘    │ is_read              │
                            │ created_at           │
                            └──────────────────────┘
```

### 8.2 Relasi Antar Tabel

| Dari | Ke | Jenis | Keterangan |
|------|----|-------|------------|
| `auth.users` | `profiles` | 1:1 | Trigger `trg_on_auth_user_created` auto-bikin row profiles saat signUp |
| `profiles` | `reports` | 1:N | Satu user bisa punya banyak laporan |
| `reports` | `conversations` | 1:N | Satu laporan bisa punya banyak percakapan |
| `profiles` | `conversations` | N:M | Via user_a_id + user_b_id, UNIQUE constraint per report |
| `conversations` | `messages` | 1:N | Satu percakapan punya banyak pesan |
| `profiles` | `notifications` | 1:N | Notifikasi per user |

### 8.3 Keamanan Data (Row Level Security)

| Tabel | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `profiles` | Publik | — | Hanya row sendiri | — |
| `reports` | Approved publik + owner semua + admin semua | Owner + admin | Owner (belum resolved) + admin | Owner (belum resolved) + admin |
| `conversations` | Peserta + admin | Peserta | Peserta | — |
| `messages` | Peserta + admin | Peserta | Peserta | — |
| `notifications` | Owner + admin | Admin | Owner | — |

### 8.4 Storage Buckets (Supabase Storage)

| Bucket | Public | Kebijakan | Isi |
|--------|--------|-----------|-----|
| `report-photos` | ✅ Ya | Upload/delete by owner folder prefix | Foto barang laporan |
| `avatars` | ✅ Ya | Upload/delete by owner folder prefix | Foto profil user |
| `chat-media` | ❌ Tidak | TBD (FASE 4.5) | Lampiran chat |

---

## Lampiran

### A. Akun Test

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cariin.app | admin123 |
| Mahasiswa | faiz@student.unu-jogja.ac.id | faizfaiz |

### B. Link Penting

| Resource | URL |
|----------|-----|
| Prototype HTML | https://cariin-lf.vercel.app/ |
| Supabase Dashboard | https://supabase.com/dashboard/project/kytsksnyoyffwbksotps |
| Repository GitHub | _(isi setelah push)_ |

### C. Status Progress

FASE 1–4 (Setup, Navigasi, Auth, Core Mahasiswa) = ✅ Selesai
FASE 4.5–6 (Chat, Admin, Polish) = 🔜 Dikerjakan selanjutnya
