// src/pages/Planning.jsx
import React from 'react';
import styled from 'styled-components';

const PlanningContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.primaryColor};
`;

const Planning = () => {
  return (
    <PlanningContainer>
      <Title>플래닝 페이지</Title>
      <p>여기에 플래닝 관련 내용을 추가하세요.</p>
    </PlanningContainer>
  );
};

export default Planning;
