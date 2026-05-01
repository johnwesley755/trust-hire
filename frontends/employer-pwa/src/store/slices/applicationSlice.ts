import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

interface Application {
  id: string;
  jobId: string;
  workerId: string;
  status: string;
  createdAt: string;
}

interface ApplicationState {
  applications: Application[];
  loading: boolean;
  error: string | null;
}

const initialState: ApplicationState = {
  applications: [],
  loading: false,
  error: null,
};

export const fetchApplicationsByJobs = createAsyncThunk(
  'applications/fetchByJobs',
  async (jobIds: string[], { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/applications/batch', { jobIds });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch applications');
    }
  }
);

export const fetchApplicationsForEmployerJobs = createAsyncThunk(
  'applications/fetchForEmployerJobs',
  async (jobIds: string[], { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/applications/employer/batch', { jobIds });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch employer applications');
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/api/applications/${id}/status`, { status });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update status');
    }
  }
);

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicationsByJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApplicationsByJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchApplicationsByJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchApplicationsForEmployerJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApplicationsForEmployerJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const index = state.applications.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      });
  },
});

export default applicationSlice.reducer;
