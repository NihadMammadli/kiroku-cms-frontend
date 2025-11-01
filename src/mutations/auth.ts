import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { MessageInstance } from 'antd/es/message/interface';
import { authAPI } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

export const useLoginMutation = (messageApi: MessageInstance) => {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      setToken(data.token);
      localStorage.setItem('user_id', data.user_id);
      messageApi.open({
        type: 'success',
        content: 'Giriş uğurlu oldu!',
      });
      navigate('/products');
    },
    onError: (error) => {
      messageApi.open({
        type: 'error',
        content:
          'Giriş alınmadı: ' + error?.response?.data?.non_field_errors[0],
      });
    },
  });
};

export const useLogoutMutation = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      // Clear token and localStorage
      setToken(null);
      // Navigate to login page
      navigate('/login');
    },
    onError: (error) => {
      // Even if logout API fails, clear local storage and navigate to login
      console.error('Logout API failed:', error);
      setToken(null);
      navigate('/login');
    },
  });
};
