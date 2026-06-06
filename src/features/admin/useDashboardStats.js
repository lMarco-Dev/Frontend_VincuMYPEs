import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from './adminDashboard.api';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'dashboardStats'],
    queryFn: getDashboardStats,
    refetchInterval: 60_000,
  });
}
