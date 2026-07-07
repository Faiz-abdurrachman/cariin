import { Feather } from '@expo/vector-icons';
import { Text, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import type { Message } from '@/services/chat.service';
import { COLORS } from '@/utils/constants';
import { formatRelativeTime } from '@/utils/formatters';

interface Props {
  message: Message;
  isMine: boolean;
  showTime: boolean;
}

export default function ChatBubble({ message, isMine, showTime }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: isMine ? 'flex-end' : 'flex-start',
        paddingHorizontal: 16,
        marginBottom: 8,
      }}
    >
      <BlurView
        intensity={35}
        tint="light"
        style={{
          maxWidth: '75%',
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 22,
          borderBottomRightRadius: isMine ? 6 : 22,
          borderBottomLeftRadius: isMine ? 22 : 6,
          backgroundColor: isMine ? 'rgba(37,99,235,0.92)' : 'rgba(255,255,255,0.62)',
          borderWidth: 1,
          borderColor: isMine ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.82)',
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={
            isMine
              ? ['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.06)', 'transparent']
              : ['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.2)', 'transparent']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />
        <Text
          style={{
            fontSize: 14,
            lineHeight: 20,
            color: isMine ? '#FFFFFF' : COLORS.primary,
            fontWeight: '600',
          }}
        >
          {message.content}
        </Text>
        {showTime ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 4,
              marginTop: 4,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                color: isMine ? 'rgba(255,255,255,0.66)' : COLORS.textMuted,
                fontWeight: '700',
              }}
            >
              {formatRelativeTime(message.created_at)}
            </Text>
            {isMine ? (
              <Feather
                name={message.is_read ? 'check' : 'check'}
                size={12}
                color={message.is_read ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.46)'}
                style={message.is_read ? undefined : { opacity: 0.6 }}
              />
            ) : null}
          </View>
        ) : null}
      </BlurView>
    </View>
  );
}
