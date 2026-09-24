import apiClient from '../api/apiClient';

export interface AdminStats {
  totalWorkers: number;
  totalEmployers: number;
  totalUsers: number;
  totalJobs: number;
  openJobs: number;
  totalApplications: number;
  totalHired: number;
  pendingVerifications: number;
  totalVerifications: number;
  escrowVolume: number;
  recentUsers: any[];
  recentJobs: any[];
}

export interface VerificationItem {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  userPhoto?: string;
  role: string;
  verificationType: string;
  docImageUrl?: string;
  liveImageUrl?: string;
  confidenceScore?: string;
  status: 'PENDING' | 'VERIFIED' | 'APPROVED' | 'REJECTED';
  failureReason?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface AdminUserItem {
  id: string;
  email: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  role: 'WORKER' | 'EMPLOYER' | 'ADMIN';
  email_verified: boolean;
  onboarded: boolean;
  created_at: string;
}

export interface AdminJobItem {
  id: string;
  title: string;
  employer_name?: string;
  employer_id?: string;
  city?: string;
  location?: string;
  budget?: number;
  status: string;
  applicantCount?: number;
  created_at: string;
}

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const res = await apiClient.get<AdminStats>('/api/admin/stats');
    return res.data;
  },

  getVerifications: async (status: string = 'ALL'): Promise<VerificationItem[]> => {
    const res = await apiClient.get<VerificationItem[]>('/api/admin/verifications', {
      params: { status }
    });
    return res.data || [];
  },

  updateVerificationStatus: async (
    id: string, 
    status: 'VERIFIED' | 'REJECTED', 
    failureReason?: string
  ): Promise<any> => {
    const res = await apiClient.patch(`/api/admin/verifications/${id}/status`, {
      status,
      failureReason
    });
    return res.data;
  },

  getUsers: async (params?: { role?: string; q?: string }): Promise<AdminUserItem[]> => {
    const res = await apiClient.get<AdminUserItem[]>('/api/admin/users', { params });
    return res.data || [];
  },

  getJobs: async (params?: { status?: string; q?: string }): Promise<AdminJobItem[]> => {
    const res = await apiClient.get<AdminJobItem[]>('/api/admin/jobs', { params });
    return res.data || [];
  },

  deleteJob: async (id: string): Promise<any> => {
    const res = await apiClient.delete(`/api/admin/jobs/${id}`);
    return res.data;
  },

  createAdmin: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<any> => {
    const res = await apiClient.post('/api/admin/users/create-admin', data);
    return res.data;
  }
};
