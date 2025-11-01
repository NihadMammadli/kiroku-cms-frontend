import api from './index';

export interface Product {
  id: string;
  name: string;
  price: number;
  retail_price: number;
  min_price: number;
  active_to_bot: boolean;
  is_active: boolean;
  offer_id: string;
  umico_id: string;
  product_url: string;
  mp_price_is_below_min_price: boolean;
}

export interface PaginatedProductsResponse {
  results: Product[];
  count: number;
  next: string | null;
  previous: string | null;
}

export const productsAPI = {
  getAll: async (
    page: number = 1,
    search?: string,
    activeToBotFilter?: boolean,
    isActiveFilter?: boolean,
    mpPriceBelowMinFilter?: boolean,
    pageSize: number = 10,
    ordering?: string
  ): Promise<PaginatedProductsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (search) {
      params.append('search', search);
    }

    if (activeToBotFilter !== undefined) {
      params.append('active_to_bot', activeToBotFilter.toString());
    }

    if (isActiveFilter !== undefined) {
      params.append('is_active', isActiveFilter.toString());
    }

    if (mpPriceBelowMinFilter !== undefined) {
      params.append(
        'mp_price_is_below_min_price',
        mpPriceBelowMinFilter.toString()
      );
    }

    if (ordering) {
      params.append('ordering', ordering);
    }

    const response = await api.get(`/products/?${params.toString()}`);
    return response.data;
  },

  updateMinPrice: async (
    productId: string,
    minPrice: number
  ): Promise<Product> => {
    const response = await api.patch(`/products/${productId}/update/`, {
      min_price: minPrice,
    });
    return response.data;
  },

  toggleActive: async (
    productId: string,
    active: boolean
  ): Promise<Product> => {
    const response = await api.patch(`/products/${productId}/update/`, {
      active_to_bot: active,
    });
    return response.data;
  },

  fetchUmico: async (): Promise<void> => {
    const response = await api.post(`/products/fetch-umico/`);
    if (response.status === 202 || response.status === 200) {
      return;
    }
    throw new Error(`Unexpected status code: ${response.status}`);
  },

  activateAll: async (): Promise<{
    activated_count: number;
    status: string;
  }> => {
    const response = await api.post(`/products/activate-all/`);
    return response.data;
  },

  activateProduct: async (payload: {
    offer_id: string;
    old_price: string;
    retail_price: string;
    qty: string;
  }): Promise<void> => {
    const response = await api.post(`/products/activate/`, payload);
    return response.data;
  },

  deactivateProduct: async (payload: { offer_id: string }): Promise<void> => {
    const response = await api.post(`/products/deactivate/`, payload);
    return response.data;
  },
};
