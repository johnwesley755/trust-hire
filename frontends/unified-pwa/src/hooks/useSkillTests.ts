import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skillTestService } from '../services/skill-test.service';
import { queryKeys } from '../api/queryKeys';
import { toast } from 'sonner';

export const useSkillTestsQuery = () => {
  return useQuery({
    queryKey: queryKeys.skillTests.all,
    queryFn: () => skillTestService.getAllTests(),
  });
};

export const useSkillTestDetailQuery = (testId: string) => {
  return useQuery({
    queryKey: queryKeys.skillTests.detail(testId),
    queryFn: () => skillTestService.getTestById(testId),
    enabled: !!testId,
  });
};

export const useSkillTestResultsQuery = (workerId: string) => {
  return useQuery({
    queryKey: queryKeys.skillTests.results(workerId),
    queryFn: () => skillTestService.getResultsByWorker(workerId),
    enabled: !!workerId,
  });
};

export const useSubmitSkillTestMutation = (testId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (answers: Record<string, number>) => skillTestService.submitTest(testId, answers),
    onSuccess: (data) => {
      if (data?.passed) {
        toast.success(`Congratulations! You passed with score ${data.score}%`);
      }
      if (data) {
        queryClient.setQueryData(queryKeys.skillTests.detail(testId), (old: any) => ({
          ...(old || {}),
          completed: true,
          result: data,
        }));
        queryClient.setQueryData(queryKeys.workers.me, (old: any) => {
          if (!old) return old;
          return {
            ...old,
            worker: {
              ...(old.worker || {}),
              skillTestsPassed: data.passed
                ? (old.worker?.skillTestsPassed || 0) + 1
                : old.worker?.skillTestsPassed,
            },
          };
        });
      }
    },
    onError: () => {
      // Handled in test result UI
    },
  });
};
