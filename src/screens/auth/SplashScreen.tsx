import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';

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
    <View className="flex-1 items-center justify-center bg-zinc-950">
      <Animated.View
        className="items-center"
        style={{ rowGap: 16, opacity: fade, transform: [{ translateY: slide }] }}
      >
        <View
          className="bg-white items-center justify-center"
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            transform: [{ rotate: '3deg' }],
            shadowColor: '#FFFFFF',
            shadowOpacity: 0.15,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 0 },
            elevation: 12,
          }}
        >
          <Ionicons
            name="search"
            size={30}
            color="#18181B"
            style={{ transform: [{ rotate: '-3deg' }] }}
          />
        </View>
        <Text className="text-4xl font-bold text-white tracking-tight">
          Cari.In
        </Text>
        <Animated.Text
          className="text-sm font-medium text-zinc-400 tracking-wide"
          style={{ opacity: fade.interpolate({ inputRange: [0, 1], outputRange: [0, 0.6] }) }}
        >
          Kampus Lebih Aman
        </Animated.Text>
      </Animated.View>
    </View>
  );
}
