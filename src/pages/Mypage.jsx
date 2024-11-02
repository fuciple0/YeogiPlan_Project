// src/pages/Mypage.jsx
import React from 'react';
import styled from 'styled-components';

const MypageContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.primaryColor};
`;

const Mypage = () => {
  return (
    <MypageContainer>
      <Title>마이페이지</Title>
      <p>여기에 마이페이지 관련 내용을 추가하세요.</p>
    </MypageContainer>
  );
};

export default Mypage;
