# 📘 PANDUAN PRESENTASI PBO — Cari.In

> **Buat:** Faiz (241111021)  
> **Tujuan:** Panduan lengkap jelasin 4 pilar OOP dari basic sampai kode  
> **Cara pakai:** Baca urut, pahamin analoginya, latian jelasin pake suara keras

---

## 📌 DAFTAR ISI

1. [OOP Itu Apa?](#1-oop-itu-apa)
2. [Abstraction (Abstraksi)](#2-abstraction-abstraksi)
3. [Encapsulation (Enkapsulasi)](#3-encapsulation-enkapsulasi)
4. [Inheritance (Pewarisan)](#4-inheritance-pewarisan)
5. [Polymorphism (Polimorfisme)](#5-polymorphism-polimorfisme)
6. [Hubungan 4 Pilar + Project](#6-hubungan-4-pilar--project)
7. [Naskah Presentasi 5 Menit](#7-naskah-presentasi-5-menit)
8. [Q&A Siap Tempur](#8-qa-siap-tempur)
9. [Glosarium Istilah](#9-glosarium-istilah)

---

## 1. OOP Itu Apa?

### Pengertian Paling Dasar

**OOP (Object-Oriented Programming)** = cara nulis kode dengan cara **memandang semuanya sebagai "objek"**.

### Analogi Dunia Nyata

Coba lo pikirin **mobil**:

| Konsep OOP | Mobil |
|------------|-------|
| **Class** | Cetakan / blueprint mobil |
| **Object** | Mobil beneran yang bisa lo jalanin |
| **Property** | Warna, merek, tahun |
| **Method** | Gas, rem, belok |

### Kenapa OOP?

| Tanpa OOP | Dengan OOP |
|-----------|------------|
| Kode 1 file panjang (spageti) | Kode terpisah per class |
| Reusability rendah | Class bisa dipake ulang |
| Nyari bug susah | Error terisolasi per class |
| Gak mirip dunia nyata | Struktur kode mirip entitas nyata |

### Di Project Cari.In

Di Cari.In, kita punya entitas dunia nyata yang langsung dipetakan jadi class:

```
DUNIA NYATA              →      CLASS / OBJEK
──────────────────────────────────────────────
Mahasiswa / Admin         →      Mahasiswa extends User
                                    Admin extends User
Laporan Hilang / Temuan   →      LostReport extends ReportModel
                                    FoundReport extends ReportModel
Percakapan 2 user         →      Tabel conversations
Pesan                      →      Tabel messages
```

> 💡 **Intinya:** OOP bikin kode lo mirip cara lo mikir sehari-hari. Gak perlu "terjemahan" antara masalah nyata ke kode.

---

## 2. ABSTRACTION (Abstraksi)

### 🧠 Pengertian (Pake Bahasa Lo)

> *"Nyembunyiin detail yang ribet, yang kelihatan cuma fitur pentingnya aja."*

### 📱 Analogi Sehari-hari

**Remote TV:**
- Lo pencet tombol "Volume Up" → suara ngegas
- Lo **gak perlu tau** cara kerjanya (sinyal infrared, resistor, transistor)
- Lo cuma tau: tombol ini buat gedein volume

**Abstraction = remote TV.**
Fungsinya kelihatan, detail implementasinya disembunyiin.

### 💻 Implementasi di Cari.In

#### Abstraction Level 1 — `abstract class User`

```typescript
// src/models/User.ts

export abstract class User {
  // 🔽 METHOD YANG UDAH JADI (implementasi konkret)
  get initial(): string {
    return this._name.trim().charAt(0).toUpperCase() || '?';
  }

  // 🔽 METHOD YANG MASIH ABSTRACT (blueprint doang)
  abstract get role(): UserRole;
  abstract getRoleLabel(): string;
  abstract canModerate(): boolean;
}
```

> **Cara bacanya:**  
> `abstract` di depan class → "ini blueprint, gak bisa di-instance langsung"  
> `abstract get role()` → "setiap anak wajib punya method ini"

#### Abstraction Level 2 — `abstract class ReportModel`

```typescript
// src/models/Report.ts

export abstract class ReportModel {
  protected readonly _title: string;
  protected readonly _category: CategoryId;
  protected readonly _location: string;

  // Method yang udah jadi — semua subclass pake ini
  get title(): string { return this._title; }

  // Method abstract — WAJIB diimplementasi subclass
  abstract validate(): string | null;
  abstract get type(): ReportType;
  abstract getTypeLabel(): string;
}
```

#### Abstraction Level 3 — Service Layer

```typescript
// src/services/report.service.ts

// 🔽 UI cuma panggil method ini. Gak peduli isinya.
export async function listReports(filter: ReportFilter): Promise<Report[]> {
  let q = supabase.from('reports').select(REPORT_SELECT);
  if (filter.type) q = q.eq('type', filter.type);
  if (filter.search) q = q.ilike('title', `%${filter.search}%`);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}
```

### 🎤 Cara Jelasin ke Dosen

**Buka file:** `src/models/User.ts`

> *"Ini contoh abstraction pak. `User` adalah abstract class — dia cuma **blueprint**. Coba ketik `new User()`, pasti error. Soalnya abstract class gak bisa di-instance langsung."*
>
> *"Fungsinya: **memaksa** setiap subclass (`Mahasiswa` dan `Admin`) untuk punya method `role()`, `getRoleLabel()`, dan `canModerate()`. Kalo lupa, TypeScript langsung teriak error."*
>
> *"Abstraction juga ada di **service layer**. Screen kayak `HomeScreen` cuma panggil `reportService.listReports()` — gak peduli itu query ke tabel apa pake filter apa. Detailnya disembunyiin. Kalo suatu saat backend ganti dari Supabase ke API lain, tinggal ganti isi service-nya, screen gak perlu diotak-atik."*

---

## 3. ENCAPSULATION (Enkapsulasi)

### 🧠 Pengertian (Pake Bahasa Lo)

> *"Data dibungkus rapet biar gak bisa diotak-atik sembarangan. Akses cuma lewat pintu yang udah ditentuin."*

### 📱 Analogi Sehari-hari

**Brankas di bank:**
- Uang (`_id`, `_name`) disimpen di dalem brankas (`private`)
- Nasabah gak bisa langsung ambil uang
- Harus lewat teller (`getter`) buat liat saldo
- Kalo mau narik uang, ada validasi (`setter`): "Saldo mencukupi?"

**Encapsulation = brankas + teller.**
Data aman, akses terkontrol.

### 💻 Implementasi di Cari.In

```typescript
// src/models/User.ts

export abstract class User {
  // 🔒 DATA DIRAHASIAKAN — private, gak bisa diakses dari luar
  private readonly _id: string;
  private _name: string;

  // 🚪 PINTU MASUK — getter (hanya baca)
  get id(): string { return this._id; }
  get name(): string { return this._name; }

  // 🚪 PINTU KELUAR — setter (bisa ubah, tapi ada validasi)
  set name(value: string) {
    if (value.trim().length === 0)                      // 🔍 Validasi
      throw new Error('Nama tidak boleh kosong.');
    this._name = value.trim();
  }
}
```

**Apa yang terjadi kalo gak pake encapsulation:**

```typescript
// ❌ TANPA ENCAPSULATION — field publik
class User {
  id: string;    // Sembarang orang bisa ubah
  name: string;  // Sembarang orang bisa set name = ''
}

// Kode di screen lain bisa ngaco:
user.id = 'random-id';     // ✅ Gak dicegah!
user.name = '';            // ✅ Gak dicegah! Data jadi kosong
```

```typescript
// ✅ DENGAN ENCAPSULATION — field private
class User {
  private readonly _id: string;  // Gak bisa diubah dari luar
  private _name: string;

  set name(value: string) {
    if (value.trim().length === 0)  // 🚫 Ditolak!
      throw new Error('Nama tidak boleh kosong.');
    this._name = value.trim();
  }
}

// Kode di screen lain:
user.name = '';  // ❌ Error: "Nama tidak boleh kosong."
```

### Enkapsulasi Tingkat Arsitektur

```typescript
// ❌ BURUK — screen akses database langsung
function HomeScreen() {
  const { data } = await supabase.from('reports').select('*');  // 😱
}

// ✅ BAIK — screen lewat service layer
function HomeScreen() {
  const reports = await reportService.listReports(filter);  // 👍 Bersih
}
```

### 🎤 Cara Jelasin ke Dosen

**Buka file:** `src/models/User.ts`

> *"Encapsulation pak. Field `_id` dan `_name` itu **private** — dari luar class, gak bisa diakses langsung. Coba lo ketik `user._id` di screen lain, TypeScript bakal error."*
>
> *"Satu-satunya cara baca data adalah lewat **getter**: `user.id`, `user.name`."*
>
> *"Kalo mau ngubah `name`, ada **setter** yang nge-validasi dulu. Kalo dikirim string kosong, bakal **throw error**. Jadi data `name` gak bakal pernah kosong selama aplikasi jalan."*
>
> *"Ini juga diterapkan di arsitektur — UI gak pernah manggil Supabase langsung. Semua akses data dibungkus di **service layer**. Kalo ada bug di query, lo tau harus cek di `src/services/`, bukan nyari di 20 screen berbeda."*

---

## 4. INHERITANCE (Pewarisan)

### 🧠 Pengertian (Pake Bahasa Lo)

> *"Class anak bisa mewarisi semua properti dan method dari class induk. Terus bisa nambah kemampuan sendiri."*

### 📱 Analogi Sehari-hari

** smartphone:**
- **Smartphone** (induk): punya layar, baterai, kamera
- **iPhone** (anak): punya SEMUA fitur smartphone + Face ID
- **Android** (anak): punya SEMUA fitur smartphone + Google Assistant

**Inheritance = iPhone dan Android mewarisi sifat smartphone.
Mereka gak perlu bikin ulang layar, baterai, kamera dari nol.**

### 💻 Implementasi di Cari.In

**Hierarki 1: User → Mahasiswa & Admin**

```
┌─────────────────────────────────────┐
│            class User               │  ← INDUK (abstract)
├─────────────────────────────────────┤
│ - _id: string                       │
│ - _name: string                     │
│ - _email: string                    │
│ + get id(), get name()              │
│ + abstract role(), canModerate()    │
└──────────────┬──────────────────────┘
               │ extends
       ┌───────┴───────┐
       ▼               ▼
┌─────────────┐ ┌─────────────┐
│  Mahasiswa  │ │   Admin     │  ← ANAK
├─────────────┤ ├─────────────┤
│ (warisan:)  │ │ (warisan:)  │
│ _id, _name  │ │ _id, _name  │
│ id(), name()│ │ id(), name()│
├─────────────┤ ├─────────────┤
│ canModerate │ │ canModerate │
│   : false   │ │   : true    │
│             │ │ + approve() │  ← TAMBAHAN
│             │ │ + reject()  │
└─────────────┘ └─────────────┘
```

**Kode real:**

```typescript
// src/models/Mahasiswa.ts
export class Mahasiswa extends User {   // ← extends = mewarisi
  get role(): UserRole { return 'mahasiswa'; }
  getRoleLabel(): string { return 'Mahasiswa'; }
  canModerate(): boolean { return false; }

  // Gak perlu nulis _id, _name, getter — SEMUA UDAH DIWARISI
}

// src/models/Admin.ts
export class Admin extends User {       // ← extends = mewarisi
  get role(): UserRole { return 'admin'; }
  getRoleLabel(): string { return 'Administrator'; }
  canModerate(): boolean { return true; }

  // Method TAMBAHAN — cuma Admin yang punya:
  async approveReport(reportId: string, note?: string): Promise<void> {
    await reportService.approveReport(reportId, note);
  }
  async rejectReport(reportId: string, reason: string): Promise<void> {
    await reportService.rejectReport(reportId, reason);
  }
}
```

**Hierarki 2: ReportModel → LostReport & FoundReport**

```typescript
// src/models/Report.ts
export class LostReport extends ReportModel {
  validate(): string | null {
    // Cuma cek judul + lokasi
    if (this._title.trim() === '') return 'Judul wajib diisi.';
    if (this._location.trim() === '') return 'Lokasi wajib diisi.';
    return null;  // ✅ Gak butuh custodyPoint
  }
}

export class FoundReport extends ReportModel {
  private readonly _custodyPoint: string;  // ✨ Field tambahan

  validate(): string | null {
    if (this._title.trim() === '') return 'Judul wajib diisi.';
    if (this._location.trim() === '') return 'Lokasi wajib diisi.';
    if (this._custodyPoint.trim() === '')  // ✨ Validasi ekstra
      return 'Titik penitipan wajib diisi.';
    return null;
  }
}
```

### Coba Bayangin Kalo Gak Pake Inheritance

| Kode | Tanpa Inheritance (nulis ulang) | Pake Inheritance (extends) |
|------|-------------------------------|---------------------------|
| `_id`, `_name`, getter, setter | Ditulis 3x (User, Mahasiswa, Admin) | Ditulis **1x** di User |
| Validasi nama | Copy paste 3x | **1x** di User, dipanggil otomatis |
| Nambah method baru di User | Edit 3 file | Edit **1 file** (User) |

### 🎤 Cara Jelasin ke Dosen

**Buka file:** `src/models/Mahasiswa.ts` dan `src/models/Admin.ts` (split screen)

> *"Ini inheritance pak. Mahasiswa dan Admin sama-sama **extends User**. Artinya mereka mewarisi **semua** properti dari User: `_id`, `_name`, getter, setter, method `initial()` — semuanya. Gak perlu nulis ulang."*
>
> *"Tapi Admin punya **tambahan**: method `approveReport()` dan `rejectReport()`. Method ini **cuma** ada di Admin, gak ada di User atau Mahasiswa. Karena emang cuma admin yang punya wewenang approve/reject laporan."*
>
> *"Hierarki kedua ada di laporan: `LostReport extends ReportModel` dan `FoundReport extends ReportModel`. FoundReport punya field tambahan `_custodyPoint` — soalny a barang temuan wajib dicatet titik penitipannya."*
>
> *"Manfaatnya jelas: kode ditulis **sekali** di User / ReportModel, dipake **semua** subclass. Contoh: kalo besok ada tipe user baru `SuperAdmin`, tinggal `extends User` — semua properti User langsung dapet."*

---

## 5. POLYMORPHISM (Polimorfisme)

### 🧠 Pengertian (Pake Bahasa Lo)

> *"Method dengan **nama yang sama** tapi **perilaku berbeda** tergantung class-nya."*

### 📱 Analogi Sehari-hari

**Kucing vs Anjing — sama-sama "bersuara":**

```typescript
class Kucing {
  bersuara(): string { return 'Meow!'; }
}

class Anjing {
  bersuara(): string { return 'Guk guk!'; }
}

const hewan1 = new Kucing();
const hewan2 = new Anjing();

hewan1.bersuara();  // "Meow!"  ← Method SAMA, hasil BEDA
hewan2.bersuara();  // "Guk guk!"
```

### 💻 Implementasi di Cari.In (2 Bukti)

**Bukti 1 — `canModerate()`:**

```typescript
// Method SAMA:
// User bilang: "setiap subclass harus punya canModerate()"
abstract canModerate(): boolean;

// Tapi hasilnya BEDA tiap subclass:
// Mahasiswa → false
class Mahasiswa extends User {
  canModerate(): boolean { return false; }
}

// Admin → true
class Admin extends User {
  canModerate(): boolean { return true; }
}

// Dipake di AdminNavigator.tsx:
const { currentUser } = useAuth();
if (currentUser.canModerate()) {
  // Munculin tombol Approve/Reject    ← Admin
} else {
  // Gak munculin apapun              ← Mahasiswa
}
```

**Bukti 2 — `validate()` (Bukti Paling Kuat):**

```typescript
// Method SAMA:
// ReportModel bilang: "setiap subclass harus punya validate()"
abstract validate(): string | null;

// Tapi perilaku BEDA:
class LostReport extends ReportModel {
  validate() {
    cek judul    ✅
    cek lokasi   ✅
    // Gak peduli custodyPoint       ← BEDA 1
  }
}

class FoundReport extends ReportModel {
  validate() {
    cek judul    ✅
    cek lokasi   ✅
    cek custodyPoint ⚠️             ← BEDA 2
  }
}
```

### Yang Bikin Polimorfisme Keren

```typescript
// Di CreateReportScreen.tsx — PAKAI POLIMORFISME:

// Step 1: User milih "Kehilangan" atau "Menemukan"
const type = userPilih === 'lost' ? 'lost' : 'found';

// Step 2: Factory bikin objek yang tepat
const model = createReportModel(type, formData);
//    ↑ Kalo type='lost'  → new LostReport(data)
//    ↑ Kalo type='found' → new FoundReport(data)

// Step 3: Panggil validate() — TANPA PEDULI TIPE!
const error = model.validate();
//    ↑ Kalo LostReport  → validasi tanpa custodyPoint
//    ↑ Kalo FoundReport → validasi DENGAN custodyPoint

// Ini yang disebut POLYMORPHISM:
// Method DIPANGGIL SAMA → Perilaku BEDA otomatis
```

**Bandingin sama kode tanpa polimorfisme:**

```typescript
// ❌ TANPA POLIMORFISME — pake if-else
function validate(type, data) {
  if (type === 'lost') {
    // validasi untuk Lost
  } else if (type === 'found') {
    // validasi untuk Found
  }
  // Kalo nambah tipe baru → tambah else if lagi!
  // Makan banyak tempat...
}
```

```typescript
// ✅ DENGAN POLIMORFISME — pake class
model.validate();  // Clean! Nambah tipe baru tinggal tambah class
```

### 🎤 Cara Jelasin ke Dosen

**Buka file:** `src/models/Report.ts`

> *"Ini polymorhism pak. Contoh paling jelas ada di hierarki laporan."*
>
> *"`LostReport.validate()` — method ini cek judul sama lokasi doang. Wajar, soalnya kalo kehilangan barang, lo gak tau barangnya ada di mana — lagian kan ilang. Gak perlu titik penitipan."*
>
> *"Tapi `FoundReport.validate()` — methodnya **sama-sama** `validate()`, tapi **berbeda**. Dia nambah validasi `custodyPoint`. Barang temuan wajib dicatet dititipin dimana."*
>
> *"Ini beneran dipake di `CreateReportScreen.tsx`. Waktu user milih 'Kehilangan' atau 'Menemukan', kita panggil factory `createReportModel()` yang ngembaliin objek `LostReport` atau `FoundReport`. Terus panggil `.validate()`. Satu baris kode — `model.validate()` — tapi hasil validasinya bisa beda tergantung tipe laporan. Itu polymorhism."*
>
> *"Kalo gak pake polymorhism, kita harus nulis `if (type === 'lost') { ... } else if (type === 'found') { ... }` — dan tiap kali nambah tipe laporan baru, semua screen yang pake validasi harus diubah. Dengan polymorhism, kita tinggal nambah class baru. **Open-Closed Principle**: terbuka untuk ekstensi, tertutup untuk modifikasi."*

---

## 6. Hubungan 4 Pilar + Project

### Diagram Pilar OOP di Cari.In

```
┌────────────────────────────────────────────────────────┐
│                    ABSTRACTION                          │
│  (Nyembunyiin detail, ngekspos blueprint)              │
│                                                         │
│  ┌──────────────┐      ┌──────────────────┐            │
│  │ abstract class│      │   Service Layer   │            │
│  │ User          │      │   (menyembunyi-   │            │
│  │ ReportModel   │      │    kan Supabase)  │            │
│  └──────┬───────┘      └──────────────────┘            │
│         │                                                │
│         ▼                                                │
│  ┌──────────────────────────────────────────┐           │
│  │           INHERITANCE                     │           │
│  │  (Mewarisi properti & method)            │           │
│  │                                           │           │
│  │  User → Mahasiswa, Admin                 │           │
│  │  ReportModel → LostReport, FoundReport    │           │
│  └──────────┬───────────────────────────────┘           │
│             │                                            │
│             ▼                                            │
│  ┌──────────────────────────────────────────┐           │
│  │          ENCAPSULATION                    │           │
│  │  (Melindungi data)                       │           │
│  │                                           │           │
│  │  private _id → get id() (read-only)      │           │
│  │  private _name → get/set name (validated) │           │
│  └──────────┬───────────────────────────────┘           │
│             │                                            │
│             ▼                                            │
│  ┌──────────────────────────────────────────┐           │
│  │         POLYMORPHISM                     │           │
│  │  (Method sama, perilaku beda)            │           │
│  │                                           │           │
│  │  canModerate(): Mahasiswa=false, Admin=true│           │
│  │  validate(): LostReport vs FoundReport   │           │
│  └──────────────────────────────────────────┘           │
└────────────────────────────────────────────────────────┘
```

### Kaitan 4 Pilar dengan Fitur Cari.In

| Pilar | Class | Dipanggil di Screen | Fungsinya Buat Aplikasi |
|-------|-------|---------------------|------------------------|
| **Abstraction** | `abstract class User` | `AuthContext.tsx` — `createUserModel()` | User cuma blueprint, runtime pilih Mahasiswa/Admin |
| **Abstraction** | Service layer | `HomeScreen.tsx` — `reportService.listReports()` | UI gak tau detail query database |
| **Encapsulation** | `User.ts` — private field | Semua screen via `user.name`, `user.id` | Data user gak bisa diubah sembarangan |
| **Inheritance** | `Admin extends User` | `AdminNavigator.tsx` — `currentUser.getRoleLabel()` | Admin punya method approve tanpa nulis ulang |
| **Inheritance** | `FoundReport extends ReportModel` | `CreateReportScreen.tsx` | Field custodyPoint cuma di Found, Lost gak perlu |
| **Polymorphism** | `canModerate()` | `AdminNavigator.tsx` — routing screen | Admin vs Mahasiswa beda tampilan otomatis |
| **Polymorphism** | `validate()` | `CreateReportScreen.tsx` — submit form | Validasi Lost vs Found beda tanpa if-else |

---

## 7. Naskah Presentasi 5 Menit

### Pembukaan (30 detik)

> *"Perkenalkan pak, saya Faiz. Project kami Cari.In — aplikasi lost & found kampus. Saya akan menjelaskan penerapan 4 pilar OOP di project ini."*

### 1. Abstraction — Buka `src/models/User.ts` (45 detik)

> *"Pertama **Abstraction**. `User` adalah abstract class — blueprint. `new User()` bakal error karena abstract class gak bisa di-instance langsung. Coba liat baris ini — ada 3 abstract method: `role()`, `getRoleLabel()`, `canModerate()`. Method ini WAJIB diimplementasi oleh setiap subclass. Ini bentuk abstraksi — User cuma nentuin kontrak, detailnya diserahkan ke subclass."*
>
> *"Abstraction juga ada di service layer. Screen panggil `reportService.listReports()` tanpa tau detail query Supabase. Implementasi query disembunyiin."*

### 2. Encapsulation — Masih di `User.ts`, scroll ke `private` (45 detik)

> *"Kedua **Encapsulation**. Field `_id` dan `_name` itu **private** — dari luar class, gak bisa diakses langsung. Akses cuma lewat getter `user.id` dan `user.name`. Setter `name` ada validasi — kalo nilai kosong, throw error. Data aman."*

### 3. Inheritance — Buka `Mahasiswa.ts` dan `Admin.ts` (1 menit)

> *"Ketiga **Inheritance**. `Mahasiswa extends User` dan `Admin extends User`. Mereka mewarisi semua properti User: `_id`, `_name`, getter, setter. Gak perlu nulis ulang. Admin juga **menambah** method `approveReport()` dan `rejectReport()` yang cuma admin punya."*
>
> *"Hierarki laporan juga: `LostReport extends ReportModel` dan `FoundReport extends ReportModel`. FoundReport punya field `_custodyPoint` yang LostReport gak punya."*

### 4. Polymorphism — Buka `src/models/Report.ts` (1 menit)

> *"Terakhir **Polymorphism**. Method `validate()` — nama sama, tapi perilaku beda. `LostReport.validate()` cek judul dan lokasi doang. `FoundReport.validate()` nambah validasi `custodyPoint`. Method SAMA, perilaku BEDA."*
>
> *"Ini dipake di `CreateReportScreen.tsx`. Form laporan panggil `model.validate()` — tanpa if-else. Runtime milih otomatis validasi Lost atau Found. Kalo besok nambah tipe laporan baru, tinggal tambah class — kode lama gak perlu diubah."*

### Penutup (30 detik)

> *"Kesimpulan: 4 pilar OOP di project ini bukan teori — class-class ini beneran dipanggil di `AuthContext.tsx`, `AdminNavigator.tsx`, dan `CreateReportScreen.tsx`. Kalo ada pertanyaan, silakan pak."*

---

## 8. Q&A Siap Tempur

### 🎯 Q1: "Abstract class vs Interface, kenapa milih abstract class?"

> **Jawab:**
> *"3 alasan pak:*
> 1. *Abstract class bisa punya **constructor + field** (`_id`, `_name`). Interface cuma kontrak method, gak bisa bawa state.*
> 2. *Abstract class bisa punya **method implementasi** kayak `get initial()`. Interface cuma deklarasi.*
> 3. *Butuh **access modifier** `protected` untuk field yang diakses subclass — ini gak ada di interface."*

### 🎯 Q2: "Bisa tunjukin abstract beneran error kalo di-instance?"

> **Jawab:**
> (Buka terminal VS Code)
> *"Coba kita tes. Kalo gw nulis `new User()`, TypeScript langsung error: `Cannot create an instance of an abstract class.` — bukti abstract class gak bisa di-instance langsung."*

### 🎯 Q3: "Apa bedanya `private` sama `protected`?"

> **Jawab:**
> *"`private` — cuma class itu sendiri yang bisa akses. Bahkan subclass pun gak bisa. `protected` — class itu sendiri + subclass bisa akses."*
> *"Di project: `User._id` pake `private` karena subclass gak perlu akses langsung. Tapi `ReportModel._title` pake `protected` karena subclass `LostReport` dan `FoundReport` perlu akses pas method `validate()`."*

### 🎯 Q4: "Ini beneran OOP atau cuma struktural aja?"

> **Jawab:**
> *"Beneran OOP pak. Bisa dilihat dari:*
> 1. *Polymorphism `validate()` dipake di `CreateReportScreen` — runtime binding.*
> 2. *`AuthContext.tsx` bikin instance `Mahasiswa` atau `Admin` — ini object creation.*
> 3. *`currentUser.getRoleLabel()` di AdminNavigator — method dipanggil dari object, hasilnya beda tergantung tipe."*

### 🎯 Q5: "Kode ini hasil generate AI?"

> **Jawab:**
> *"Jujur pak, ada bantuan AI untuk boilerplate. Tapi **keputusan desain OOP** — kenapa pake abstract class, kenapa `protected` bukan `private`, kenapa `validate()` dipisah per class — itu keputusan saya. AI gak tau konteks bisnis: barang hilang gak butuh custodyPoint, barang temuan wajib."*
> *"Saya juga yang test flow-nya: bikin laporan Lost → validasi jalan tanpa custodyPoint, bikin Found → error kalo custodyPoint kosong. Itu butuh pemahaman."*

### 🎯 Q6: "Kalo di class diagram, mana yang lupa lo gambar?"

> **Jawab:**
> *"Yang mungkin kurang detail adalah **relasi antar class** — misalnya `AuthContext` yang `createUserModel()` itu menghubungkan abstract class User dengan screen. Tujuan saya di diagram cuma fokus ke **hierarki class** di `src/models/` karena itu inti OOP-nya."*

### 🎯 Q7: "Kenapa gak pake JavaScript biasa? Kan lebih simpel?"

> **Jawab:**
> *"JavaScript modern pake class juga pak. Tapi TypeScript lebih cocok karena:*
> 1. *TypeScript punya `abstract`, `private`, `protected` — JavaScript class biasa gak ada access modifier.*
> 2. *TypeScript strict — kalo ada method abstract belum diimplementasi, langsung error.*
> 3. *TypeScript memaksa penulisan tipe — jadi kode lebih terdokumentasi dan gampang di-refactor."*

### 🎯 Q8: "Kalo ditanya 'Coba jelasin baris per baris kode User.ts'"

> **Jawab:**
> (Buka User.ts, pointing baris per baris)
> ```typescript
> export abstract class User {        // ← Baris 1: ini class abstract
>   private readonly _id: string;      // ← Baris 2: field private, readonly
>   private _name: string;             // ← Baris 3: field private
>   constructor(params: UserParams) {  // ← Baris 4: constructor, dipanggil pas new
>     this._id = params.id;            // ← Baris 5: set id dari parameter
>     this._name = params.name;        // ← Baris 6: set name dari parameter
>   }
>   get id(): string {                 // ← Baris 7: getter — baca id (read-only)
>     return this._id;
>   }
>   set name(value: string) {          // ← Baris 8: setter — ubah name
>     if (value.trim().length === 0)   // ← Baris 9: validasi
>       throw new Error('...');
>     this._name = value.trim();
>   }
>   abstract get role(): UserRole;     // ← Baris 10: abstract method — blueprint
> }
> ```

### 🎯 Q9: "Kalo ditanya Runtime Polymorphism — jelasin"

> **Jawab:**
> *"Runtime polymorphism terjadi ketika method yang dipanggil ditentukan **saat program berjalan**, bukan saat dikompilasi. Di project ini: ketika user memilih tipe laporan di `CreateReportScreen`, factory `createReportModel(type, data)` membuat objek `LostReport` atau `FoundReport` **saat runtime**. Method `validate()` baru dipanggil setelahnya — dan implementasi yang jalan tergantung objek yang dibuat tadi."*
> *"Kalo user pilih 'Hilang', runtime buat `new LostReport()` → `validate()` p Pa ke Lost. Kalo 'Temuan', runtime buat `new FoundReport()` → `validate()` ke Found. Keputusannya terjadi **saat runtime**, bukan compile time."*

### 🎯 Q10: "Ini kan React Native — kenapa repot pake class? Functional programming kan lebih cocok?"

> **Jawab:**
> *"Bener pak, React Native pake functional component. Tapi itu di **layer UI**. Untuk **model domain** — representasi data dan aturan bisnis — OOP lebih cocok. Layernya dipisah: Screen pake functional component, Model pake class OOP. Yang penting adalah **pemisahan concern** yang bener."*

---

## 9. Glosarium Istilah

| Istilah | Arti (bahasa lo) |
|---------|------------------|
| **Class** | Cetakan untuk bikin objek |
| **Object / Instance** | Hasil jadi dari cetakan class |
| **Property / Field** | Data yang disimpen di class |
| **Method** | Fungsi / perilaku yang bisa dilakukan class |
| **Constructor** | Method yang otomatis dipanggil pas objek dibuat |
| **`extends`** | Keyword buat inheritance (mewarisi) |
| **`abstract`** | Keyword buat class/method yang masih blueprint |
| **`private`** | Hanya bisa diakses di dalam class itu sendiri |
| **`protected`** | Bisa diakses class itu sendiri + subclass |
| **Getter (`get`)** | Method baca data (kayak properti, bukan fungsi) |
| **Setter (`set`)** | Method nulis data (bisa pake validasi) |
| **`readonly`** | Cuma bisa diisi 1x (di constructor), setelah itu gak bisa diubah |
| **Override** | Nulis ulang method dari class induk di subclass |
| **Encapsulation** | Bungkus data, kontrol akses |
| **Inheritance** | Warisan properti/method dari induk ke anak |
| **Polymorphism** | Method sama, perilaku beda |
| **Abstraction** | Nyembunyiin detail, ngekspos yang penting |
| **Open-Closed Principle** | Terbuka untuk ekstensi, tertutup untuk modifikasi |
| **Runtime** | Saat program berjalan (bukan saat dikompilasi) |

---

> **Catatan:** Ini file panduan belajar, bukan dokumen resmi laporan.  
> **Cara make:** Baca per bagian → tutup mata → jelasin pake bahasa lo sendiri → cocokin lagi.  
> **Goal:** Pahamin, bukan hafalin. Kalo lo paham, kata-kata sendiri yang keluar.
