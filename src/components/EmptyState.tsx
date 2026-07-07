// Placeholder kalau list kosong (feed, my posts, inbox, notifications).

import { Feather } from '@expo/vector-icons';
import { Text, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS } from '@/utils/constants';

interface Props {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ icon = 'inbox', title, subtitle }: Props) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 48,
      }}
    >
      <BlurView
        intensity={55}
        tint="light"
        style={{
          width: '100%',
          maxWidth: 340,
          paddingHorizontal: 24,
          paddingVertical: 28,
          borderRadius: 28,
          backgroundColor: 'rgba(255,255,255,0.42)',
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.75)',
          alignItems: 'center',
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          elevation: 4,
        }}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.85)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        <View
          style={{
            width: 76,
            height: 76,
            borderRadius: 999,
            backgroundColor: COLORS.primaryLight,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.75)',
          }}
        >
          <Feather name={icon} size={32} color={COLORS.primary} />
        </View>
        <Text
          style={{
            fontSize: 17,
            fontWeight: '800',
            color: COLORS.primary,
            marginBottom: 6,
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              fontSize: 13,
              color: COLORS.textMuted,
              textAlign: 'center',
              lineHeight: 20,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </BlurView>
    </View>
  );
}
