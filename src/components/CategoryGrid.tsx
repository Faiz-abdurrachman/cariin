// Horizontal scroll chips kategori — dipakai di HomeScreen sebagai filter.
// Tap chip "Semua" untuk clear filter, tap chip kategori untuk filter spesifik.

import { Pressable, ScrollView, Text } from 'react-native';

import { CATEGORIES, COLORS, type CategoryId } from '@/utils/constants';

interface Props {
  selected: CategoryId | null;
  onSelect: (id: CategoryId | null) => void;
}

export default function CategoryGrid({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
    >
      <Chip
        label="Semua"
        emoji="🌐"
        active={selected === null}
        onPress={() => onSelect(null)}
      />
      {CATEGORIES.map((c) => (
        <Chip
          key={c.id}
          label={c.label}
          emoji={c.emoji}
          active={selected === c.id}
          onPress={() => onSelect(c.id)}
        />
      ))}
    </ScrollView>
  );
}

function Chip({
  label,
  emoji,
  active,
  onPress,
}: {
  label: string;
  emoji: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {({ pressed }) => (
        <Text
          style={{
            backgroundColor: active ? COLORS.primary : '#FFFFFF',
            color: active ? '#FFFFFF' : COLORS.textMuted,
            borderWidth: active ? 0 : 1,
            borderColor: COLORS.border,
            paddingHorizontal: 16,
            paddingVertical: 9,
            borderRadius: 999,
            fontSize: 13,
            fontWeight: '600',
            opacity: pressed ? 0.7 : 1,
            overflow: 'hidden',
          }}
        >
          {emoji}  {label}
        </Text>
      )}
    </Pressable>
  );
}
