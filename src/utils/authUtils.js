export const isAuthenticated = () => {
    // 로컬 스토리지 또는 세션 스토리지에서 토큰 확인
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    return !!token; // 토큰이 있으면 true, 없으면 false 반환
  };
  