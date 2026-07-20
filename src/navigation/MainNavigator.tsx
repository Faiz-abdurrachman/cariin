// Main navigator untuk user mahasiswa.
//
// Hirarki:
//   RootStack (file ini default export)
//     ├─ MainTabs       — Bottom Tab 5 slot, slot ke-3 (Create) intercept ke modal
//     └─ CreateModal    — Stack presentation:'modal' (CreateLost ↔ CreateFound → Success)
//
// FAB di tengah tab bar pakai `tabBarButton` custom + `tabPress: e.preventDefault()`
// supaya tap memang trigger modal, bukan navigate ke tab dummy.

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LiquidTabBar from '@/components/LiquidTabBar';
import ChatRoomScreen from '@/screens/chat/ChatRoomScreen';
import InboxScreen from '@/screens/chat/InboxScreen';
import NotificationsScreen from '@/screens/chat/NotificationsScreen';
import CreateFoundScreen from '@/screens/main/CreateFoundScreen';
import CreateLostScreen from '@/screens/main/CreateLostScreen';
import DetailFoundScreen from '@/screens/main/DetailFoundScreen';
import DetailLostScreen from '@/screens/main/DetailLostScreen';
import HomeScreen from '@/screens/main/HomeScreen';
import SuccessScreen from '@/screens/main/SuccessScreen';
import EditPostScreen from '@/screens/profile/EditPostScreen';
import HelpScreen from '@/screens/profile/HelpScreen';
import MyPostsScreen from '@/screens/profile/MyPostsScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import SettingsScreen from '@/screens/profile/SettingsScreen';
import UserProfileScreen from '@/screens/profile/UserProfileScreen';

import type {
  ChatStackParamList,
  CreateModalParamList,
  HomeStackParamList,
  MainTabParamList,
  MyPostsStackParamList,
  ProfileStackParamList,
  RootStackParamList,
} from './types';

const HomeStack = createStackNavigator<HomeStackParamList>();
function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeFeed" component={HomeScreen} />
      <HomeStack.Screen name="DetailLost" component={DetailLostScreen} />
      <HomeStack.Screen name="DetailFound" component={DetailFoundScreen} />
      <HomeStack.Screen name="ChatRoom" component={ChatRoomScreen} />
      <HomeStack.Screen name="UserProfile" component={UserProfileScreen} />
    </HomeStack.Navigator>
  );
}

const ChatStack = createStackNavigator<ChatStackParamList>();
function ChatNavigator() {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="Inbox" component={InboxScreen} />
      <ChatStack.Screen name="ChatRoom" component={ChatRoomScreen} />
      <ChatStack.Screen name="UserProfile" component={UserProfileScreen} />
      <ChatStack.Screen name="DetailLost" component={DetailLostScreen} />
      <ChatStack.Screen name="DetailFound" component={DetailFoundScreen} />
      <ChatStack.Screen name="Notifications" component={NotificationsScreen} />
    </ChatStack.Navigator>
  );
}

const MyPostsStack = createStackNavigator<MyPostsStackParamList>();
function MyPostsNavigator() {
  return (
    <MyPostsStack.Navigator screenOptions={{ headerShown: false }}>
      <MyPostsStack.Screen name="MyPosts" component={MyPostsScreen} />
      <MyPostsStack.Screen name="EditPost" component={EditPostScreen} />
      <MyPostsStack.Screen name="DetailLost" component={DetailLostScreen} />
      <MyPostsStack.Screen name="DetailFound" component={DetailFoundScreen} />
    </MyPostsStack.Navigator>
  );
}

const ProfileStack = createStackNavigator<ProfileStackParamList>();
function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
      <ProfileStack.Screen name="Help" component={HelpScreen} />
      <ProfileStack.Screen name="UserProfile" component={UserProfileScreen} />
      <ProfileStack.Screen name="ChatRoom" component={ChatRoomScreen} />
      <ProfileStack.Screen name="DetailLost" component={DetailLostScreen} />
      <ProfileStack.Screen name="DetailFound" component={DetailFoundScreen} />
    </ProfileStack.Navigator>
  );
}

// Komponen kosong untuk slot CreateTab — render-nya tidak pernah ter-trigger
// karena `tabPress: e.preventDefault()` mencegah focus pindah ke tab ini.
function CreateTabPlaceholder() {
  return null;
}

const Tab = createBottomTabNavigator<MainTabParamList>();
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <LiquidTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeFeed';
          const display = ['DetailLost', 'DetailFound', 'ChatRoom', 'UserProfile'].includes(routeName) ? 'none' : 'flex';
          return {
            tabBarStyle: { display },
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
          };
        }}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Inbox';
          const display = ['ChatRoom', 'UserProfile', 'DetailLost', 'DetailFound'].includes(routeName) ? 'none' : 'flex';
          return {
            tabBarStyle: { display },
            tabBarLabel: 'Pesan',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-outline" color={color} size={size} />
            ),
          };
        }}
      />
      <Tab.Screen
        name="CreateTab"
        component={CreateTabPlaceholder}
      />
      <Tab.Screen
        name="MyPostsTab"
        component={MyPostsNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'MyPosts';
          const display = ['EditPost', 'DetailLost', 'DetailFound'].includes(routeName) ? 'none' : 'flex';
          return {
            tabBarStyle: { display },
            tabBarLabel: 'Laporanku',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document-text-outline" color={color} size={size} />
            ),
          };
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Profile';
          const display = ['Settings', 'Help', 'UserProfile', 'ChatRoom', 'DetailLost', 'DetailFound'].includes(routeName) ? 'none' : 'flex';
          return {
            tabBarStyle: { display },
            tabBarLabel: 'Profil',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" color={color} size={size} />
            ),
          };
        }}
      />
    </Tab.Navigator>
  );
}

const CreateStack = createStackNavigator<CreateModalParamList>();
function CreateModalNavigator() {
  return (
    <CreateStack.Navigator screenOptions={{ headerShown: false }}>
      <CreateStack.Screen name="CreateLost" component={CreateLostScreen} />
      <CreateStack.Screen name="CreateFound" component={CreateFoundScreen} />
      <CreateStack.Screen name="Success" component={SuccessScreen} />
    </CreateStack.Navigator>
  );
}

const Root = createStackNavigator<RootStackParamList>();
export default function MainNavigator() {
  return (
    <Root.Navigator screenOptions={{ headerShown: false }}>
      <Root.Screen name="MainTabs" component={MainTabs} />
      <Root.Screen
        name="CreateModal"
        component={CreateModalNavigator}
        options={{ presentation: 'modal' }}
      />
    </Root.Navigator>
  );
}
