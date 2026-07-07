import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import type { AuthStackParamList } from '@/navigation/types';
import { COLORS, SHADOW } from '@/utils/constants';

type Nav = StackNavigationProp<AuthStackParamList, 'RoleSelection'>;

const HERO_BACKGROUND =
  'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&auto=format&fit=crop&q=90';

interface RoleCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  onPress: () => void;
}

function RoleCard({ icon, badge, title, subtitle, description, accent, onPress }: RoleCardProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={title}>
      {({ pressed }) => (
        <View
          style={{
            borderRadius: 26,
            overflow: 'hidden',
            opacity: pressed ? 0.94 : 1,
            transform: [{ scale: pressed ? 0.985 : 1 }],
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 10 },
            elevation: 6,
          }}
        >
          <BlurView
            intensity={65}
            tint="light"
            style={{
              borderRadius: 26,
              backgroundColor: 'rgba(255,255,255,0.44)',
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.78)',
            }}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.2)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />
            <View
              style={{
                position: 'absolute',
                top: -18,
                right: -18,
                width: 160,
                height: 160,
                borderRadius: 999,
                backgroundColor: accent,
                opacity: 0.08,
              }}
              pointerEvents="none"
            />

            <View style={{ padding: 18, alignItems: 'center' }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255,255,255,0.72)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.88)',
                  ...SHADOW.subtle,
                  marginBottom: 14,
                }}
              >
                <Ionicons name={icon} size={26} color={accent} />
              </View>

              <View
                style={{
                  alignSelf: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.74)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.86)',
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '900',
                    letterSpacing: 0.8,
                    color: accent,
                    textTransform: 'uppercase',
                  }}
                >
                  {badge}
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 20,
                  lineHeight: 28,
                  fontWeight: '900',
                  color: COLORS.primary,
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                {title}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  lineHeight: 19,
                  fontWeight: '800',
                  color: COLORS.textMuted,
                  textAlign: 'center',
                  marginBottom: 16,
                }}
              >
                {subtitle}
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 22,
                  color: COLORS.textMuted,
                  textAlign: 'center',
                  marginBottom: 16,
                }}
              >
                {description}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', gap: 10, marginBottom: 14 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(37,99,235,0.12)' }} />
                <View
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 14,
                    backgroundColor: accent,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.24)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '900', color: '#FFFFFF' }}>Masuk</Text>
                  <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                </View>
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
    <ImageBackground source={{ uri: HERO_BACKGROUND }} style={{ flex: 1 }} resizeMode="cover">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(239,246,255,0.82)',
        }}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(239,246,255,0.78)', 'rgba(240,253,250,0.76)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <View
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 360,
          height: 360,
          borderRadius: 999,
          backgroundColor: COLORS.primary,
          opacity: 0.14,
        }}
        pointerEvents="none"
      />
      <View
        style={{
          position: 'absolute',
          bottom: -120,
          left: -100,
          width: 320,
          height: 320,
          borderRadius: 999,
          backgroundColor: COLORS.admin,
          opacity: 0.12,
        }}
        pointerEvents="none"
      />

      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-start',
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View
              style={{
                maxWidth: 420,
                width: '100%',
                alignSelf: 'center',
              }}
            >
              <View
                style={{
                  borderRadius: 30,
                  overflow: 'hidden',
                  backgroundColor: 'rgba(255,255,255,0.42)',
                  borderWidth: 1.5,
                  borderColor: 'rgba(255,255,255,0.82)',
                  padding: compact ? 18 : 22,
                  shadowColor: '#000',
                  shadowOpacity: 0.12,
                  shadowRadius: 26,
                  shadowOffset: { width: 0, height: 16 },
                  elevation: 8,
                }}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.22)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                  pointerEvents="none"
                />

                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                  <View
                    style={{
                      width: 86,
                      height: 86,
                      borderRadius: 28,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255,255,255,0.68)',
                      borderWidth: 1.5,
                      borderColor: 'rgba(255,255,255,0.92)',
                      marginBottom: 16,
                      ...SHADOW.subtle,
                    }}
                  >
                    <LinearGradient
                      colors={[COLORS.primary, '#60A5FA']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: 18,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name="search" size={30} color="#FFFFFF" />
                    </LinearGradient>
                  </View>

                  <Text
                    style={{
                      fontSize: compact ? 30 : 34,
                      fontWeight: '900',
                      letterSpacing: -0.6,
                      color: COLORS.primary,
                      marginBottom: 8,
                    }}
                  >
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
                    marginBottom: 18,
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
                    badge="Student"
                    title="Masuk sebagai Mahasiswa"
                    subtitle="Cari barang, buat laporan, dan pantau status."
                    description="Dipakai untuk akses feed publik, laporan pribadi, chat antar pengguna, dan profil mahasiswa."
                    accent={COLORS.primary}
                    onPress={() => navigation.navigate('Login', { isAdmin: false })}
                  />

                  <RoleCard
                    icon="shield-checkmark"
                    badge="Guardian"
                    title="Masuk sebagai Admin"
                    subtitle="Kelola laporan dan review data sebelum tayang."
                    description="Dipakai untuk moderasi laporan, membuat laporan walk-in, dan mengawasi aktivitas sistem."
                    accent={COLORS.admin}
                    onPress={() => navigation.navigate('Login', { isAdmin: true })}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
