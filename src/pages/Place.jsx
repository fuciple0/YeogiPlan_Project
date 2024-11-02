// src/pages/Place.jsx
import React from 'react';
import styled from 'styled-components';

const PlaceContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.primaryColor};
`;

const Place = () => {
  return (
    <PlaceContainer>
      <Title>장소 페이지</Title>
      <p>여기에 장소 관련 내용을 추가하세요.</p>
    </PlaceContainer>
  );
};

export default Place;
