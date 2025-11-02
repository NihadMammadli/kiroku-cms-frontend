import { createQuery } from '../../config';
import api from '../../config/api';
import { Organization, OrganizationListParams } from './types';

// API functions
const fetchOrganizations = async (
  params?: OrganizationListParams
): Promise<Organization[]> => {
  const response = await api.get('/organizations/', { params });
  return response.data;
};

const fetchOrganization = async (id: number): Promise<Organization> => {
  const response = await api.get(`/organizations/${id}/`);
  return response.data;
};

const fetchOrganizationBranches = async (id: number): Promise<any[]> => {
  const response = await api.get(`/organizations/${id}/branches/`);
  return response.data;
};

const fetchOrganizationStatistics = async (id: number): Promise<any> => {
  const response = await api.get(`/organizations/${id}/statistics/`);
  return response.data;
};

// Query hooks
export const useOrganizationsQuery = (params?: OrganizationListParams) => {
  return createQuery<Organization[]>({
    queryKey: ['organizations', 'list', params],
    queryFn: () => fetchOrganizations(params),
  })();
};

export const useOrganizationQuery = (id: number) => {
  return createQuery<Organization>({
    queryKey: ['organizations', 'detail', id],
    queryFn: () => fetchOrganization(id),
    options: {
      enabled: !!id,
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

export const useOrganizationStatisticsQuery = (id: number) => {
  return createQuery<any>({
    queryKey: ['organizations', 'statistics', id],
    queryFn: () => fetchOrganizationStatistics(id),
    options: {
      enabled: !!id,
    },
  })();
};
