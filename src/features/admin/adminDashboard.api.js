import { httpClient } from '@/shared/api/httpClient';

export const getDashboardStats = () =>
  httpClient.get('/admin/dashboard/stats').then((r) => r.data);
