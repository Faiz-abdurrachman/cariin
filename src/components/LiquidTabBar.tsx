import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@/utils/constants';

interface LiquidTabBarProps extends BottomTabBarProps {
  variant?: 'default' | 'admin';
  onCreatePress?: () => void;
}

export default function LiquidTabBar({
  state,
  navigation,
  descriptors,
  variant = 'default',
  onCreatePress,
}: LiquidTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomOffset = Platform.OS === 'ios' ? Math.max(insets.bottom, 10) : Math.max(insets.bottom, 8);
  const accent = variant === 'admin' ? COLORS.admin : COLORS.primary;
  const activeRoute = state.routes[state.index] ?? state.routes[0];
  const descriptor = activeRoute ? descriptors[activeRoute.key] : undefined;
  const tabBarStyle = descriptor?.options.tabBarStyle as { display?: string } | undefined;

  if (tabBarStyle?.display === 'none') {
    return null;
  }

  return (
    <View
      style={{
        position: 'absolute',
        bottom: bottomOffset,
        left: 14,
        right: 14,
        alignItems: 'center',
        zIndex: 100,
      }}
    >
      <View
        style={{
          borderRadius: 26,
          flexDirection: 'row',
          padding: 7,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.12,
          shadowRadius: 18,
          elevation: 8,
        }}
      >
        <BlurView
          intensity={60}
          tint="light"
          style={{
            ...StyleSheet.absoluteFillObject,
            borderRadius: 26,
            backgroundColor: 'rgba(255,255,255,0.44)',
            borderWidth: 1.25,
            borderColor: 'rgba(255,255,255,0.78)',
            overflow: 'hidden',
          }}
        >
          {/* Main Container Glare */}
          <LinearGradient
            colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.22)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
        </BlurView>

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const isCenterFab = route.name === 'CreateTab';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          let accessibilityLabel = 'Navigasi';
          // User routes
          if (route.name === 'HomeTab') {
            iconName = isFocused ? 'home' : 'home-outline';
            accessibilityLabel = 'Beranda';
          }
          if (route.name === 'ChatTab') {
            iconName = isFocused ? 'chatbubbles' : 'chatbubbles-outline';
            accessibilityLabel = 'Pesan';
          }
          if (route.name === 'MyPostsTab') {
            iconName = isFocused ? 'document-text' : 'document-text-outline';
            accessibilityLabel = 'Laporanku';
          }
          if (route.name === 'ProfileTab') {
            iconName = isFocused ? 'person' : 'person-outline';
            accessibilityLabel = 'Profil';
          }
          // Admin routes
          if (route.name === 'DashboardTab') {
            iconName = isFocused ? 'grid' : 'grid-outline';
            accessibilityLabel = 'Dashboard';
          }
          if (route.name === 'ReportsTab') {
            iconName = isFocused ? 'list' : 'list-outline';
            accessibilityLabel = 'Semua laporan';
          }
          if (route.name === 'AdminProfileTab') {
            iconName = isFocused ? 'person' : 'person-outline';
            accessibilityLabel = 'Profil admin';
          }
          // Center
          if (isCenterFab) iconName = 'add';

          if (isCenterFab) {
            return (
              <Pressable
                key={route.key}
                onPress={() => {
                  if (onCreatePress) {
                    onCreatePress();
                  } else {
                    navigation.navigate('CreateModal', { screen: 'CreateLost' });
                  }
                }}
                accessibilityRole="button"
                accessibilityLabel="Buat laporan baru"
              >
                {({ pressed }) => (
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 26,
                      marginHorizontal: 4,
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.95 : 1 }],
                      backgroundColor: accent,
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: accent,
                      shadowOpacity: 0.28,
                      shadowRadius: 10,
                      shadowOffset: { width: 0, height: 5 },
                      elevation: 6,
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.52)',
                    }}
                  >
                    <Ionicons name="add" size={32} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            );
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityLabel={accessibilityLabel}
              accessibilityState={{ selected: isFocused }}
              style={{
                flex: 1,
                minHeight: 52,
                paddingVertical: 7,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 2,
              }}
            >
              <Ionicons
                name={iconName}
                size={25}
                color={isFocused ? accent : COLORS.textMuted}
                style={{
                  textShadowColor: isFocused ? 'rgba(255,255,255,0.8)' : 'transparent',
                  textShadowRadius: 6,
                }}
              />
              <View
                style={{
                  width: isFocused ? 18 : 4,
                  height: 3,
                  borderRadius: 999,
                  backgroundColor: isFocused ? accent : 'transparent',
                  marginTop: 4,
                }}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
