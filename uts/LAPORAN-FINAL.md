# LAPORAN PROGRESS PROYEK MOBILE PROGRAMMING — UTS

---

> **Cover Page — Tambahkan:**
> - Logo Kampus UNU Yogyakarta (kiri atas)
> - Logo Aplikasi Cari.In (kanan atas)
> - Judul: **Laporan Progress Proyek Mobile Programming**
> - Nama: Faiz Abdurrachman
> - NIM: [ ISI NIM ]
> - Kelas: ADE
> - Program Studi: Informatika
> - Mata Kuliah: Mobile Programming (INF3105)
> - Dosen Pengampu: Yana Hendriana, ST., M.Eng.
> - Tahun Akademik: 2025/2026 Genap
> - Nama Aplikasi: Cari.In — Campus Lost & Found

---

## Identitas

| Field | Isi |
|-------|-----|
| **Nama** | Faiz Abdurrachman |
| **NIM** | _(isi NIM)_ |
| **Kelas** | ADE |
| **Program Studi** | Informatika |
| **Mata Kuliah** | Mobile Programming (INF3105) |
| **Dosen Pengampu** | Yana Hendriana, ST., M.Eng. |
| **Tahun Akademik** | 2025/2026 Genap |
| **Nama Aplikasi** | Cari.In — Campus Lost & Found |
| **Repository** | github.com/Faiz-Abdurrachman/cariin |
| **Video Presentasi** | [ PLACEHOLDER LINK YOUTUBE ] |

---

## Daftar Isi

1. [Analisis Permasalahan](#1-analisis-permasalahan)
2. [Analisis Kebutuhan](#2-analisis-kebutuhan)
3. [Referensi Desain, Survey, & Observasi](#3-referensi-desain-survey--observasi)
4. [Timeline Proyek](#4-timeline-proyek-9-minggu)
5. [Wireframe dan User Flow](#5-wireframe-dan-user-flow)
6. [Desain Interface](#6-desain-interface)
7. [Hasil Coding](#7-hasil-coding)
   - [7.1 Arsitektur Project](#71-arsitektur-project)
   - [7.2 Tech Stack](#72-tech-stack)
   - [7.3 Navigasi — Arsitektur & Alur](#73-navigasi--arsitektur--alur)
   - [7.4 State Management — AuthContext & Zustand](#74-state-management--authcontext--zustand)
   - [7.5 Service Layer — Repository Pattern](#75-service-layer--repository-pattern)
   - [7.6 Integrasi API — Supabase](#76-integrasi-api--supabase-backend-as-a-service)
   - [7.7 Navigasi — Root Branching](#77-navigasi--root-branching-berdasarkan-role)
   - [7.8 Statistik Codebase](#78-statistik-codebase)
8. [Rancangan Database](#8-rancangan-database)
9. [Progress Pengembangan](#9-progress-pengembangan)
10. [Kesimpulan](#10-kesimpulan)
11. [Lampiran](#lampiran)

## 1. Analisis Permasalahan

### 1.1 Identifikasi Masalah

Di lingkungan kampus, kehilangan dan penemuan barang merupakan masalah yang cukup sering terjadi. Barang seperti laptop, dompet, kartu tanda mahasiswa (KTM), kunci kendaraan, hingga dokumen penting sering kali hilang di area kampus.

Saat ini proses penyampaian informasi kehilangan barang masih dilakukan secara manual melalui grup WhatsApp, media sosial, ataupun laporan langsung kepada satpam kampus. Metode tersebut dinilai kurang efektif karena informasi mudah tenggelam oleh percakapan lain sehingga sulit ditemukan kembali ketika dibutuhkan.

Selain itu, belum terdapat sistem terpusat yang mampu membantu mahasiswa dalam melaporkan dan mencari barang hilang secara cepat dan aman. Tidak adanya sistem validasi identitas juga meningkatkan risiko terjadinya klaim palsu terhadap barang yang ditemukan.

Masalah utama yang teridentifikasi:

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

> **Placeholder — Tambahkan:** screenshot grup WhatsApp (informasi kehilangan tenggelam), foto papan pengumuman kampus, dokumentasi satpam pos keamanan.

---

## 2. Analisis Kebutuhan

Berdasarkan hasil analisis masalah, berikut kebutuhan fungsional dan non-fungsional yang dirancang untuk aplikasi Cari.In.

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

Sebagian besar sistem existing masih mengandalkan media sosial dan belum memiliki aplikasi mobile khusus.

### 3.2 Observasi Lapangan

Observasi dilakukan terhadap:
- **Grup WhatsApp angkatan** — Informasi kehilangan sering tenggelam dalam 1-2 jam oleh chat lain
- **Papan pengumuman kampus** — Jarang di-update, tidak real-time
- **Satpam pos keamanan** — Menerima laporan verbal tapi tidak ada sistem pencatatan digital

> **Placeholder — Tambahkan:** screenshot grup WhatsApp, hasil observasi, dokumentasi pendukung lainnya.

### 3.3 Survey / Kuesioner

Dilakukan survey terhadap mahasiswa untuk mengetahui kebutuhan utama pengguna terhadap aplikasi lost and found kampus.

> **ACTION ITEM:** Buat Google Form dengan pertanyaan berikut dan kumpulkan minimal 20 responden.

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

> **Placeholder — Tambahkan:** screenshot Google Form, diagram hasil survey, jumlah responden, kesimpulan survey.

---

## 4. Timeline Proyek (9 Minggu)

Pengembangan aplikasi dilakukan secara bertahap selama 9 minggu, mulai dari perancangan prototype hingga build APK production.

### 4.1 Gantt Chart

> **ACTION ITEM:** Konversi tabel ini ke diagram visual (Canva / Google Sheets / ProjectLibre) untuk dipasang di slide.

```
Minggu  │ 1  2  3  4  5  6  7  8  9
───────┼─────────────────────────────
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

### 4.2 Detail Milestone

| Minggu | Aktivitas | Deliverable | Status |
|--------|-----------|-------------|--------|
| 1-2 | Setup environment + prototype HTML | Prototype 27 screens di Vercel | ✅ Selesai |
| 3 | Setup Expo + NativeWind + TypeScript strict + Supabase client | Project base berjalan di Expo Go | ✅ Selesai |
| 3 | Fondasi navigasi (Stack + Tab + Drawer) + AuthContext | RootNavigator branching 3 role | ✅ Selesai |
| 4 | Auth screens (Splash, RoleSelection, Login, Register, Forgot) | Flow login/register lengkap | ✅ Selesai |
| 5 | Core mahasiswa: Home feed, Detail, Create report, My Posts, Profile | CRUD laporan + upload foto + profile | ✅ Selesai |
| 6 | Admin screens: Dashboard, Moderation, Walk-in reports | Admin bisa approve/reject + buat laporan | ✅ Selesai |
| 7 | Polish: Settings, Help, UserProfile, avatar | Semua screen profil implementasi | ✅ Selesai |
| 8 | Chat & Notifikasi (Supabase Realtime) | In-app chat real-time + notifikasi | 🔜 Progress |
| 9 | EAS Build APK, README, video demo | APK siap submission | 🔜 Progress |

---

## 5. Wireframe dan User Flow

Sebelum implementasi, dibuat wireframe low-fidelity dan blueprint alur aplikasi untuk mempermudah proses development.

### 5.1 Low-Fidelity Wireframe

Wireframe dibuat dalam bentuk **prototype HTML** (27 screens) yang di-deploy di Vercel. Seluruh layout, navigasi, dan flow user sudah divisualisasikan.

**URL Prototype:** https://cariin-lf.vercel.app/

> **Placeholder — Tambahkan:** screenshot tiap wireframe screen dari prototype HTML, atau export gambar wireframe low-fidelity.

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

> **Placeholder — Tambahkan:** diagram user flow visual (flowchart), gunakan Figma / draw.io / Whimsical.

### 5.3 Struktur Halaman (27 Screens)

**Auth (5 screens):** SplashScreen, RoleSelectionScreen, LoginScreen, RegisterScreen, ForgotPasswordScreen

**Main Mahasiswa (7 screens):** HomeScreen, DetailLostScreen, DetailFoundScreen, CreateLostScreen, CreateFoundScreen, SuccessScreen, LoadingScreen

**Chat (3 screens):** InboxScreen, ChatRoomScreen, NotificationsScreen

**Profile (6 screens):** MyPostsScreen, EditPostScreen, ProfileScreen, UserProfileScreen, SettingsScreen, HelpScreen

**Admin (6 screens):** AdminLoginScreen, AdminDashboardScreen, AdminReviewScreen, AdminReportsScreen, AdminCreateLostScreen, AdminCreateFoundScreen

---

## 6. Desain Interface

Aplikasi Cari.In menggunakan desain modern dengan tampilan sederhana dan mudah digunakan. Penggunaan warna dibedakan berdasarkan kategori: **merah** untuk laporan kehilangan, **hijau** untuk laporan penemuan, dan **indigo** untuk dashboard admin. Framework styling yang digunakan adalah NativeWind v4 (Tailwind CSS untuk React Native).

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
| UserProfileScreen | ✅ Done | Profil publik user lain + daftar laporan aktif |
| SettingsScreen | ✅ Done | Pengaturan akun (ganti password, notifikasi, dsb) |
| HelpScreen | ✅ Done | Pusat bantuan — FAQ accordion + kontak dukungan |
| AdminDashboardScreen | ✅ Done | Dashboard statistik laporan + quick actions |
| AdminReviewScreen | ✅ Done | Detail laporan + approve/reject + alasan wajib |
| AdminReportsScreen | ✅ Done | Daftar semua laporan + filter status |
| AdminCreateLostScreen | ✅ Done | Admin buat laporan kehilangan walk-in |
| AdminCreateFoundScreen | ✅ Done | Admin buat laporan penemuan walk-in |

### 6.3 Screens Placeholder (dikerjakan FASE 4.5–6)

| Screen | Status | Deskripsi |
|--------|--------|-----------|
| InboxScreen | 🔜 Progress | Daftar percakapan chat |
| ChatRoomScreen | 🔜 Progress | Chat real-time antara pelapor dan penemu |
| NotificationsScreen | 🔜 Progress | Daftar notifikasi in-app |

### 6.4 Screenshot Implementasi

> **Placeholder — Tambahkan screenshot dari Expo Go / device untuk setiap screen di bawah.**

#### Tampilan Splash Screen

<!-- [ Screenshot Splash Screen ] -->

Halaman awal aplikasi yang menampilkan identitas aplikasi Cari.In.

#### Tampilan Role Selection

<!-- [ Screenshot Role Selection ] -->

Halaman pemilihan role: Mahasiswa atau Admin.

#### Tampilan Login

<!-- [ Screenshot Login ] -->

Halaman autentikasi pengguna menggunakan email kampus dan password.

#### Tampilan Register

<!-- [ Screenshot Register ] -->

Halaman registrasi pengguna baru dengan validasi email kampus.

#### Tampilan Home Feed

<!-- [ Screenshot Home Feed ] -->

Halaman utama yang menampilkan seluruh laporan kehilangan dan penemuan barang dengan filter dan pencarian.

#### Tampilan Detail Laporan Kehilangan

<!-- [ Screenshot Detail Lost ] -->

Halaman detail informasi barang hilang dengan badge merah dan tombol chat.

#### Tampilan Detail Laporan Penemuan

<!-- [ Screenshot Detail Found ] -->

Halaman detail informasi barang ditemukan dengan badge hijau dan informasi titik penitipan.

#### Tampilan Create Report

<!-- [ Screenshot Create Report ] -->

Halaman untuk membuat laporan kehilangan dan penemuan barang dengan upload foto wajib.

#### Tampilan My Posts

<!-- [ Screenshot My Posts ] -->

Halaman daftar laporan milik user dengan filter status.

#### Tampilan Profile

<!-- [ Screenshot Profile ] -->

Halaman profil pengguna dan pengelolaan akun.

#### Tampilan Dashboard Admin

<!-- [ Screenshot Admin Dashboard ] -->

Dashboard admin untuk moderasi laporan pengguna.

---

## 7. Hasil Coding

Aplikasi Cari.In dikembangkan menggunakan React Native (Expo SDK 54) dengan TypeScript strict. Backend menggunakan Supabase yang menyediakan authentication, database PostgreSQL, storage, serta realtime subscription.

### 7.1 Arsitektur Project

Aplikasi mengadopsi **arsitektur berlapis (layered architecture)** — UI layer tidak pernah berinteraksi langsung dengan database, semua operasi data melewati service layer.

```
┌──────────────────────────────────────────────────────────────┐
│                   UI Layer (27 Screens)                       │
│  Hanya menampilkan data dari state, TIDAK import supabase    │
├──────────────────────────────────────────────────────────────┤
│               Navigation Layer (React Navigation v7)         │
│  RootNavigator → branch berdasarkan auth state + user role   │
├──────────────────────────────────────────────────────────────┤
│          State Management (equivalent ViewModel)              │
│  AuthContext — auth state global                               │
│  Zustand    — feedStore (cache+filter), chatStore             │
├──────────────────────────────────────────────────────────────┤
│           Service Layer (equivalent Repository/DAO)            │
│  auth.service │ report.service │ upload.service               │
│  chat.service │ notification.service                          │
├──────────────────────────────────────────────────────────────┤
│                  Backend (Supabase)                           │
│  Auth (JWT) │ PostgreSQL + RLS │ Storage │ Realtime │ RPC    │
└──────────────────────────────────────────────────────────────┘
```

### 7.2 Tech Stack

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| Framework | Expo SDK 54 (Managed Workflow) | `~54.0.33` |
| Runtime | React Native + Hermes | `0.81.5` |
| Language | TypeScript strict | `~5.9.2` |
| Navigation | React Navigation v7 | `^7.x` |
| State | Context API + Zustand 5 | `^5.0.13` |
| Styling | NativeWind v4 (Tailwind CSS) | `^4.2.3` |
| Backend | Supabase (Auth + Postgres + Storage + Realtime) | `^2.105.3` |
| Image | expo-image-picker + Supabase Storage | `~17.0.11` |
| Storage Lokal | AsyncStorage + expo-secure-store | `2.2.0` / `~15.0.8` |

### 7.3 Potongan Kode Inti

#### a) Navigasi — Root Branching Berdasarkan Role

**Buat apa:** Menentukan navigator mana yang ditampilkan berdasarkan status login dan role user. `isLoading` mencegah "flash" LoginScreen saat session masih di-load dari storage.

```typescript
// src/navigation/index.tsx
export default function RootNavigator() {
  const { isLoading, isAuthenticated, role } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      {!isAuthenticated ? <AuthNavigator />
        : role === 'admin' ? <AdminNavigator />
        : <MainNavigator />}
    </NavigationContainer>
  );
}
```

#### b) Navigasi — Bottom Tab + FAB + Modal Stack

**Buat apa:** Tab ke-3 bukan screen biasa, tapi tombol FAB (+) yang membuka CreateModal sebagai slide-up sheet. `tabPress: e.preventDefault()` mencegah navigasi ke tab dummy.

```typescript
// src/navigation/MainNavigator.tsx
<Tab.Screen
  name="CreateTab"
  component={CreateTabPlaceholder}   // Tidak pernah di-render
  options={{
    tabBarButton: (props) => (
      <FabButton containerStyle={props.style}
        onPress={() => rootNav.navigate('CreateModal', { screen: 'CreateLost' })}
      />
    ),
  }}
  listeners={{ tabPress: (e) => { e.preventDefault(); } }}
/>

// CreateModal sebagai modal presentation
<Root.Screen name="CreateModal" component={CreateModalNavigator}
  options={{ presentation: 'modal' }} />
```

#### c) State Management — AuthContext (equivalent ViewModel)

**Buat apa:** Single source of truth untuk auth state. Subscribe ke `supabase.auth.onAuthStateChange()` supaya seluruh app otomatis re-render saat login/logout tanpa manual refresh. `mounted` flag mencegah memory leak saat async operation selesai setelah component unmount.

```typescript
// src/context/AuthContext.tsx
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Load existing session (cold start / app resume)
    async function loadInitial() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      if (data.session) {
        const profile = await fetchProfile(data.session.user.id);
        if (!mounted) return;
        setUserProfile(profile);           // Ambil role dari tabel profiles
      }
      setIsLoading(false);
    }
    void loadInitial();

    // Subscribe perubahan auth (login/logout/token refresh)
    const { data: sub } = supabase.auth.onAuthStateChange(async (_, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (newSession) {
        const profile = await fetchProfile(newSession.user.id);
        if (!mounted) return;
        setUserProfile(profile);
      } else {
        setUserProfile(null);              // Logout → reset
      }
    });

    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  // ... value, logout, refreshProfile
}
```

#### d) State Management — Zustand FeedStore (cache + debounce)

**Buat apa:** Cache data feed di memory supaya pindah tab balik tidak refetch. Search di-debounce 300ms — user ngetik "laptop" (6 huruf) menghasilkan 1 API call bukan 6.

```typescript
// src/store/feedStore.ts
const SEARCH_DEBOUNCE_MS = 300;
let searchTimer: ReturnType<typeof setTimeout> | null = null;

export const useFeedStore = create<FeedState>((set, get) => ({
  reports: [],
  loading: false,
  filter: { type: 'all', category: null, search: '' },

  async fetch() {
    set({ loading: true, error: null });
    try {
      const data = await listReports(toServiceFilter(get().filter));
      set({ reports: data, loading: false });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : 'Gagal memuat.' });
    }
  },

  setFilter(patch) {
    set((s) => ({ filter: { ...s.filter, ...patch } }));
    if (patch.search !== undefined) {
      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(() => void get().fetch(), SEARCH_DEBOUNCE_MS);
    } else {
      void get().fetch();   // type/category: langsung fetch
    }
  },
}));
```

#### e) Service Layer — Autentikasi dengan Validasi Email Kampus

**Buat apa:** Validasi domain email (`@student.unu-jogja.ac.id`) dilakukan di service layer, bukan di UI — memastikan validasi tetap berjalan meskipun ada multiple entry point. Domain divalidasi saat register saja, bukan login (admin pakai `admin@cariin.app`).

```typescript
// src/services/auth.service.ts
export async function register(payload: RegisterPayload): Promise<User> {
  if (!isValidCampusEmail(payload.email)) {
    throw new Error(EMAIL_DOMAIN_ERROR);
  }

  const { data, error } = await supabase.auth.signUp({
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    options: { data: { name: payload.name, nim: payload.nim, ... } },
  });
  if (error) throw error;
  if (!data.user) throw new Error('Registrasi gagal.');

  // DB trigger `trg_on_auth_user_created` sudah bikin row profiles.
  // Kita UPDATE untuk mengisi nim/faculty/department.
  if (data.session) {
    const { error: profileErr } = await supabase
      .from('profiles')
      .update({ name: payload.name, nim: payload.nim, ... })
      .eq('id', data.user.id);
    if (profileErr) throw new Error(profileErr.message);
  }
  return data.user;
}
```

#### f) Service Layer — CRUD Laporan (Repository Pattern)

**Buat apa:** Satu pintu untuk semua operasi database tabel `reports`. Screen TIDAK pernah import `supabase` langsung — hanya memanggil fungsi dari service. Manfaat: error handling terpusat, ganti backend cuma ubah service layer. `REPORT_SELECT` memakai PostgREST Foreign Embed (equivalent JOIN) supaya data pelapor ikut dalam satu query.

```typescript
// src/services/report.service.ts
const REPORT_SELECT = '*, reporter:user_id ( name, nim, faculty, avatar_url )';

export async function listReports(filter: ReportFilter = {}): Promise<Report[]> {
  let q = supabase.from('reports').select(REPORT_SELECT);

  if (filter.userId) q = q.eq('user_id', filter.userId);          // MyPosts
  else if (filter.status) q = q.eq('status', filter.status);      // Admin filter
  else q = q.in('status', ['approved', 'resolved']);               // Feed publik

  if (filter.type) q = q.eq('type', filter.type);
  if (filter.search) q = q.ilike('title', `%${escapeLike(filter.search)}%`);

  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) throw new Error(error.message);    // rewrap PostgrestError
  return (data ?? []) as Report[];
}
```

#### g) Service Layer — Upload Foto ke Supabase Storage

**Buat apa:** Upload gambar dari device (camera/gallery) ke cloud storage. Strategi: `expo-image-picker` dengan `base64: true` → decode ke Uint8Array → upload bytes. Lebih reliable di Android dibanding `fetch(uri) → blob()`. Foto laporan pakai `upsert: false` (banyak foto), avatar pakai `upsert: true` (satu foto per user, overwrite).

```typescript
// src/services/upload.service.ts
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function uploadReportPhoto(picked: PickImageResult, userId: string): Promise<string> {
  const path = `${userId}/${Date.now()}-${randomSuffix()}.${extFromMime(picked.mimeType)}`;
  const bytes = base64ToUint8Array(picked.base64);
  await supabase.storage.from('report-photos').upload(path, bytes, { contentType: picked.mimeType, upsert: false });
  const { data } = supabase.storage.from('report-photos').getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadAvatar(picked: PickImageResult, userId: string): Promise<string> {
  const path = `${userId}/avatar.${extFromMime(picked.mimeType)}`;
  const bytes = base64ToUint8Array(picked.base64);
  await supabase.storage.from('avatars').upload(path, bytes, { contentType: picked.mimeType, upsert: true });
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;   // cache-bust
}
```

#### h) Integrasi API — Admin Moderasi via RPC Security-Definer

**Buat apa:** Admin approve/reject memakai RPC (stored procedure), bukan direct UPDATE. Alasannya: RLS policy `reports_update_self` hanya mengizinkan owner mengupdate row sendiri. RPC dengan `SECURITY DEFINER` menjalankan function sebagai superuser, sehingga admin bisa update row manapun meskipun RLS memblokir.

```typescript
// src/services/report.service.ts — Admin functions via RPC
export async function approveReport(id: string, note?: string): Promise<void> {
  const { error } = await supabase.rpc('update_report_status', {
    p_report_id: id,
    p_new_status: 'approved',
    p_admin_note: note ?? null,
  });
  if (error) throw new Error(error.message);
}

export async function createAdminReport(input: AdminReportInput): Promise<string> {
  // Walk-in report: admin buat laporan atas nama mahasiswa yang lapor ke satpam.
  // Otomatis approved + badge "Via Admin".
  const { data, error } = await supabase.rpc('create_admin_report', {
    p_type: input.type,
    p_title: input.title,
    p_reporter_name: input.reporter_name ?? null,
    p_reporter_nim: input.reporter_nim ?? null,
    p_reporter_faculty: input.reporter_faculty ?? null,
    // ... fields lainnya
  });
  if (error) throw new Error(error.message);
  return data as string;
}
```

```sql
-- supabase-schema.sql — Security-definer function
CREATE OR REPLACE FUNCTION update_report_status(
  p_report_id UUID,
  p_new_status TEXT,
  p_admin_note TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  UPDATE reports SET
    status = p_new_status,
    admin_note = p_admin_note,
    updated_at = now()
  WHERE id = p_report_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### i) Integrasi API — Supabase Realtime (Chat)

**Buat apa:** Subscribe ke perubahan data via WebSocket — pesan baru dan notifikasi muncul real-time tanpa polling.

```typescript
// Subscribe ke INSERT baru di tabel messages
supabase
  .channel('chat-room')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages',
      filter: `conversation_id=eq.${id}` },
    (payload) => { /* tambah pesan baru ke UI */ }
  )
  .subscribe();
```

### 7.4 Statistik Codebase

| Metrik | Jumlah |
|--------|--------|
| Total file source | 60+ file TypeScript |
| Screens | 27 (22 implementasi penuh, 3 placeholder chat, 2 shared) |
| Komponen reusable | 13 |
| Service layer (Repository) | 6 file (auth, report, upload, chat, notification, supabase) |
| Context (ViewModel) | 2 (AuthContext, NotifContext) |
| Zustand store | 2 (feedStore, chatStore) |
| Tabel database | 5 (profiles, reports, conversations, messages, notifications) |
| RLS policies | 17 policies |
| RPC functions | 2 (update_report_status, create_admin_report) |
| Storage buckets | 3 (report-photos, avatars, chat-media) |
| DB triggers | 2 (trg_on_auth_user_created, trg_updated_at) |

---

## 8. Rancangan Database

Database aplikasi menggunakan PostgreSQL melalui Supabase, terdiri dari 5 tabel utama dengan Row Level Security (RLS) dan 3 storage buckets.

### 8.1 ERD (Entity Relationship Diagram)

> **ACTION ITEM:** Gambar ERD visual di draw.io / dbdiagram.io. Copy relasi di bawah.

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

Untuk menjaga keamanan data pengguna, aplikasi menggunakan JWT Authentication, Row Level Security (RLS), dan Supabase Storage Policy.

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

## 9. Progress Pengembangan

Saat laporan ini dibuat, progress pengembangan aplikasi telah mencapai tahap implementasi fitur admin dan polish UI. Dari 27 screens, 22 sudah diimplementasi penuh dan 3 screens chat masih dalam pengerjaan.

**Fitur yang telah selesai:**
- Autentikasi (login, register, forgot password, validasi email kampus, Google OAuth)
- Home feed dengan filter dan pencarian + Zustand cache & debounce
- Detail laporan (Lost & Found) dengan info pelapor dan tombol chat
- Create report dengan upload foto (camera + gallery)
- Edit dan hapus laporan + mark as resolved
- Profile pengguna + edit avatar
- Profil publik user lain (UserProfileScreen)
- Settings dan Pusat Bantuan (FAQ accordion + kontak dukungan)
- Admin Dashboard — statistik laporan + quick actions
- Admin Moderation — approve/reject dengan alasan wajib
- Admin Walk-in Reports — buat laporan atas nama mahasiswa
- Navigasi aplikasi (Stack + Tab + Drawer + Modal)
- Upload foto ke Supabase Storage (report-photos + avatars)
- Row Level Security (17 policies) + RPC functions (2)
- Service layer / Repository Pattern (6 service files)
- State management (AuthContext + NotifContext + 2 Zustand stores)

**Fitur yang masih dalam tahap pengembangan:**
- Chat real-time (InboxScreen, ChatRoomScreen — Supabase Realtime)
- Notifikasi in-app (NotificationsScreen)
- Build APK production (EAS Build)

---

## 10. Kesimpulan

Berdasarkan hasil progress pengembangan yang telah dilakukan, aplikasi Cari.In berhasil dirancang sebagai aplikasi mobile lost and found berbasis kampus menggunakan React Native (Expo SDK 54) dan Supabase.

Dari 27 screens yang dirancang, 22 telah diimplementasi penuh termasuk seluruh fitur autentikasi, feed laporan, CRUD laporan, moderasi admin, dan profil pengguna. Arsitektur aplikasi mengadopsi **layered architecture** dengan pemisahan tanggung jawab yang jelas: UI Layer → Navigation Layer → State Management (equivalent ViewModel) → Service Layer (equivalent Repository) → Backend (Supabase).

Aplikasi ini mampu membantu mahasiswa dalam melaporkan dan mencari barang hilang secara lebih terstruktur, aman, dan mudah digunakan. Fitur validasi email kampus (`@student.unu-jogja.ac.id`) meminimalisir risiko klaim palsu, sementara in-app chat melindungi privasi pengguna dari ekspos nomor HP.

Selain itu, fitur moderasi admin dan dashboard memberikan kemudahan tambahan dalam proses pengawasan laporan, serta jalur walk-in reporting via satpam memastikan aksesibilitas bagi mahasiswa yang belum menginstal aplikasi. Keamanan data dijamin melalui JWT Authentication, 17 RLS policies, 2 RPC security-definer functions, dan Storage bucket policies.

Pengembangan selanjutnya akan difokuskan pada implementasi fitur chat real-time, notifikasi in-app, dan finalisasi APK production via EAS Build.

---

## Lampiran

### A. Akun Testing

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
| Video Presentasi | [ PLACEHOLDER LINK YOUTUBE ] |

### C. Status Progress Fase

| Fase | Deskripsi | Status |
|------|-----------|--------|
| FASE 1 | Setup environment + prototype | ✅ Selesai |
| FASE 2 | Navigasi (Stack + Tab + Drawer) | ✅ Selesai |
| FASE 3 | Autentikasi (Auth screens + AuthContext) | ✅ Selesai |
| FASE 4 | Core Mahasiswa (Feed, Detail, Create, My Posts, Profile) | ✅ Selesai |
| FASE 4.5 | Chat & Notifikasi | 🔜 Progress |
| FASE 5 | Admin screens (Dashboard, Moderation, Walk-in Reports) | ✅ Selesai |
| FASE 5.5 | Polish UI (Settings, Help, UserProfile, avatar) | ✅ Selesai |
| FASE 6 | Chat real-time + Notifikasi + Build APK | 🔜 Progress |
