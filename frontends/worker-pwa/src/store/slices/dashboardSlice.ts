import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

interface DashboardState {
  stats: any | null;
  activities: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  activities: [],
  loading: false,
  error: null,
};

export const fetchWorkerStats = createAsyncThunk(
  'dashboard/fetchWorkerStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/dashboard/worker-stats');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch worker stats');
    }
  }
);

export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchRecentActivities',
  async (limit: number = 5, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/activities/recent?limit=${limit}`);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch recent activities');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkerStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchWorkerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRecentActivities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
