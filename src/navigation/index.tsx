// Root navigator — branching antara tiga navigator besar berdasarkan auth state.
//
// Catatan: NavigationContainer hanya boleh ada satu di seluruh app. Diletakkan
// di sini agar bersih meng-cover Auth/Main/Admin secara bergantian.

import { NavigationContainer } from '@react-navigation/native';

import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/screens/LoadingScreen';

import AdminNavigator from './AdminNavigator';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

export default function RootNavigator() {
  const { isLoading, isAuthenticated, role } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : role === 'admin' ? (
        <AdminNavigator />
      ) : (
        <MainNavigator />
      )}
    </NavigationContainer>
  );
}
