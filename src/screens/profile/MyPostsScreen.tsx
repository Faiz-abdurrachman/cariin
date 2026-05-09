// Laporanku — daftar laporan milik user (semua status). Bisa Edit, Hapus,
// atau Tandai Selesai. Referensi visual: cariin-web/my-posts.html.

import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '@/components/EmptyState';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import type { MyPostsStackParamList } from '@/navigation/types';
import {
  deleteReport,
  listReports,
  markAsResolved,
  type Report,
} from '@/services/report.service';
import { useFeedStore } from '@/store/feedStore';
import { COLORS } from '@/utils/constants';
import { formatRelativeTime } from '@/utils/formatters';

type Nav = StackNavigationProp<MyPostsStackParamList, 'MyPosts'>;

export default function MyPostsScreen() {
  const nav = useNavigation<Nav>();
  const { user } = useAuth();
  const refreshFeed = useFeedStore((s) => s.fetch);

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (showSpinner = true) => {
      if (!user) return;
      if (showSpinner) setLoading(true);
      setError(null);
      try {
        const data = await listReports({ userId: user.id });
        setReports(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Gagal memuat laporan.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user],
  );

  useFocusEffect(
    useCallback(() => {
      void load(true);
    }, [load]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    void load(false);
  };

  const onDelete = (item: Report) => {
    Alert.alert('Hapus laporan?', `"${item.title}" akan dihapus permanen.`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteReport(item.id);
            setReports((prev) => prev.filter((r) => r.id !== item.id));
            void refreshFeed();
          } catch (e) {
            Alert.alert(
              'Gagal hapus',
              e instanceof Error ? e.message : 'Coba lagi sebentar.',
            );
          }
        },
      },
    ]);
  };

  const onMarkResolved = (item: Report) => {
    Alert.alert(
      'Tandai selesai?',
      `Setelah ditandai selesai, laporan "${item.title}" tidak bisa diedit lagi.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Tandai Selesai',
          onPress: async () => {
            try {
              const updated = await markAsResolved(item.id);
              setReports((prev) =>
                prev.map((r) => (r.id === item.id ? updated : r)),
              );
              void refreshFeed();
            } catch (e) {
              Alert.alert(
                'Gagal',
                e instanceof Error ? e.message : 'Coba lagi sebentar.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }} edges={['top']}>
      <View
        style={{
          height: 56,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.surface,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.primary }}>
          Laporanku
        </Text>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            report={item}
            onPressDetail={() =>
              nav.navigate(
                item.type === 'lost' ? 'DetailLost' : 'DetailFound',
                { reportId: item.id },
              )
            }
            onEdit={() => nav.navigate('EditPost', { reportId: item.id })}
            onDelete={() => onDelete(item)}
            onMarkResolved={() => onMarkResolved(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 32,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          loading ? (
            <LoadingSkeleton count={3} />
          ) : error ? (
            <EmptyState
              icon="alert-triangle"
              title="Gagal memuat"
              subtitle={error}
            />
          ) : (
            <EmptyState
              icon="folder"
              title="Belum ada laporan"
              subtitle="Buat laporan pertama lewat tombol + di tab bar."
            />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

interface PostCardProps {
  report: Report;
  onPressDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMarkResolved: () => void;
}

function PostCard({
  report,
  onPressDetail,
  onEdit,
  onDelete,
  onMarkResolved,
}: PostCardProps) {
  const canEdit = report.status !== 'resolved' && report.status !== 'rejected';
  const canMarkResolved = report.status === 'approved';
  const typeLabel = report.type === 'lost' ? 'Hilang' : 'Ditemukan';

  return (
    <View
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#F4F4F5',
        overflow: 'hidden',
      }}
    >
      <Pressable onPress={onPressDetail} accessibilityRole="button">
        {({ pressed }) => (
          <View
            style={{
              padding: 14,
              flexDirection: 'row',
              gap: 14,
              opacity: pressed ? 0.85 : 1,
            }}
          >
            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 16,
                backgroundColor: '#F4F4F5',
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {report.photo_url ? (
                <Image
                  source={{ uri: report.photo_url }}
                  style={{ width: 88, height: 88 }}
                  resizeMode="cover"
                />
              ) : (
                <Feather name="image" size={28} color={COLORS.textMuted} />
              )}
            </View>
            <View style={{ flex: 1, justifyContent: 'center', gap: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <StatusBadge status={report.status} />
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: COLORS.textMuted,
                    letterSpacing: 0.5,
                  }}
                >
                  • {typeLabel}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: COLORS.primary,
                  lineHeight: 19,
                }}
                numberOfLines={2}
              >
                {report.title}
              </Text>
              <Text style={{ fontSize: 11, color: COLORS.textMuted }}>
                {formatRelativeTime(report.created_at)}
              </Text>
            </View>
          </View>
        )}
      </Pressable>

      {/* Action row */}
      {canEdit || canMarkResolved || report.status !== 'resolved' ? (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: '#F4F4F5',
            paddingHorizontal: 14,
            paddingVertical: 10,
            backgroundColor: '#FAFAFA',
            flexDirection: 'row',
            gap: 8,
          }}
        >
          {canMarkResolved ? (
            <ActionButton
              label="Tandai Selesai"
              variant="primary"
              onPress={onMarkResolved}
              flex
            />
          ) : null}
          {canEdit ? (
            <ActionButton
              label="Edit"
              variant="secondary"
              onPress={onEdit}
              flex={!canMarkResolved}
            />
          ) : null}
          <ActionButton
            label="Hapus"
            variant="danger"
            onPress={onDelete}
            flex={!canMarkResolved && !canEdit}
          />
        </View>
      ) : null}
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  variant,
  flex,
}: {
  label: string;
  onPress: () => void;
  variant: 'primary' | 'secondary' | 'danger';
  flex?: boolean;
}) {
  const colors = {
    primary: { bg: COLORS.primary, text: '#FFFFFF', border: COLORS.primary },
    secondary: { bg: COLORS.surface, text: COLORS.primary, border: COLORS.border },
    danger: { bg: COLORS.surface, text: COLORS.lost, border: COLORS.border },
  }[variant];

  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={{ flex: flex ? 1 : undefined }}>
      {({ pressed }) => (
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 9,
            borderRadius: 12,
            backgroundColor: colors.bg,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            opacity: pressed ? 0.85 : 1,
          }}
        >
          <Text style={{ color: colors.text, fontSize: 12, fontWeight: '700' }}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
