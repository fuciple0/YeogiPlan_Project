// src/components/ProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  if (!isLoggedIn) {
    alert('로그인이 필요합니다.');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
