import apiClient from '../api/apiClient';

export interface EarlyAccessRequestPayload {
    email: string;
    source: string;
}

export const miscService = {
    requestEarlyAccess: async (payload: EarlyAccessRequestPayload) => {
        const response = await apiClient.post('/api/early-access', payload);
        return response.data;
    }
};
