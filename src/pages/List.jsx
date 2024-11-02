// src/pages/List.jsx
import React from 'react';
import styled from 'styled-components';

const ListContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.primaryColor};
`;

const List = () => {
  return (
    <ListContainer>
      <Title>리스트 페이지</Title>
      <p>여기에 리스트 관련 내용을 추가하세요.</p>
    </ListContainer>
  );
};

export default List;
