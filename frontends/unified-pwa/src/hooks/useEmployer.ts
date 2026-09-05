import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employerService } from '../services/employer.service';
import { queryKeys } from '../api/queryKeys';
import { toast } from 'sonner';

export const useEmployerProfileQuery = () => {
  return useQuery({
    queryKey: queryKeys.employers.me,
    queryFn: async () => {
      const res = await employerService.getProfile();
      return res.data;
    },
  });
};

export const useEmployerStatsQuery = () => {
  return useQuery({
    queryKey: queryKeys.employers.stats,
    queryFn: async () => {
      const res = await employerService.getEmployerStats();
      return res.data;
    },
  });
};

export const useUpdateEmployerProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => employerService.updateProfile(data),
    onSuccess: () => {
      toast.success('Employer profile updated successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.employers.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update employer profile');
    },
  });
};
