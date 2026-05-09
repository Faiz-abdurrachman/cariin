# CLAUDE.md — Cari.In Mobile (handoff untuk AI assistant baru)

> File ini auto-read sama Claude Code saat start sesi. Targetnya: AI baru langsung paham project tanpa briefing manual.
> Update tiap akhir FASE atau saat ada pattern baru yang penting.

---

## 0. PROTOKOL RESUME (BACA INI DULU)

Saat start sesi:
1. **Baca file ini sampai habis** — pattern & gotcha penting ada di section 4-6.
2. **Baca `CHECKPOINT.md`** — status terkini, fase mana yang udah selesai, akun test, issue terdokumentasi.
3. **Baca `NEXT_STEPS.md`** — plan fase berikutnya step-by-step.
4. **Cek `git log --oneline -10`** untuk konfirmasi commit terkini match dengan CHECKPOINT.
5. Cek memory di `~/.claude/projects/-home-faiz-Semester-4-Mobile-Programming-cariin-cariin-mobile/memory/MEMORY.md` untuk konteks user/feedback.

User akan trigger lanjut dengan: *"Baca CHECKPOINT.md dan NEXT_STEPS.md, lanjut FASE X"*. Kasih rekap plan + tanya scope sebelum eksekusi.

---

## 1. PROJECT RINGKAS

**Cari.In** — aplikasi lost & found kampus untuk mahasiswa UNU Yogyakarta. Tugas Mobile Programming Semester 4.
- **Stack:** Expo SDK 54, React Native 0.81.5, NativeWind v4, TypeScript strict, Zustand + Context.
- **Backend:** Supabase (Auth + Postgres + Storage). **BUKAN Firebase.**
- **Navigasi:** React Navigation v7 (Stack + Tab + Drawer) — wajib dosen.
- **Status:** FASE 1-4 done. FASE 4.5/5/6 belum.

---

## 2. FILE PENTING — APA BOLEH DIUBAH

### JANGAN UBAH (sumber kebenaran dari dosen/spec):
- `CONTEXT.md` — spec lengkap project dari dosen
- `UI_AUDIT.md` — inventory 26 screen + spec UI

### UPDATE TIAP AKHIR FASE:
- `CHECKPOINT.md` — status snapshot (hash commit, akun, issue, file placeholder remaining)
- `NEXT_STEPS.md` — plan fase berikutnya
- `CLAUDE.md` (file ini) — kalau ada pattern/gotcha baru yang AI lain perlu tau

### REFERENSI VISUAL (jangan diubah):
- `../cariin-web/*.html` — 26 prototype HTML, sumber design tiap screen RN. **Selalu Read file HTML yang relevan dulu sebelum implement screen baru.**

---

## 3. ATURAN KERJA (USER PREFERENCE)

- **Bahasa:** Indonesia casual (lo/gw). User student, suka step-by-step pelan-pelan dengan screenshot per step kalau setup eksternal (Supabase Dashboard, Expo Go).
- **Decision style:** kasih opsi A/B/C dengan trade-off jelas via `AskUserQuestion`. User suka konfirmasi sebelum eksekusi keputusan non-trivial. Pakai label `(Recommended)` di opsi paling masuk akal.
- **Tes runtime:** user yang test di Expo Go iPhone. Sebelum claim "FASE selesai", minta screenshot verify.
- **Push ke origin:** **JANGAN** kecuali user eksplisit minta. Saat ini commit accumulate di local main, belum push.
- **Commit pesan format:**
  ```
  FASE N: ringkasan pendek

  - Bullet list perubahan utama
  - Catatan defer kalau ada

  Verifikasi: tsc clean, manual E2E di iPhone Expo Go (...)

  Co-Authored-By: Claude Opus X.X <noreply@anthropic.com>
  ```

---

## 4. PATTERN WAJIB DI PROJECT INI

### 4.1 — Pressable styling: PAKAI children-as-function

⚠️ **CRITICAL** ⚠️ Pressable dengan `style={({pressed}) => ({...})}` (function-form style) **SERING BROKEN** di RN/Expo SDK 54 versi project ini. Gejala: tombol invisible (style gak apply), Image collapse, layout berantakan.

**❌ JANGAN pake:**
```tsx
<Pressable
  style={({ pressed }) => ({ backgroundColor: 'black', opacity: pressed ? 0.85 : 1 })}
>
  <Text style={{ color: 'white' }}>Submit</Text>
</Pressable>
```

**✅ PAKAI ini (children-as-function):**
```tsx
<Pressable onPress={...} accessibilityRole="button">
  {({ pressed }) => (
    <View style={{ backgroundColor: 'black', opacity: pressed ? 0.85 : 1 }}>
      <Text style={{ color: 'white' }}>Submit</Text>
    </View>
  )}
</Pressable>
```

Confirmed working: `PrimaryButton.tsx`, `RoleSelectionScreen.RoleCard`, FASE 4 Create/Detail/Profile/MyPosts/Success.

### 4.2 — Image dimensions: explicit numbers, bukan `100%` bila parent bisa kolaps

Image dengan `width: '100%', height: '100%'` di-nest di Pressable yang stylenya gak stable bisa bikin parent kolaps ke height 0. Solusi:
- Set parent View `height: <number>` eksplisit
- Image-nya boleh `width: '100%', height: <number>` atau `width: <number>, height: <number>`

### 4.3 — Modal back button: pakai parent navigator

Screen pertama di nested modal stack (mis. CreateLost di CreateModal stack) **gak punya history**. `nav.goBack()` di sana = no-op. Untuk dismiss modal:

```ts
const closeModal = () => {
  const root = nav.getParent<StackNavigationProp<RootStackParamList>>();
  if (root && root.canGoBack()) root.goBack();
  else if (root) root.navigate('MainTabs', { screen: 'HomeTab', params: { screen: 'HomeFeed' } });
};
```

### 4.4 — Header dengan title absolute: pasang `pointerEvents="none"`

Title `<Text style={{ position: 'absolute', left: 0, right: 0 }}>` bisa nge-cover tombol back di belakangnya dan capture tap. Selalu `pointerEvents="none"` di Text title overlay.

### 4.5 — Supabase error handling

`PostgrestError` dari Supabase **bukan instance Error class** — `err instanceof Error` returns false. Wrap di service layer:
```ts
if (error) throw new Error(error.message);
```
Pattern dipake konsisten di `auth.service.ts`, `report.service.ts`.

### 4.6 — RLS WITH CHECK: hati-hati replikasi USING

Saat bikin policy UPDATE, jangan otomatis replikasi USING ke WITH CHECK. WITH CHECK validate **NEW row state** (setelah update). Kalau USING punya predicate yang mau di-bypass setelah update (mis. `status='resolved'`), WITH CHECK harus lebih lenient.

Contoh fix di FASE 4: `reports_update_self` semula reject `markAsResolved()` karena WITH CHECK requires `status <> 'resolved'`. Fix: WITH CHECK cuma cek `user_id = auth.uid()`.

### 4.7 — Path alias

Import pakai `@/*` (= `src/*`). Jangan relatif panjang.

### 4.8 — Komentar code

Default no comments. Tulis komentar HANYA kalau:
- Ada hidden constraint atau workaround spesifik
- Ada pattern yang surprising bagi pembaca baru
- WHY non-obvious (bukan WHAT — variable name harus self-documenting)

Contoh acceptable:
```ts
// PostgrestError bukan Error instance — bungkus jadi Error agar
// pesannya kebaca di catch block UI.
throw new Error(profileErr.message);
```

---

## 5. SUPABASE — STATE PENTING

- **Project URL prefix:** `kytsksnyoyffwbksotps.supabase.co`
- **Dashboard:** https://supabase.com/dashboard/project/kytsksnyoyffwbksotps
- `.env` lokal terisi (URL + ANON_KEY + ALLOWED_EMAIL_DOMAIN=`student.unu-jogja.ac.id`)
- Schema: 5 tabel (profiles/reports/conversations/messages/notifications) + RLS + triggers + GRANTs di `supabase-schema.sql`
- **Email Auth Enabled, Confirm Email OFF** (dev convenience)
- **`profiles_admin_all` policy DI-COMMENT-OUT** karena rekursi RLS via `is_admin()`. Defer FASE 5; admin moderate via service_role atau RPC security definer.
- **Storage buckets:** `report-photos` ✅ + 3 policies, `avatars` ✅ + 3 policies, `chat-media` (created tapi belum policy — defer FASE 4.5)

### Akun test seeded
| Role | Email | Password | UUID |
|------|-------|----------|------|
| admin | `admin@cariin.app` | `admin123` | `c80aa818-4803-42f0-9265-5bb52cc81e19` |
| mahasiswa | `faiz@student.unu-jogja.ac.id` | `faizfaiz` | `14719036-99a4-4b8d-9bf0-8dce43cee0e0` |

UUID-nya stabil — copas kalau perlu SQL seed/query manual.

---

## 6. QUICK COMMANDS

```bash
cd cariin-mobile

# dev server
npm start
# atau buat web preview (sudah enable di FASE 4):
npx expo start --web      # buka di Chrome laptop

# typecheck
npx tsc --noEmit

# lint (legacy config — TODO migrate ke flat config FASE 6)
ESLINT_USE_FLAT_CONFIG=false npx eslint "src/**/*.{ts,tsx}"

# expo health check
npx expo-doctor

# clear cache (Metro lengket sering bikin fix gak ke-load)
npx expo start --clear
```

---

## 7. PERSISTEN MEMORY (lintas-sesi)

Memory user/feedback/project disimpan di `~/.claude/projects/-home-faiz-Semester-4-Mobile-Programming-cariin-cariin-mobile/memory/`. AI baru otomatis baca via MEMORY.md index.

Key memories:
- `feedback_communication.md` — Indonesia casual, screenshot per step
- `feedback_decision_style.md` — opsi A/B/C dengan trade-off
- `feedback_resume.md` — update CHECKPOINT/NEXT_STEPS tiap akhir sesi
- `feedback_pressable_pattern.md` — pattern Pressable wajib children-as-function
- `project_state.md` — status fase
- `project_supabase.md` — Supabase setup detail
- `reference_cariin_web.md` — sumber visual prototype HTML

---

## 8. ARSITEKTUR — MAP CEPAT

```
RootNavigator (src/navigation/index.tsx)
  └── isLoading → LoadingScreen
  └── !isAuthenticated → AuthNavigator
  │     └── Splash → RoleSelection → Login | Register | ForgotPassword
  └── role==='admin' → AdminNavigator (Drawer indigo)
  │     └── Dashboard | Semua Laporan | Buat Laporan | (Logout custom)
  └── role==='mahasiswa' → MainNavigator (Bottom Tab + Modal)
        ├── HomeTab → HomeStack (HomeFeed + Detail*)
        ├── ChatTab → ChatStack (Inbox/ChatRoom — placeholder, FASE 4.5)
        ├── CreateTab (FAB tombol +) → modal CreateModal (CreateLost/Found shared + Success)
        ├── MyPostsTab → MyPostsStack (MyPosts + EditPost + Detail*)
        └── ProfileTab → ProfileStack (Profile + Settings/Help/UserProfile placeholder)
```

State global:
- `AuthContext` (`src/context/AuthContext.tsx`) — session, user, userProfile, role, methods
- `feedStore` Zustand — reports cache + filter (HomeFeed)
- `chatStore` Zustand — masih stub (FASE 4.5)

---

## 9. TIPS UNTUK AI BARU

- **Saat user kasih screenshot bug, jangan langsung fix** — analisa dulu screenshot vs code, identify root cause, baru patch. User suka penjelasan sebelum eksekusi.
- **Sebelum implement screen baru, READ HTML referensi di `../cariin-web/*.html`**. Layout, color, spacing harus match prototype.
- **Setiap edit code, langsung `npx tsc --noEmit`** verify gak ada type error sebelum klaim sukses.
- **Saat user complain "X gak jalan", cek pattern Pressable section 4.1** dulu — paling sering itu masalahnya.
- **Sebelum commit, WAJIB update CHECKPOINT.md + NEXT_STEPS.md** untuk reflect state baru. User pernah eksplisit minta ini biar lintas-sesi gak bingung.
- **Jangan push tanpa diminta.** Sekali user bilang "push" itu cuma untuk konteks itu — bukan permanent permission.
