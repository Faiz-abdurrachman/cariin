// Badge status laporan: pending/approved/rejected/resolved dengan warna khas.

import { Text, View } from 'react-native';

import { REPORT_STATUS_LABEL, type ReportStatus } from '@/utils/constants';

interface Props {
  status: ReportStatus;
  size?: 'sm' | 'md';
}

const STATUS_BG: Record<ReportStatus, string> = {
  pending: '#FEF3C7',
  approved: '#ECFDF5',
  rejected: '#FFF7ED',
  resolved: '#F3E8FF',
};

const STATUS_TEXT: Record<ReportStatus, string> = {
  pending: '#92400E',
  approved: '#065F46',
  rejected: '#9A3412',
  resolved: '#6B21A8',
};

export default function StatusBadge({ status, size = 'sm' }: Props) {
  return (
    <View
      style={{
        backgroundColor: STATUS_BG[status],
        paddingHorizontal: size === 'sm' ? 8 : 12,
        paddingVertical: size === 'sm' ? 3 : 5,
        borderRadius: 999,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        style={{
          color: STATUS_TEXT[status],
          fontSize: size === 'sm' ? 10 : 12,
          fontWeight: '700',
          letterSpacing: 0.3,
        }}
      >
        {REPORT_STATUS_LABEL[status]}
      </Text>
    </View>
  );
}
