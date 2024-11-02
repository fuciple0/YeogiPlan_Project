// src/pages/Talk.jsx
import React from 'react';
import styled from 'styled-components';

const TalkContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.primaryColor};
`;

const Talk = () => {
  return (
    <TalkContainer>
      <Title>토크 페이지</Title>
      <p>여기에 토크 관련 내용을 추가하세요.</p>
    </TalkContainer>
  );
};

export default Talk;
