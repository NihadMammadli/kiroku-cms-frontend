import api from './index';

export interface Log {
  id: number;
  product_name: string;
  umico_id: number;
  old_price: string;
  new_price: string;
  price_difference: number;
  savings: string;
  changed_at: string;
}

export interface PaginatedLogsResponse {
  results: Log[];
  count: number;
  next: string | null;
  previous: string | null;
}

export const logsAPI = {
  getAll: async (
    page: number = 1,
    search?: string,
    pageSize: number = 50
  ): Promise<PaginatedLogsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (search) {
      params.append('search', search);
    }

    const response = await api.get(`/price-changes/?${params.toString()}`);
    return response.data;
  },

  exportToExcel: async (): Promise<Blob> => {
    const response = await api.get('/price-changes/export/', {
      responseType: 'blob',
    });
    return response.data;
  },
};
