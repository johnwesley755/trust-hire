import apiClient from './apiClient';

export interface EmployerStats {
    activeJobs: number;
    totalApplicants: number;
    interviewingCount: number;
    totalHired: number;
    unreadNotifications: number;
}

export const dashboardService = {
    getEmployerStats: async (): Promise<EmployerStats> => {
        const response = await apiClient.get('/api/dashboard/employer/stats');
        return response.data.data;
    }
};
