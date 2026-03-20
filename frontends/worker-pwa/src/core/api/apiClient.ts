import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setupInterceptors = (getToken: () => Promise<string | null>) => {
  apiClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    const isOpenEndpoint = config.url && (
      config.url.includes('/api/media/upload') || 
      config.url.includes('/api/auth/register') ||
      config.url.includes('/api/auth/login') ||
      config.url.includes('/api/auth/send-otp') ||
      config.url.includes('/api/auth/forgot-password') ||
      config.url.includes('/api/auth/reset-password')
    );

    if (token && !isOpenEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

export default apiClient;
