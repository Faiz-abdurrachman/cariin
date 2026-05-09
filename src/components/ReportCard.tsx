// Card laporan untuk feed — foto + badge type + title + waktu + lokasi.
// Referensi visual: cariin-web/home.html.

import { Feather } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';

import StatusBadge from './StatusBadge';
import ViaAdminBadge from './ViaAdminBadge';
import { COLORS } from '@/utils/constants';
import { formatRelativeTime } from '@/utils/formatters';
import type { Report } from '@/services/report.service';

interface Props {
  report: Report;
  onPress: () => void;
  /** Tampilkan StatusBadge (default false — feed publik gak perlu, tapi MyPosts perlu). */
  showStatus?: boolean;
}

export default function ReportCard({ report, onPress, showStatus = false }: Props) {
  const isLost = report.type === 'lost';
  const dotColor = isLost ? COLORS.lost : COLORS.found;
  const typeLabel = isLost ? 'Hilang' : 'Ditemukan';

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {({ pressed }) => (
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 24,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: '#F4F4F5',
            shadowColor: '#000',
            shadowOpacity: 0.04,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 1,
            opacity: pressed ? 0.85 : 1,
          }}
        >
          {/* Foto + badge type + via admin */}
          <View style={{ height: 200, backgroundColor: '#F4F4F5' }}>
            {report.photo_url ? (
              <Image
                source={{ uri: report.photo_url }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="image" size={36} color={COLORS.textMuted} />
              </View>
            )}
            <View
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                flexDirection: 'row',
                gap: 6,
              }}
            >
              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 999,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <View
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    backgroundColor: dotColor,
                  }}
                />
                <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.primary }}>
                  {typeLabel}
                </Text>
              </View>
              {report.created_by_admin ? <ViaAdminBadge /> : null}
            </View>
            {showStatus ? (
              <View style={{ position: 'absolute', top: 12, right: 12 }}>
                <StatusBadge status={report.status} />
              </View>
            ) : null}
          </View>

          {/* Body */}
          <View style={{ padding: 18 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: 6,
                gap: 8,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: '700',
                  color: COLORS.primary,
                  lineHeight: 22,
                }}
                numberOfLines={2}
              >
                {report.title}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '500',
                  color: COLORS.textMuted,
                  backgroundColor: '#F4F4F5',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 6,
                  overflow: 'hidden',
                }}
              >
                {formatRelativeTime(report.created_at)}
              </Text>
            </View>

            {report.description ? (
              <Text
                numberOfLines={2}
                style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 12 }}
              >
                {report.description}
              </Text>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                alignSelf: 'flex-start',
                backgroundColor: '#FAFAFA',
                borderWidth: 1,
                borderColor: '#F4F4F5',
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Feather name="map-pin" size={12} color={COLORS.textMuted} />
              <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.textMuted }}>
                {report.location}
              </Text>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}
