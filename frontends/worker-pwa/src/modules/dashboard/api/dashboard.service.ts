import apiClient from "../../../core/api/apiClient";

export interface WorkerStats {
    appliedJobs: number;
    unreadNotifications: number;
    level: string;
    trustScore: number;
}

export const dashboardService = {
    getWorkerStats: async (): Promise<WorkerStats> => {
        const response = await apiClient.get('/api/dashboard/worker/stats');
        return response.data.data;
    }
};
