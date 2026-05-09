// Stack navigator untuk flow otentikasi (sebelum login).
// Initial: Splash → RoleSelection → Login/Register/ForgotPassword.

import { createStackNavigator } from '@react-navigation/stack';

import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import RoleSelectionScreen from '@/screens/auth/RoleSelectionScreen';
import SplashScreen from '@/screens/auth/SplashScreen';

import type { AuthStackParamList } from './types';

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
