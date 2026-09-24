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
    onSuccess: (newApp, variables) => {
      toast.success('Application submitted successfully!');
      queryClient.setQueryData(queryKeys.applications.my, (old: any[] = []) => [
        newApp || { id: `app-${Date.now()}`, jobId: variables.jobId, status: 'PENDING' },
        ...old
      ]);
    },
    onError: () => {
      // Handled in page UI
    },
  });
};

export const useUpdateApplicationStatusMutation = (jobId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: string }) => 
      applicationService.updateApplicationStatus(applicationId, status),
    onSuccess: (_, variables) => {
      toast.success('Applicant status updated');
      if (jobId) {
        queryClient.setQueryData(queryKeys.applications.byJob(jobId), (old: any[] = []) => 
          old.map((a: any) => a.id === variables.applicationId ? { ...a, status: variables.status } : a)
        );
      }
      queryClient.setQueryData(queryKeys.applications.all, (old: any[] = []) => 
        old.map((a: any) => a.id === variables.applicationId ? { ...a, status: variables.status } : a)
      );
    },
    onError: () => {
      // Handled in page UI
    },
  });
};
