import { useAuth } from '../providers/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { setupInterceptors } from '../api/apiClient';

const queryClient = new QueryClient();

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const { getToken } = useAuth();
  useEffect(() => { setupInterceptors(getToken); }, [getToken]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
