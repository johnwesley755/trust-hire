import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

interface VerificationState {
  status: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: VerificationState = {
  status: null,
  loading: false,
  error: null,
};

export const fetchVerificationStatus = createAsyncThunk(
  'verification/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/verification/status');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch verification status');
    }
  }
);

export const uploadAadhaar = createAsyncThunk(
  'verification/uploadAadhaar',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post('/api/verification/upload-aadhaar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to upload Aadhaar');
    }
  }
);

export const uploadLiveCapture = createAsyncThunk(
  'verification/uploadLiveCapture',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post('/api/verification/upload-live', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to upload live capture');
    }
  }
);

const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVerificationStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVerificationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload;
      })
      .addCase(fetchVerificationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadAadhaar.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadAadhaar.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadAadhaar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadLiveCapture.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadLiveCapture.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadLiveCapture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default verificationSlice.reducer;
