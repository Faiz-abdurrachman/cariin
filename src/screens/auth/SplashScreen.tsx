import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { type StackNavigationProp } from '@react-navigation/stack';

import { COLORS } from '@/utils/constants';
import type { AuthStackParamList } from '@/navigation/types';

const REDIRECT_DELAY_MS = 2200;

type Nav = StackNavigationProp<AuthStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, scale]);

  useEffect(() => {
    const id = setTimeout(() => {
      navigation.replace('RoleSelection');
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(id);
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary }}>
      <Animated.View
        style={{ alignItems: 'center', rowGap: 16, opacity: 1, transform: [{ scale }] }}
      >
        <View style={{ shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 24, shadowOffset: { width: 0, height: 0 }, elevation: 12, borderRadius: 24, transform: [{ rotate: '3deg' }] }}>
          <BlurView
            intensity={60}
            tint="light"
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderWidth: 1.5,
              borderColor: 'rgba(255, 255, 255, 0.5)',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
          <Ionicons
            name="search"
            size={36}
            color="#FFFFFF"
            style={{ transform: [{ rotate: '-3deg' }] }}
          />
          </BlurView>
        </View>
        <Animated.Text style={{ fontSize: 28, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5, opacity: fade }}>
          Cari.In
        </Animated.Text>
        <Animated.Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: 0.5,
            opacity: fade.interpolate({ inputRange: [0, 1], outputRange: [0, 0.7] }),
          }}
        >
          Kampus Lebih Aman
        </Animated.Text>
      </Animated.View>
    </View>
  );
}
