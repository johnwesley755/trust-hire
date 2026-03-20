import apiClient from './apiClient';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  otp?: string;
  role?: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  onboarded: boolean;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  level?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  sendOtp: async (email: string) => {
    return await apiClient.post('/api/auth/send-otp', { email });
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  }
};
