// src/utils/fetchWithAuth.js
import { isTokenExpired } from './tokenUtils';
import { store } from '../store/store';
import { logoutUser } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';

// fetch 요청을 위한 함수
export const fetchWithAuth = async (url, options = {}) => {
  const { accessToken } = store.getState().user;
  const navigate = useNavigate();

  // 토큰 만료 확인
  if (isTokenExpired(accessToken)) {
    store.dispatch(logoutUser());  // 상태 초기화
    navigate('/login');            // 로그인 페이지로 리다이렉트
    throw new Error('토큰이 만료되었습니다. 다시 로그인해주세요.');
  }

  // Authorization 헤더에 토큰 추가
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  const updatedOptions = {
    ...options,
    headers,
  };

  // fetch 요청 보내기
  const response = await fetch(url, updatedOptions);

  // 401 오류 시 로그아웃 처리 및 리다이렉트
  if (response.status === 401) {
    store.dispatch(logoutUser());
    navigate('/login');
    throw new Error('인증 오류가 발생했습니다. 다시 로그인해주세요.');
  }

  return response;
};


// default로 내보내기
export default fetchWithAuth;