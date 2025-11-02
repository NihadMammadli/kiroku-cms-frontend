import { createQuery } from '../../config';
import api from '../../config/api';
import type { Organization, OrganizationListParams } from './types';

// API functions
const fetchOrganizations = async (
  params?: OrganizationListParams
): Promise<Organization[]> => {
  const response = await api.get('/organizations/', { params });
  return response.data;
};

const fetchOrganization = async (): Promise<Organization> => {
  const response = await api.get(`/organizations/my/`);
  return response.data;
};

const fetchOrganizationBranches = async (id: number): Promise<any[]> => {
  const response = await api.get(`/organizations/${id}/branches/`);
  return response.data;
};

const fetchOrganizationStatistics = async (): Promise<any> => {
  const response = await api.get(`/organizations/my/statistics/`);
  return response.data;
};

// Query hooks
export const useOrganizationsQuery = (params?: OrganizationListParams) => {
  return createQuery<Organization[]>({
    queryKey: ['organizations', 'list', params],
    queryFn: () => fetchOrganizations(params),
  })();
};

export const useOrganizationQuery = () => {
  return createQuery<Organization>({
    queryKey: ['organizations', 'detail'],
    queryFn: () => fetchOrganization(),
    options: {
      enabled: true,
    },
  })();
};

export const useOrganizationBranchesQuery = (id: number) => {
  return createQuery<any[]>({
    queryKey: ['organizations', 'branches', id],
    queryFn: () => fetchOrganizationBranches(id),
    options: {
      enabled: !!id,
    },
  })();
};

export const useOrganizationStatisticsQuery = () => {
  return createQuery<any>({
    queryKey: ['organizations', 'statistics'],
    queryFn: () => fetchOrganizationStatistics(),
    options: {
      enabled: true,
    },
  })();
};
