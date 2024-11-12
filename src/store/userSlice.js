import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: false,
    userInfo: {
      userId: null,
      email: null,
      nickname: null,
      profile_photo: null, // 프로필 이미지 추가
      role: 'guest',
    },
    token: null,
    preferences: {
      theme: 'light',
      language: 'en'
    }
  },
  reducers: {
    // 사용자 정보 설정
    setUser: (state, action) => {
      state.isLoggedIn = true;
      state.userInfo = action.payload.userInfo;
      state.token = action.payload.token;
      state.preferences = action.payload.preferences || state.preferences;
    },
    // 로그아웃 처리
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.userInfo = {
        userId: null,
        email: null,
        nickname: null,
        profile_photo: null,
        role: 'guest'
      };
      state.token = null;
      state.preferences = { theme: 'light', language: 'en' };

      // 로컬 및 세션 스토리지 초기화
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userInfo');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('userInfo');
    },
    loadUser: (state) => {
      const storedToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const storedUserInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');

      if (storedToken && storedUserInfo) {
        state.isLoggedIn = true;
        state.userInfo = JSON.parse(storedUserInfo);
        state.token = storedToken;
      }
    }


  },
});

// 내보내기에서 `loadUser`가 포함되어 있는지 확인
export const { setUser, logoutUser, loadUser } = userSlice.actions;
export default userSlice.reducer;
