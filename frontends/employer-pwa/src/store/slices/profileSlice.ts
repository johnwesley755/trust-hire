import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { profileService } from '../../api/profileService';
import type { EmployerProfile } from '../../api/profileService';

interface ProfileState {
  profile: EmployerProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await profileService.getProfile();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch profile');
    }
  }
);

export const updateEmployerProfile = createAsyncThunk(
  'profile/updateProfile',
  async (updates: Partial<EmployerProfile>, { rejectWithValue }) => {
    try {
      return await profileService.updateProfile(updates);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update profile');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<EmployerProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateEmployerProfile.fulfilled, (state, action: PayloadAction<EmployerProfile>) => {
        state.profile = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
