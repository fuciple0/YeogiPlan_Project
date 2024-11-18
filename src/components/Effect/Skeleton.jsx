// src/components/Skeleton.jsx
import React from 'react';
import styled from 'styled-components';

const Skeleton = ({ width, height }) => {
  return <SkeletonWrapper style={{ width, height, margin: '2px' }} />;
};

export default Skeleton;

const SkeletonWrapper = styled.div`
  background: #e0e0e0;
  border-radius: 4px;
  animation: skeleton-loading 1.5s infinite ease-in-out;

  @keyframes skeleton-loading {
    0% {
      background-color: #e0e0e0;
    }
    50% {
      background-color: #c0c0c0;
    }
    100% {
      background-color: #e0e0e0;
    }
  }
`;
