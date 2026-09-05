import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setupInterceptors = (getToken: () => Promise<string | null>) => {
  apiClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    const isOpenEndpoint = config.url && (
      config.url.includes('/api/auth/register') ||
      config.url.includes('/api/auth/login') ||
      config.url.includes('/api/auth/oauth-sync') ||
      config.url.includes('/api/auth/send-otp') ||
      config.url.includes('/api/auth/forgot-password') ||
      config.url.includes('/api/auth/reset-password') ||
      config.url.includes('/api/early-access')
    );

    if (token && !isOpenEndpoint) {
      if (config.headers.set) {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  });
};

apiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
      if (response.data.success) {
        return { ...response, data: response.data.data };
      } else {
        return Promise.reject(new Error(response.data.message || 'API Error'));
      }
    }
    return response;
  },
  (error) => {
    const isAuthEndpoint = error.config?.url && (
      error.config.url.includes('/api/auth/login') ||
      error.config.url.includes('/api/auth/register') ||
      error.config.url.includes('/api/auth/oauth-sync')
    );

    if (!isAuthEndpoint && (error.response?.status === 401 || error.response?.status === 403)) {
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
