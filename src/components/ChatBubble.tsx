import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
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
        marginBottom: 4,
      }}
    >
      <View
        style={{
          maxWidth: '75%',
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 20,
          borderBottomRightRadius: isMine ? 4 : 20,
          borderBottomLeftRadius: isMine ? 20 : 4,
          backgroundColor: isMine ? COLORS.primary : '#F4F4F5',
        }}
      >
        <Text
          style={{
            fontSize: 14,
            lineHeight: 20,
            color: isMine ? '#FFFFFF' : COLORS.primary,
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
                color: isMine ? 'rgba(255,255,255,0.6)' : COLORS.textMuted,
              }}
            >
              {formatRelativeTime(message.created_at)}
            </Text>
            {isMine ? (
              <Feather
                name={message.is_read ? 'check' : 'check'}
                size={12}
                color={message.is_read ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)'}
                style={message.is_read ? undefined : { opacity: 0.6 }}
              />
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}
