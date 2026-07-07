import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { StatusBar, Pressable, Text, View, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import type { AuthStackParamList } from '@/navigation/types';
import { COLORS, SHADOW } from '@/utils/constants';

type Nav = StackNavigationProp<AuthStackParamList, 'RoleSelection'>;

interface RoleCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  description: string;
  onPress: () => void;
  accent: string;
  badge: string;
}

function RoleCard({ icon, title, subtitle, description, onPress, accent, badge }: RoleCardProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${title}: ${subtitle}`}>
      {({ pressed }) => (
        <View
          style={{
            borderRadius: 28,
            transform: [{ scale: pressed ? 0.985 : 1 }],
            opacity: pressed ? 0.92 : 1,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 10 },
            elevation: 4,
          }}
        >
          <BlurView
            intensity={58}
            tint="light"
            style={{
              borderRadius: 28,
              overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.42)',
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.75)',
            }}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.84)', 'rgba(255,255,255,0.18)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />
            <View
              style={{
                borderLeftWidth: 4,
                borderLeftColor: accent,
                padding: 18,
                gap: 14,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.62)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.82)',
                    ...SHADOW.subtle,
                  }}
                >
                  <Ionicons name={icon} size={26} color={accent} />
                </View>

                <View style={{ flex: 1, gap: 4 }}>
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 999,
                      backgroundColor: 'rgba(255,255,255,0.62)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.75)',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '800',
                        letterSpacing: 0.8,
                        color: accent,
                        textTransform: 'uppercase',
                      }}
                    >
                      {badge}
                    </Text>
                  </View>

                  <Text style={{ fontSize: 19, fontWeight: '800', color: COLORS.primary }}>
                    {title}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMuted }}>
                    {subtitle}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color={accent} />
              </View>

              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 20,
                  color: COLORS.textMuted,
                  paddingRight: 4,
                }}
              >
                {description}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: 'rgba(37, 99, 235, 0.12)',
                  }}
                />
                <Text style={{ fontSize: 12, fontWeight: '700', color: accent }}>
                  Lanjutkan
                </Text>
              </View>
            </View>
          </BlurView>
        </View>
      )}
    </Pressable>
  );
}

export default function RoleSelectionScreen() {
  const navigation = useNavigation<Nav>();
  const { width } = useWindowDimensions();
  const compact = width < 380;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View
        style={{
          position: 'absolute',
          top: -80,
          right: -90,
          width: 380,
          height: 380,
          borderRadius: 999,
          backgroundColor: COLORS.primary,
          opacity: 0.14,
          transform: [{ scale: 1.15 }],
        }}
        pointerEvents="none"
      />
      <View
        style={{
          position: 'absolute',
          bottom: -90,
          left: -110,
          width: 360,
          height: 360,
          borderRadius: 999,
          backgroundColor: COLORS.admin,
          opacity: 0.12,
          transform: [{ scale: 1.12 }],
        }}
        pointerEvents="none"
      />
      <View
        style={{
          position: 'absolute',
          top: '28%',
          left: '18%',
          width: 180,
          height: 180,
          borderRadius: 999,
          backgroundColor: COLORS.found,
          opacity: 0.12,
          transform: [{ scale: 1.4 }],
        }}
        pointerEvents="none"
      />

      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}
        >
          <BlurView
            intensity={60}
            tint="light"
            style={{
              borderRadius: 32,
              overflow: 'hidden',
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.76)',
              backgroundColor: 'rgba(255,255,255,0.4)',
              padding: compact ? 20 : 24,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 14 },
              elevation: 8,
            }}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.22)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />

            <View style={{ alignItems: 'center', marginBottom: 22 }}>
              <View
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255,255,255,0.58)',
                  borderWidth: 1.5,
                  borderColor: 'rgba(255,255,255,0.9)',
                  marginBottom: 18,
                  ...SHADOW.subtle,
                }}
              >
                <LinearGradient
                  colors={[COLORS.primary, '#60A5FA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="search" size={30} color="#FFFFFF" />
                </LinearGradient>
              </View>

              <Text style={{ fontSize: compact ? 30 : 34, fontWeight: '900', color: COLORS.primary, letterSpacing: -0.6, marginBottom: 8 }}>
                Cari.In
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 22,
                  color: COLORS.textMuted,
                  textAlign: 'center',
                  maxWidth: 300,
                }}
              >
                Tempat mencari, melapor, dan menemukan barang kampus dengan alur yang cepat dan rapi.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                gap: 8,
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: 'rgba(37,99,235,0.08)',
                  borderWidth: 1,
                  borderColor: 'rgba(37,99,235,0.14)',
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.primary }}>Mahasiswa</Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: 'rgba(13,148,136,0.08)',
                  borderWidth: 1,
                  borderColor: 'rgba(13,148,136,0.14)',
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.adminText }}>Admin</Text>
              </View>
            </View>

            <View style={{ gap: 14 }}>
              <RoleCard
                icon="school"
                title="Masuk sebagai Mahasiswa"
                subtitle="Cari barang, buat laporan, dan pantau status."
                description="Dipakai untuk akses feed publik, laporan pribadi, chat antar pengguna, dan profil mahasiswa."
                badge="Student"
                accent={COLORS.primary}
                onPress={() => navigation.navigate('Login', { isAdmin: false })}
              />

              <RoleCard
                icon="shield-checkmark"
                title="Masuk sebagai Admin"
                subtitle="Kelola laporan dan review data sebelum tayang."
                description="Dipakai untuk moderasi laporan, membuat laporan walk-in, dan mengawasi aktivitas sistem."
                badge="Guardian"
                accent={COLORS.admin}
                onPress={() => navigation.navigate('Login', { isAdmin: true })}
              />
            </View>
          </BlurView>
        </View>
      </SafeAreaView>
    </View>
  );
}
