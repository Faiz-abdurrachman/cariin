import { useRoute, type RouteProp } from '@react-navigation/native';

import type { AdminCreateStackParamList } from '@/navigation/types';
import AdminCreateFoundScreen from './AdminCreateFoundScreen';

type Route = RouteProp<AdminCreateStackParamList, 'AdminCreate'>;

export default function AdminCreateReportScreen() {
  const route = useRoute<Route>();
  return <AdminCreateFoundScreen initialLost={route.params?.initialType === 'lost'} />;
}
