# Panduan Presentasi PBO — Cari.In

> Buat lo yang mau presentasi tapi gak mau kicek.
> Bahasa santai, contoh real dari project lo sendiri.

---

## DAFTAR ISI CEPET

1. [OOP Itu Sebenernya Apa?](#1-oop-itu-sebenernya-apa)
2. [Class vs Object](#2-class-vs-object)
3. [ABSTRACTION — Nyembunyiin yang Ribet](#3-abstraction)
4. [ENCAPSULATION — Ngunci Biar Gak Sembarangan](#4-encapsulation)
5. [INHERITANCE — Warisan Orang Tua ke Anak](#5-inheritance)
6. [POLYMORPHISM — Nama Sama, Tapi Sikap Beda](#6-polymorphism)
7. [Naskah Presentasi 5 Menit](#7-naskah-presentasi-5-menit)
8. [Q&A Jebakan + Jawaban](#8-qa-jebakan--jawaban)
9. [Tips Biar Gak Grogi](#9-tips-biar-gak-grogi)

---

## 1. OOP Itu Sebenernya Apa?

### Dalam 1 kalimat

> **OOP** = cara nulis kode dengan ngeliat semua hal sebagai "objek" yang punya **data** + **tingkah laku**.

### Biar gampang — bayangin mobil

| Istilah OOP | Artinya | Contoh Mobil |
|-------------|---------|--------------|
| **Class** | Cetakan/blueprint | Gambar desain mobil |
| **Object** | Hasil cetakannya | Mobil beneran di jalan |
| **Property** | Ciri-ciri / data | Warna, merek, tahun |
| **Method** | Tingkah laku | Gas, rem, belok, klakson |

### Kenapa pake OOP?

**Tanpa OOP:** Lo nulis kode panjang di 1 file, susah nyari error, susah dipake ulang.

**Pake OOP:** Kode lo terpecah per class. Mau nyari bug gampang. Class bisa dipake ulang di file lain.

### Di project lo — pemetaannya gini:

| Kenyataan | Jadi Class |
|-----------|------------|
| Mahasiswa | `class Mahasiswa extends User` |
| Admin satpam | `class Admin extends User` |
| Laporan hilang | `class LostReport extends ReportModel` |
| Laporan temuan | `class FoundReport extends ReportModel` |

---

## 2. Class vs Object

### Class = cetakan kue

```typescript
export class Mahasiswa extends User {
  get role(): UserRole { return 'mahasiswa'; }
}
```
Ini CETAKAN-nya. Belum ada data siapa yang make.

### Object = kue jadi

Pas lo login, baru dibuat objeknya:
```typescript
const faiz = new Mahasiswa({ id: '001', name: 'Faiz', email: 'faiz@student...' });
```
Sekarang `faiz` bisa pake semua method dari `Mahasiswa` + warisan `User`.

---

## 3. ABSTRACTION

### Artinya (pake bahasa lo)

> "Yang keliatan cuma fitur pentingnya doang. Yang ribet-ribet disembunyiin."

### Analogi: Remote TV

Lo pencet tombol **Volume Up** → suara ngegas.
Lo **gak perlu tau** di dalem remote ada sinyal infrared apa, resistor berapa ohm.
Yang penting: tombol ini gedein volume.

### Di project lo — `src/models/User.ts`

**📍 TRACK:** `src/models/User.ts` — baris 18
**🎯 Cari:** `export abstract class User`

Buka file ini:

```typescript
export abstract class User {
  // ✅ Method yang udah jadi — bisa langsung dipake
  get initial(): string {
    return this._name.charAt(0).toUpperCase();
  }

  // 🔴 Method yang MASIH ABSTRACT — WAJIB diisi subclass
  abstract get role(): UserRole;
  abstract getRoleLabel(): string;
  abstract canModerate(): boolean;
}
```

### Cara jelasin (pointing ke baris 18-58):

> "Lihat `abstract class User` baris 18. Ini tuh blueprint doang, bukan objek beneran. Coba lo ketik `new User()` — dijamin error."
>
> "Kenapa? Karena User itu konsep abstrak. Di dunia nyata, gak ada 'user' tanpa peran. Yang ada cuma Mahasiswa atau Admin."
>
> "Nah abstract class ini **memaksa** setiap subclass untuk ngisi `role()`, `getRoleLabel()`, dan `canModerate()`. Kalo lupa ngisi, error dari TypeScript."

### Abstraction juga ada di Service Layer

Buka `src/services/report.service.ts`:

**📍 TRACK:** `src/services/report.service.ts` — baris 75
**🎯 Cari:** `export async function listReports`

```typescript
// Screen panggil ini:
const reports = await reportService.listReports(filter);

// Screen GAK PEDULI isi dalemnya:
//   - Query ke tabel mana?
//   - Pake filter apa?
//   - Error handling gimana?
// Yang penting: dapet data laporan.
```

**Cara jelasin:**
> "Abstraction gak cuma di model. Service layer juga abstraction — screen cuma tau 'saya mau laporan', gak peduli datanya dari Supabase, Firebase, atau API mana."

### Yang lo hafal:

```
Abstract class User:
  → Gak bisa di-instance (new User() error)
  → Cuma blueprint
  → Subclass WAJIB implementasi abstract method
```

---

## 4. ENCAPSULATION

### Artinya (pake bahasa lo)

> "Data dikunci rapet. Mau ngintip atau ngubah harus lewat pintu yang udah ditentuin."

### Analogi: Brankas

Lo punya brankas. Isinya uang (`_id`, `_name`).
- **Private field** = uang di dalem brankas — gak bisa langsung diambil
- **Getter** = lo buka pintu brankas — bisa liat isinya
- **Setter** = lo masukin uang — tapi lewat pintu yang ada satpam (validasi)

Kalo satpam liat lo masukin uang palsu (`string kosong`), satpam nolak.

### Di project lo — `src/models/User.ts`

**📍 TRACK:** `src/models/User.ts` — baris 20-21 (field), 37-38 (getter), 45 (setter)
**🎯 Cari:** `private readonly _id` (baris 20), `set name` (baris 45)

```typescript
export abstract class User {
  // 🔒 DIKUNCI — private, gak bisa diakses dari luar
  private readonly _id: string;         // ← baris 20
  private _name: string;                // ← baris 21

  // 🚪 GETTER — akses baca doang
  get id(): string { return this._id; }     // Bisa baca, gak bisa ubah
  get name(): string { return this._name; }

  // 🚪 SETTER — akses tulis, ADA VALIDASI
  set name(value: string) {
    if (value.trim().length === 0)
      throw new Error('Nama tidak boleh kosong.');  // 👮 Satpam!
    this._name = value.trim();
  }
}
```

### Yang bisa dan gak bisa dilakukan:

```typescript
const user = new Mahasiswa({ id: '001', name: 'Faiz' });

// ✅ BOLEH:
console.log(user.name);       // "Faiz" — lewat getter
user.name = 'Galih';           // ✅ — lewat setter

// ❌ GAK BOLEH:
console.log(user._name);      // Error! Private
user._name = 'Hacker';        // Error! Private
user.id = '002';              // Error! Gak ada setter (readonly)
```

### Cara jelasin:

> "Encapsulation itu ngunci data biar gak dibobol sembarangan. Field `_id` di-private, cuma bisa dibaca lewat getter. Mau ganti nama? Pake setter — tapi ada validasi, kalo kosong ditolak."
>
> "Encapsulation juga ada di service layer. Screen gak pernah akses database langsung — semuanya lewat service. Kalo suatu saat ganti backend, screen gak perlu diubah."

### Yang lo hafal:

```
private _id, _name
  → Getter buat baca
  → Setter buat nulis + validasi
Service layer → enkapsulasi akses database
```


---

## 5. INHERITANCE

### Artinya (pake bahasa lo)

> "Class anak mewarisi semua punya class induk. Kaya lo mewarisi sifat dari orang tua."

### Analogi: Ortu punya rumah

Orang tua (User) punya rumah (`_id`, `_name`, `get id()`, dll).
Anak pertama (Mahasiswa) tinggal di rumah itu — pake semua fasilitasnya.
Anak kedua (Admin) juga tinggal — sama-sama pake fasilitas, tapi **dia punya mobil sendiri** (`approveReport()`) yang anak pertama gak punya.

### Di project lo — ada 2 hierarki

#### Hierarki 1: `User` → `Mahasiswa` & `Admin`

Buka `src/models/Mahasiswa.ts`:

**📍 TRACK:** `src/models/Mahasiswa.ts` — baris 6 | `src/models/Admin.ts` — baris 8
**🎯 Cari:** `class Mahasiswa extends User` (Mhs baris 6), `class Admin extends User` (Admin baris 8)

```typescript
export class Mahasiswa extends User {
  // 👇 Method abstract dari User — wajib diisi
  get role(): UserRole { return 'mahasiswa'; }
  getRoleLabel(): string { return 'Mahasiswa'; }
  canModerate(): boolean { return false; }

  // Method khusus Mahasiswa
  canPublishDirectly(): boolean { return false; }
}
```

Buka `src/models/Admin.ts`:
```typescript
export class Admin extends User {
  // 👇 Method abstract dari User — wajib diisi
  get role(): UserRole { return 'admin'; }
  getRoleLabel(): string { return 'Administrator'; }
  canModerate(): boolean { return true; }

  // 🔥 Method KHUSUS Admin — gak ada di User atau Mahasiswa
  async approveReport(reportId: string, note?: string) {
    await reportService.approveReport(reportId, note);
  }
  async rejectReport(reportId: string, reason: string) {
    await reportService.rejectReport(reportId, reason);
  }
}
```

### Cara jelasin (buka split screen):

> "Ini Inheritance. `Mahasiswa extends User` — artinya Mahasiswa punya SEMUA properti User: `_id`, `_name`, getter, setter, semua. Tanpa nulis ulang."
>
> "Admin juga `extends User` — sama, punya semua properti User. Tapi Admin NAMBAH `approveReport()` dan `rejectReport()` yang cuma dia yang punya."
>
> "Ini yang namanya **reusability** — kode `User` ditulis SEKALI, dipake di 2 class. Gak perlu copy-paste."

#### Hierarki 2: `ReportModel` → `LostReport` & `FoundReport`

Buka `src/models/Report.ts`:

```typescript
export abstract class ReportModel {
  // Induk: punya title, category, location
  protected _title: string;
  protected _category: CategoryId;
  protected _location: string;
  // ...getter...
}

class LostReport extends ReportModel {
  // Anak 1: cuma pake properti induk
}

class FoundReport extends ReportModel {
  // Anak 2: NAMBAH field sendiri
  private _custodyPoint: string;
}
```

### Manfaat inheritance:

| Tanpa Inheritance | Pake Inheritance |
|-------------------|------------------|
| `Mahasiswa` nulis `_id`, `_name`, `get id()` sendiri | Diwaris dari `User` |
| `Admin` nulis `_id`, `_name`, `get id()` sendiri lagi | Diwaris dari `User` |
| 2x kerja — rentan typo | 0x kerja — konsisten |

### Yang lo hafal:

```
Mahasiswa extends User
Admin extends User
  → Semua properti User DIWARISKAN
  → Admin NAMBAH approveReport/rejectReport

LostReport extends ReportModel
FoundReport extends ReportModel
  → Semua properti ReportModel diwariskan
  → FoundReport NAMBAH _custodyPoint
```

---

## 6. POLYMORPHISM

### Artinya (pake bahasa lo)

> "Nama method-nya SAMA, tapi kelakuannya BEDA tergantung class-nya."

### Analogi: Suara binatang

```typescript
kucing.bersuara()   // "Meow"
anjing.bersuara()   // "Guk guk"
sapi.bersuara()     // "Mooo"
```

Methodnya sama-sama `bersuara()`, tapi hasilnya beda. Itu polimorfisme.

### Di project lo — 2 bukti nyata

#### Bukti 1: `canModerate()` — User & Admin

```typescript
class Mahasiswa extends User {
  canModerate(): boolean { return false; }  // ❌ Gak bisa
}

class Admin extends User {
  canModerate(): boolean { return true; }   // ✅ Bisa
}
```

**Cara jelasin:**
> "Method `canModerate()` dipanggil. Tapi kalo Mahasiswa, jawabannya `false`. Kalo Admin, `true`. Method SAMA, hasil BEDA."

**Dipakai di mana?**
Di `AdminNavigator.tsx`:
```typescript
const { currentUser } = useAuth();

// currentUser bisa Mahasiswa atau Admin — tergantung yang login
if (currentUser.canModerate()) {
  // Tampilin menu admin
} else {
  // Redirect ke halaman mahasiswa
}
```

#### Bukti 2: `validate()` — LostReport vs FoundReport (YANG PALING KEREN)

Buka `src/models/Report.ts`:

**📍 TRACK:** `src/models/Report.ts` — Lost baris 41-55, Found baris 59-84
**🎯 Cari:** `class LostReport` (baris 41), `class FoundReport` (baris 59)

```typescript
// LAPORAN HILANG (baris 41)
class LostReport extends ReportModel {
  validate(): string | null {
    if (judul kosong) return 'Judul wajib diisi.';
    if (lokasi kosong) return 'Lokasi wajib diisi.';
    return null;  // ✅ GAK perlu custodyPoint — barang hilang ya gak tau
  }
}

// LAPORAN TEMUAN
class FoundReport extends ReportModel {
  validate(): string | null {
    if (judul kosong) return 'Judul wajib diisi.';
    if (lokasi kosong) return 'Lokasi wajib diisi.';
    if (custodyPoint kosong) return 'Titik penitipan wajib.';  // ❗ BEDA!
    return null;
  }
}
```

**Cara jelasin:**
> "Ini inti polimorfisme. Method `validate()` itu SATU nama. Tapi `LostReport` cek judul + lokasi doang. `FoundReport` nambah validasi custodyPoint. Soalnya barang temuan WAJIB dititipin."

**Dipakai di mana?**
Di `CreateReportScreen.tsx` — pas user submit form:
```typescript
// type = 'lost' atau 'found' — dipilih user di form
const model = createReportModel(type, data);

// 😱 Program GAK TAU class-nya Lost atau Found
// Tapi tinggal panggil .validate() — otomatis milih sendiri
const error = model.validate();
```

### Bedanya kalo pake cara lama (if-else):

```typescript
// ❌ CARA LAMA — setiap nambah tipe, nambah if
function validate(type, data) {
  if (type === 'lost') { ... validasi A ... }
  else if (type === 'found') { ... validasi B ... }
  // Kalo nambah tipe "donated" → nambah cabang lagi
}

// ✅ PAKE POLYMORPHISM — tinggal tambah class baru
class DonatedReport extends ReportModel {
  validate() { ... validasi sendiri ... }
}
```

Ini yang namanya **Open-Closed Principle**: kode lo terbuka buat nambah, tapi gak perlu diutak-atik.

### Yang lo hafal:

```
LostReport.validate() → cek judul + lokasi
FoundReport.validate() → cek judul + lokasi + custodyPoint

Method SAMA, logika BEDA = polimorfisme
```

---

## 7. NASKAH PRESENTASI 5 MENIT

### Pembukaan (15 detik)

> "Assalamualaikum. Saya Faiz, NIM 241111021. Saya bakal jelasin penerapan 4 pilar OOP di project Cari.In — aplikasi lost & found kampus."

---

### #1 Abstraction — buka `User.ts` (45 detik)

**Arahin cursor ke** `abstract class User`

> "Yang pertama **Abstraction**. Lihat nih `abstract class User`. Dia tuh blueprint aja — kalo dicoba `new User()` bakal error. Dia cuma nyediain kerangka: method `role()`, `getRoleLabel()`, `canModerate()` itu WAJIB diisi sama subclass."
>
> "Detail implementasinya disembunyiin. Yang kelihatan cuma kontraknya doang."

---

### #2 Encapsulation — masih `User.ts` (45 detik)

**Arahin ke** `private readonly _id` dan `set name()`

> "Yang kedua **Encapsulation**. Field `_id` sama `_name` di-private. Kalo mau baca pake getter. Kalo mau ganti nama pake setter — tapi ada validasinya. Kalo ngisi string kosong, nolak."
>
> "Encapsulation juga di service layer. Screen gak pernah akses database langsung — semua lewat service. Data aman."

---

### #3 Inheritance — buka `Mahasiswa.ts` + `Admin.ts` (1 menit)

**Split screen** — Mahasiswa kiri, Admin kanan

> "Yang ketiga **Inheritance**. `Mahasiswa extends User` — otomatis punya SEMUA field + method dari User, tanpa nulis ulang."
>
> "`Admin extends User` — sama. Tapi Admin NAMBAH `approveReport()` dan `rejectReport()` yang cuma dia punya."
>
> "Ini reusability — kode ditulis sekali di `User`, dipake di 2 class."

---

### #4 Polymorphism — buka `Report.ts` (1 menit)

**Arahin ke** `LostReport.validate()` dan `FoundReport.validate()`

> "Yang keempat **Polymorphism**. Method `validate()` namanya sama. Tapi `LostReport` cek judul + lokasi doang. `FoundReport` nambah validasi titik penitipan."
>
> "Method sama, perilaku beda. Ini dipake beneran di `CreateReportScreen` — pas user pilih 'Hilang' atau 'Temuan', runtime milih sendiri validasi mana yang jalan."

---

### Penutup (15 detik)

> "Itu pak 4 pilar OOP di Cari.In. Kalo berkenan, saya bisa demo aplikasinya langsung."

---

## 8. Q&A JEBAKAN + JAWABAN

### Q1: "Ini hasil generate AI ya?"
**Jawab:** "Ada bantuan buat struktur dasar. Tapi logika OOP-nya — milih abstract class, nentuin mana private mana protected — itu keputusan saya. Saya tau kenapa `User._id` private tapi `Report._title` protected. Bedanya tujuan."

### Q2: "Abstract class vs interface?"
**Jawab:** "Abstract class bisa punya field (`_id`, `_name`) + constructor. Interface cuma kontrak method. Saya butuh field soalnya User harus nyimpen data."

### Q3: "Kenapa pake class terpisah? Gak pake if-else aja?"
**Jawab:** "Kalo pake if-else, setiap nambah tipe laporan, kode diedit. Pake class, tinggal bikin class baru yang `extends ReportModel`. Kode lama gak berubah."

### Q4: "Bisa buktiin abstract gak bisa di-instance?"
**Jawab:** "Coba ketik `new User()` di file manapun — langsung error dari TypeScript. Buktinya ada di kode."

### Q5: "Ini OOP di frontend — emang cocok?"
**Jawab:** "Cocok soalnya entitasnya punya hierarki alami — User punya 2 turunan, Report punya 2 turunan. Kalo pake cara prosedural, validasi bakal berserakan."

### Q6: "Komentar 'Pilar OOP: Encapsulation' — itu AI ya?"
**Jawab:** "Itu sengaja saya tulis buat dokumentasi PDO biar yang baca langsung paham. Di kode beneran, komentar kayak gitu gak ada."

### Q7: "Service layer = encapsulation juga?"
**Jawab:** "Iya — screen cuma panggil `reportService.listReports()`, gak pernah `supabase.from('reports').select(...)` langsung. Detail query di-enkapsulasi."

---

## 9. TIPS BIAR GAK GROGI

### Yang WAJIB lo siapin:

- ✅ Buka VS CODE sebelum presentasi
- ✅ Tab `User.ts`, `Mahasiswa.ts`, `Admin.ts`, `Report.ts` udah siap
- ✅ Bawa laptop + charger
- ✅ Siapin internet (hotspot) kalo mau demo app
- ✅ Minum air minum sebelum maju

### Yang JANGAN lo lakuin:

- ❌ "Maaf pak saya lupa" — mending pointing ke layar "Bisa liat sendiri di kode"
- ❌ "Soalnya AI bilang gitu" — lo harus tau alasan di balik kode
- ❌ Baca slide kayak teks proklamasi — ngomong natural aja

### PeDe terakhir:

> **Lo beneran ngerjain project ini sendiri.**
> **Isi kepala lo lebih banyak dari yang lo kira.**
> **Ngomong pelan, pointing ke kode kalo lupa.**
> **Gas aja, lo udah siap.**

---

*Selamat presentasi bro! 🚀*

---

## 10. DEMO UI → KODE (Yang Paling Berkesan)

Ini bagian paling membedain lo dari kelompok lain. Sambil tunjukin app, lo jelasin **code yang jalan di belakangnya**.

### Demo 1: Login → Muncul Role Berbeda (Polymorphism)

**Yang lo lakuin di app:**
Buka app → Login sebagai `faiz@student.unu-jogja.ac.id` → Masuk ke halaman mahasiswa.

**Sambil itu jelasin kode:**

Buka `src/context/AuthContext.tsx`:

**📍 TRACK:** `src/context/AuthContext.tsx` — baris 142
**🎯 Cari:** `createUserModel` — ada di `src/models/index.ts` baris 28

```typescript
function createUserModel(profile: Profile): User {
  if (profile.role === 'admin') {
    return new Admin(profile);      // 🟢 Kalo admin → bikin objek Admin
  } else {
    return new Mahasiswa(profile);  // 🟢 Kalo mahasiswa → bikin objek Mahasiswa
  }
}
```

**Cara ngomong:**
> "Pas login, program cek role. Kalo 'admin', dibuat objek `Admin`. Kalo 'mahasiswa', objek `Mahasiswa`. Dua-duanya tipe `User` — tapi perilakunya beda. Ini **Polymorphism**."

---

### Demo 2: Navigasi Admin Beda dari Mahasiswa (Polymorphism)

**Yang lo lakuin di app:**
Logout → Login sebagai `admin@cariin.app` → Lihat dashboard admin tampilannya beda.

**Sambil itu jelasin kode:**

Buka `src/navigation/index.tsx`:

**📍 TRACK:** `src/navigation/index.tsx` — baris 16-29
**🎯 Cari:** `role === 'admin'` (baris 26)

```typescript
export default function RootNavigator() {
  const { role } = useAuth();

  if (role === 'admin') {
    return <AdminNavigator />;   // 👈 Admin: drawer + bottom tab
  } else {
    return <MainNavigator />;    // 👈 Mahasiswa: bottom tab biasa
  }
}
```

Buka `src/navigation/AdminNavigator.tsx`:

**📍 TRACK:** `src/navigation/AdminNavigator.tsx` — baris 449-452
**🎯 Cari:** `getRoleLabel()` (baris 452)

```typescript
// Di dalem AdminNavigator, baris 452:
<Text>{currentUser.getRoleLabel()}</Text>
// Kalo Admin → "Administrator"
// Kalo Mahasiswa → "Mahasiswa"
```

**Cara ngomong:**
> "Method `getRoleLabel()` namanya sama. Tapi hasilnya beda tergantung siapa yang login. Kalo Admin, tulisannya 'Administrator'. Kalo Mahasiswa, 'Mahasiswa'. **Polymorphism** di UI."

---

### Demo 3: Buat Laporan Hilang vs Temuan (Polymorphism + Inheritance)

**Yang lo lakuin di app:**
Tap FAB (+) → Pilih "Kehilangan" → Isi form (judul + lokasi doang) → Submit.

**Sambil itu jelasin kode:**

Buka `src/models/Report.ts`:

```typescript
// LAPORAN HILANG — validasi ringan
class LostReport extends ReportModel {
  validate(): string | null {
    if (judul kosong) return 'Judul wajib.';
    if (lokasi kosong) return 'Lokasi wajib.';
    return null;  // ✅ Gak perlu titik penitipan
  }
}
```

**Sekarang ganti ke "Ditemukan":**

Back ke form → Tap "Ditemukan" → Ada field **Titik Penitipan** tambahan.

Buka `src/models/Report.ts` (scroll ke `FoundReport`):

```typescript
// LAPORAN TEMUAN — validasi lebih berat
class FoundReport extends ReportModel {
  validate(): string | null {
    if (judul kosong) return 'Judul wajib.';
    if (lokasi kosong) return 'Lokasi wajib.';
    if (titik penitipan kosong) return 'Titik penitipan wajib.';  // ❗ BEDA!
    return null;
  }
}
```

**Cara ngomong:**
> "Methodnya sama-sama `validate()`. Tapi `LostReport` cek 2 hal. `FoundReport` cek 3 hal — ada tambahan titik penitipan. Soalnya barang temuan harus dititipin di suatu tempat."
>
> "Ini **Inheritance** (dua-duanya `extends ReportModel`) + **Polymorphism** (method `validate()` beda kelakuan)."

---

### Demo 4: Coba Kasih Judul Kosong (Encapsulation + Validasi)

**Yang lo lakuin di app:**
Form create → Judul dikosongin → Submit → Muncul error "Judul wajib diisi".

**Sambil itu jelasin kode:**

```typescript
class LostReport extends ReportModel {
  validate(): string | null {
    if (this._title.trim().length === 0)   // 🔥 Ngecek pake field protected
      return 'Judul laporan wajib diisi.';
    // ...
  }
}
```

**Cara ngomong:**
> "Validasi ini pake field `_title` yang di-`protected` — bisa diakses subclass `LostReport`. Kalo field-nya `private`, subclass gak bisa akses. Ini contoh **Encapsulation** yang disesuaikan kebutuhan."

---

### Demo 5: Edit Profile → Ganti Nama (Encapsulation)

**Yang lo lakuin di app:**
Profile → Edit nama → Hapus semua karakter → Simpan → Error.

**Sambil itu jelasin kode:**

Buka `src/models/User.ts`, arahin ke `set name()`:

```typescript
set name(value: string) {
  if (value.trim().length === 0)
    throw new Error('Nama tidak boleh kosong.');  // 👮 Nolak!
  this._name = value.trim();
}
```

**Cara ngomong:**
> "Ini **Encapsulation**. Field `_name` private. Kalo mau ganti nama, harus lewat setter. Setter ini ada satpamnya — kalo lo masukin string kosong, ditolak. Data tetap aman."

---

### Demo 6: Abstraction di Service Layer

**Yang lo lakuin di app:**
Scroll feed — tunjukkin laporan muncul.

**Sambil itu jelasin kode:**

Buka `src/services/report.service.ts`:

```typescript
export async function listReports(filter) {
  let q = supabase.from('reports').select('*');
  // ... query ribuan ...
  return data;
}
```

Terus buka `src/screens/main/HomeScreen.tsx`, cari panggilannya:

```typescript
// Di HomeScreen — sesimpel ini:
const reports = await reportService.listReports(filter);
```

**Cara ngomong:**
> "`HomeScreen` cuma panggil `reportService.listReports()`. Gak tau di dalemnya ada query Supabase, filter, error handling, apa aja. Detail disembunyiin — ini **Abstraction** di level arsitektur."

---

## 11. URUTAN PRESENTASI FINAL (10 Menit)

| Waktu | Bagian | Yang Dilakuin |
|-------|--------|---------------|
| 0:00-0:30 | Pembukaan | Salam, perkenalan, project Cari.In |
| 0:30-1:15 | **Abstraction** | Buka `User.ts` → tunjukkin abstract class |
| 1:15-2:00 | **Encapsulation** | Buka `User.ts` → tunjukkin private + getter/setter |
| 2:00-3:00 | **Inheritance** | Split `Mahasiswa.ts` + `Admin.ts` |
| 3:00-4:00 | **Polymorphism** | Buka `Report.ts` → Lost vs Found validate() |
| 4:00-7:00 | **Demo App + Kode** | Login → Buat laporan → Tunjukkin kode dibaliknya |
| 7:00-8:00 | Service Layer | Abstraction di service |
| 8:00-9:00 | Q&A | Jawab pertanyaan |
| 9:00-10:00 | Penutup | Kesimpulan, terima kasih |

### Yang harus udah siap di VS CODE:

| Tab | File |
|-----|------|
| Tab 1 | `src/models/User.ts` — untuk Abstraction + Encapsulation |
| Tab 2 | `src/models/Mahasiswa.ts` — Inheritance |
| Tab 3 | `src/models/Admin.ts` — Inheritance |
| Tab 4 | `src/models/Report.ts` — Polymorphism |
| Tab 5 | `src/context/AuthContext.tsx` — Polymorphism di login |
| Tab 6 | `src/services/report.service.ts` — Abstraction di service |

### Yang perlu dibuka di HP/Expo Go:

- App Cari.In
- Akun mahasiswa: `faiz@student.unu-jogja.ac.id` / `faizfaiz`
- Akun admin: `admin@cariin.app` / `admin123`

---

*Lo udah siap 100% bro. Gas! 🚀*
