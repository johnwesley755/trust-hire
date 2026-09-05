import apiClient from '../api/apiClient';

export const miscService = {
  submitEarlyAccess: async (emailOrPayload: string | { email: string; source?: string }, source: string = 'LANDING_PAGE') => {
    const payload = typeof emailOrPayload === 'string'
      ? { email: emailOrPayload, source }
      : { email: emailOrPayload.email, source: emailOrPayload.source || 'LANDING_PAGE' };
    const res = await apiClient.post('/api/early-access', payload);
    return res.data;
  },
  requestEarlyAccess: async (emailOrPayload: string | { email: string; source?: string }, source: string = 'LANDING_PAGE') => {
    const payload = typeof emailOrPayload === 'string'
      ? { email: emailOrPayload, source }
      : { email: emailOrPayload.email, source: emailOrPayload.source || 'LANDING_PAGE' };
    const res = await apiClient.post('/api/early-access', payload);
    return res.data;
  },
  submitSupportTicket: async (data: { subject: string; message: string; priority?: string }) => {
    const res = await apiClient.post('/api/support/ticket', data);
    return res.data;
  },
};
