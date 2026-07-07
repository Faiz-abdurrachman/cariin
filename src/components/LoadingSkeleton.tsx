// Skeleton placeholder untuk feed selama loading. Render N card kosong dgn
// pulse animation lewat react-native-reanimated (sudah terinstall via Expo SDK).

import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  count?: number;
}

export default function LoadingSkeleton({ count = 3 }: Props) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={{ gap: 20 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View
          key={i}
          style={[
            {
              borderRadius: 24,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
              elevation: 3,
            },
            animatedStyle,
          ]}
        >
          <BlurView
            intensity={40}
            tint="light"
            style={{
              backgroundColor: 'rgba(255,255,255,0.42)',
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.72)',
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.8)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />
            <View style={{ height: 200, backgroundColor: '#E4E4E7' }} />
            <View style={{ padding: 18, gap: 8 }}>
              <View
                style={{ height: 16, backgroundColor: '#E4E4E7', borderRadius: 6, width: '70%' }}
              />
              <View
                style={{ height: 12, backgroundColor: '#E4E4E7', borderRadius: 6, width: '95%' }}
              />
              <View
                style={{ height: 12, backgroundColor: '#E4E4E7', borderRadius: 6, width: '60%' }}
              />
            </View>
          </BlurView>
        </Animated.View>
      ))}
    </View>
  );
}
