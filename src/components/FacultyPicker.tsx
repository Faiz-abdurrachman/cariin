// Dropdown faculty pakai Modal + FlatList — bukan native Picker biar styling
// konsisten lintas Android/iOS dan tidak butuh dep tambahan.

import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, FACULTIES } from '@/utils/constants';

interface Props {
  label: string;
  value: string | null;
  onChange: (faculty: string) => void;
  error?: string;
  placeholder?: string;
}

export default function FacultyPicker({
  label,
  value,
  onChange,
  error,
  placeholder = 'Pilih',
}: Props) {
  const [open, setOpen] = useState(false);

  const borderColor = error ? COLORS.lost : COLORS.border;

  return (
    <View style={{ rowGap: 6 }}>
      <Text className="text-sm font-semibold text-zinc-900">{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Pilih ${label}`}
        style={{
          backgroundColor: '#FAFAFA',
          borderColor,
          borderWidth: error ? 2 : 1,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 14, color: value ? COLORS.primary : COLORS.textMuted }}>
          {value ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
      </Pressable>
      {error ? (
        <Text className="text-xs font-medium" style={{ color: COLORS.lost }}>
          {error}
        </Text>
      ) : null}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: COLORS.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 8,
              paddingBottom: 32,
              maxHeight: '70%',
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: COLORS.border,
                borderRadius: 2,
                alignSelf: 'center',
                marginVertical: 12,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                paddingHorizontal: 24,
                paddingBottom: 12,
                color: COLORS.primary,
              }}
            >
              Pilih Fakultas
            </Text>
            <FlatList
              data={FACULTIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const selected = item === value;
                return (
                  <Pressable
                    onPress={() => {
                      onChange(item);
                      setOpen(false);
                    }}
                    style={({ pressed }) => ({
                      paddingHorizontal: 24,
                      paddingVertical: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: pressed ? COLORS.background : 'transparent',
                    })}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: selected ? '700' : '500',
                        color: selected ? COLORS.primary : COLORS.textMuted,
                      }}
                    >
                      {item}
                    </Text>
                    {selected ? (
                      <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
