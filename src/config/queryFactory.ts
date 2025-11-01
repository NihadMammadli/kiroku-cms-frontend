import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import type { MessageInstance } from 'antd/es/message/interface';

interface QueryConfig<TData> {
  queryKey: (string | number | boolean | undefined)[];
  queryFn: () => Promise<TData>;
  options?: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'>;
}

interface MutationConfig<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  invalidateKeys?: string[];
  onSuccessMessage?: string | ((data: TData) => string);
  onErrorMessage?: string | ((error: Error) => string);
  onSuccessCallback?: (data: TData) => void;
  options?: Omit<
    UseMutationOptions<TData, Error, TVariables>,
    'mutationFn' | 'onSuccess' | 'onError'
  >;
}

export const createQuery = <TData>({
  queryKey,
  queryFn,
  options,
}: QueryConfig<TData>) => {
  return () =>
    useQuery<TData, Error>({
      queryKey,
      queryFn,
      ...options,
    });
};

export const createMutation = <TData, TVariables>({
  mutationFn,
  invalidateKeys = [],
  onSuccessMessage,
  onErrorMessage,
  onSuccessCallback,
  options,
}: MutationConfig<TData, TVariables>) => {
  return (messageApi: MessageInstance) => {
    const queryClient = useQueryClient();

    return useMutation<TData, Error, TVariables>({
      mutationFn,
      onSuccess: (data) => {
        if (onSuccessMessage) {
          const message =
            typeof onSuccessMessage === 'function'
              ? onSuccessMessage(data)
              : onSuccessMessage;
          messageApi.open({
            type: 'success',
            content: message,
          });
        }

        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });

        if (onSuccessCallback) {
          onSuccessCallback(data);
        }
      },
      onError: (error) => {
        if (onErrorMessage) {
          const message =
            typeof onErrorMessage === 'function'
              ? onErrorMessage(error)
              : onErrorMessage;
          messageApi.open({
            type: 'error',
            content: message,
          });
        }
      },
      ...options,
    });
  };
};
