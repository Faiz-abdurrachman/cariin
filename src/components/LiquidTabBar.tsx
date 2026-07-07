import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@/utils/constants';

export default function LiquidTabBar({ state, navigation, descriptors }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomOffset = Platform.OS === 'ios' ? Math.max(insets.bottom, 10) : Math.max(insets.bottom, 8);
  const activeRoute = state.routes[state.index];
  const descriptor = descriptors[activeRoute.key];
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
          // User routes
          if (route.name === 'HomeTab') iconName = isFocused ? 'home' : 'home-outline';
          if (route.name === 'ChatTab') iconName = isFocused ? 'chatbubbles' : 'chatbubbles-outline';
          if (route.name === 'MyPostsTab') iconName = isFocused ? 'document-text' : 'document-text-outline';
          if (route.name === 'ProfileTab') iconName = isFocused ? 'person' : 'person-outline';
          // Admin routes
          if (route.name === 'DashboardTab') iconName = isFocused ? 'grid' : 'grid-outline';
          if (route.name === 'ReportsTab') iconName = isFocused ? 'list' : 'list-outline';
          if (route.name === 'AdminProfileTab') iconName = isFocused ? 'person' : 'person-outline';
          // Center
          if (isCenterFab) iconName = 'add';

          if (isCenterFab) {
            // Render the Center FAB inside the pill
            return (
              <Pressable
                key={route.key}
                onPress={() => navigation.navigate('CreateModal', { screen: 'CreateLost' })}
              >
                {({ pressed }) => (
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 20,
                      marginHorizontal: 4,
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.95 : 1 }],
                      backgroundColor: COLORS.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: COLORS.primary,
                      shadowOpacity: 0.4,
                      shadowRadius: 12,
                      shadowOffset: { width: 0, height: 6 },
                      elevation: 6,
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.4)',
                    }}
                  >
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.4)', 'rgba(255,255,255,0)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFillObject}
                      pointerEvents="none"
                    />
                    <LinearGradient
                      colors={['rgba(0, 0, 0, 0.1)', 'transparent']}
                      start={{ x: 1, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      style={StyleSheet.absoluteFillObject}
                      pointerEvents="none"
                    />
                    <Ionicons name="add" size={32} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            );
          }

          // Normal Tab Items
          return (
            <Pressable
                key={route.key}
                onPress={onPress}
                style={{
                  flex: 1,
                  paddingVertical: 9,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginHorizontal: 4,
                }}
              >
              {isFocused ? (
                // Active Liquid Glass Button Background
                <View style={StyleSheet.absoluteFillObject}>
                  <View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      borderRadius: 18,
                      backgroundColor: 'rgba(255,255,255,0.56)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.82)',
                    }}
                  >
                    <LinearGradient
                      colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.18)', 'transparent']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFillObject}
                      pointerEvents="none"
                    />
                  </View>
                </View>
              ) : null}

              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? COLORS.primary : COLORS.textMuted}
                style={{
                  textShadowColor: isFocused ? 'rgba(255,255,255,0.8)' : 'transparent',
                  textShadowRadius: 8,
                }}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
