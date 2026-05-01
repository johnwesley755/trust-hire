import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export interface WorkerProfile {
  id?: string;
  userId?: string;
  fullName: string;
  bio: string;
  skills: string;
  location: string;
  city?: string;
  address?: string;
  experienceYears: number;
  hourlyRate: number;
  level: string;
  levelNumber?: number;
  trustScore?: number;
  profileViews?: number;
  isAvailable: boolean;
  completedJobs?: number;
  totalJobs?: number;
}

interface ProfileState {
  profile: WorkerProfile | null;
  trustScore: any | null;
  loading: boolean;
  error: string | null;
  levelDetails: any | null;
  levelProgress: any | null;
}

const initialState: ProfileState = {
  profile: null,
  trustScore: null,
  levelDetails: null,
  levelProgress: null,
  loading: false,
  error: null,
};

// ASYNC THUNKS
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/worker/profile');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch profile');
    }
  }
);

export const fetchLevelDetails = createAsyncThunk(
  'profile/fetchLevelDetails',
  async (workerId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/levels/worker/${workerId}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch level details');
    }
  }
);

export const fetchLevelProgress = createAsyncThunk(
  'profile/fetchLevelProgress',
  async (workerId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/levels/progress/${workerId}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch level progress');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (updates: Partial<WorkerProfile>, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/api/worker/profile', updates);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update profile');
    }
  }
);

export const fetchTrustScore = createAsyncThunk(
  'profile/fetchTrustScore',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/worker/trust-score/${userId}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch trust score');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.trustScore = null;
      state.levelDetails = null;
      state.levelProgress = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Level Details
      .addCase(fetchLevelDetails.fulfilled, (state, action) => {
        state.levelDetails = action.payload;
      })
      // Fetch Level Progress
      .addCase(fetchLevelProgress.fulfilled, (state, action) => {
        state.levelProgress = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      // Fetch Trust Score
      .addCase(fetchTrustScore.fulfilled, (state, action) => {
        state.trustScore = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
