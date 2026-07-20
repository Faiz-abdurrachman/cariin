# LAPORAN UAS — Pemrograman Berorientasi Objek (PBO)

## Cari.In: Aplikasi Lost & Found Kampus Berbasis Mobile dengan Arsitektur OOP

> **Mata Kuliah:** Pemrograman Berorientasi Objek (PBO)
> **Program Studi:** Informatika — UNU Yogyakarta
> **Semester:** 4 (Genap 2025/2026)
> **Dosen Pengampu:** Septian Rico Hernawan, S. Kom., M. Eng.

### Anggota Kelompok

| No | Nama | NIM | Peran |
|----|------|-----|-------|
| 1 | Irham Zubaidi Alhuda | 241111006 | Analisis kebutuhan, dokumentasi laporan |
| 2 | Galih Witradika | 241111013 | Perancangan sistem, pengujian, UML |
| 3 | Faiz Abdurrachman | 241111021 | Full-stack development, implementasi OOP |
| 4 | Ibnul Mubarok | 241111026 | Penyusunan laporan progress, pengujian user flow admin, dokumentasi skenario testing |
| 5 | Imroatu Zakkiyah | 241111032 | Penyebaran & pengolahan data kuesioner (39 responden), dokumentasi laporan, materi presentasi |
| 6 | Aldo Yulian Widyadewangga | 241111037 | Perancangan design system & 10+ komponen UI reusable, pembuatan 26 screen prototype HTML, deployment Vercel |

---

## DAFTAR ISI

1. Pendahuluan
2. Konsep OOP yang Diterapkan (Inti PBO)
3. Class Diagram (UML)
4. Arsitektur Sistem Berlapis
5. Struktur Database & Pemetaan Objek
6. Implementasi Fitur
7. Teknologi & Tools
8. Pengujian
9. Kesimpulan
10. Lampiran: Peta File OOP

---

## BAB 1 — PENDAHULUAN

### 1.1 Latar Belakang

Mahasiswa UNU Yogyakarta sering kehilangan barang di lingkungan kampus. Berdasarkan survei terhadap responden mahasiswa, ditemukan bahwa mayoritas pernah kehilangan barang (kunci kendaraan, charger, dompet), dan penanganannya masih manual — bertanya ke satpam atau menyebar info di grup WhatsApp. Cara ini punya banyak masalah: informasi cepat tenggelam, tidak ada verifikasi identitas (rawan klaim palsu), dan nomor HP pribadi terekspos di grup publik.

### 1.2 Rumusan Masalah

1. Bagaimana merancang sistem Lost & Found kampus yang terpusat dan terstruktur?
2. Bagaimana menerapkan konsep **Pemrograman Berorientasi Objek (OOP)** pada aplikasi mobile ini?
3. Bagaimana memetakan entitas dunia nyata (User, Laporan) menjadi objek dan kelas yang dapat digunakan ulang?

### 1.3 Solusi: Cari.In

**Cari.In** adalah aplikasi mobile Lost & Found yang menyelesaikan masalah di atas melalui: verifikasi email kampus, moderasi admin, chat in-app realtime (tanpa ekspos nomor HP), dan database terstruktur. Dari sisi teknis, aplikasi dibangun dengan **arsitektur berorientasi objek**: entitas domain (User, Report) dimodelkan sebagai hierarki kelas dengan penerapan 4 pilar OOP.

### 1.4 Tujuan

- Membangun aplikasi lost & found fungsional yang menyelesaikan masalah nyata.
- **Menerapkan dan membuktikan 4 pilar OOP** (Encapsulation, Inheritance, Polymorphism, Abstraction) dalam kode yang benar-benar berjalan.
- Menunjukkan pemisahan tanggung jawab (separation of concerns) melalui arsitektur berlapis.

---

## BAB 2 — KONSEP OOP YANG DITERAPKAN (INTI PBO)

Aplikasi ditulis dengan **TypeScript**, bahasa yang mendukung OOP secara penuh (class, inheritance, abstract, access modifier). Model domain OOP berada di folder **`src/models/`** dan benar-benar digunakan oleh aplikasi (bukan kode mati).

### 2.1 Abstraction (Abstraksi)

**Definisi:** Menyembunyikan detail implementasi dan hanya mengekspos kontrak/blueprint. Diwujudkan dengan `abstract class` yang tidak bisa di-instansiasi langsung.

**Bukti kode — `src/models/User.ts`:**

```typescript
export abstract class User {
  // ... field private ...

  // Kontrak yang WAJIB diimplementasi tiap subclass:
  abstract get role(): UserRole;
  abstract getRoleLabel(): string;
  abstract canModerate(): boolean;
}
```

  `new User()` akan **error** — `User` hanya blueprint. Objek nyata dibuat lewat subclass `Mahasiswa` atau `Admin`.

### 2.2 Encapsulation (Enkapsulasi)

**Definisi:** Membungkus data (field) agar tidak bisa diakses/diubah sembarangan dari luar. Akses dikontrol lewat *getter/setter*.

**Bukti kode — `src/models/User.ts`:**

```typescript
export abstract class User {
  private readonly _id: string;      // field PRIVATE — tidak bisa diakses dari luar
  private _name: string;

  get id(): string { return this._id; }       // getter: akses read-only
  get name(): string { return this._name; }

  set name(value: string) {                    // setter: dengan VALIDASI
    if (value.trim().length === 0) throw new Error('Nama tidak boleh kosong.');
    this._name = value.trim();
  }
}
```

Field `_id` bersifat `private readonly` — kode luar tidak bisa membaca/menimpanya langsung, hanya lewat getter. Setter `name` memvalidasi input sebelum menyimpan.

**Enkapsulasi tingkat arsitektur:** Komponen UI tidak pernah menyentuh database langsung. Seluruh operasi data dibungkus di *service layer* (`src/services/`). Contoh: UI memanggil `reportService.approveReport(id)` tanpa tahu detail query Supabase.

### 2.3 Inheritance (Pewarisan)

**Definisi:** Subclass mewarisi sifat & method superclass, lalu bisa menambah/mengubah perilaku.

**Bukti kode — `src/models/Mahasiswa.ts` & `src/models/Admin.ts`:**

```typescript
export class Mahasiswa extends User {          // mewarisi User
  get role(): UserRole { return 'mahasiswa'; }
  getRoleLabel(): string { return 'Mahasiswa'; }
  canModerate(): boolean { return false; }
}

export class Admin extends User {              // mewarisi User
  get role(): UserRole { return 'admin'; }
  getRoleLabel(): string { return 'Administrator'; }
  canModerate(): boolean { return true; }Encapsulation

  // Method KHUSUS Admin — tidak dimiliki User/Mahasiswa:
  async approveReport(reportId: string, note?: string): Promise<void> {
    await reportService.approveReport(reportId, note);
  }
  async rejectReport(reportId: string, reason: string): Promise<void> {
    await reportService.rejectReport(reportId, reason);
  }
}
```

`Mahasiswa` dan `Admin` sama-sama mewarisi `User` (memakai field & getter yang sama), tetapi `Admin` **menambah** kemampuan `approveReport()` dan `rejectReport()`.

Hal serupa pada hierarki laporan (`src/models/Report.ts`): `LostReport` dan `FoundReport` sama-sama `extends ReportModel`.

### 2.4 Polymorphism (Polimorfisme)

**Definisi:** Method dengan nama sama berperilaku berbeda tergantung objeknya.

**Bukti 1 — `canModerate()` (User):** Mahasiswa mengembalikan `false`, Admin mengembalikan `true`. Method sama, hasil beda.

**Bukti 2 — `validate()` pada hierarki Report (`src/models/Report.ts`):**

```typescript
export class LostReport extends ReportModel {
  validate(): string | null {
    if (this._title.trim().length === 0) return 'Judul laporan wajib diisi.';
    if (this._location.trim().length === 0) return 'Lokasi terakhir terlihat wajib diisi.';
    return null;                               // Lost TIDAK butuh titik penitipan
  }
}

export class FoundReport extends ReportModel {
  validate(): string | null {
    if (this._title.trim().length === 0) return 'Judul laporan wajib diisi.';
    if (this._location.trim().length === 0) return 'Lokasi penemuan wajib diisi.';
    if (this._custodyPoint.trim().length === 0) {
      return 'Titik penitipan wajib diisi untuk barang temuan.';   // Found WAJIB titik penitipan
    }
    return null;
  }
}
```

Method `validate()` **berperilaku berbeda**: `FoundReport` mewajibkan `custodyPoint`, `LostReport` tidak. Polimorfisme ini **benar-benar dipakai** di layar `CreateReportScreen.tsx` melalui factory `createReportModel(type, ...)` yang memilih subclass sesuai tipe laporan saat runtime.

### 2.5 Ringkasan Pemetaan Pilar → Kode

| Pilar OOP | Wujud di Kode | Lokasi |
|-----------|---------------|--------|
| **Abstraction** | `abstract class User`, `abstract class ReportModel`, abstract method | `models/User.ts`, `models/Report.ts` |
| **Encapsulation** | field `private readonly` + getter/setter validasi; service layer | `models/User.ts`, `services/` |
| **Inheritance** | `Mahasiswa`/`Admin extends User`; `Lost`/`FoundReport extends ReportModel` | `models/Mahasiswa.ts`, `Admin.ts`, `Report.ts` |
| **Polymorphism** | `canModerate()`, `validate()` override berbeda per subclass | `models/*` + dipakai di `AdminNavigator`, `CreateReportScreen` |

---

## BAB 3 — CLASS DIAGRAM (UML)

### 3.1 Hierarki User

```
              ┌─────────────────────────────┐
              │      «abstract» User         │
              ├─────────────────────────────┤
              │ - _id: string               │
              │ - _name: string             │
              │ - _email: string            │
              │ - _nim: string | null       │
              │ - _faculty: string | null   │
              ├─────────────────────────────┤
              │ + get id() / name() / ...    │
              │ + set name(value)           │
              │ + get initial()             │
              │ «abstract» + role()         │
              │ «abstract» + getRoleLabel() │
              │ «abstract» + canModerate()  │
              └─────────────┬───────────────┘
                            │ (inheritance)
             ┌──────────────┴───────────────┐
             ▼                               ▼
┌────────────────────────┐      ┌──────────────────────────────┐
│      Mahasiswa          │      │            Admin              │
├────────────────────────┤      ├──────────────────────────────┤
│ + canModerate(): false  │      │ + canModerate(): true         │
│ + canPublishDirectly()  │      │ + approveReport(id, note)     │
│   : false               │      │ + rejectReport(id, reason)    │
└────────────────────────┘      │ + canPublishDirectly(): true  │
                                 └──────────────────────────────┘
```

### 3.2 Hierarki Report

```
              ┌───────────────────────────────┐
              │    «abstract» ReportModel      │
              ├───────────────────────────────┤
              │ # _title / _category          │
              │ # _location / _description    │
              ├───────────────────────────────┤
              │ + get title() / category()...  │
              │ «abstract» + type()           │
              │ «abstract» + getTypeLabel()   │
              │ «abstract» + validate()       │
              └───────────────┬───────────────┘
                              │ (inheritance)
             ┌────────────────┴────────────────┐
             ▼                                  ▼
┌────────────────────────┐        ┌────────────────────────────┐
│      LostReport         │        │        FoundReport          │
├────────────────────────┤        ├────────────────────────────┤
│ + type(): 'lost'        │        │ - _custodyPoint: string     │
│ + validate()            │        │ + type(): 'found'           │
│   (tanpa custodyPoint)  │        │ + validate()                │
└────────────────────────┘        │   (WAJIB custodyPoint)      │
                                   └────────────────────────────┘
```

> Diagram dapat dibuat versi grafis dengan tools seperti draw.io / PlantUML memakai definisi di atas.

---

## BAB 4 — ARSITEKTUR SISTEM BERLAPIS

Aplikasi memakai **three-layer architecture** yang memperkuat prinsip enkapsulasi dan abstraksi:

```
┌──────────────────────────────────────────────────┐
│  PRESENTATION LAYER  (src/screens, src/components) │
│  - UI, hanya memanggil method deklaratif           │
└───────────────────────┬──────────────────────────┘
                        │ (memanggil, tanpa tahu detail)
┌───────────────────────▼──────────────────────────┐
│  DOMAIN / SERVICE LAYER                            │
│  - src/models  → objek domain (User, Report)       │
│  - src/services → abstraksi akses data (Supabase)  │
│  - src/store, src/context → state management       │
└───────────────────────┬──────────────────────────┘
                        │ (query terenkapsulasi)
┌───────────────────────▼──────────────────────────┐
│  DATA LAYER  (Supabase: PostgreSQL + RLS + Storage)│
└──────────────────────────────────────────────────┘
```

**Manfaat OOP dari pemisahan ini:** Jika suatu saat backend diganti (misal dari Supabase ke lainnya), cukup mengubah *service layer*; UI tidak perlu diubah karena hanya mengenal *interface* method (contoh: `reportService.listReports()`). Inilah abstraksi dan enkapsulasi tingkat arsitektur.

---

## BAB 5 — STRUKTUR DATABASE & PEMETAAN OBJEK

Model objek dipetakan ke tabel relasional PostgreSQL (Supabase). Pemetaan objek → tabel inilah alasan memilih database **relasional** (bukan NoSQL).

| Objek / Kelas | Tabel | Relasi |
|---------------|-------|--------|
| `User` (Mahasiswa/Admin) | `profiles` | 1-1 dengan `auth.users` |
| `ReportModel` (Lost/Found) | `reports` | 1 user → N reports |
| Percakapan | `conversations` | 1 report → N conversations |
| Pesan | `messages` | 1 conversation → N messages |
| Notifikasi | `notifications` | 1 user → N notifications |

**Keamanan:** 5 tabel dilindungi Row Level Security (RLS), 4 trigger otomatis, dan 2 fungsi RPC `SECURITY DEFINER` (`update_report_status`, `create_admin_report`) untuk operasi admin.

---

## BAB 6 — IMPLEMENTASI FITUR

### 6.1 Mahasiswa
- Register/Login dengan email kampus (`@student.unu-jogja.ac.id`), autentikasi JWT.
- Feed laporan publik: filter tipe/kategori + search (debounce 300ms).
- Buat laporan Lost/Found (upload foto) — **validasi via model OOP** `LostReport`/`FoundReport.validate()`.
- Kelola laporan sendiri (edit, hapus, tandai selesai).
- Chat realtime + notifikasi in-app.
- Profil + upload avatar, pengaturan, bantuan.

### 6.2 Admin
- **Drawer Navigator** (menu geser kiri): Beranda, Tentang Cari.In, Keluar.
- Dashboard: statistik + tab Pending/Aktif/Selesai.
- Moderasi laporan: approve/reject (via `Admin.approveReport()` / `rejectReport()`).
- Walk-in report: buat laporan atas nama mahasiswa (langsung approved).

### 6.3 Penggunaan Nyata Model OOP
- `AuthContext` membangun instance `Mahasiswa`/`Admin` (`createUserModel`) untuk user aktif; drawer admin menampilkan `currentUser.getRoleLabel()` (**polimorfisme di UI**).
- `CreateReportScreen` memvalidasi form dengan `createReportModel(type, ...).validate()` (**polimorfisme Lost vs Found**).

---

## BAB 7 — TEKNOLOGI & TOOLS

| Layer | Teknologi |
|-------|-----------|
| Framework | React Native 0.81 (Expo SDK 54, Managed Workflow) |
| Bahasa | TypeScript 5.9 (strict mode) — mendukung OOP penuh |
| Navigasi | React Navigation v7 — **Stack + Bottom Tab + Drawer** |
| State | Context API + Zustand v5 |
| Backend | Supabase (Auth + PostgreSQL + Storage + Realtime) |
| Keamanan token | **SecureStore** (JWT terenkripsi di Keychain/Keystore) |
| Offline cache | AsyncStorage (persist feed) |
| Kualitas kode | TypeScript strict, ESLint v9, Prettier |

---

## BAB 8 — PENGUJIAN

### 8.1 Pengujian Statis (Kualitas Kode)

| Cek | Hasil |
|-----|-------|
| `tsc --noEmit` (type check) | ✅ 0 error |
| `eslint` | ✅ 0 error, 0 warning |
| `expo-doctor` | ✅ 18/18 checks passed |

### 8.2 Pengujian Fungsional (Manual)

Diuji manual di perangkat via Expo Go, mencakup: auth (login/register/validasi), CRUD laporan, chat realtime, moderasi admin, Drawer navigator, persistensi sesi (SecureStore), dan cache offline. Rincian langkah pada `TESTING-MANUAL.md`.

---

## BAB 9 — KESIMPULAN

1. Cari.In berhasil menjadi solusi lost & found kampus yang terpusat, aman, dan terstruktur.
2. **Keempat pilar OOP diterapkan dan dibuktikan di kode nyata** (`src/models/`): abstraksi (abstract class), enkapsulasi (private field + getter/setter + service layer), pewarisan (`extends`), dan polimorfisme (`validate()`, `canModerate()` yang override).
3. Pemodelan objek (User, Report) dipetakan rapi ke database relasional, memperkuat argumen pemilihan PostgreSQL.
4. Arsitektur berlapis membuat kode modular, mudah dirawat, dan mudah diuji — sesuai prinsip OOP.

---

## LAMPIRAN — PETA FILE OOP

| File | Peran OOP |
|------|-----------|
| `src/models/User.ts` | Abstract class `User` — abstraksi + enkapsulasi |
| `src/models/Mahasiswa.ts` | `extends User` — pewarisan + polimorfisme |
| `src/models/Admin.ts` | `extends User` + method khusus — pewarisan + polimorfisme |
| `src/models/Report.ts` | Abstract `ReportModel` + `LostReport`/`FoundReport` — polimorfisme |
| `src/models/index.ts` | Factory `createUserModel()`, `createReportModel()` |
| `src/context/AuthContext.tsx` | Membuat & memakai instance `Mahasiswa`/`Admin` |
| `src/screens/main/CreateReportScreen.tsx` | Memakai `Report.validate()` (polimorfisme) |
| `src/navigation/AdminNavigator.tsx` | Memakai `currentUser.getRoleLabel()` (polimorfisme) |
| `src/services/*.ts` | Enkapsulasi akses data (abstraksi Supabase) |

---

> Dokumen ini disusun berdasarkan kondisi kode terkini (branch `main`). Seluruh klaim OOP dapat diverifikasi langsung dengan membuka file yang dirujuk pada tabel lampiran.
