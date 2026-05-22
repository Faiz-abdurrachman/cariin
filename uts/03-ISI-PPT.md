# ISI SLIDE PRESENTASI UTS — Cari.In

> **Total slide: 12–15 slide**  
> **Design tool:** Canva / Google Slides / Figma  
> **Color scheme:** Zinc-900 (#18181B) primary, Red-500 (#EF4444) Lost, Emerald-500 (#22C55E) Found, Indigo-600 (#4F46E5) Admin  
> **Font:** Inter / Poppins / System default — clean & modern

---

## SLIDE 1 — Cover / Judul

**Layout:** Full-width, background gelap (#18181B)

| Elemen | Isi |
|--------|-----|
| Logo | Cari.In (besar, putih) |
| Tagline | "Cariin barangmu di kampus." |
| Subtitle | "Campus Lost & Found Application" |
| Nama | Faiz Abdurrachman |
| NIM | _(isi NIM lu)_ |
| Kelas | _(isi kelas)_ |
| Mata Kuliah | Mobile Programming — INF3105 |
| Dosen | Yana Hendriana, ST., M.Eng. |

---

## SLIDE 2 — Daftar Isi

**Layout:** Simple list, icon per section

| No | Lingkup |
|----|---------|
| 1 | Analisis Permasalahan |
| 2 | Analisis Kebutuhan |
| 3 | Referensi Desain, Survey & Observasi |
| 4 | Timeline |
| 5 | Wireframe |
| 6 | Desain Interface & Demo |
| 7 | Hasil Coding |
| 8 | Rancangan Database |

---

## SLIDE 3 — Analisis Permasalahan

**Layout:** 2 kolom — kiri: masalah (icon + text), kanan: data validasi

### Kolom Kiri — 6 Masalah Utama

```
📱  Informasi tenggelam di grup WA
🔍  Tidak ada pencarian terpusat
⚠️  Rawan klaim palsu — tidak ada verifikasi
👁️  Privasi terancam — nomor HP terekspos
📋  Format pelaporan tidak konsisten
🏢  Mahasiswa tidak sempat install — butuh jalur admin
```

### Kolom Kanan — Data Validasi

| Referensi | Data |
|-----------|------|
| Lost N Found Telkom U | 11.000+ followers Instagram |
| ITS Surabaya | 700 laporan / 9 bulan |
| Univ. Brawijaya | >50% mahasiswa pernah kehilangan |

---

## SLIDE 4 — Analisis Kebutuhan

**Layout:** 2 kolom — Kebutuhan Fungsional (kiri) + Non-Fungsional (kanan)

### Kiri — Kebutuhan Fungsional (Top 8)

| No | Fitur | Keterangan |
|----|-------|------------|
| 1 | Register & Login | Email kampus + Google OAuth |
| 2 | Laporan Kehilangan (Lost) | Foto wajib + kategori + lokasi |
| 3 | Laporan Penemuan (Found) | Foto + titik penitipan wajib |
| 4 | Feed Utama + Search | Filter kategori/tipe + keyword |
| 5 | Moderasi Admin | Approve/Reject + alasan |
| 6 | In-App Chat | Real-time, tanpa share kontak |
| 7 | Notifikasi | Laporan approved/rejected + pesan baru |
| 8 | Admin Walk-in Report | Laporan atas nama, langsung approved |

### Kanan — Kebutuhan Non-Fungsional

| Kategori | Target |
|----------|--------|
| Keamanan | JWT Auth + RLS + email domain validation |
| Performa | Loading < 2s, chat < 500ms |
| Usability | Lost=merah, Found=hijau, navigasi intuitif |
| Kompatibilitas | Android 6+ / iOS 13+ |
| Scalability | Supabase Postgres + Realtime WebSocket |

---

## SLIDE 5 — Referensi Desain, Survey & Observasi

**Layout:** 3 section vertical

### Section 1 — Studi Banding

| Aplikasi | Reach | Masalah | Pelajaran |
|----------|-------|---------|-----------|
| Lost N Found Telkom U | 11K+ IG | Manual via DM | Perlu platform khusus |
| TemuKembali UB | Ada | UI kurang intuitif | Perlu UI modern |
| Lost & Found ITS | Ada | Web-only | Mobile-first approach |

### Section 2 — Observasi

- Grup WA: info kehilangan tenggelam dalam 1-2 jam
- Papan pengumuman: jarang di-update
- Satpam: laporan verbal, tidak tercatat digital

### Section 3 — Hasil Kuesioner

> ⚠️ **ACTION ITEM:** Tambahin grafik/chart hasil kuesioner lu di sini.
> Contoh yang bisa ditampilkan:
> - Pie chart: "Pernah kehilangan barang?" (Ya/Tidak persentase)
> - Bar chart: "Barang yang paling sering hilang" (per kategori)
> - Bar chart: "Cara mencari barang hilang saat ini" (per metode)
> - Bar chart: "Minat menggunakan aplikasi lost & found" (skala 1-5)

---

## SLIDE 6 — Timeline (Gantt Chart)

**Layout:** Full-width Gantt Chart

> ⚠️ **ACTION ITEM:** Buat Gantt Chart visual (Canva/Google Sheets). Warna:
> - ✅ Hijau = sudah selesai (FASE 1-4)
> - 🔜 Biru = sedang dikerjakan
> - ⬜ Abu = belum dimulai (FASE 4.5-6)

```
Aktivitas        │ Minggu
                 │ 1  2  3  4  5  6  7  8  9
─────────────────┼─────────────────────────────
Setup + Proto    │ ██
Expo + Nav + Auth│       ████
Core Mahasiswa   │             ████
Chat & Notif     │                ██
Admin Moderation │                   ██
Polish + Build   │                      ████
```

**Milestone highlight:**
- ✅ Minggu 1-2: Prototype 26 screens HTML
- ✅ Minggu 3: FASE 1 (Setup) + FASE 2 (Navigasi)
- ✅ Minggu 4: FASE 3 (Auth screens lengkap)
- ✅ Minggu 5: FASE 4 (Core mahasiswa: feed + detail + create + profile)
- 🔜 Minggu 6-9: FASE 4.5-6 (Chat, Admin, Polish, Build APK)

---

## SLIDE 7 — Wireframe

**Layout:** Grid 3x3 screenshot prototype HTML

> ⚠️ **ACTION ITEM:** Screenshot 9 screen utama dari cariin-lf.vercel.app, taruh dalam grid.

**9 Screen yang ditampilkan:**

| Posisi | Screen | Keterangan |
|--------|--------|------------|
| 1,1 | Splash | Logo + tagline |
| 1,2 | Login | Form email + password |
| 1,3 | Register | Form lengkap + validasi domain |
| 2,1 | Home Feed | List laporan + filter + search |
| 2,2 | Detail Lost | Info kehilangan + badge merah |
| 2,3 | Create Report | Form + upload foto |
| 3,1 | Chat | Percakapan real-time |
| 3,2 | Admin Dashboard | Stat cards + pending list |
| 3,3 | Profile | Data user + laporanku |

**Caption bawah:**
"Prototype lengkap 26 screens: https://cariin-lf.vercel.app/"

---

## SLIDE 8 — Desain Interface (Implementasi RN)

**Layout:** 2 kolom — kiri: before (prototype HTML), kanan: after (React Native app screenshot)

> ⚠️ **ACTION ITEM:** Screenshot app dari Expo Go/iPhone, side-by-side dengan prototype HTML.

### Side-by-Side Comparison

| Prototype (HTML) | Implementasi (React Native) |
|------------------|----------------------------|
| Screenshot Login HTML | Screenshot Login RN |
| Screenshot Home HTML | Screenshot Home RN |
| Screenshot Detail HTML | Screenshot Detail RN |
| Screenshot Create HTML | Screenshot Create RN |

**Caption:**
"Implementasi menggunakan Expo SDK 54, React Native 0.81, NativeWind v4 (Tailwind CSS), TypeScript strict. Semua 14 screen utama sudah berjalan di device."

---

## SLIDE 9 — Desain Interface — Design System

**Layout:** Color palette + UI conventions

### Color Palette (visual swatches)

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Primary  │ │   Lost   │ │  Found   │ │  Admin   │ │ Pending  │ │ Resolved │
│ #18181B  │ │ #EF4444  │ │ #22C55E  │ │ #4F46E5  │ │ #F59E0B  │ │ #8B5CF6  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

### 8 Kategori Barang

```
💻 Elektronik    📄 Dokumen      👜 Dompet/Tas    🔑 Kunci
💍 Aksesoris     👕 Pakaian      📚 Buku/ATK     📦 Lainnya
```

### UI Conventions

| Elemen | Spesifikasi |
|--------|-------------|
| Card border radius | 24px (rounded-3xl) |
| Input/Button radius | 16px (rounded-2xl) |
| Shadow | elevation: 2 (Android) |
| Spacing | kelipatan 4px |
| Framework | NativeWind v4 (Tailwind CSS for RN) |

---

## SLIDE 10 — Hasil Coding

**Layout:** Code snippet (dark theme) + arsitektur diagram

### Arsitektur Layer

```
┌─────────────────────────────────────────────┐
│                  SCREENS                     │  26 screen components
│         (React Native + NativeWind)          │
├─────────────────────────────────────────────┤
│               NAVIGATION                     │  React Navigation v7
│     Stack (Auth) + Tab (Main) + Drawer (Admin)│
├─────────────────────────────────────────────┤
│     STATE MANAGEMENT                        │  Context API + Zustand
│     AuthContext | feedStore | chatStore      │
├─────────────────────────────────────────────┤
│            SERVICE LAYER                     │  Supabase wrappers
│   auth | report | upload | chat | notif      │
├─────────────────────────────────────────────┤
│              BACKEND                         │  Supabase
│  Auth (JWT) + Postgres + Storage + Realtime  │
└─────────────────────────────────────────────┘
```

### Code Snippet — Pilih 1-2 yang Paling Representatif

**Snippet 1: Validasi Email Kampus**
```typescript
export const ALLOWED_DOMAIN = 'student.unu-jogja.ac.id';
export const isValidCampusEmail = (email: string): boolean => {
  return email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
};
```

**Snippet 2: CRUD dengan RLS**
```typescript
export async function listReports(filter: ReportFilter = {}): Promise<Report[]> {
  let q = supabase.from('reports').select('*, reporter:user_id(name,nim,faculty)');
  if (!filter.userId) q = q.in('status', ['approved', 'resolved']);
  if (filter.type) q = q.eq('type', filter.type);
  if (filter.search) q = q.ilike('title', `%${filter.search}%`);
  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
```

### Statistik

| Metrik | Jumlah |
|--------|--------|
| Total file TypeScript | 60+ |
| Screens diimplementasi | 14 dari 26 |
| Komponen reusable | 13 |
| Service layer | 6 file |
| RLS policies | 17 |
| TypeScript strict | ✅ Zero error |

---

## SLIDE 11 — Rancangan Database

**Layout:** ERD diagram visual (besar, full slide)

> ⚠️ **ACTION ITEM:** Buat ERD visual di draw.io / dbdiagram.io. Desain yang bersih dan mudah dibaca.

### ERD Visual

```
                  ┌─────────────────┐
                  │   auth.users    │
                  │   id (PK)       │
                  │   email         │
                  └────────┬────────┘
                           │ 1:1
                  ┌────────▼────────┐
                  │    profiles     │
                  │ id (PK, FK)     │
                  │ name, nim       │
                  │ role            │
                  │ faculty         │
                  └──┬─────┬───────┘
                     │     │
            1:N      │     │ 1:N
     ┌──────────────▼─┐   ┌▼──────────────────┐
     │    reports      │   │  notifications    │
     │ id (PK)         │   │  id (PK)          │
     │ user_id (FK)    │   │  user_id (FK)     │
     │ type            │   │  type, title      │
     │ title, category │   │  is_read          │
     │ status          │   └───────────────────┘
     │ location        │
     │ photo_url       │
     └───────┬─────────┘
             │ 1:N
     ┌───────▼─────────┐
     │ conversations   │
     │ id (PK)         │
     │ report_id (FK)  │
     │ user_a_id (FK)  │
     │ user_b_id (FK)  │
     └───────┬─────────┘
             │ 1:N
     ┌───────▼─────────┐
     │    messages     │
     │ id (PK)         │
     │ conversation_id │
     │ sender_id (FK)  │
     │ content         │
     │ is_read         │
     └─────────────────┘
```

### Tabel Ringkasan

| Tabel | Kolom Utama | Relasi |
|-------|-------------|--------|
| `profiles` | id, name, nim, role, faculty | 1:1 dengan auth.users |
| `reports` | id, user_id, type, title, category, status, photo_url | N:1 profiles |
| `conversations` | id, report_id, user_a_id, user_b_id | N:1 reports, N:M profiles |
| `messages` | id, conversation_id, sender_id, content | N:1 conversations |
| `notifications` | id, user_id, type, title, body | N:1 profiles |

### Row Level Security

- 17 policy mengatur akses SELECT/INSERT/UPDATE/DELETE per tabel
- Mahasiswa hanya akses data milik sendiri
- Admin bisa akses semua data
- Feed publik hanya tampilkan laporan approved/resolved

---

## SLIDE 12 — Demo Aplikasi (Video Embed / Live)

**Layout:** Full-screen video atau link YouTube

**Isi slide:**
- Link video demo YouTube
- QR code ke video (opsional)

> Catatan: Di presentasi, ini bagian lu langsung tunjukin app di device / screen recording yang udah lu rekam terpisah. Bisa juga edit jadi 1 video dengan slide.

---

## SLIDE 13 — Next Steps

**Layout:** Roadmap visual

### Yang Sudah Selesai ✅

- FASE 1: Setup Project (Expo + NativeWind + TS + Supabase)
- FASE 2: Fondasi Navigasi (Stack + Tab + Drawer + AuthContext)
- FASE 3: Auth Screens (Splash, Login, Register, ForgotPassword)
- FASE 4: Core Mahasiswa (Home, Detail, Create, MyPosts, Profile)

### Yang Akan Dikerjakan 🔜

- FASE 4.5: Chat Realtime (Supabase Realtime + Inbox + ChatRoom)
- FASE 5: Admin Screens (Dashboard + Moderation + Walk-in Reports)
- FASE 6: Polish (Settings, Help, Avatar, Animasi) + EAS Build APK

---

## SLIDE 14 — Terima Kasih

**Layout:** Simple, clean

| Elemen | Isi |
|--------|-----|
| Text besar | "Terima Kasih" |
| Subtitle | "Cari.In — Campus Lost & Found" |
| Nama | Faiz Abdurrachman |
| Contact | Email + GitHub |

---

## 📋 CHECKLIST SEBELUM JADI

- [ ] Semua slide punya visual (bukan text doank)
- [ ] Screenshot app dari Expo Go sudah diambil (minimal 8 screen)
- [ ] Screenshot prototype HTML sudah diambil (minimal 9 screen)
- [ ] ERD diagram sudah dibuat di draw.io / dbdiagram.io
- [ ] Gantt Chart sudah dibuat visual
- [ ] Grafik hasil kuesioner sudah dibuat (Google Form → chart)
- [ ] Color palette swatches ada di slide Design System
- [ ] Code snippet ditampilkan dengan dark background + syntax highlighting
- [ ] Link prototype Vercel ada di slide Wireframe
- [ ] Total slide 12-15, tidak lebih
