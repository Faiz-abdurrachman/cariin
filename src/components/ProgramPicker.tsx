// Dropdown program studi (prodi) pakai Modal + FlatList.
// Daftar prodi berubah dinamis tergantung fakultas yang dipilih.
// Picker tetap bisa ditekan — kalau fakultas belum dipilih, modal muncul
// dengan pesan "Pilih fakultas terlebih dahulu."

import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, FACULTY_PROGRAMS } from '@/utils/constants';

interface Props {
  faculty: string | null;
  value: string | null;
  onChange: (prodi: string) => void;
  error?: string;
}

export default function ProgramPicker({ faculty, value, onChange, error }: Props) {
  const [open, setOpen] = useState(false);

  const programs = faculty ? FACULTY_PROGRAMS[faculty] : undefined;
  const hasPrograms = programs !== undefined && programs.length > 0;
  const noFaculty = !faculty;

  const borderColor = error ? COLORS.lost : COLORS.border;

  return (
    <View style={{ rowGap: 6 }}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: '#18181B' }}>Prodi</Text>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Pilih prodi"
        style={{
          backgroundColor: noFaculty ? '#E2E8F0' : '#FAFAFA',
          borderColor,
          borderWidth: error ? 2 : 1,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: noFaculty ? 0.5 : 1,
        }}
      >
        <Text style={{ fontSize: 14, color: value ? COLORS.primary : COLORS.textMuted }}>
          {noFaculty ? 'Pilih fakultas dulu' : (value ?? 'Pilih prodi')}
        </Text>
        <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
      </Pressable>
      {error ? (
        <Text style={{ fontSize: 12, fontWeight: '500', color: COLORS.lost }}>
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
              Pilih Prodi
            </Text>
            {noFaculty ? (
              <Text style={{ paddingHorizontal: 24, paddingVertical: 20, fontSize: 14, color: COLORS.textMuted, textAlign: 'center' }}>
                Pilih fakultas terlebih dahulu.
              </Text>
            ) : !hasPrograms ? (
              <Text style={{ paddingHorizontal: 24, paddingVertical: 20, fontSize: 14, color: COLORS.textMuted, textAlign: 'center' }}>
                Tidak ada prodi tersedia untuk fakultas ini.
              </Text>
            ) : (
              <FlatList
                data={programs}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const selected = item === value;
                  return (
                    <Pressable
                      onPress={() => {
                        onChange(item);
                        setOpen(false);
                      }}
                    >
                      {({ pressed }) => (
                        <View
                          style={{
                            paddingHorizontal: 24,
                            paddingVertical: 16,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: pressed ? COLORS.background : 'transparent',
                          }}
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
                        </View>
                      )}
                    </Pressable>
                  );
                }}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
