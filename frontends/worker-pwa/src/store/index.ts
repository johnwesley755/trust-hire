import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// Slices will be imported here
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import profileReducer from './slices/profileSlice';
import notificationReducer from './slices/notificationSlice';
import searchReducer from './slices/searchSlice';
import dashboardReducer from './slices/dashboardSlice';
import verificationReducer from './slices/verificationSlice';
import skillReducer from './slices/skillSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    profile: profileReducer,
    notifications: notificationReducer,
    search: searchReducer,
    dashboard: dashboardReducer,
    verification: verificationReducer,
    skill: skillReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
