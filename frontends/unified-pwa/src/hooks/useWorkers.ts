import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workerService } from '../services/worker.service';
import { queryKeys } from '../api/queryKeys';
import { toast } from 'sonner';

export const useWorkerProfileQuery = () => {
  return useQuery({
    queryKey: queryKeys.workers.me,
    queryFn: () => workerService.getProfile(),
  });
};

export const useWorkerDetailsQuery = (workerId: string) => {
  return useQuery({
    queryKey: queryKeys.workers.detail(workerId),
    queryFn: () => workerService.getWorkerById(workerId),
    enabled: !!workerId,
  });
};

export const useWorkerSearchQuery = (params?: any) => {
  return useQuery({
    queryKey: queryKeys.workers.search(params),
    queryFn: () => workerService.searchWorkers(params),
  });
};

export const useUpdateWorkerProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => workerService.updateProfile(data),
    onSuccess: (data: any) => {
      toast.success('Worker profile updated successfully');
      if (data) {
        queryClient.setQueryData(queryKeys.workers.me, (old: any) => ({
          ...(old || {}),
          ...data,
          worker: { ...(old?.worker || {}), ...(data.worker || data) },
        }));
        queryClient.setQueryData(queryKeys.auth.me, (old: any) => ({
          ...(old || {}),
          ...data,
        }));
      }
    },
    onError: () => {
      // Handled in form UI or silently without popup toast errors
    },
  });
};
