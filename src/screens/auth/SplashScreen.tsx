import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';

import { COLORS } from '@/utils/constants';
import type { AuthStackParamList } from '@/navigation/types';

const REDIRECT_DELAY_MS = 2200;

type Nav = StackNavigationProp<AuthStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, slide]);

  useEffect(() => {
    const id = setTimeout(() => {
      navigation.replace('RoleSelection');
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(id);
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary }}>
      <Animated.View
        style={{ alignItems: 'center', rowGap: 16, opacity: fade, transform: [{ translateY: slide }] }}
      >
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ rotate: '3deg' }],
            shadowColor: '#FFFFFF',
            shadowOpacity: 0.2,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 0 },
            elevation: 12,
          }}
        >
          <Ionicons
            name="search"
            size={30}
            color={COLORS.primary}
            style={{ transform: [{ rotate: '-3deg' }] }}
          />
        </View>
        <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 }}>
          Cari.In
        </Text>
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
