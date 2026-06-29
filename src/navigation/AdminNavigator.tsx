// Bottom Tab navigator untuk role admin — lebih simple dari Drawer.
// 5 tab: Dashboard, Laporan, Buat, Pesan, Profil.
//
// Warna indigo (COLORS.admin) sebagai aksen.

import { Ionicons } from '@expo/vector-icons';
import { Alert, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

export default function AdminNavigator() {
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
