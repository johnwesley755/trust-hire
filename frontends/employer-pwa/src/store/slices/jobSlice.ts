import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import type { PostJobInput } from '../../validations/zodSchema';

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

interface Application {
  id: string;
  jobId: string;
  workerId: string;
  status: string;
}

interface JobState {
  myJobs: Job[];
  currentApplicants: Application[];
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  myJobs: [],
  currentApplicants: [],
  loading: false,
  error: null,
};

export const postJob = createAsyncThunk(
  'jobs/post',
  async (jobData: PostJobInput, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/jobs', jobData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to post job');
    }
  }
);

export const fetchMyJobs = createAsyncThunk(
  'jobs/fetchMyJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/jobs/employer/my');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch jobs');
    }
  }
);

export const fetchApplicants = createAsyncThunk(
  'jobs/fetchApplicants',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/jobs/${jobId}/applications`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch applicants');
    }
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.myJobs = action.payload;
      })
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.currentApplicants = action.payload;
      });
  },
});

export default jobSlice.reducer;
