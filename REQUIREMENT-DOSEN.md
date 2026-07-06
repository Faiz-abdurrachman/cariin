# Requirement Dosen — Mobile Programming Project

> **Sumber:** `Materi pertemuan 2/Proyek Mobile Programming React Native.pdf`
> **Dosen:** Yana Hendriana — UNU Yogyakarta
> **Tanggal slide:** 6 April 2026
> **Catatan:** Ini hasil konversi verbatim dari PDF asli dosen (via `pdftotext`). Dokumen ini adalah **sumber kebenaran** requirement, bukan `CONTEXT.md` (yang punya beberapa tambahan requirement karangan seperti "Google Auth" yang TIDAK ada di PDF ini).

---

## 1. Project Overview and Objectives

Empat pilar konsep project:
- **Cross-Platform**
- **Data Integration**
- **Backend Services**
- **Personal Interest**

---

## 2. Mandatory Technical Specifications

### 2.1 UI/UX & Core Development — *React Native & Flexbox*
> Build responsive interfaces using **StyleSheet** (**min. 5 screens**). Leverage **React Compiler** and **Suspense** for modern performance standards and cross-platform robustness.

### 2.2 Navigation & Networking — *React Navigation v6 & State*
> Implement **Stack, Tab, and Drawer** patterns. Manage state via **Context API, Zustand, or Redux**. Handle REST APIs using **Axios or Fetch** with **Async/Await** patterns.

### 2.3 Data Storage & Deployment — *AsyncStorage & Expo EAS*
> Ensure offline persistence with **AsyncStorage** and secure **JWT handling via SecureStorage**. Use **Expo EAS Build** to generate **APK/IPA** files for the final project demonstration.

---

## 3. Recommended Project Themes

Konsep inspirasi (pilih salah satu / bebas sesuai minat):
- **Task Manager App** — CRUD tasks, kategori, push notification reminders
- **Expense Tracker** — log pengeluaran harian, visual charts, export CSV
- **Mini Marketplace** — product listing, shopping cart, simulasi checkout
- **E-Learning Application** — daftar course, progress tracking, quiz
- **Health & Fitness Tracker** — log olahraga/makan, visualisasi data historis

---

## 4. Development Timeline and Milestones

### Phase 1: Foundation & Core
- **Weeks 1-2:** Environment setup + UI wireframing dengan Figma prototypes
- **Weeks 3-5:** Implementasi core features — CRUD, Navigation, State management (React Native 0.83)

### Phase 2: Integration & Launch
- **Weeks 6-7:** Integrasi REST APIs + **JWT Authentication**
- **Week 8:** Unit tests, bug fixing, UI refinement
- **Week 9:** Deployment + dokumentasi final (GitHub + video demo)

---

## 5. Standard Project Structure

| Folder | Fungsi |
|--------|--------|
| `src/components` | Reusable UI elements — modular & konsisten |
| `src/screens` | Halaman/view individual aplikasi |
| `src/navigation` | Logic **Stack, Tab, and Drawer** navigators — routing terpusat |
| `src/services` | API call + local storage logic — pisah data fetching dari UI |
| `src/context` | Global state via Context API / Redux |
| `src/utils` | Helper functions, utility methods, konstanta (DRY) |

---

## 6. Grading Criteria Breakdown

| Kriteria | Bobot | Yang Dinilai |
|----------|-------|--------------|
| **Functionality** | **40%** | Core features & CRUD jalan benar. App jalan mulus tanpa crash saat evaluasi. |
| **Code Quality** | **25%** | Clean code, modularitas, struktur maintainable + komentar memadai. |
| **UI/UX Design** | **15%** | Interface intuitif & modern, layout responsive lintas device. |
| **Performance** | **10%** | Loading cepat semua screen, animasi smooth. |
| **Doc & Demo** | **10%** | README lengkap + video demo 3 menit menunjukkan semua fitur inti. |

---

## 7. Final Demo and Submission Requirements

### Video Demo — *Feature Walkthrough*
- Durasi: **3–5 menit** total
- Tampilkan **semua fitur** yang berfungsi
- Pakai emulator atau real device

### Source & Artifacts — *Repository & APK*
- **Public GitHub** repository
- Branch **`main` dan `develop`**
- **Release-ready Android APK**

### Documentation — *Project README*
- Detailed project overview
- Clear installation guides
- App interface **screenshots**

---

## Checklist Compliance Cari.In (vs PDF ini)

| Requirement | Status |
|-------------|--------|
| Min. 5 screens + Flexbox/StyleSheet | ✅ ~30 screens |
| **Stack** Navigator | ✅ AuthNavigator |
| **Tab** Navigator | ✅ Mahasiswa + Admin (Bottom Tab) |
| **Drawer** Navigator | ❌ **BELUM ADA** — gap teknis nyata |
| State (Context/Zustand/Redux) | ✅ Context + Zustand |
| REST via Axios **atau** Fetch | ✅ Supabase (fetch-based) — sah |
| JWT Authentication | ✅ Supabase Auth |
| AsyncStorage (offline) | ✅ |
| SecureStorage (JWT) | ⚠️ `expo-secure-store` keinstall — verifikasi beneran dipakai |
| Expo EAS Build → APK | 🟡 `eas.json` ada, APK belum di-build |
| Video demo 3–5 menit | 🟡 belum |
| GitHub public, `main` + `develop` | 🟡 `main` ada, `develop` belum |
| README + install + screenshots | ⚠️ ada, tapi klaim "Google OAuth" perlu dihapus (nggak diminta & nggak diimplementasi) |

> **Catatan penting:** "Google Authentication" dan "Realtime Database (wajib)" yang ditulis di `CONTEXT.md` **TIDAK ada di PDF ini**. Auth yang diminta cuma **JWT**. Jadi Google OAuth bukan kewajiban dari dosen.
