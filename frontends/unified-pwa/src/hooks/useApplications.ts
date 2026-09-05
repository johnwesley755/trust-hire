import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '../services/application.service';
import { queryKeys } from '../api/queryKeys';
import { toast } from 'sonner';

export const useMyApplicationsQuery = () => {
  return useQuery({
    queryKey: queryKeys.applications.my,
    queryFn: () => applicationService.getMyApplications(),
  });
};

export const useJobApplicationsQuery = (jobId: string) => {
  return useQuery({
    queryKey: queryKeys.applications.byJob(jobId),
    queryFn: () => applicationService.getJobApplications(jobId),
    enabled: !!jobId,
  });
};

export const useApplyForJobMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, coverLetter }: { jobId: string; coverLetter?: string }) => 
      applicationService.applyForJob(jobId, coverLetter),
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit application');
    },
  });
};

export const useUpdateApplicationStatusMutation = (jobId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: string }) => 
      applicationService.updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      toast.success('Applicant status updated');
      if (jobId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.applications.byJob(jobId) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update status');
    },
  });
};
