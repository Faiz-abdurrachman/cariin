# Bukti Implementasi 4 Pilar OOP — Cari.In

> Screenshot kode dari `src/models/` untuk slide PPT.
> Format: kode + 1-2 baris penjelasan.

---

## 1. Inheritance — `Mahasiswa extends User`

**File:** `src/models/Mahasiswa.ts`

```typescript
export class Mahasiswa extends User {
  get role(): UserRole { return 'mahasiswa'; }
  getRoleLabel(): string { return 'Mahasiswa'; }
  canModerate(): boolean { return false; }
}

export class Admin extends User {
  get role(): UserRole { return 'admin'; }
  getRoleLabel(): string { return 'Administrator'; }
  canModerate(): boolean { return true; }
}
```

> ✅ **Penjelasan:** `Mahasiswa` dan `Admin` mewarisi (`extends`) class `User`. Keduanya punya field & method yang sama dari User, tapi `Admin` ditambah method khusus `approveReport()` dan `rejectReport()`. Kode tidak perlu ditulis ulang — konsep **reusability**.

---

## 2. Encapsulation — Field Private + Getter/Setter

**File:** `src/models/User.ts`

```typescript
export abstract class User {
  private readonly _id: string;     // ✋ PRIVATE — tidak bisa diakses langsung
  private _name: string;

  // Getter: akses read-only
  get id(): string { return this._id; }
  get name(): string { return this._name; }

  // Setter: dengan VALIDASI
  set name(value: string) {
    if (value.trim().length === 0)
      throw new Error('Nama tidak boleh kosong.');
    this._name = value.trim();
  }
}
```

> ✅ **Penjelasan:** Field `_id` dan `_name` bersifat `private` — tidak bisa dibaca/diubah dari luar class. Akses hanya lewat **getter** (read) dan **setter** (write + validasi). Data aman dari modifikasi sembarangan.

---

## 3. Polymorphism — `validate()` Berbeda Tiap Subclass

**File:** `src/models/Report.ts`

```typescript
export class LostReport extends ReportModel {
  validate(): string | null {
    if (this._title.trim().length === 0) return 'Judul wajib diisi.';
    if (this._location.trim().length === 0) return 'Lokasi wajib diisi.';
    return null;  // ✅ Lost: tanpa custodyPoint
  }
}

export class FoundReport extends ReportModel {
  validate(): string | null {
    if (this._title.trim().length === 0) return 'Judul wajib diisi.';
    if (this._location.trim().length === 0) return 'Lokasi wajib diisi.';
    if (this._custodyPoint.trim().length === 0)
      return 'Titik penitipan wajib diisi.';  // ❗ Found: WAJIB custodyPoint
    return null;
  }
}
```

> ✅ **Penjelasan:** Method `validate()` punya **nama sama** tapi **perilaku berbeda**. `LostReport` tidak peduli custodyPoint, `FoundReport` mewajibkannya. Ini dipanggil di `CreateReportScreen.tsx` saat user submit form.

---

## 4. Abstraction — `abstract class` (Blueprint)

**File:** `src/models/User.ts`

```typescript
export abstract class User {
  abstract get role(): UserRole;
  abstract getRoleLabel(): string;
  abstract canModerate(): boolean;
}
```

> ✅ **Penjelasan:** `User` adalah **abstract class** — tidak bisa di-instansiasi langsung (`new User()` akan error). Dia cuma **blueprint** yang memaksa setiap subclass (`Mahasiswa` / `Admin`) untuk mengimplementasikan method `role()`, `getRoleLabel()`, dan `canModerate()`.

---

## Ringkasan Cepat

| Pilar | Keyword Kunci | File | Baris Kode |
|-------|--------------|------|------------|
| Inheritance | `extends User` | `Mahasiswa.ts`, `Admin.ts` | ~15 baris |
| Encapsulation | `private` + `get`/`set` | `User.ts` | ~20 baris |
| Polymorphism | `validate()` override | `Report.ts` | ~20 baris |
| Abstraction | `abstract class` + `abstract` method | `User.ts`, `Report.ts` | ~10 baris |

---

> **Cara pakai:** Lo bisa buka langsung file di atas (path: `src/models/`) atau screenshot dari laporan UAS PBO (`uas-pbo/LAPORAN-UAS-PBO.md`). Kalau mau, gw juga bisa bikinin versi yang langsung tempel di slide — misalnya 1 slide isi 4 box kaya gini.
