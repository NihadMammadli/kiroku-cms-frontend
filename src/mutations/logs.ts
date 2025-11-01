import { useQuery, useMutation } from '@tanstack/react-query';
import { logsAPI } from '../api/logs';

export const useLogsQuery = (
  page: number = 1,
  search?: string,
  pageSize: number = 50
) => {
  return useQuery({
    queryKey: ['logs', page, search, pageSize],
    queryFn: () => logsAPI.getAll(page, search, pageSize),
  });
};

export const useExportLogsMutation = () => {
  return useMutation({
    mutationFn: logsAPI.exportToExcel,
  });
};
