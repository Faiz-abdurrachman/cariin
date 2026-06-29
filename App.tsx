// Entry utama Cari.In.
// GestureHandlerRootView wajib di paling luar (Drawer dari React Navigation v7
// pakai gesture-handler). AuthProvider menyediakan state otentikasi global.

import './global.css';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/context/AuthContext';
import { NotifProvider } from '@/context/NotifContext';
import RootNavigator from '@/navigation';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <NotifProvider>
            <RootNavigator />
            <StatusBar style="dark" />
          </NotifProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
