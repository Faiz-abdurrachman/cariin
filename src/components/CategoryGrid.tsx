import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

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
            borderRadius: 999,
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          }}
        >
          <BlurView
            intensity={50}
            tint="light"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: active ? 'rgba(37,99,235,0.92)' : 'rgba(255,255,255,0.42)',
              borderWidth: 1.5,
              borderColor: active ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.75)',
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 999,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOpacity: 0.06,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 2,
            }}
          >
            {active && (
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  { backgroundColor: COLORS.primary, opacity: 0.22 }
                ]}
                pointerEvents="none"
              />
            )}

            <LinearGradient
              colors={['rgba(255,255,255,0.84)', 'rgba(255,255,255,0.18)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />

            {active && (
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    borderTopWidth: 1.5,
                    borderTopColor: 'rgba(255,255,255,0.38)',
                    borderRadius: 999,
                  }
                ]}
                pointerEvents="none"
              />
            )}

            <MaterialCommunityIcons
              name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
              size={16}
              color={active ? '#FFFFFF' : COLORS.textMuted}
              style={
                active
                  ? {
                      textShadowColor: 'rgba(0,0,0,0.1)',
                      textShadowRadius: 2,
                      textShadowOffset: { width: 0, height: 1 },
                    }
                  : undefined
              }
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: active ? '700' : '600',
                color: active ? '#FFFFFF' : COLORS.textMuted,
              }}
            >
              {label}
            </Text>
          </BlurView>
        </View>
      )}
    </Pressable>
  );
}
