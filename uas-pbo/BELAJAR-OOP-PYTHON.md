# Belajar OOP Pake Python — Dari Project Cari.In

> Versi Python dari konsep OOP yang sama persis kayak di project lo.
> Kalo lo udah paham TypeScript, lo tinggal liat perbedaannya di Python.
> Tiap section: KODE TYPESCRIPT (dari project) -> KODE PYTHON (biar lo paham).

---

## 📖 Glosarium (Biar Gak Bingung)

| Istilah | Python | TypeScript |
|---------|--------|------------|
| Bikin class | `class Nama:` | `class Nama {` |
| Constructor | `def __init__(self):` | `constructor() {` |
| Private field | `self.__nama` (dua underscore) | `private _nama` |
| Protected field | `self._nama` (satu underscore) | `protected _nama` |
| Getter/Setter | `@property` / `@nama.setter` | `get name()` / `set name()` |
| Abstract class | `from abc import ABC, abstractmethod` | `abstract class` |
| Extends | `class Anak(Ortu):` | `class Anak extends Ortu` |
| Type hint | `def func() -> str:` | `func(): string` |
| 'null' | `None` | `null` |

---

## 1. CLASS & OBJECT — Cetakan dan Hasil Jadinya

### TypeScript (project lo):
```typescript
// src/models/Mahasiswa.ts — baris 6
class Mahasiswa extends User {
  get role(): UserRole { return 'mahasiswa'; }
}

// Dipake di AuthContext:
const faiz = new Mahasiswa({ id: '001', name: 'Faiz', email: '...' });
```

### Python (versi sederhana):
```python
# Ini CLASS = cetakan
class Mahasiswa:
    def __init__(self, id: str, name: str, email: str):
        self.id = id
        self.name = name
        self.email = email
    
    def get_role(self) -> str:
        return 'mahasiswa'

# Ini OBJECT = hasil cetakan — baru ada datanya
faiz = Mahasiswa(id='001', name='Faiz', email='faiz@student.unu-jogja.ac.id')
print(faiz.name)      # "Faiz"
print(faiz.get_role()) # "mahasiswa"
```

### Bedanya:

| Konsep | TypeScript | Python |
|--------|------------|--------|
| Bikin objek | `new Mahasiswa(...)` | `Mahasiswa(...)` — gak pake `new` |
| Constructor | `constructor(params)` | `def __init__(self, params)` |
| Type tulis | `name: string` | `name: str` |
| Akses property | `this._name` | `self._name` |

---

## 2. ABSTRACTION — Abstract Class

### TypeScript (project lo — `User.ts` baris 18):
```typescript
export abstract class User {
  private readonly _id: string;
  
  abstract get role(): UserRole;
  
  get initial(): string {
    return this._name.charAt(0).toUpperCase();
  }
}
```

### Python:
```python
from abc import ABC, abstractmethod  # Wajib import dulu!

class User(ABC):  # ABC = Abstract Base Class
    def __init__(self, id: str, name: str, email: str):
        self.__id = id        # __ = private di Python
        self._name = name     # _ = protected
        self._email = email
    
    @property
    def id(self) -> str:
        return self.__id
    
    @property
    def name(self) -> str:
        return self._name
    
    @property
    def initial(self) -> str:
        return self._name[0].upper() if self._name else '?'
    
    @abstractmethod  # 🔴 Ini WAJIB di-override subclass!
    def get_role(self) -> str:
        pass

# Coba ini bakal error:
# u = User('001', 'Test', 'a@b.com')  # TypeError! Gak bisa instansiasi abstract class
```

### Yang sama:

| TypeScript | Python | Artinya |
|------------|--------|---------|
| `abstract class` | `class(ABC)` | Blueprint doang, gak bisa instance |
| `abstract method` | `@abstractmethod` | Wajib diisi subclass |
| `private _id` | `self.__id` | Dikunci, cuma class ini yang bisa |
| `protected _name` | `self._name` | Setengah kunci, subclass bisa |
| Getter `get id()` | `@property` | Pintu baca |

---

## 3. ENCAPSULATION — Private + Getter/Setter

### TypeScript (project lo — `User.ts` baris 20-48):
```typescript
private readonly _id: string;
private _name: string;

get id(): string { return this._id; }
get name(): string { return this._name; }

set name(value: string) {
  if (value.trim().length === 0)
    throw new Error('Nama tidak boleh kosong.');
  this._name = value.trim();
}
```

### Python:
```python
class User:
    def __init__(self, id: str, name: str):
        self.__id = id       # __ = private — gak bisa diakses dari luar
        self.__name = name
    
    @property                # Ini GETTER — @property
    def id(self) -> str:
        return self.__id
    
    @property                # Getter buat name
    def name(self) -> str:
        return self.__name
    
    @name.setter             # Ini SETTER — @nama_property.setter
    def name(self, value: str):
        if len(value.strip()) == 0:
            raise ValueError('Nama tidak boleh kosong.')
        self.__name = value.strip()
```

### Cara pakenya:

```python
u = User('001', 'Faiz')

# ✅ BOLEH:
print(u.name)      # "Faiz" — lewat getter
u.name = 'Galih'   # OK — lewat setter

# ❌ GAK BOLEH:
print(u.__name)    # Error! AttributeError — private!
u.__name = 'Hack'  # Error! Private!
u.id = '002'       # Error! Gak ada setter buat id
```

### Bedanya:

| TypeScript | Python |
|------------|--------|
| `private _id` | `self.__id` (dua underscore) |
| `get name()` | `@property` + `def name(self)` |
| `set name(v)` | `@name.setter` + `def name(self, v)` |
| `throw new Error()` | `raise ValueError()` |

---

## 4. INHERITANCE — Pewarisan

### TypeScript (project lo):
```typescript
// Mahasiswa.ts baris 6
class Mahasiswa extends User {
  get role(): UserRole { return 'mahasiswa'; }
  canModerate(): boolean { return false; }
}

// Admin.ts baris 8
class Admin extends User {
  get role(): UserRole { return 'admin'; }
  canModerate(): boolean { return true; }
  
  async approveReport(id: string) {
    await reportService.approveReport(id);
  }
}
```

### Python:
```python
class Mahasiswa(User):      # extends = (User)
    def get_role(self) -> str:
        return 'mahasiswa'
    
    def can_moderate(self) -> bool:
        return False

class Admin(User):          # Admin juga extends User
    def get_role(self) -> str:
        return 'admin'
    
    def can_moderate(self) -> bool:
        return True
    
    def approve_report(self, report_id: str):   # Method KHUSUS Admin
        print(f'Laporan {report_id} disetujui!')
    
    def reject_report(self, report_id: str, reason: str):
        print(f'Laporan {report_id} ditolak. Alasan: {reason}')
```

### Cara pakenya:

```python
faiz = Mahasiswa('001', 'Faiz', 'faiz@student.unu-jogja.ac.id')
admin = Admin('999', 'Satpam', 'admin@cariin.app')

# ✅ DUA-DUANYA punya name, email, initial — warisan dari User
print(faiz.name)        # "Faiz"
print(admin.name)       # "Satpam"
print(admin.initial)    # "S"

# ✅ BEDA:
print(faiz.can_moderate())  # False ❌
print(admin.can_moderate()) # True ✅

# ✅ KHUSUS ADMIN:
admin.approve_report('R001')
# admin ini method cuma Admin yang punya
```

### Hierarki Report juga:

```python
class ReportModel:
    def __init__(self, title: str, location: str):
        self._title = title       # protected
        self._location = location
    
    def validate(self):           # Bakal di-override
        raise NotImplementedError

class LostReport(ReportModel):
    def validate(self):
        errors = []
        if not self._title: errors.append('Judul wajib')
        if not self._location: errors.append('Lokasi wajib')
        return errors  # ✅ Gak peduli custodyPoint

class FoundReport(ReportModel):
    def __init__(self, title: str, location: str, custody_point: str):
        super().__init__(title, location)  # Panggil constructor induk
        self._custody_point = custody_point
    
    def validate(self):
        errors = []
        if not self._title: errors.append('Judul wajib')
        if not self._location: errors.append('Lokasi wajib')
        if not self._custody_point: errors.append('Titik penitipan wajib')  # ❗ BEDA!
        return errors
```

---

## 5. POLYMORPHISM — Method Sama, Kelakuan Beda

### TypeScript (project lo — `Report.ts`):
```typescript
class LostReport extends ReportModel {
  validate(): string | null {
    if (!this._title) return 'Judul wajib';
    if (!this._location) return 'Lokasi wajib';
    return null;  // ✅ Gak peduli custodyPoint
  }
}

class FoundReport extends ReportModel {
  validate(): string | null {
    if (!this._title) return 'Judul wajib';
    if (!this._location) return 'Lokasi wajib';
    if (!this._custodyPoint) return 'Titik penitipan wajib';  // ❗ BEDA!
    return null;
  }
}
```

### Python:
```python
class LostReport(ReportModel):
    def validate(self):              # Method SAMA: validate()
        if not self._title:
            return 'Judul wajib'
        if not self._location:
            return 'Lokasi wajib'
        return None  # ✅ Lost: gak peduli custodyPoint

class FoundReport(ReportModel):
    def validate(self):              # Method SAMA: validate()
        if not self._title:
            return 'Judul wajib'
        if not self._location:
            return 'Lokasi wajib'
        if not self._custody_point:  # ❗ BEDA! Tambahan ini
            return 'Titik penitipan wajib'
        return None
```

### Polymorphism di Python — Cara Makainya:

```python
def buat_laporan(tipe: str, data: dict):
    """Factory function — milih class runtime"""
    if tipe == 'lost':
        return LostReport(data['title'], data['location'])
    elif tipe == 'found':
        return FoundReport(data['title'], data['location'], data['custody_point'])

# 🔥 Runtime MILIH SENDIRI:
laporan_hilang = buat_laporan('lost', {'title': 'Kunci', 'location': 'Kantin'})
laporan_temu = buat_laporan('found', {'title': 'Dompet', 'location': 'Lab', 'custody_point': 'Satpam'})

# Method SAMA, hasil BEDA:
print(laporan_hilang.validate())  # None (OK) — cek judul+lokasi doang
print(laporan_temu.validate())    # None (OK) — cek judul+lokasi+titipan

# Kalo custody_point-nya kosong:
laporan_error = buat_laporan('found', {'title': 'Dompet', 'location': 'Lab', 'custody_point': ''})
print(laporan_error.validate())   # "Titik penitipan wajib" ❗
```

### Pake if-else (cara lama) vs Polymorphism:

```python
# ❌ CARA LAMA — setiap nambah tipe, kode diutak-atik
def validate_laporan(tipe, title, location, custody_point=None):
    if tipe == 'lost':
        errors = []
        if not title: errors.append('Judul wajib')
        if not location: errors.append('Lokasi wajib')
        return errors
    elif tipe == 'found':
        errors = []
        if not title: errors.append('Judul wajib')
        if not location: errors.append('Lokasi wajib')
        if not custody_point: errors.append('Titik penitipan wajib')
        return errors
    # Kalo nambah tipe 'donated' — nambah cabang lagi!

# ✅ PAKE POLYMORPHISM — tinggal tambah class
class DonatedReport(ReportModel):
    def validate(self):
        errors = []
        if not self._title: errors.append('Judul wajib')
        # Validasi sendiri...
        return errors

# Gak perlu utak-atik kode lama!
```

---

## 6. CHEAT SHEET: TypeScript → Python

| TypeScript | Python |
|------------|--------|
| `class Mahasiswa extends User {` | `class Mahasiswa(User):` |
| `constructor(id: string) {` | `def __init__(self, id: str):` |
| `this._id` | `self._id` |
| `private _id` | `self.__id` |
| `get id(): string { }` | `@property` + `def id(self) -> str:` |
| `set id(v: string) { }` | `@id.setter` + `def id(self, v):` |
| `abstract class User { }` | `class User(ABC):` |
| `abstract method()` | `@abstractmethod` + `def method(self):` |
| `extends` | `(NamaInduk)` |
| `new Mahasiswa()` | `Mahasiswa()` (gak pake new) |
| `throw new Error()` | `raise Exception()` atau `raise ValueError()` |
| `string \| null` | `Optional[str]` atau `str \| None` |
| `import { ... }` | `from ... import ...` |
| `async / await` | `async / await` (sama!) |

---

## 7. KODE LENGKAP: 4 Pilar dalam 1 File Python

```python
from abc import ABC, abstractmethod
  
# ========== ABSTRACTION + ENCAPSULATION ==========
class User(ABC):  # ABC = abstract
    def __init__(self, id: str, name: str, email: str):
        self.__id = id          # private
        self.__name = name      # private
    
    # GETTER
    @property
    def id(self) -> str:
        return self.__id
    
    @property
    def name(self) -> str:
        return self.__name
    
    # SETTER dengan validasi
    @name.setter
    def name(self, value: str):
        if len(value.strip()) == 0:
            raise ValueError('Nama tidak boleh kosong.')
        self.__name = value.strip()
    
    # ABSTRACT METHOD — wajib diisi subclass
    @abstractmethod
    def get_role(self) -> str:
        pass
    
    @abstractmethod
    def can_moderate(self) -> bool:
        pass

# ========== INHERITANCE ==========
class Mahasiswa(User):
    def get_role(self) -> str:
        return 'mahasiswa'
    
    def can_moderate(self) -> bool:
        return False

class Admin(User):
    def get_role(self) -> str:
        return 'admin'
    
    def can_moderate(self) -> bool:
        return True
    
    # Method KHUSUS Admin
    def approve_report(self, report_id: str):
        print(f'Laporan {report_id} disetujui')

# ========== POLYMORPHISM ==========
class ReportModel(ABC):
    def __init__(self, title: str, location: str):
        self._title = title        # protected
        self._location = location
    
    @abstractmethod
    def validate(self):
        pass

class LostReport(ReportModel):
    def validate(self):
        if not self._title:
            return 'Judul wajib'
        if not self._location:
            return 'Lokasi wajib'
        return None  # ✅ Lost: tanpa custodyPoint

class FoundReport(ReportModel):
    def __init__(self, title: str, location: str, custody_point: str):
        super().__init__(title, location)
        self._custody_point = custody_point
    
    def validate(self):
        if not self._title:
            return 'Judul wajib'
        if not self._location:
            return 'Lokasi wajib'
        if not self._custody_point:  # ❗ BEDA!
            return 'Titik penitipan wajib'
        return None

# ========== CARA PAKE ==========
def create_user_model(profile: dict) -> User:
    """Factory — milih class runtime (Polymorphism!)"""
    if profile['role'] == 'admin':
        return Admin(profile['id'], profile['name'], profile['email'])
    else:
        return Mahasiswa(profile['id'], profile['name'], profile['email'])

def create_report_model(tipe: str, data: dict) -> ReportModel:
    """Factory — milih class runtime (Polymorphism!)"""
    if tipe == 'found':
        return FoundReport(data['title'], data['location'], data.get('custody_point', ''))
    else:
        return LostReport(data['title'], data['location'])

# ========== DEMO ==========
if __name__ == '__main__':
    # 1. Abstraction — gak bisa bikin User langsung
    # u = User('001', 'Test', 'a@b.com')  # ERROR! Can't instantiate abstract class
    
    # 2. Inheritance + Polymorphism
    faiz = create_user_model({'role': 'mahasiswa', 'id': '001', 'name': 'Faiz', 'email': 'faiz@student...'})
    admin = create_user_model({'role': 'admin', 'id': '999', 'name': 'Satpam', 'email': 'admin@cariin.app'})
    
    print(faiz.get_role())     # "mahasiswa"
    print(admin.get_role())    # "admin"
    print(faiz.can_moderate()) # False
    print(admin.can_moderate())# True
    
    # 3. Encapsulation
    try:
        admin.name = ''  # Error! Validasi nolak
    except ValueError as e:
        print(f'Error: {e}')  # "Nama tidak boleh kosong."
    
    # 4. Polymorphism: validate() beda
    l1 = create_report_model('lost', {'title': 'Kunci', 'location': 'Kantin'})
    l2 = create_report_model('found', {'title': 'Dompet', 'location': 'Lab', 'custody_point': 'Satpam'})
    
    print(l1.validate())  # None (valid)
    print(l2.validate())  # None (valid)
    
    # 5. Error kalo custody_point kosong
    l3 = create_report_model('found', {'title': 'Dompet', 'location': 'Lab', 'custody_point': ''})
    print(l3.validate())  # "Titik penitipan wajib"
```

---

## 8. KALO MAU JALANIN KODE INI

```bash
# 1. Simpan kode di atas ke file: oop_demo.py
# 2. Jalanin:
python3 oop_demo.py

# 3. Outputnya bakal:
# mahasiswa
# admin
# False
# True
# Error: Nama tidak boleh kosong.
# None
# None
# Titik penitipan wajib
```

---

## RINGKASAN: 4 PILAR OOP DI PYTHON

| Pilar | TypeScript (project lo) | Python |
|-------|------------------------|--------|
| **Abstraction** | `abstract class User` | `class User(ABC)` + `@abstractmethod` |
| **Encapsulation** | `private _id` + getter/setter | `self.__id` + `@property` + `@nama.setter` |
| **Inheritance** | `Mahasiswa extends User` | `class Mahasiswa(User):` |
| **Polymorphism** | `validate()` Lost vs Found beda | `validate()` Lost vs Found beda (sama!) |

---

*OOP di Python dan TypeScript prinsipnya SAMA. Yang beda cuma cara nulisnya doang.*
*Kalo lo udah paham 4 pilar dari project Cari.In, lo udah paham OOP di bahasa manapun.*

---
