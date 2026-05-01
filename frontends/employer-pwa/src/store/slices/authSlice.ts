import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import type { LoginInput, RegisterInput } from '../../validations/zodSchema';

interface User {
  id: string;
  email: string;
  role: string;
  onboarded: boolean;
  identityVerified: boolean;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  companyName?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isLoaded: boolean;
  sessionExpired: boolean;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
  isLoaded: false,
  sessionExpired: false,
};

const mapUserFields = (data: any): User => {
  return {
    id: data.userId || data.id,
    email: data.email,
    role: data.role,
    onboarded: data.onboarded,
    identityVerified: data.identityVerified ?? data.identity_verified,
    firstName: data.firstName ?? data.first_name,
    lastName: data.lastName ?? data.last_name,
    profileImageUrl: data.profileImageUrl ?? data.profile_image_url,
    companyName: data.companyName,
  };
};

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      await apiClient.post('/api/auth/send-otp', { email });
      return email;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to send OTP');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      await apiClient.post('/api/auth/forgot-password', { email });
      return email;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to send reset email');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { token: string; password: string }, { rejectWithValue }) => {
    try {
      await apiClient.post('/api/auth/reset-password', data);
      return true;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to reset password');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginInput, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/auth/login', credentials);
      const { token, user } = response.data;
      const mappedUser = mapUserFields(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(mappedUser));
      return { token, user: mappedUser };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterInput & { otp: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/auth/register', userData);
      const { token, user } = response.data;
      const mappedUser = mapUserFields(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(mappedUser));
      return { token, user: mappedUser };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

export const syncUser = createAsyncThunk(
  'auth/sync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/auth/sync', { role: "EMPLOYER" });
      const mappedUser = mapUserFields(response.data);
      localStorage.setItem('user', JSON.stringify(mappedUser));
      return mappedUser;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Sync failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    setLoaded: (state) => {
      state.isLoaded = true;
    },
    setSessionExpired: (state, action: PayloadAction<boolean>) => {
      state.sessionExpired = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(syncUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoaded = true;
      })
      .addCase(syncUser.rejected, (state) => {
        state.isLoaded = true;
      });
  },
});

export const { logout, updateUser, setLoaded } = authSlice.actions;
export const selectIsAuthenticated = (state: { auth: AuthState }) => !!state.auth.token;
export default authSlice.reducer;
