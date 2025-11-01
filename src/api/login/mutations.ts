import { api } from '../../config';
import { createMutation } from '../../config/queryFactory';
import type { LoginRequest, LoginResponse } from './types';

const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post('/auth/login/', credentials);
  return response.data;
};

export const useLoginMutation = createMutation<LoginResponse, LoginRequest>({
  mutationFn: login,
  onSuccessMessage: 'Giriş uğurlu oldu!',
  onErrorMessage: (
    error: Error & { response?: { data?: { detail?: string } } }
  ) => error.response?.data?.detail || 'Giriş zamanı xəta baş verdi',
  onSuccessCallback: (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user_id', data.user_id.toString());
    window.location.href = '/dashboard';
  },
});
