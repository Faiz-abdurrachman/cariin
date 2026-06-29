import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';

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
        icon="grid"
        active={selected === null}
        onPress={() => onSelect(null)}
      />
      {CATEGORIES.map((c) => (
        <Chip
          key={c.id}
          label={c.label}
          icon={c.icon}
          active={selected === c.id}
          onPress={() => onSelect(c.id)}
        />
      ))}
    </ScrollView>
  );
}

function Chip({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {({ pressed }) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: active ? COLORS.primary : '#FFFFFF',
            borderWidth: active ? 0 : 1,
            borderColor: COLORS.border,
            paddingHorizontal: 16,
            paddingVertical: 9,
            borderRadius: 999,
            opacity: pressed ? 0.7 : 1,
          }}
        >
          <MaterialCommunityIcons
            name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={16}
            color={active ? '#FFFFFF' : COLORS.textMuted}
          />
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: active ? '#FFFFFF' : COLORS.textMuted,
            }}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
