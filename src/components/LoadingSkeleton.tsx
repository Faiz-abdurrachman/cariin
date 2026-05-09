// Skeleton placeholder untuk feed selama loading. Render N card kosong dgn
// pulse animation lewat react-native-reanimated (sudah terinstall via Expo SDK).

import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { COLORS } from '@/utils/constants';

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
              backgroundColor: COLORS.surface,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: '#F4F4F5',
              overflow: 'hidden',
            },
            animatedStyle,
          ]}
        >
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
        </Animated.View>
      ))}
    </View>
  );
}
