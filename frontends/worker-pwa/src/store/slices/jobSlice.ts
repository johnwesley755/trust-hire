import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  city: string;
  salary: string;
  employerId: string;
}

interface JobApplication {
  id: string;
  jobId: string;
  workerId: string;
  status: string;
  coverLetter: string;
  createdAt: string;
}

interface JobState {
  jobs: Job[];
  appliedJobs: JobApplication[];
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  appliedJobs: [],
  loading: false,
  error: null,
};

// ASYNC THUNKS
export const searchJobs = createAsyncThunk(
  'jobs/search',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/search/jobs', { params });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to search jobs');
    }
  }
);

export const applyToJob = createAsyncThunk(
  'jobs/apply',
  async (application: { jobId: string; coverLetter: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/jobs/applications', application);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to apply');
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  'jobs/fetchApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/jobs/applications/my');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch applications');
    }
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.appliedJobs = action.payload;
      });
  },
});

export default jobSlice.reducer;
