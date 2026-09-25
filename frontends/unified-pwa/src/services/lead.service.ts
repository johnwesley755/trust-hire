import apiClient from '../api/apiClient';

export interface LeadRequirementItem {
  id: string;
  lead_id: string;
  title: string;
  normalized_title: string;
  category?: string | null;
  description?: string | null;
  city?: string | null;
  location?: string | null;
  workers_needed: number;
  salary_range?: string | null;
  source_name: string;
  source_url: string;
  source_hash: string;
  is_verified: boolean;
  discovered_at: string;
  last_seen_at: string;
  status: string;
}

export interface LeadOutreachLogItem {
  id: string;
  lead_id: string;
  admin_id: string;
  channel: string;
  contact_target?: string | null;
  notes: string;
  outcome?: string | null;
  contacted_at: string;
}

export interface EmployerLeadItem {
  id: string;
  company_name: string;
  normalized_name: string;
  company_domain?: string | null;
  company_website?: string | null;
  industry?: string | null;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  official_email?: string | null;
  official_phone?: string | null;
  contact_page_url?: string | null;
  contactability_score: 'COMPLETE' | 'PARTIAL' | 'UNCONTACTABLE';
  status: 'DISCOVERED' | 'REVIEWING' | 'VERIFIED' | 'CONTACTABLE' | 'CONTACTED' | 'RESPONDED' | 'INTERESTED' | 'ONBOARDED' | 'INVALID' | 'DUPLICATE' | 'EXPIRED' | 'NOT_INTERESTED';
  trusthire_employer_id?: string | null;
  created_at: string;
  updated_at: string;
  requirements: LeadRequirementItem[];
  outreach_logs: LeadOutreachLogItem[];
}

export interface LeadStatsResponse {
  totalLeads: number;
  completeLeads: number;
  verifiedLeads: number;
  contactedLeads: number;
  convertedLeads: number;
  totalRequirements: number;
}

export interface GetLeadsParams {
  status?: string;
  contactability?: string;
  city?: string;
  category?: string;
  sortBy?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export const leadService = {
  getLeads: async (params?: GetLeadsParams): Promise<{ total: number; page: number; limit: number; totalPages: number; leads: EmployerLeadItem[] }> => {
    const response = await apiClient.get('/api/admin/leads', { params });
    return {
      total: response.data.total || 0,
      page: response.data.page || 1,
      limit: response.data.limit || 10,
      totalPages: response.data.totalPages || 1,
      leads: response.data.leads || []
    };
  },

  getStats: async (): Promise<LeadStatsResponse> => {
    const response = await apiClient.get('/api/admin/leads/stats');
    return response.data.stats;
  },

  ingestLead: async (data: any): Promise<any> => {
    const response = await apiClient.post('/api/admin/leads/ingest', data);
    return response.data;
  },

  batchIngest: async (leads: any[]): Promise<any> => {
    const response = await apiClient.post('/api/admin/leads/batch-ingest', { leads });
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<any> => {
    const response = await apiClient.patch(`/api/admin/leads/${id}/status`, { status });
    return response.data;
  },

  logOutreach: async (id: string, data: { channel: string; contactTarget?: string; notes: string; outcome?: string }): Promise<any> => {
    const response = await apiClient.post(`/api/admin/leads/${id}/outreach`, data);
    return response.data;
  },

  convertLead: async (id: string): Promise<any> => {
    const response = await apiClient.post(`/api/admin/leads/${id}/convert`);
    return response.data;
  },

  runAutoDiscovery: async (): Promise<{ totalScanned: number; newLeadsCount: number; updatedLeadsCount: number }> => {
    const response = await apiClient.post('/api/admin/leads/run-discovery');
    return response.data;
  },

  crawlUrl: async (url: string): Promise<any> => {
    const response = await apiClient.post('/api/admin/leads/crawl-url', { url });
    return response.data;
  },

  getSources: async (): Promise<any[]> => {
    const response = await apiClient.get('/api/admin/leads/sources');
    return response.data.sources || [];
  }
};
