import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

interface Worker {
  id: string;
  userId: string;
  name: string;
  skills: string;
  level: string;
  trustScore: number;
}

interface SearchState {
  workers: Worker[];
  currentWorker: any | null;
  trustScore: any | null;
  ratings: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  workers: [],
  currentWorker: null,
  trustScore: null,
  ratings: [],
  loading: false,
  error: null,
};

export const searchWorkers = createAsyncThunk(
  'search/workers',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/search/workers', { params });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Search failed');
    }
  }
);

export const fetchWorkerById = createAsyncThunk(
  'search/fetchWorkerById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/worker/${id}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch worker');
    }
  }
);

export const fetchTrustScore = createAsyncThunk(
  'search/fetchTrustScore',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/worker-levels/trust-score/${id}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch trust score');
    }
  }
);

export const fetchWorkerRatings = createAsyncThunk(
  'search/fetchWorkerRatings',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/rating-service/worker/${id}/ratings`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch ratings');
    }
  }
);

export const incrementProfileView = createAsyncThunk(
  'search/incrementProfileView',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.post(`/api/worker/${id}/view`);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to increment view');
    }
  }
);

export const fetchProfilesByUserIds = createAsyncThunk(
  'search/fetchProfilesByUserIds',
  async (userIds: string[], { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/worker/profiles/batch', { userIds });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch profiles');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchWorkers.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchWorkers.fulfilled, (state, action) => {
        state.loading = false;
        state.workers = action.payload;
      })
      .addCase(fetchWorkerById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWorker = action.payload;
      })
      .addCase(fetchTrustScore.fulfilled, (state, action) => {
        state.trustScore = action.payload;
      })
      .addCase(fetchWorkerRatings.fulfilled, (state, action) => {
        state.ratings = action.payload;
      })
      .addCase(fetchProfilesByUserIds.fulfilled, (state, action) => {
        // We could merge or just store separately. Let's merge into workers for simplicity if needed,
        // or just rely on the component using a map.
        state.workers = action.payload;
      });
  },
});

export default searchSlice.reducer;
