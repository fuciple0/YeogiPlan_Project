// ProtectedRoute.js

import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { isAuthenticated } from './authUtils';
import Modal from './NotiModal';

const ProtectedRoute = ({ children }) => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!isAuthenticated()) {
        setShowModal(true);
        // 2초 후 로그인 페이지로 이동
        setTimeout(() => {
          setShowModal(false);
          navigate('/login', { state: { message: '로그인이 필요한 서비스입니다.' } });
        }, 2000);
      }
    }, [navigate]);
  
    if (showModal) {
      return <Modal message="로그인이 필요한 서비스입니다." onClose={() => setShowModal(false)} />;
    }
  
    return isAuthenticated() ? children : null;
  };
  
  export default ProtectedRoute;