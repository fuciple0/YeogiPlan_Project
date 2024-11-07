// src/store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: false,       // 로그인 상태
    userInfo: {
      userId: null,          // 사용자 ID
      email: null,           // 이메일
      nickname: null,        // 닉네임
      role: 'guest',         // 역할 (예: guest, member, admin 등)
    },
    token: null,             // 인증 토큰
    preferences: {           // 사용자 설정 정보
      theme: 'light',        // 테마 설정 (예: light, dark)
      language: 'en'         // 언어 설정
    }
  },
  reducers: {
    setUser: (state, action) => {
      state.isLoggedIn = true;
      state.userInfo = action.payload.userInfo;
      state.token = action.payload.token;
      state.preferences = action.payload.preferences || state.preferences; // 설정 정보가 있으면 업데이트
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
      state.preferences = { theme: 'light', language: 'en' }; // 초기 상태로 되돌리기
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
