import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { verificationService } from '../services/verification.service';
import { queryKeys } from '../api/queryKeys';
import { toast } from 'sonner';

export const useVerificationStatusQuery = () => {
  return useQuery({
    queryKey: queryKeys.verification.status,
    queryFn: async () => {
      const res = await verificationService.getStatus();
      return res.data;
    },
  });
};

export const useInitiateVerificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ docImageUrl, liveImageUrl }: { docImageUrl: string; liveImageUrl: string }) =>
      verificationService.initiate(docImageUrl, liveImageUrl),
    onSuccess: (data: any) => {
      toast.success('Identity documents dispatched for algorithmic auditing');
      if (data) {
        queryClient.setQueryData(queryKeys.verification.status, (old: any) => ({
          ...(old || {}),
          ...data,
          status: data.status || 'PENDING',
        }));
        queryClient.setQueryData(queryKeys.auth.me, (old: any) => ({
          ...(old || {}),
          isVerified: false,
          verificationStatus: 'PENDING',
        }));
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Verification initiation failed');
    },
  });
};
