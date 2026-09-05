import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService, type CreateJobDto } from '../services/job.service';
import { queryKeys } from '../api/queryKeys';
import { toast } from 'sonner';

export const useAllJobsQuery = () => {
  return useQuery({
    queryKey: queryKeys.jobs.all,
    queryFn: () => jobService.getAllJobs(),
  });
};

export const useEmployerJobsQuery = () => {
  return useQuery({
    queryKey: queryKeys.jobs.employer,
    queryFn: () => jobService.getMyJobs(),
  });
};

export const useJobDetailsQuery = (jobId: string) => {
  return useQuery({
    queryKey: queryKeys.jobs.detail(jobId),
    queryFn: () => jobService.getJobById(jobId),
    enabled: !!jobId,
  });
};

export const useJobStatsQuery = () => {
  return useQuery({
    queryKey: queryKeys.jobs.stats,
    queryFn: () => jobService.getJobStats(),
  });
};

export const useCreateJobMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJobDto) => jobService.createJob(data),
    onSuccess: () => {
      toast.success('Job requisition broadcasted successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.employer });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to publish job');
    },
  });
};

export const useUpdateJobMutation = (jobId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreateJobDto>) => jobService.updateJob(jobId, data),
    onSuccess: () => {
      toast.success('Job details updated successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.employer });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update job');
    },
  });
};

export const useDeleteJobMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => jobService.deleteJob(jobId),
    onSuccess: () => {
      toast.success('Job requisition deleted');
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.employer });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete job');
    },
  });
};
