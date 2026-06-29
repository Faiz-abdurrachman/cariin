// Placeholder kalau list kosong (feed, my posts, inbox, notifications).

import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

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
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 999,
          backgroundColor: COLORS.primaryLight,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <Feather name={icon} size={32} color={COLORS.textMuted} />
      </View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '700',
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
    </View>
  );
}
