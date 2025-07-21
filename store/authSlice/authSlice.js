// features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const loginUser = createAsyncThunk('auth/login', async (loginData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, loginData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const socialLogin = createAsyncThunk('auth/socialLogin', async (socialData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/social-login`, socialData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, isLoading: false, error: null },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoading = false;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(socialLogin.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoading = false;
      })
      .addMatcher((action) => action.type.endsWith('/pending'), (state) => {
        state.isLoading = true;
      })
      .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
