import apiClient from '../api/apiClient';
import type { User } from '../types';

export interface RegisterPayload {
  email: string;
  password?: string;
  role: 'WORKER' | 'EMPLOYER' | 'ADMIN';
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  otp?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
  role?: 'WORKER' | 'EMPLOYER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  register: async (data: RegisterPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return res.data;
  },
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/api/auth/login', data);
    return res.data;
  },
  sendOtp: async (email: string, role?: string): Promise<any> => {
    const res = await apiClient.post('/api/auth/send-otp', { email, role });
    return res.data;
  },
  forgotPassword: async (email: string, role?: string): Promise<any> => {
    const res = await apiClient.post('/api/auth/forgot-password', { email, role });
    return res.data;
  },
  resetPassword: async (payload: { token: string; newPassword?: string; password?: string }): Promise<any> => {
    const res = await apiClient.post('/api/auth/reset-password', payload);
    return res.data;
  },
  getCurrentUser: async (): Promise<User> => {
    const res = await apiClient.get<User>('/api/auth/me');
    return res.data;
  },
  syncUser: async (data: any): Promise<User> => {
    const res = await apiClient.post<User>('/api/auth/sync', data);
    return res.data;
  },
};

