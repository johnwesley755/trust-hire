import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for Auth Token
apiClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  const isOpenEndpoint = config.url && (
    config.url.includes('/api/auth/register') ||
    config.url.includes('/api/auth/login') ||
    config.url.includes('/api/auth/send-otp') ||
    config.url.includes('/api/auth/forgot-password') ||
    config.url.includes('/api/auth/reset-password')
  );

  if (token && !isOpenEndpoint) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for unwrapping ApiResponse and handling common errors
apiClient.interceptors.response.use(
  (response) => {
    // If backend returns the ApiResponse wrapper, unwrap it
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
    const status = error.response ? error.response.status : null;
    
    if (status === 401) {
      // Global event for session expiry
      window.dispatchEvent(new CustomEvent('auth:expired'));
      localStorage.removeItem('token');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
