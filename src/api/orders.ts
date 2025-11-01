import api from './index';

export interface Order {
  id: number;
  umico_order_id: string;
  umico_order_number: string;
  customer_full_name: string;
  state_name: string;
  total_amount: string;
  ordered_at: string;
  cancel_reason: string;
  umico_order_url: string;
  total_order_count: number;
  total_cancel_count: number;
}

export interface PaginatedOrdersResponse {
  results: Order[];
  count: number;
  next: string | null;
  previous: string | null;
}

export const ordersAPI = {
  getAll: async (
    page: number = 1,
    search?: string,
    stateFilter?: string,
    pageSize: number = 10,
    ordering?: string
  ): Promise<PaginatedOrdersResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (search) {
      params.append('search', search);
    }

    if (stateFilter) {
      params.append('state_name', stateFilter);
    }

    if (ordering) {
      params.append('ordering', ordering);
    }

    const response = await api.get(`/orders/?${params.toString()}`);
    return response.data;
  },

  getStateNames: async (): Promise<string[]> => {
    const response = await api.get('/orders/state-name-list/');
    return response.data;
  },

  fetchUmico: async (): Promise<void> => {
    const response = await api.post('/orders/fetch-umico/');
    if (response.status === 202 || response.status === 200) {
      return;
    }
    throw new Error(`Unexpected status code: ${response.status}`);
  },
};
