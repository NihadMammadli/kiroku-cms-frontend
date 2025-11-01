export interface Branch {
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

export interface PaginatedBranchesResponse {
  results: Branch[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface UpdateMinPricePayload {
  productId: string;
  minPrice: number;
}

export interface ToggleActivePayload {
  productId: string;
  active: boolean;
}

export interface ActivateProductPayload {
  offer_id: string;
  old_price: number;
  retail_price: number;
  qty: number;
}

export interface DeactivateProductPayload {
  offer_id: string;
}

export interface ActivateAllResponse {
  activated_count: number;
  status: string;
}
