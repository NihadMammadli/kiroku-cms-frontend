import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersAPI } from '../api/orders';
import type { MessageInstance } from 'antd/es/message/interface';

export const useFetchUmicoOrdersMutation = (messageApi: MessageInstance) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersAPI.fetchUmico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      messageApi.success('Sifarişlər yenilənir...');
    },
    onError: (error: Error) => {
      messageApi.error(`Xəta: ${error.message}`);
    },
  });
};

