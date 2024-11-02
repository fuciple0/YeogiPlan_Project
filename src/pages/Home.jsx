// src/pages/Home.jsx
import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.primaryColor};
`;

const Home = () => {
  return (
    <HomeContainer>
      <Title>홈 페이지</Title>
      <p>여기에 홈 페이지 관련 내용을 추가하세요.</p>
    </HomeContainer>
  );
};

export default Home;
