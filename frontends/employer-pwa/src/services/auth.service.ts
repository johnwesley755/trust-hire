import apiClient from '../api/apiClient';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  otp?: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  onboarded: boolean;
  identityVerified: boolean;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  companyName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export const authService = {
  sendOtp: async (email: string) => {
    return await apiClient.post('/api/auth/send-otp', { email });
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    return await apiClient.post('/api/auth/forgot-password', { email, role: 'EMPLOYER' });
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    return await apiClient.post('/api/auth/reset-password', data);
  }
};
