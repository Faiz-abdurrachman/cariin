// Drawer navigator untuk role admin. Aksen warna indigo (COLORS.admin).
//
// 4 entry:
//   - Dashboard      (stack: AdminDashboard → AdminReview)
//   - Semua Laporan  (single screen: AdminReportsScreen)
//   - Buat Laporan   (stack: AdminCreateLost ↔ AdminCreateFound)
//   - Logout         (custom item, panggil useAuth().logout())

import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuth } from '@/context/AuthContext';
import AdminCreateFoundScreen from '@/screens/admin/AdminCreateFoundScreen';
import AdminCreateLostScreen from '@/screens/admin/AdminCreateLostScreen';
import AdminDashboardScreen from '@/screens/admin/AdminDashboardScreen';
import AdminReportsScreen from '@/screens/admin/AdminReportsScreen';
import AdminReviewScreen from '@/screens/admin/AdminReviewScreen';
import { COLORS } from '@/utils/constants';

import type {
  AdminCreateStackParamList,
  AdminDashboardStackParamList,
  AdminDrawerParamList,
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

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { logout } = useAuth();
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        labelStyle={{ color: COLORS.lost, fontWeight: '600' }}
        icon={({ size }) => <Ionicons name="log-out-outline" size={size} color={COLORS.lost} />}
        onPress={() => {
          Alert.alert('Keluar dari Cari.In?', 'Sesi admin akan diakhiri.', [
            { text: 'Batal', style: 'cancel' },
            {
              text: 'Keluar',
              style: 'destructive',
              onPress: async () => {
                try {
                  await logout();
                } catch (e) {
                  Alert.alert(
                    'Gagal logout',
                    e instanceof Error ? e.message : 'Coba lagi sebentar.',
                  );
                }
              },
            },
          ]);
        }}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator<AdminDrawerParamList>();

export default function AdminNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: COLORS.adminLight,
        drawerActiveTintColor: COLORS.adminText,
        drawerInactiveTintColor: COLORS.textMuted,
        headerStyle: { backgroundColor: COLORS.admin },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Drawer.Screen
        name="DashboardDrawer"
        component={DashboardStackNavigator}
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="speedometer-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="AllReports"
        component={AdminReportsScreen}
        options={{
          title: 'Semua Laporan',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="CreateDrawer"
        component={AdminCreateStackNavigator}
        options={{
          title: 'Buat Laporan',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
