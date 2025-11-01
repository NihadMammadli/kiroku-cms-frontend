import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MessageInstance } from 'antd/es/message/interface';
import { productsAPI } from '../api/products';

export const useUpdateMinPriceMutation = (messageApi: MessageInstance) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      minPrice,
    }: {
      productId: string;
      minPrice: number;
    }) => productsAPI.updateMinPrice(productId, minPrice),
    onSuccess: () => {
      messageApi.open({
        type: 'success',
        content: 'Məhsulun minimum qiyməti uğurla yeniləndi!',
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      messageApi.open({
        type: 'error',
        content: `Məhsulu yeniləmək alınmadı: ${(error as Error).message}`,
      });
    },
  });
};

export const useToggleActiveMutation = (messageApi: MessageInstance) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      active,
    }: {
      productId: string;
      active: boolean;
    }) => productsAPI.toggleActive(productId, active),
    onSuccess: (data) => {
      messageApi.open({
        type: 'success',
        content: `Məhsul uğurla ${data.active_to_bot ? 'aktiv edildi' : 'deaktiv edildi'}!`,
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      messageApi.open({
        type: 'error',
        content: `Məhsulun statusunu dəyişmək alınmadı: ${(error as Error).response?.data[0]}`,
      });
    },
  });
};

export const useFetchUmicoMutation = (messageApi: MessageInstance) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => productsAPI.fetchUmico(),
    onSuccess: () => {
      messageApi.open({
        type: 'success',
        content:
          'Umico məhsulları uğurla yeniləndi! Məhsullar təqribi 10 dəqiqəyədək yenilənəcək.',
        duration: 10,
      });

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        messageApi.open({
          type: 'info',
          content: 'Məhsullar siyahısı yeniləndi!',
        });
      }, 2000);
    },
    onError: (error) => {
      messageApi.open({
        type: 'error',
        content: `Umico məhsullarını yeniləmək alınmadı: ${(error as Error).message}`,
      });
    },
  });
};

export const useActivateAllMutation = (messageApi: MessageInstance) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => productsAPI.activateAll(),
    onSuccess: (data) => {
      messageApi.open({
        type: 'success',
        content: `${data.activated_count} məhsul uğurla bot üçün aktiv edildi!`,
        duration: 6,
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      messageApi.open({
        type: 'error',
        content: `Məhsulları aktiv etmək alınmadı: ${(error as Error).message}`,
      });
    },
  });
};

export const useActivateProductMutation = (messageApi: MessageInstance) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      offer_id: string;
      old_price: number;
      retail_price: number;
      qty: number;
    }) => productsAPI.activateProduct(payload),
    onSuccess: (data) => {
      messageApi.open({
        type: 'success',
        content: `Məhsul uğurla aktiv edildi!`,
        duration: 6,
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      messageApi.open({
        type: 'error',
        content: `Məhsulu aktiv etmək alınmadı: ${(error as Error).message}`,
      });
    },
  });
};

export const useDeactivateProductMutation = (messageApi: MessageInstance) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { offer_id: string }) =>
      productsAPI.deactivateProduct(payload),
    onSuccess: () => {
      messageApi.open({
        type: 'success',
        content: `Məhsul uğurla deaktiv edildi!`,
        duration: 6,
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      messageApi.open({
        type: 'error',
        content: `Məhsulu deaktiv etmək alınmadı: ${(error as Error).message}`,
      });
    },
  });
};
