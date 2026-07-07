// Laporanku — daftar laporan milik user (semua status). Bisa Edit, Hapus,
// atau Tandai Selesai.

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
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

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
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View
        style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 350,
          height: 350,
          borderRadius: 999,
          backgroundColor: COLORS.primary,
          opacity: 0.15,
          transform: [{ scale: 1.35 }],
        }}
        pointerEvents="none"
      />
      <View
        style={{
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: 300,
          height: 300,
          borderRadius: 999,
          backgroundColor: COLORS.found,
          opacity: 0.14,
          transform: [{ scale: 1.2 }],
        }}
        pointerEvents="none"
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
        <BlurView
          intensity={60}
          tint="light"
          style={{
            marginHorizontal: 16,
            marginTop: 2,
            marginBottom: 10,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderRadius: 24,
            backgroundColor: 'rgba(255,255,255,0.42)',
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.76)',
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.18)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <Text style={{ fontSize: 20, fontWeight: '900', color: COLORS.primary }}>
            Laporanku
          </Text>
          <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
            Semua laporan milikmu ada di sini, lengkap dengan status dan aksi cepat.
          </Text>
        </BlurView>

        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              report={item}
              onPressDetail={() =>
                nav.navigate(item.type === 'lost' ? 'DetailLost' : 'DetailFound', {
                  reportId: item.id,
                })
              }
              onEdit={() => nav.navigate('EditPost', { reportId: item.id })}
              onDelete={() => onDelete(item)}
              onMarkResolved={() => onMarkResolved(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 6,
            paddingBottom: 132,
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
    </View>
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
    <BlurView
      intensity={50}
      tint="light"
      style={{
        borderRadius: 28,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.42)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.76)',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 4,
      }}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.18)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <Pressable onPress={onPressDetail} accessibilityRole="button">
        {({ pressed }) => (
          <View
            style={{
              padding: 14,
              flexDirection: 'row',
              gap: 14,
              opacity: pressed ? 0.9 : 1,
            }}
          >
            <View
              style={{
                width: 92,
                height: 92,
                borderRadius: 18,
                backgroundColor: '#F4F4F5',
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {report.photo_url ? (
                <Image
                  source={{ uri: report.photo_url }}
                  style={{ width: 92, height: 92 }}
                  resizeMode="cover"
                />
              ) : (
                <Feather name="image" size={28} color={COLORS.textMuted} />
              )}
            </View>

            <View style={{ flex: 1, justifyContent: 'center', gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <StatusBadge status={report.status} />
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '800',
                    color: COLORS.textMuted,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                  }}
                >
                  {typeLabel}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '800',
                  color: COLORS.primary,
                  lineHeight: 20,
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

      {canEdit || canMarkResolved || report.status !== 'resolved' ? (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.74)',
            paddingHorizontal: 14,
            paddingVertical: 12,
            flexDirection: 'row',
            gap: 8,
            backgroundColor: 'rgba(255,255,255,0.3)',
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
    </BlurView>
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
    secondary: { bg: 'rgba(255,255,255,0.54)', text: COLORS.primary, border: 'rgba(255,255,255,0.82)' },
    danger: { bg: 'rgba(255,255,255,0.54)', text: COLORS.lost, border: 'rgba(255,255,255,0.82)' },
  }[variant];

  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={{ flex: flex ? 1 : undefined }}>
      {({ pressed }) => (
        <View
          style={{
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 14,
            backgroundColor: colors.bg,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            opacity: pressed ? 0.82 : 1,
          }}
        >
          <Text style={{ color: colors.text, fontSize: 12, fontWeight: '800' }}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
