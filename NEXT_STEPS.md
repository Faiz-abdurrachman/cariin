# NEXT_STEPS — Rencana FASE 2

> Rencana detail langkah-langkah FASE 2 (Fondasi Navigasi).
> Baca `CHECKPOINT.md` dulu untuk konteks status saat ini.

---

## TUJUAN FASE 2

Membangun fondasi navigasi & state otentikasi sehingga setelah ini selesai:
- App bisa branching antar 3 navigator besar (Auth / Main / Admin) berdasarkan status login + role user.
- Semua 26 screen placeholder bisa dibuka via navigation (tidak crash).
- AuthContext jadi single source of truth untuk user, role, isLoading, isAuthenticated.

**FASE 2 belum implementasi screen — itu di FASE 3 ke atas.** Yang dibangun di sini hanya kerangka navigasi + state global.

---

## URUTAN TASK (WAJIB IKUTI)

### 2.0 — Pre-flight Check (sebelum mulai coding)
1. Pastikan user sudah:
   - Buat Supabase project (sudah dilakukan saat migrasi — `.env` sudah berisi `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY`).
   - Run `supabase-schema.sql` di Supabase Dashboard → SQL Editor untuk bikin tabel + RLS policies.
   - Test FASE 1 di Expo Go — splash render dengan styling NativeWind aktif.
2. Verifikasi `.env` sudah ada `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY` (non-empty). `supabase.ts` cuma `console.warn` (bukan throw) kalau env kosong, jadi App tidak crash — tapi semua call ke Supabase bakal gagal.

### 2.1 — TypeScript Route Param Types (DULU, biar autocomplete jalan)
**File:** `src/navigation/types.ts`

Definisikan param list untuk setiap navigator:
```typescript
export type AuthStackParamList = {
  Splash: undefined;
  RoleSelection: undefined;
  Login: { isAdmin?: boolean } | undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  HomeFeed: undefined;
  DetailLost: { reportId: string };
  DetailFound: { reportId: string };
  ChatRoom: { conversationId: string; reportId: string };
  UserProfile: { userId: string };
};

export type ChatStackParamList = { ... };
export type CreateModalParamList = { ... };
export type MyPostsStackParamList = { ... };
export type ProfileStackParamList = { ... };
export type MainTabParamList = { ... };
export type AdminDrawerParamList = { ... };
export type RootParamList = AuthStackParamList & MainTabParamList & AdminDrawerParamList;
```

Lalu tambah module declaration untuk React Navigation v7 type safety:
```typescript
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootParamList {}
  }
}
```

### 2.2 — AuthContext (state global user + role)
**File:** `src/context/AuthContext.tsx`

State yang di-expose:
- `user: User | null` — Supabase user object (dari `supabase.auth.getUser()` / `session.user`)
- `userProfile: UserProfile | null` — data dari tabel Supabase `profiles` (row dengan `id = session.user.id`: role, name, nim, faculty, dll)
- `role: 'mahasiswa' | 'admin' | null`
- `isLoading: boolean` — true saat onAuthStateChanged belum fire pertama kali
- `isAuthenticated: boolean`

Fungsi yang di-expose:
- `loginWithEmail(email, password)` — validasi domain dulu via `isValidCampusEmail`, lalu `supabase.auth.signInWithPassword({ email, password })`
- `loginWithGoogle()` — `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'cariin://auth-callback' } })` dibungkus `expo-web-browser.openAuthSessionAsync` (browser flow). Tidak butuh native module, jalan di Expo Go.
- `register(data)` — validasi domain → `supabase.auth.signUp({ email, password })` → setelah sukses, insert ke tabel `profiles` (role default `mahasiswa`). Atau pakai database trigger (lihat `supabase-schema.sql`).
- `logout()` — `supabase.auth.signOut()` + clear state
- `resetPassword(email)` — `supabase.auth.resetPasswordForEmail(email, { redirectTo: 'cariin://reset-password' })`

Logic di useEffect:
- Initial: `supabase.auth.getSession()` untuk dapat session yang sudah ada (dari AsyncStorage)
- Subscribe `supabase.auth.onAuthStateChange((event, session) => ...)`
- Saat session ada: fetch row `profiles` by `id = session.user.id` untuk dapat role
- Saat session null: clear state
- Set `isLoading = false` setelah getSession + first onAuthStateChange settle

**Hook:** `export function useAuth(): AuthContextValue`

### 2.3 — Root Navigator (branching)
**File:** `src/navigation/index.tsx`

Logika:
```typescript
const { isLoading, isAuthenticated, role } = useAuth();

if (isLoading) return <LoadingScreen />;
if (!isAuthenticated) return <AuthNavigator />;
if (role === 'admin') return <AdminNavigator />;
return <MainNavigator />;
```

Wrap dengan `<NavigationContainer>` (dari `@react-navigation/native`) di sini.

**Catatan:** `LoadingScreen` belum ada di `src/screens/`. Buat inline atau tambah `src/screens/LoadingScreen.tsx` baru (1 file kecil).

### 2.4 — AuthNavigator (Stack)
**File:** `src/navigation/AuthNavigator.tsx`

Pakai `createStackNavigator` dari `@react-navigation/stack`.
Routes urut: `Splash` → `RoleSelection` → `Login` / `Register` / `ForgotPassword`.
Initial route: `Splash`.
Header: `headerShown: false` untuk semua route auth (full-screen design).

### 2.5 — MainNavigator (Bottom Tab + nested Stacks + Modal)
**File:** `src/navigation/MainNavigator.tsx`

Pakai `createBottomTabNavigator` dari `@react-navigation/bottom-tabs`.

5 tab:
1. **Home** — wrap `HomeStack` (HomeScreen → DetailLost/DetailFound/ChatRoom/UserProfile)
2. **Pesan** — wrap `ChatStack` (InboxScreen → ChatRoomScreen → UserProfileScreen)
3. **FAB (+)** — bukan tab biasa. Pakai `tabBarButton` custom yang menonjol ke atas. Saat ditekan: navigate ke modal route `Create` (CreateLost ↔ CreateFound → Success). Modal bisa pakai `Stack.Screen` dengan `presentation: 'modal'`.
4. **Laporanku** — wrap `MyPostsStack` (MyPostsScreen → EditPostScreen)
5. **Profil** — wrap `ProfileStack` (ProfileScreen → SettingsScreen / HelpScreen / UserProfileScreen)

**Catatan implementasi FAB:** Tab tengah perlu custom button. Pattern yang sudah teruji:
```typescript
<Tab.Screen
  name="Create"
  component={DummyComponent}
  options={{
    tabBarButton: (props) => <FabButton onPress={() => navigation.navigate('CreateModal')} />,
  }}
  listeners={{ tabPress: (e) => e.preventDefault() }}
/>
```
Lalu daftarkan `CreateModal` sebagai route Stack di level lebih tinggi (atau pakai `RootStack` yang membungkus MainTab).

**Icon:** pakai `@expo/vector-icons` (Ionicons atau Feather). Warna aktif `COLORS.primary`, inactive `COLORS.textMuted`.

### 2.6 — AdminNavigator (Drawer)
**File:** `src/navigation/AdminNavigator.tsx`

Pakai `createDrawerNavigator` dari `@react-navigation/drawer`.

4 item drawer:
1. **Dashboard** — wrap stack `AdminDashboard` → `AdminReview`
2. **Semua Laporan** — `AdminReportsScreen`
3. **Buat Laporan** — wrap stack `AdminCreateLost` ↔ `AdminCreateFound`
4. **Logout** — custom drawer item; on press → `logout()` dari useAuth

**Aksen warna:** `COLORS.admin` (#4F46E5 indigo) untuk active item background, header tint, dll. Konfigurasi via `drawerActiveBackgroundColor`, `drawerActiveTintColor`.

**Catatan:** Drawer butuh `react-native-gesture-handler` di-import paling atas di `index.ts` (Expo entry). Verifikasi sudah ada — kalau belum, tambahkan `import 'react-native-gesture-handler';` sebagai baris pertama `index.ts`.

### 2.7 — Update App.tsx
**File:** `App.tsx`

Hapus splash sederhana FASE 1. Ganti jadi:
```typescript
import './global.css';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/context/AuthContext';
import RootNavigator from '@/navigation';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
```

### 2.8 — Verifikasi FASE 2
1. `npx tsc --noEmit` — harus clean.
2. `npm start` di Expo Go — harus muncul `SplashScreen` placeholder lalu bisa navigate ke RoleSelection (kalau auto-navigate dari Splash sudah di-wire) atau minimal AuthNavigator render tanpa crash.
3. Cek manual: tap RoleSelection → Login → Register → ForgotPassword — semua harus bisa dibuka & back.
4. Karena belum ada login flow, tidak bisa test branching ke MainNavigator/AdminNavigator. Cara test cepat: hardcode `isAuthenticated = true` + `role = 'mahasiswa'` di AuthContext sementara, pastikan MainNavigator render dengan 5 tab. Lalu balik ke `false` sebelum commit.

### 2.9 — Commit FASE 2
Pesan commit:
```
FASE 2: Fondasi navigasi (Stack + Tab + Drawer) + AuthContext

- AuthContext dengan supabase.auth.onAuthStateChange + Supabase Auth methods
- Root navigator branching: isLoading / Auth / Main / Admin
- AuthNavigator (Stack), MainNavigator (5-tab + FAB modal), AdminNavigator (Drawer indigo)
- Type-safe route params di src/navigation/types.ts
```

---

## FILE YANG AKAN DIBUAT / DIEDIT

| File | Aksi | Status setelah FASE 2 |
|------|------|----------------------|
| `src/navigation/types.ts` | Edit (dari stub) | Berisi semua ParamList |
| `src/navigation/index.tsx` | Edit (dari stub) | Root navigator + branching |
| `src/navigation/AuthNavigator.tsx` | Edit (dari stub) | Stack 5 route |
| `src/navigation/MainNavigator.tsx` | Edit (dari stub) | Bottom Tab 5 + FAB modal + nested stacks |
| `src/navigation/AdminNavigator.tsx` | Edit (dari stub) | Drawer indigo 4 item |
| `src/context/AuthContext.tsx` | Edit (dari stub) | Provider + useAuth hook |
| `src/services/auth.service.ts` | Edit (dari stub) | Wrapper functions: loginWithEmail, loginWithGoogle, register, logout, resetPassword |
| `src/screens/LoadingScreen.tsx` | **Buat baru** | Spinner sederhana (tidak ada di CONTEXT struktur, tapi diperlukan) |
| `src/components/FabButton.tsx` | **Buat baru** | Custom tab button untuk FAB di MainNavigator |
| `App.tsx` | Edit | Bungkus dengan GestureHandlerRootView + AuthProvider + RootNavigator |
| `index.ts` | Edit (jika perlu) | Pastikan `import 'react-native-gesture-handler'` ada di paling atas |

---

## POTENSI MASALAH

### M1 — Supabase call gagal walau init sukses
**Penyebab:** `.env` kosong (hanya `console.warn`, bukan throw), tapi `supabase.from(...)` bakal return error 401 / network. Atau schema belum dibuat.
**Solusi:** Pastikan (a) `.env` sudah berisi URL + publishable key non-empty, (b) `supabase-schema.sql` sudah di-run di SQL Editor.

### M2 — `URL is not defined` / `Headers is not defined`
Sudah di-handle dengan `import 'react-native-url-polyfill/auto'` di baris paling atas `supabase.ts`. Kalau ada error tipe ini, pastikan import polyfill dieksekusi sebelum `createClient`.

### M3 — Reanimated babel plugin
React Navigation Drawer butuh Reanimated. Pastikan `babel.config.js` punya plugin `react-native-reanimated/plugin` di **akhir array plugins**. Saat ini babel.config.js cuma punya preset, belum plugin. Kalau drawer crash dengan error "Reanimated babel plugin missing", tambah:
```javascript
plugins: ['react-native-reanimated/plugin']
```
Tapi sebelum nambah, verifikasi dulu — mungkin Expo SDK 54 sudah auto-include via `babel-preset-expo`.

### M4 — FAB tab button preventDefault
Pattern `listeners.tabPress: (e) => e.preventDefault()` perlu kombinasi dengan custom `tabBarButton` agar tap memang bypass tab nav dan trigger modal. Hati-hati duplicate event handling.

### M5 — Nested navigator typing di v7
React Navigation v7 mengubah cara typing nested navigator. `RootParamList` augmentation di global namespace cara baru. Kalau autocomplete tidak jalan, cek dokumentasi v7 di `node_modules/@react-navigation/native/lib/typescript/`.

### M6 — Google OAuth flow di mobile
Pakai `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'cariin://auth-callback' } })` + `expo-web-browser.openAuthSessionAsync` untuk capture redirect. Butuh setup di Supabase Dashboard → Authentication → Providers → Google (paste Client ID + Secret dari Google Cloud Console). Deep link `cariin://auth-callback` harus terdaftar di Supabase URL Allow List, dan `scheme: 'cariin'` di `app.json` sudah cocok. **Bonus:** jalan di Expo Go tanpa dev build.

### M7 — `cariin-web/` nested di dalam cariin-mobile
Belum dipindah. Sebelum atau saat FASE 2, putuskan: pindah keluar atau biarkan. Kalau biarkan, tambah ke `.gitignore` cariin-mobile/cariin-web/ supaya nggak ikut bundle.

---

## YANG USER PERLU SIAPKAN SEBELUM FASE 2

### WAJIB (blocker)
1. **Test FASE 1 dulu di Expo Go** — `cd cariin-mobile && npm start`, scan QR, pastikan splash render dengan styling NativeWind. Kalau gagal, fix dulu sebelum FASE 2.
2. **`.env` sudah ada** dengan Supabase URL + publishable key (sudah di-set saat migrasi). Yang masih perlu di-setup di Supabase Dashboard:
   - SQL Editor → run `supabase-schema.sql` (di root project) untuk bikin tabel + RLS
   - Authentication → Providers → enable Email + Google
   - Storage → bikin bucket `report-photos` (public read), `chat-media` (authenticated read), `avatars` (public read)

### OPSIONAL (boleh saat FASE 3)
3. **Google OAuth setup** — Cloud Console → Credentials → OAuth 2.0 → Web application. Copy Client ID + Secret ke Supabase Dashboard → Authentication → Providers → Google. Tambah callback URL Supabase ke "Authorized redirect URIs" Google: `https://<project-id>.supabase.co/auth/v1/callback`.
4. **Domain email kampus aktual** — kalau bukan `student.unu-jogja.ac.id`, update `EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN` di `.env`.

---

## DURASI ESTIMASI FASE 2

- 2.1 types.ts: 10 menit
- 2.2 AuthContext + auth.service: 30–45 menit
- 2.3 RootNavigator: 10 menit
- 2.4 AuthNavigator: 10 menit
- 2.5 MainNavigator (paling kompleks, FAB modal): 30–45 menit
- 2.6 AdminNavigator: 15 menit
- 2.7 App.tsx update: 5 menit
- 2.8 Verifikasi + manual nav test: 15–20 menit
- 2.9 Commit: 5 menit

**Total:** ~2 jam fokus (asumsi tidak ada bug Supabase / Reanimated / Drawer surprise).

---

## DEFINISI "FASE 2 SELESAI"

Checklist sebelum mark FASE 2 done:
- [ ] `npx tsc --noEmit` clean
- [ ] App.tsx render tanpa crash di Expo Go
- [ ] Tap dari Splash → bisa sampai ke ForgotPassword via Login
- [ ] Hardcode `isAuthenticated = true; role = 'mahasiswa'` → MainNavigator render 5 tab, semua tab bisa dibuka
- [ ] Hardcode `role = 'admin'` → AdminNavigator drawer render, semua 4 item bisa dibuka
- [ ] Hardcode dikembalikan ke null/false sebelum commit
- [ ] FAB tap → modal Create muncul (CreateLost/CreateFound bisa toggle)
- [ ] Logout dari AdminNavigator → kembali ke AuthNavigator
- [ ] Commit FASE 2 di branch `develop`
