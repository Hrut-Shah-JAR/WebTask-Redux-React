import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser } from '../thunks';
import { AuthState } from '../types';

const initialState: AuthState = {
  isAuthenticated: false,
  username: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ username: string; token: string }>) => {
          state.isAuthenticated = true;
          state.username = action.payload.username;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });

  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
