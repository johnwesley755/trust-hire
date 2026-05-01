import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export interface SkillTest {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  durationMinutes: number;
  points: number;
}

interface SkillState {
  availableTests: SkillTest[];
  loading: boolean;
  error: string | null;
}

const initialState: SkillState = {
  availableTests: [],
  loading: false,
  error: null,
};

export const fetchAvailableTests = createAsyncThunk(
  'skill/fetchAvailableTests',
  async (category: string | undefined, { rejectWithValue }) => {
    try {
      const url = category ? `/api/skill-tests/available?category=${category}` : '/api/skill-tests/available';
      const response = await apiClient.get(url);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch available tests');
    }
  }
);

const skillSlice = createSlice({
  name: 'skill',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableTests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAvailableTests.fulfilled, (state, action) => {
        state.loading = false;
        state.availableTests = action.payload;
      })
      .addCase(fetchAvailableTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default skillSlice.reducer;
