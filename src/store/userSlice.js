// src/store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: false,
    userInfo: {
      userId: null,
      email: null,
      nickname: null,
      role: 'guest',
    },
    token: null,
    preferences: {
      theme: 'light',
      language: 'en'
    }
  },
  reducers: {
    setUser: (state, action) => {
      state.isLoggedIn = true;
      state.userInfo = action.payload.userInfo;
      state.token = action.payload.token;
      state.preferences = action.payload.preferences || state.preferences;
    },
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.userInfo = {
        userId: null,
        email: null,
        nickname: null,
        role: 'guest'
      };
      state.token = null;
      state.preferences = { theme: 'light', language: 'en' };
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;