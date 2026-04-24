import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080'
});

export const setupInterceptors = (getToken: () => Promise<string | null>) => {
  apiClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    const isOpenEndpoint = config.url && (
      config.url.includes('/api/auth/register') ||
      config.url.includes('/api/auth/login') ||
      config.url.includes('/api/auth/send-otp') ||
      config.url.includes('/api/auth/forgot-password') ||
      config.url.includes('/api/auth/reset-password')
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

// Response interceptor to unwrap ApiResponse
apiClient.interceptors.response.use(
  (response) => {
    // If it's a success response and has the ApiResponse structure
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
    return Promise.reject(error);
  }
);

export default apiClient;
