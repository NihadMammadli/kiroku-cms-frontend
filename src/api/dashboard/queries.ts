import { api } from '../../config';
import { createQuery } from '../../config/queryFactory';
import type { DashboardStats } from './types';

const fetchBranchesCount = async (): Promise<DashboardStats> => {
  const response = await api.get('/products/?page=1&page_size=1');
  return { count: response.data.count || 0 };
};

export const useBranchesCountQuery = createQuery<DashboardStats>({
  queryKey: ['branches-count'],
  queryFn: fetchBranchesCount,
});
