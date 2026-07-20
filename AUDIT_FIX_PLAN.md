# AUDIT FIX PLAN — Cari.In Mobile

> Rencana perbaikan berdasarkan audit 13 kategori (`AUDIT_REPORT.md`).
> Urutan sudah dioptimasi: **blocker dulu → quick win → polishing → pasca-submission**.

---

## Ringkasan Kondisi

| Metrik | Saat Ini | Target |
|--------|----------|--------|
| Risk Score | 42/100 | ≤25 |
| Production Readiness | 52% | ≥70% |
| Test Coverage | 0% | ≥30% |
| CI/CD | 0 pipelines | 1 pipeline |
| Oversized files (>400 LOC) | 6 file | ≤3 file |

---

## FASE A: BLOKER SUBMISSION (harus kelar sebelum submit)

> Masalah yang dosen/penilai bisa lihat langsung — harus fix dulu.

### A1. Fix `search_path` di SECURITY DEFINER Functions 🔴

| | |
|---|---|
| **Severity** | HIGH (security vulnerability) |
| **File** | `supabase-schema.sql` |
| **Estimasi** | 30 menit |
| **Dependensi** | Tidak ada |

**Masalah:** 7 fungsi pakai `SECURITY DEFINER` tanpa `SET search_path = ''`. Ini celah
search_path injection — attacker bisa override fungsi system dengan nama yang sama.

**Fix:** Tambahin `SET search_path = ''` di setiap function SECURITY DEFINER.

```sql
CREATE OR REPLACE FUNCTION public.update_report_status(...)
RETURNS ...
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''  -- ← ini yang kurang
AS $$
...
```

**Verifikasi:** Run ulang schema di remote, pastikan tidak ada error.

---

### A2. Audit Warna & Visual Konsistensi 🟠

| | |
|---|---|
| **Severity** | MEDIUM (visual regression risk) |
| **File** | `src/utils/constants.ts`, `tailwind.config.js` |
| **Estimasi** | 30 menit |
| **Dependensi** | Tidak ada |

**Masalah:** `COLORS.primary = #2563EB` (biru) tapi `tailwind.config.js` punya
`primary: '#18181B'` (hitam). Kalau ada komponen yang campur inline style + className,
warnanya bisa beda.

**Fix:**
1. Sinkronkan tailwind `primary` ke `#2563EB`
2. Atau sebaliknya — tentuin satu source of truth
3. Verifikasi gak ada yang patah

**Verifikasi:** Visual test semua screen di Expo Go.

---

### A3. Error Boundary Global 🟡

| | |
|---|---|
| **Severity** | LOW (UX) |
| **File** | `src/components/ErrorBoundary.tsx` (baru) + `App.tsx` |
| **Estimasi** | 45 menit |
| **Dependensi** | Tidak ada |

**Masalah:** Kalau satu screen crash (misal render error), seluruh app blank putih.
Gak ada fallback UI.

**Fix:** Bikin `ErrorBoundary` class component yang wrap root app + tampilin
"Ada yang salah, silakan restart" dengan tombol reload.

---

## FASE B: QUICK WINS (cepet, dampak langsung)

### B1. Pindahin `@expo/ngrok` ke devDependencies 🔴

| | |
|---|---|
| **Severity** | MEDIUM (bundle size) |
| **File** | `package.json` |
| **Estimasi** | 2 menit |
| **Dependensi** | Tidak ada |

**Fix:** Pindah dari `dependencies` ke `devDependencies`.

```bash
npm uninstall @expo/ngrok && npm install --save-dev @expo/ngrok
```

**Verifikasi:** `npx expo start --tunnel` masih jalan.


### B2. Optimasi FlatList (HomeScreen + AdminDashboard) 🟠

| | |
|---|---|
| **Severity** | MEDIUM (scroll performance) |
| **File** | `HomeScreen.tsx`, `AdminDashboardScreen.tsx`, `AdminReportsScreen.tsx` |
| **Estimasi** | 45 menit |
| **Dependensi** | Tidak ada |

**Masalah:** FlatList tanpa optimasi render — semua item di-render sekaligus.

**Fix:** Tambahin props: `windowSize={5}`, `maxToRenderPerBatch={5}`,
`initialNumToRender={4}`, `removeClippedSubviews`, `getItemLayout`.


### B3. `eslint-disable` Cleanup di AdminDashboard 🟠

| | |
|---|---|
| **Severity** | LOW (code quality) |
| **File** | `src/screens/admin/AdminDashboardScreen.tsx` |
| **Estimasi** | 20 menit |
| **Dependensi** | Tidak ada |

**Masalah:** 5× `// eslint-disable-next-line @typescript-eslint/no-explicit-any`
untuk navigasi ke parent screen.

**Fix:** Bikin helper typed function untuk `nav.getParent()?.navigate()`.


---

## FASE C: POLISHING (perbaikan jangka menengah)

### C1. Split `AdminNavigator.tsx` (501 LOC) 🟡

| | |
|---|---|
| **Severity** | LOW (maintainability) |
| **File** | `src/navigation/AdminNavigator.tsx` |
| **Estimasi** | 1 jam |
| **Dependensi** | Tidak ada |

Extract inline components: AdminProfileScreen, AdminDrawerContent ke file sendiri.


### C2. Split `AdminEditReportScreen.tsx` (860 LOC) 🟡

| | |
|---|---|
| **Severity** | LOW (maintainability) |
| **File** | `src/screens/admin/AdminEditReportScreen.tsx` |
| **Estimasi** | 1.5 jam |
| **Dependensi** | Tidak ada |

Extract: EditReportForm, WalkInIdentityFields, PhotoUploader.


### C3. Offline Handling untuk Create/Submit 🟡

| | |
|---|---|
| **Severity** | LOW (UX) |
| **File** | `CreateReportScreen.tsx`, service layer |
| **Estimasi** | 2 jam |
| **Dependensi** | Tidak ada |

Save draft ke AsyncStorage saat network fail, tampilkan banner draft pending di HomeScreen.


### C4. Notifikasi pakai Realtime (bukan polling) 🟡

| | |
|---|---|
| **Severity** | LOW (efficiency) |
| **File** | `src/context/NotifContext.tsx` |
| **Estimasi** | 2 jam |
| **Dependensi** | Tidak ada |

Ganti `setInterval(polling, 15000)` dengan Supabase Realtime channel subscription.


---

## FASE D: PASCA-SUBMISSION (gak nge-block FASE 6)

### D1. Unit Tests (service layer) 🔴

| | |
|---|---|
| **Severity** | HIGH (regression risk) |
| **Estimasi** | 3-5 hari |
| **Dependensi** | Jest setup di Expo |

**Scope minimum untuk 30% coverage:**
- `auth.service.ts` — login, register, logout, resetPassword
- `report.service.ts` — listReports, createReport, markAsResolved
- `validators.ts` — isValidCampusEmail, isValidPassword, isValidNim
- `formatters.ts` — formatRelativeTime, categoryLabel

**Stack:** Jest + React Native Testing Library.


### D2. CI/CD Pipeline (GitHub Actions) 🔴

| | |
|---|---|
| **Severity** | HIGH (build reliability) |
| **Estimasi** | 1-2 hari |
| **Dependensi** | Tidak ada |

Pipeline: checkout → npm ci → tsc → lint → test → build.


### D3. Database Migration Versioning 🟠

| | |
|---|---|
| **Severity** | MEDIUM (schema drift risk) |
| **Estimasi** | 2 jam |
| **Dependensi** | Tidak ada |

Pecah `supabase-schema.sql` jadi: `001_initial_schema.sql`, `002_rls_policies.sql`,
`003_triggers.sql`, `004_storage_policies.sql`, `005_admin_full_crud.sql`,
`006_function_hardening.sql`.


### D4. Accessibility Audit 🟡

| | |
|---|---|
| **Severity** | LOW |
| **Estimasi** | 4 jam |
| **Dependensi** | Tidak ada |

Tambahkan `accessibilityState`, `accessibilityHint`, `accessibilityLiveRegion`
ke komponen interaktif.

---

## URUTAN EKSEKUSI REKOMENDASI

```
FASE A (Blocker: ~2 jam)
  ├─ A1: search_path fix              [30m]  ← PALING PENTING
  ├─ A2: color token sync             [30m]
  └─ A3: error boundary               [45m]

FASE B (Quick Wins: ~1 jam)
  ├─ B1: ngrok → devDeps              [2m]   ← PALING CEPET
  ├─ B2: FlatList optimasi            [45m]
  └─ B3: eslint-disable cleanup       [20m]

FASE C (Polish: ~6.5 jam)
  ├─ C1: split AdminNavigator         [1j]
  ├─ C2: split AdminEditReport        [1.5j]
  ├─ C3: offline handling             [2j]
  └─ C4: Realtime notif               [2j]

FASE D (Pasca-submission: ~8+ hari)
  ├─ D1: unit tests                   [3-5 hari]
  ├─ D2: CI/CD pipeline               [1-2 hari]
  ├─ D3: migration versioning         [2 jam]
  └─ D4: accessibility audit          [4 jam]
```

---

## ESTIMASI TOTAL

| Fase | Estimasi | Blocker? |
|------|----------|----------|
| A — Blocker Submission | ~2 jam | ✅ YA |
| B — Quick Wins | ~1 jam | ❌ Nice-to-have |
| C — Polish | ~6.5 jam | ❌ Nice-to-have |
| D — Pasca-Submission | ~8+ hari | ❌ Defer |
| **TOTAL untuk submit** | **~3 jam** | |
| **TOTAL keseluruhan** | **~10+ hari** | |

---

## YANG GAK DIPERBAIKI (DENGAN ALASAN)

| Issue | Alasan Skip |
|-------|-------------|
| BlurView + LinearGradient berlebihan | Ciri khas visual Cari.In (glass morphism). Bukan bug. |
| `fix_glass*.js` di root | Script cleanup ad-hoc, gak masuk production bundle. |
| `promt.md` | Catatan pribadi user, bukan bagian aplikasi. |
| Photo upload OOM risk | Belum ada laporan bug konkret. |
| `feedStore` migration strategy | Cache offline sederhana, belum butuh migration. |
