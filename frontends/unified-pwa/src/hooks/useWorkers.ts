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
    onSuccess: () => {
      toast.success('Worker profile updated successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.workers.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};
