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
    onSuccess: (newJob: any) => {
      toast.success('Job requisition broadcasted successfully');
      if (newJob) {
        queryClient.setQueryData(queryKeys.jobs.all, (old: any[] = []) => [newJob, ...old]);
        queryClient.setQueryData(queryKeys.jobs.employer, (old: any[] = []) => [newJob, ...old]);
      }
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
    onSuccess: (updatedJob: any, variables) => {
      toast.success('Job details updated successfully');
      queryClient.setQueryData(queryKeys.jobs.detail(jobId), (old: any) => ({ ...old, ...variables, ...updatedJob }));
      queryClient.setQueryData(queryKeys.jobs.employer, (old: any[] = []) => 
        old.map((j: any) => j.id === jobId ? { ...j, ...variables, ...updatedJob } : j)
      );
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
    onSuccess: (_, deletedId) => {
      toast.success('Job requisition deleted');
      queryClient.setQueryData(queryKeys.jobs.employer, (old: any[] = []) => 
        old.filter((j: any) => j.id !== deletedId)
      );
      queryClient.setQueryData(queryKeys.jobs.all, (old: any[] = []) => 
        old.filter((j: any) => j.id !== deletedId)
      );
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete job');
    },
  });
};
