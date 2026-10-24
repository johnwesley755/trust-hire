import apiClient from '../api/apiClient';

export interface OnboardingOption {
  key: string;
  label: string;
  labelTa?: string;
  sortOrder?: number;
}

export interface OnboardingOptionsResponse {
  educationLevels: OnboardingOption[];
  degrees: OnboardingOption[];
  schoolMediums: OnboardingOption[];
  englishProficiencies: OnboardingOption[];
  disabilityTypes: OnboardingOption[];
  disabilityAreas: OnboardingOption[];
  disabilityReasons: OnboardingOption[];
  languages: OnboardingOption[];
  experienceLevels: OnboardingOption[];
  popularJobRoles: OnboardingOption[];
  popularSkills: OnboardingOption[];
}

export interface LocalityItem {
  name: string;
  type: string;
  taluk?: string;
  pincode?: string;
}

export interface PincodeLookupResponse {
  pincode: string;
  state: string;
  district: string;
  taluk: string;
  localities: LocalityItem[];
}

export const metadataService = {
  // Fetch dynamic categorical options
  getOnboardingOptions: async (): Promise<OnboardingOptionsResponse> => {
    const res = await apiClient.get('/api/metadata/options');
    return res.data?.data || res.data;
  },

  // Fetch all States/UTs dynamically
  getStates: async (): Promise<string[]> => {
    const res = await apiClient.get('/api/metadata/locations/states');
    return res.data?.data || res.data || [];
  },

  // Fetch all Districts for a State
  getDistricts: async (state: string): Promise<string[]> => {
    if (!state) return [];
    const res = await apiClient.get('/api/metadata/locations/districts', {
      params: { state }
    });
    return res.data?.data || res.data || [];
  },

  // Fetch Localities (Taluks, Town Panchayats, Municipalities) for a District
  getLocalities: async (district: string, state?: string, q?: string): Promise<LocalityItem[]> => {
    if (!district) return [];
    const res = await apiClient.get('/api/metadata/locations/localities', {
      params: { district, state, q }
    });
    return res.data?.data || res.data || [];
  },

  // Live Pincode auto-discovery
  lookupPincode: async (pincode: string): Promise<PincodeLookupResponse | null> => {
    if (!pincode || pincode.length !== 6) return null;
    const res = await apiClient.get(`/api/metadata/locations/pincode/${pincode}`);
    return res.data?.data || res.data || null;
  },

  // Live place search
  searchPlaces: async (q: string): Promise<any[]> => {
    if (!q || q.length < 2) return [];
    const res = await apiClient.get('/api/metadata/locations/search', {
      params: { q }
    });
    return res.data?.data || res.data || [];
  },

  // Reverse geocoding for GPS coordinate auto-fill
  reverseGeocode: async (lat: number, lng: number): Promise<{
    state: string;
    district: string;
    taluk: string;
    locality: string;
    townPanchayat: string;
    pincode: string;
    localities: LocalityItem[];
    formattedAddress: string;
  } | null> => {
    try {
      const res = await apiClient.get('/api/metadata/locations/reverse-geocode', {
        params: { lat, lng }
      });
      return res.data?.data || res.data || null;
    } catch {
      return null;
    }
  }
};
