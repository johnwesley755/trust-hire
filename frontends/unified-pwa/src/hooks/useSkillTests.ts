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
      } else {
        toast.error(`Assessment not cleared. Score: ${data?.score || 0}%`);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.skillTests.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.workers.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.levels.progression });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit test');
    },
  });
};
