// Admin navigation: Drawer (menu geser kiri) membungkus Bottom Tab.
// Struktur: AdminNavigator (Drawer) → AdminTabs (Bottom Tab) + AdminAbout.
// Memenuhi requirement dosen: Stack (auth) + Tab (mahasiswa & admin) + Drawer (admin).
//
// Warna teal (COLORS.admin) sebagai aksen.

import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  createStackNavigator,
  type StackNavigationProp,
} from '@react-navigation/stack';

import LiquidTabBar from '@/components/LiquidTabBar';
import { useAuth } from '@/context/AuthContext';
import AdminCreateReportScreen from '@/screens/admin/AdminCreateReportScreen';
import AdminChangePasswordScreen from '@/screens/admin/AdminChangePasswordScreen';
import AdminDashboardScreen from '@/screens/admin/AdminDashboardScreen';
import AdminEditReportScreen from '@/screens/admin/AdminEditReportScreen';
import AdminReportsScreen from '@/screens/admin/AdminReportsScreen';
import AdminReviewScreen from '@/screens/admin/AdminReviewScreen';
import ChatRoomScreen from '@/screens/chat/ChatRoomScreen';
import InboxScreen from '@/screens/chat/InboxScreen';
import UserProfileScreen from '@/screens/profile/UserProfileScreen';
import { COLORS } from '@/utils/constants';

import type {
  AdminChatStackParamList,
  AdminCreateStackParamList,
  AdminDashboardStackParamList,
  AdminDrawerParamList,
  AdminProfileStackParamList,
  AdminTabParamList,
} from './types';

const DashboardStack = createStackNavigator<AdminDashboardStackParamList>();
function DashboardStackNavigator() {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <DashboardStack.Screen name="AdminReview" component={AdminReviewScreen} />
      <DashboardStack.Screen name="AdminEditReport" component={AdminEditReportScreen} />
    </DashboardStack.Navigator>
  );
}

const CreateStack = createStackNavigator<AdminCreateStackParamList>();
function AdminCreateStackNavigator() {
  return (
    <CreateStack.Navigator screenOptions={{ headerShown: false }}>
      <CreateStack.Screen name="AdminCreate" component={AdminCreateReportScreen} />
    </CreateStack.Navigator>
  );
}

const ChatStack = createStackNavigator<AdminChatStackParamList>();
function AdminChatStackNavigator() {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="Inbox" component={InboxScreen} />
      <ChatStack.Screen name="ChatRoom" component={ChatRoomScreen} />
      <ChatStack.Screen name="UserProfile" component={UserProfileScreen} />
    </ChatStack.Navigator>
  );
}

function AdminProfileScreen() {
  const { logout, userProfile } = useAuth();
  const nav =
    useNavigation<
      StackNavigationProp<AdminProfileStackParamList, 'AdminProfile'>
    >();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.admin }}>
      {/* Dark Glass Background Blobs */}
      <View style={{ position: 'absolute', top: -50, right: -50, width: 350, height: 350, borderRadius: 999, backgroundColor: '#34D399', opacity: 0.15, transform: [{ scale: 1.5 }] }} pointerEvents="none" />
      <View style={{ position: 'absolute', bottom: 50, left: -50, width: 300, height: 300, borderRadius: 999, backgroundColor: '#8B5CF6', opacity: 0.25, transform: [{ scale: 1.2 }] }} pointerEvents="none" />

      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'transparent' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.15)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.3)',
            }}
          >
            <Ionicons name="shield-checkmark-outline" size={40} color="#FFFFFF" />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 }}>
            {userProfile?.name ?? 'Admin'}
          </Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 32 }}>
            Administrator
          </Text>

          <BlurView
            intensity={40}
            tint="light"
            style={{
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 24,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.3)',
              overflow: 'hidden',
            }}
          >
            <LinearGradient colors={['rgba(255, 255, 255, 0.2)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
            {(
              [
                [
                  'key-outline',
                  'Ganti Password',
                  () => nav.navigate('AdminChangePassword'),
                ],
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
                  backgroundColor="transparent"
                  color={icon === 'log-out-outline' ? '#FCA5A5' : '#FFFFFF'}
                  iconStyle={{ marginRight: 4 }}
                  underlayColor="rgba(255,255,255,0.1)"
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                    borderRadius: 0,
                    justifyContent: 'flex-start',
                  }}
                >
                  <Text style={{ fontSize: 15, fontWeight: '600', color: icon === 'log-out-outline' ? '#FCA5A5' : '#FFFFFF', flex: 1 }}>
                    {label}
                  </Text>
                </Ionicons.Button>
                {i < arr.length - 1 && <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 20 }} />}
              </View>
            ))}
          </BlurView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const AdminProfileStack =
  createStackNavigator<AdminProfileStackParamList>();

function AdminProfileStackNavigator() {
  return (
    <AdminProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminProfileStack.Screen
        name="AdminProfile"
        component={AdminProfileScreen}
      />
      <AdminProfileStack.Screen
        name="AdminChangePassword"
        component={AdminChangePasswordScreen}
      />
    </AdminProfileStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<AdminTabParamList>();

function AdminTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <LiquidTabBar
          {...props}
          variant="admin"
          onCreatePress={() =>
            props.navigation.navigate('CreateTab', {
              screen: 'AdminCreate',
              params: { initialType: 'lost' },
            })
          }
        />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStackNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'AdminDashboard';
          const display = ['AdminReview', 'AdminEditReport'].includes(routeName) ? 'none' : 'flex';
          return {
            tabBarStyle: { display },
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} />,
          };
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
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'AdminCreate';
          const display = routeName === 'AdminCreate' ? 'none' : 'flex';
          return {
            tabBarStyle: { display },
            title: 'Buat',
          };
        }}
      />
      <Tab.Screen
        name="ChatTab"
        component={AdminChatStackNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Inbox';
          const display = ['ChatRoom'].includes(routeName) ? 'none' : 'flex';
          return {
            tabBarStyle: { display },
            title: 'Pesan',
            tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-outline" color={color} size={size} />,
          };
        }}
      />
      <Tab.Screen
        name="AdminProfileTab"
        component={AdminProfileStackNavigator}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? 'AdminProfile';
          return {
            tabBarStyle: {
              display:
                routeName === 'AdminChangePassword' ? 'none' : 'flex',
            },
            title: 'Profil',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person-outline"
                color={color}
                size={size}
              />
            ),
          };
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
    <View style={{ flex: 1, backgroundColor: COLORS.admin }}>
      {/* Dark Glass Background Blobs */}
      <View style={{ position: 'absolute', top: -50, right: -50, width: 350, height: 350, borderRadius: 999, backgroundColor: '#34D399', opacity: 0.15, transform: [{ scale: 1.5 }] }} pointerEvents="none" />
      <View style={{ position: 'absolute', bottom: 50, left: -50, width: 300, height: 300, borderRadius: 999, backgroundColor: '#8B5CF6', opacity: 0.25, transform: [{ scale: 1.2 }] }} pointerEvents="none" />

      <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
        <BlurView
          intensity={40}
          tint="light"
          style={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            backgroundColor: 'rgba(30,27,75,0.3)',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.2)'
          }}
        >
          <LinearGradient colors={['rgba(255, 255, 255, 0.1)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
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
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
              Ekosistem Lost &amp; Found kampus
            </Text>
          </View>
        </BlurView>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <BlurView
          intensity={40}
          tint="light"
          style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 24,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.3)',
            overflow: 'hidden',
          }}
        >
          <LinearGradient colors={['rgba(255, 255, 255, 0.2)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
          {ABOUT_ROWS.map((row, i) => (
            <View key={row.label}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 14 }}>
                <Ionicons name={row.icon} size={20} color="#FFFFFF" />
                <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', width: 80 }}>{row.label}</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF', flex: 1 }}>
                  {row.value}
                </Text>
              </View>
              {i < ABOUT_ROWS.length - 1 && (
                <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 20 }} />
              )}
            </View>
          ))}
        </BlurView>
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
    <View style={{ flex: 1, backgroundColor: COLORS.admin, overflow: 'hidden' }}>
      {/* Dark Glass Background Blobs */}
      <View style={{ position: 'absolute', bottom: -50, left: -50, width: 250, height: 250, borderRadius: 999, backgroundColor: '#8B5CF6', opacity: 0.25, transform: [{ scale: 1.2 }] }} pointerEvents="none" />

      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Profile Header (Glass) */}
        <BlurView
          intensity={40}
          tint="light"
          style={{
            padding: 20,
            paddingTop: 48,
            paddingBottom: 24,
            marginBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.2)',
            backgroundColor: 'rgba(30,27,75,0.3)',
          }}
        >
          <LinearGradient colors={['rgba(255, 255, 255, 0.1)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.4)',
            }}
          >
            <Ionicons name="shield-checkmark" size={32} color="#FFFFFF" />
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF' }}>
            {currentUser?.name ?? userProfile?.name ?? 'Admin'}
          </Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
            {currentUser?.getRoleLabel() ?? 'Administrator'}
          </Text>
        </BlurView>

        <View style={{ paddingHorizontal: 12, gap: 8 }}>
          <DrawerItem
            label="Beranda"
            labelStyle={{ color: '#FFFFFF', fontWeight: '600' }}
            icon={({ size }) => <Ionicons name="home-outline" size={size} color="#FFFFFF" />}
            onPress={() => props.navigation.navigate('AdminTabs')}
            style={{ borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)' }}
          />
          <DrawerItem
            label="Tentang Cari.In"
            labelStyle={{ color: '#FFFFFF', fontWeight: '600' }}
            icon={({ size }) => <Ionicons name="information-circle-outline" size={size} color="#FFFFFF" />}
            onPress={() => props.navigation.navigate('AdminAbout')}
            style={{ borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)' }}
          />

          <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 12, marginHorizontal: 16 }} />

          <DrawerItem
            label="Keluar"
            labelStyle={{ color: COLORS.lost, fontWeight: '600' }}
            icon={({ size }) => <Ionicons name="log-out-outline" size={size} color={COLORS.lost} />}
            onPress={confirmLogout}
            style={{ borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)' }}
          />
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

const Drawer = createDrawerNavigator<AdminDrawerParamList>();

export default function AdminNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <AdminDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#FFFFFF',
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: 'transparent',
          overflow: 'hidden',
        },
      }}
    >
      <Drawer.Screen name="AdminTabs" component={AdminTabs} options={{ title: 'Beranda' }} />
      <Drawer.Screen name="AdminAbout" component={AdminAboutScreen} options={{ title: 'Tentang Cari.In' }} />
    </Drawer.Navigator>
  );
}
