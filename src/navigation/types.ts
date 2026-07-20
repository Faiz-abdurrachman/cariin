// Tipe parameter rute untuk semua navigator Cari.In.
// Sumber kebenaran tunggal — diimport di setiap navigator + usage useNavigation/useRoute.
//
// Struktur runtime (saat user login mahasiswa):
//   RootStack
//     ├─ MainTabs (Bottom Tab)
//     │    ├─ HomeTab    (HomeStack)
//     │    ├─ ChatTab    (ChatStack)
//     │    ├─ CreateTab  (dummy — intercepted ke RootStack.CreateModal)
//     │    ├─ MyPostsTab (MyPostsStack)
//     │    └─ ProfileTab (ProfileStack)
//     └─ CreateModal (presentation:'modal') → CreateStack
//
// Saat belum login: AuthStack root.
// Saat login admin: AdminDrawer root.

import type { NavigatorScreenParams } from '@react-navigation/native';

// === AUTH STACK ===
export type AuthStackParamList = {
  Splash: undefined;
  RoleSelection: undefined;
  Login: { isAdmin?: boolean } | undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
};

// === MAIN — nested stacks per tab ===
export type HomeStackParamList = {
  HomeFeed: undefined;
  DetailLost: { reportId: string };
  DetailFound: { reportId: string };
  ChatRoom: { conversationId: string; reportId: string };
  UserProfile: { userId: string };
};

export type ChatStackParamList = {
  Inbox: undefined;
  ChatRoom: { conversationId: string; reportId: string };
  UserProfile: { userId: string };
  DetailLost: { reportId: string };
  DetailFound: { reportId: string };
  Notifications: undefined;
};

export type MyPostsStackParamList = {
  MyPosts: undefined;
  EditPost: { reportId: string };
  DetailLost: { reportId: string };
  DetailFound: { reportId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  Help: undefined;
  UserProfile: { userId: string };
  ChatRoom: { conversationId: string; reportId: string };
  DetailLost: { reportId: string };
  DetailFound: { reportId: string };
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ChatTab: NavigatorScreenParams<ChatStackParamList>;
  CreateTab: undefined;
  MyPostsTab: NavigatorScreenParams<MyPostsStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// === CREATE MODAL (sibling MainTabs di RootStack) ===
export type CreateModalParamList = {
  CreateLost: undefined;
  CreateFound: undefined;
  Success: { reportId?: string; type: 'lost' | 'found' } | undefined;
};

// === ROOT STACK (wrapper untuk MainTabs + modal) ===
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  CreateModal: NavigatorScreenParams<CreateModalParamList>;
};

// === ADMIN DRAWER + nested stack ===
export type AdminDashboardStackParamList = {
  AdminDashboard: undefined;
  AdminReview: { reportId: string };
  AdminEditReport: { reportId: string };
};

export type AdminCreateStackParamList = {
  AdminCreateLost: undefined;
  AdminCreateFound: undefined;
};

export type AdminChatStackParamList = {
  Inbox: undefined;
  ChatRoom: { conversationId: string; reportId: string };
  UserProfile: { userId: string };
};

export type AdminProfileStackParamList = {
  AdminProfile: undefined;
  AdminChangePassword: undefined;
};

export type AdminTabParamList = {
  DashboardTab: NavigatorScreenParams<AdminDashboardStackParamList>;
  ReportsTab: undefined;
  CreateTab: NavigatorScreenParams<AdminCreateStackParamList>;
  ChatTab: NavigatorScreenParams<AdminChatStackParamList>;
  AdminProfileTab: NavigatorScreenParams<AdminProfileStackParamList>;
};

// Drawer membungkus AdminTabs — admin punya BOTH Drawer (menu geser kiri) DAN
// Bottom Tab di dalamnya. Memenuhi requirement dosen "Stack, Tab, and Drawer".
export type AdminDrawerParamList = {
  AdminTabs: NavigatorScreenParams<AdminTabParamList>;
  AdminAbout: undefined;
};

// Augmentasi global untuk type-safe useNavigation di RootStack scope (mahasiswa flow).
// Untuk Auth/Admin scope, screen pakai tipe spesifik: useNavigation<...<AuthStackParamList>>().
declare global {
   
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
