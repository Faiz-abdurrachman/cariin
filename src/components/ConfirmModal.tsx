import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';

import { COLORS } from '@/utils/constants';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          backgroundColor: 'rgba(24,24,27,0.45)',
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tutup dialog konfirmasi"
          onPress={onCancel}
          style={{ position: 'absolute', inset: 0 }}
        />
        <View
          accessibilityViewIsModal
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 24,
            padding: 22,
            gap: 16,
            shadowColor: '#000000',
            shadowOpacity: 0.18,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 12 },
            elevation: 10,
          }}
        >
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 19, fontWeight: '800', color: COLORS.primary }}>
              {title}
            </Text>
            <Text style={{ fontSize: 14, lineHeight: 21, color: COLORS.textMuted }}>
              {message}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
            <Pressable
              onPress={onCancel}
              disabled={loading}
              accessibilityRole="button"
              style={{
                paddingHorizontal: 18,
                paddingVertical: 12,
                borderRadius: 14,
                backgroundColor: COLORS.background,
                opacity: loading ? 0.55 : 1,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.textMuted }}>
                {cancelLabel}
              </Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              disabled={loading}
              accessibilityRole="button"
              style={{
                minWidth: 104,
                paddingHorizontal: 18,
                paddingVertical: 12,
                borderRadius: 14,
                alignItems: 'center',
                backgroundColor: destructive ? COLORS.lost : COLORS.primary,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.surface} />
              ) : (
                <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.surface }}>
                  {confirmLabel}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
