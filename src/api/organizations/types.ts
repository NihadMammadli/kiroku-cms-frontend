export interface Organization {
  id: number;
  name: string;
  code: string;
  description: string | null;
  email: string | null;
  phone_number: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  logo: string | null;
  is_active: boolean;
  branch_count: string;
  total_students: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationCreate {
  name: string;
  code: string;
  description?: string | null;
  email?: string | null;
  phone_number?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  logo?: string | null;
  is_active?: boolean;
}

export interface OrganizationUpdate {
  name?: string;
  code?: string;
  description?: string | null;
  email?: string | null;
  phone_number?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  logo?: string | null;
  is_active?: boolean;
}

export interface OrganizationListParams {
  city?: string;
  country?: string;
  is_active?: boolean;
  search?: string;
  state?: string;
}
