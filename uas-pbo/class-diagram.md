# Class Diagram — Cari.In (PBO)

> Diagram kelas model domain OOP (`src/models/`). Tersedia 2 format:
> - **Mermaid** → otomatis ter-render di GitHub / VS Code (preview).
> - **PlantUML** → paste ke [plantuml.com](https://www.plantuml.com/plantuml) atau draw.io untuk export PNG/SVG (buat slide PPT).

---

## 1. Mermaid (render langsung di GitHub)

### 1.1 Hierarki User

```mermaid
classDiagram
    class User {
        <<abstract>>
        -string _id
        -string _name
        -string _email
        -string _nim
        -string _faculty
        -string _avatarUrl
        +get id() string
        +get name() string
        +set name(value) void
        +get initial() string
        +role()* UserRole
        +getRoleLabel()* string
        +canModerate()* boolean
    }
    class Mahasiswa {
        +role() UserRole
        +getRoleLabel() string
        +canModerate() boolean
        +canPublishDirectly() boolean
    }
    class Admin {
        +role() UserRole
        +getRoleLabel() string
        +canModerate() boolean
        +canPublishDirectly() boolean
        +approveReport(reportId, note) Promise
        +rejectReport(reportId, reason) Promise
    }
    User <|-- Mahasiswa : extends
    User <|-- Admin : extends
```

### 1.2 Hierarki Report

```mermaid
classDiagram
    class ReportModel {
        <<abstract>>
        #string _title
        #CategoryId _category
        #string _location
        #string _description
        +get title() string
        +get category() CategoryId
        +get location() string
        +type()* ReportType
        +getTypeLabel()* string
        +validate()* string
    }
    class LostReport {
        +type() ReportType
        +getTypeLabel() string
        +validate() string
    }
    class FoundReport {
        -string _custodyPoint
        +get custodyPoint() string
        +type() ReportType
        +getTypeLabel() string
        +validate() string
    }
    ReportModel <|-- LostReport : extends
    ReportModel <|-- FoundReport : extends
```

---

## 2. PlantUML (export PNG/SVG untuk PPT)

```plantuml
@startuml CariIn_ClassDiagram
skinparam classAttributeIconSize 0
skinparam monochrome false
title Cari.In — Class Diagram (Domain Model OOP)

abstract class User {
  - _id : string
  - _name : string
  - _email : string
  - _nim : string
  - _faculty : string
  - _avatarUrl : string
  --
  + get id() : string
  + get name() : string
  + set name(value)
  + get initial() : string
  {abstract} + role() : UserRole
  {abstract} + getRoleLabel() : string
  {abstract} + canModerate() : boolean
}

class Mahasiswa {
  + role() : UserRole
  + getRoleLabel() : string
  + canModerate() : boolean
  + canPublishDirectly() : boolean
}

class Admin {
  + role() : UserRole
  + getRoleLabel() : string
  + canModerate() : boolean
  + canPublishDirectly() : boolean
  + approveReport(reportId, note)
  + rejectReport(reportId, reason)
}

User <|-- Mahasiswa
User <|-- Admin

abstract class ReportModel {
  # _title : string
  # _category : CategoryId
  # _location : string
  # _description : string
  --
  + get title() : string
  + get category() : CategoryId
  + get location() : string
  {abstract} + type() : ReportType
  {abstract} + getTypeLabel() : string
  {abstract} + validate() : string
}

class LostReport {
  + type() : ReportType
  + getTypeLabel() : string
  + validate() : string
}

class FoundReport {
  - _custodyPoint : string
  + get custodyPoint() : string
  + type() : ReportType
  + getTypeLabel() : string
  + validate() : string
}

ReportModel <|-- LostReport
ReportModel <|-- FoundReport

@enduml
```

---

## 3. Keterangan Pilar OOP pada Diagram

| Simbol / Elemen | Pilar OOP |
|-----------------|-----------|
| `«abstract» User` / `ReportModel` | **Abstraction** — tidak bisa di-instansiasi langsung |
| `- _id`, `- _name` (tanda minus = private) | **Encapsulation** — field private |
| `+ get / set` | **Encapsulation** — akses terkontrol |
| Panah `<|--` (extends) | **Inheritance** — Mahasiswa/Admin ← User |
| `canModerate()`, `validate()` beda tiap subclass | **Polymorphism** — override |

> Sumber kebenaran: `src/models/User.ts`, `Mahasiswa.ts`, `Admin.ts`, `Report.ts`.
