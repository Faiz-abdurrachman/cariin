import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '@/utils/constants';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.background,
            padding: 32,
          }}
        >
          <View style={{ alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 24,
                backgroundColor: '#FEE2E2',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 32 }}>⚠</Text>
            </View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '800',
                color: COLORS.primary,
                textAlign: 'center',
              }}
            >
              Ada yang salah
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.textMuted,
                textAlign: 'center',
                lineHeight: 21,
                maxWidth: 280,
              }}
            >
              Aplikasi mengalami error yang tidak terduga. Coba mulai ulang aplikasi.
            </Text>
          </View>

          <Pressable
            onPress={this.handleReset}
            accessibilityRole="button"
            accessibilityLabel="Coba lagi"
          >
            {({ pressed }) => (
              <View
                style={{
                  backgroundColor: COLORS.primary,
                  paddingHorizontal: 28,
                  paddingVertical: 14,
                  borderRadius: 16,
                  opacity: pressed ? 0.8 : 1,
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 15,
                    fontWeight: '700',
                  }}
                >
                  Coba Lagi
                </Text>
              </View>
            )}
          </Pressable>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}
