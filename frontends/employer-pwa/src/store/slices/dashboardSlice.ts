import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardService } from '../../api/dashboardService';
import type { EmployerStats } from '../../api/dashboardService';
import apiClient from '../../api/apiClient';

interface DashboardState {
  stats: EmployerStats | null;
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

export const fetchEmployerStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getEmployerStats();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch stats');
    }
  }
);

export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchActivities',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/api/activities/recent?limit=5');
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch activities');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployerStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchEmployerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.activities = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
