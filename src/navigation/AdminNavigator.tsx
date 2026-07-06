// Admin navigation: Drawer (menu geser kiri) membungkus Bottom Tab.
// Struktur: AdminNavigator (Drawer) → AdminTabs (Bottom Tab) + AdminAbout.
// Memenuhi requirement dosen: Stack (auth) + Tab (mahasiswa & admin) + Drawer (admin).
//
// Warna teal (COLORS.admin) sebagai aksen.

import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import FabButton from '@/components/FabButton';
import { useAuth } from '@/context/AuthContext';
import AdminCreateFoundScreen from '@/screens/admin/AdminCreateFoundScreen';
import AdminCreateLostScreen from '@/screens/admin/AdminCreateLostScreen';
import AdminDashboardScreen from '@/screens/admin/AdminDashboardScreen';
import AdminReportsScreen from '@/screens/admin/AdminReportsScreen';
import AdminReviewScreen from '@/screens/admin/AdminReviewScreen';
import ChatRoomScreen from '@/screens/chat/ChatRoomScreen';
import InboxScreen from '@/screens/chat/InboxScreen';
import { COLORS } from '@/utils/constants';

import type {
  AdminChatStackParamList,
  AdminCreateStackParamList,
  AdminDashboardStackParamList,
  AdminDrawerParamList,
  AdminTabParamList,
} from './types';

const DashboardStack = createStackNavigator<AdminDashboardStackParamList>();
function DashboardStackNavigator() {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <DashboardStack.Screen name="AdminReview" component={AdminReviewScreen} />
    </DashboardStack.Navigator>
  );
}

const CreateStack = createStackNavigator<AdminCreateStackParamList>();
function AdminCreateStackNavigator() {
  return (
    <CreateStack.Navigator screenOptions={{ headerShown: false }}>
      <CreateStack.Screen name="AdminCreateLost" component={AdminCreateLostScreen} />
      <CreateStack.Screen name="AdminCreateFound" component={AdminCreateFoundScreen} />
    </CreateStack.Navigator>
  );
}

const ChatStack = createStackNavigator<AdminChatStackParamList>();
function AdminChatStackNavigator() {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="Inbox" component={InboxScreen} />
      <ChatStack.Screen name="ChatRoom" component={ChatRoomScreen} />
    </ChatStack.Navigator>
  );
}

function AdminProfileScreen() {
  const { logout, userProfile } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 999,
          backgroundColor: COLORS.adminLight,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <Ionicons name="shield-checkmark-outline" size={40} color={COLORS.admin} />
      </View>
      <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.adminText, marginBottom: 4 }}>
        {userProfile?.name ?? 'Admin'}
      </Text>
      <Text style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 32 }}>
        Administrator
      </Text>

      <View
        style={{
          width: '100%',
          backgroundColor: COLORS.surface,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: COLORS.adminBorder,
          overflow: 'hidden',
        }}
      >
        {(
          [
            ['key-outline', 'Ganti Password', () => Alert.alert('Ganti Password', 'Fitur ini akan hadir di update berikutnya.')],
            ['log-out-outline', 'Keluar', () => {
              Alert.alert('Keluar dari Cari.In?', 'Sesi admin akan diakhiri.', [
                { text: 'Batal', style: 'cancel' },
                {
                  text: 'Keluar', style: 'destructive',
                  onPress: async () => {
                    try { await logout(); } catch (e) {
                      Alert.alert('Gagal logout', e instanceof Error ? e.message : 'Coba lagi.');
                    }
                  },
                },
              ]);
            }],
          ] as const
        ).map(([icon, label, onPress], i, arr) => (
          <View key={label}>
            <Ionicons.Button
              name={icon}
              onPress={onPress}
              backgroundColor={COLORS.surface}
              color={icon === 'log-out-outline' ? COLORS.lost : COLORS.adminText}
              iconStyle={{ marginRight: 4 }}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 14,
                borderRadius: 0,
                justifyContent: 'flex-start',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: icon === 'log-out-outline' ? COLORS.lost : COLORS.adminText, flex: 1 }}>
                {label}
              </Text>
            </Ionicons.Button>
            {i < arr.length - 1 && <View style={{ height: 1, backgroundColor: COLORS.adminBorder, marginHorizontal: 20 }} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const Tab = createBottomTabNavigator<AdminTabParamList>();

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.admin,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.adminBorder,
        },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStackNavigator}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ReportsTab"
        component={AdminReportsScreen}
        options={{
          title: 'Laporan',
          tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="CreateTab"
        component={AdminCreateStackNavigator}
        options={{
          title: 'Buat',
          tabBarLabel: '',
          tabBarButton: (props) => (
            <FabButton
              onPress={props.onPress as () => void}
              containerStyle={props.style}
              accessibilityLabel="Buat laporan admin"
              variant="admin"
            />
          ),
        }}
      />
      <Tab.Screen
        name="ChatTab"
        component={AdminChatStackNavigator}
        options={{
          title: 'Pesan',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AdminProfileTab"
        component={AdminProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const ABOUT_ROWS: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }[] = [
  { icon: 'phone-portrait-outline', label: 'Aplikasi', value: 'Cari.In' },
  { icon: 'pricetag-outline', label: 'Versi', value: '1.0.0' },
  { icon: 'cube-outline', label: 'Package', value: 'id.cariin.app' },
  { icon: 'school-outline', label: 'Kampus', value: 'UNU Yogyakarta' },
  { icon: 'construct-outline', label: 'Stack', value: 'React Native · Expo · Supabase' },
];

function AdminAboutScreen() {
  const nav = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: COLORS.admin }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable
            onPress={() => nav.dispatch(DrawerActions.openDrawer())}
            accessibilityRole="button"
            accessibilityLabel="Buka menu"
            hitSlop={8}
          >
            {({ pressed }) => (
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.7 : 1,
                }}
              >
                <Ionicons name="menu" size={18} color="#FFFFFF" />
              </View>
            )}
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF' }}>Tentang Cari.In</Text>
            <Text style={{ fontSize: 12, color: COLORS.adminBorder, marginTop: 2 }}>
              Ekosistem Lost &amp; Found kampus
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: COLORS.adminBorder,
            overflow: 'hidden',
          }}
        >
          {ABOUT_ROWS.map((row, i) => (
            <View key={row.label}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 14 }}>
                <Ionicons name={row.icon} size={20} color={COLORS.admin} />
                <Text style={{ fontSize: 13, color: COLORS.textMuted, width: 80 }}>{row.label}</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.adminText, flex: 1 }}>
                  {row.value}
                </Text>
              </View>
              {i < ABOUT_ROWS.length - 1 && (
                <View style={{ height: 1, backgroundColor: COLORS.background, marginHorizontal: 20 }} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function AdminDrawerContent(props: DrawerContentComponentProps) {
  const { logout, userProfile, currentUser } = useAuth();

  const confirmLogout = () => {
    Alert.alert('Keluar dari Cari.In?', 'Sesi admin akan diakhiri.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (e) {
            Alert.alert('Gagal logout', e instanceof Error ? e.message : 'Coba lagi.');
          }
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
      <View style={{ backgroundColor: COLORS.admin, padding: 20, paddingTop: 48, marginBottom: 8 }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            backgroundColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
          }}
        >
          <Ionicons name="shield-checkmark" size={28} color="#FFFFFF" />
        </View>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>
          {currentUser?.name ?? userProfile?.name ?? 'Admin'}
        </Text>
        <Text style={{ fontSize: 12, color: COLORS.adminBorder, marginTop: 2 }}>
          {currentUser?.getRoleLabel() ?? 'Administrator'}
        </Text>
      </View>

      <DrawerItem
        label="Beranda"
        icon={({ size }) => <Ionicons name="home-outline" size={size} color={COLORS.admin} />}
        onPress={() => props.navigation.navigate('AdminTabs')}
      />
      <DrawerItem
        label="Tentang Cari.In"
        icon={({ size }) => <Ionicons name="information-circle-outline" size={size} color={COLORS.admin} />}
        onPress={() => props.navigation.navigate('AdminAbout')}
      />

      <View style={{ height: 1, backgroundColor: COLORS.adminBorder, marginVertical: 8, marginHorizontal: 16 }} />

      <DrawerItem
        label="Keluar"
        labelStyle={{ color: COLORS.lost }}
        icon={({ size }) => <Ionicons name="log-out-outline" size={size} color={COLORS.lost} />}
        onPress={confirmLogout}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator<AdminDrawerParamList>();

export default function AdminNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <AdminDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: COLORS.admin,
        drawerType: 'front',
      }}
    >
      <Drawer.Screen name="AdminTabs" component={AdminTabs} options={{ title: 'Beranda' }} />
      <Drawer.Screen name="AdminAbout" component={AdminAboutScreen} options={{ title: 'Tentang Cari.In' }} />
    </Drawer.Navigator>
  );
}
