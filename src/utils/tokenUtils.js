// src/utils/tokenUtils.js
export const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // JWT의 payload 부분을 디코딩
      const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Invalid token format:', error);
      return true; // 형식 오류 시 만료된 것으로 간주
    }
  };
  