// 이미지 컨테이너와 텍스트 오버레이 부분을 별도로 분리한 컴포넌트

import React from 'react';
import styled from 'styled-components';
import { IoMdArrowDropdown } from "react-icons/io";

const ImageContainerWrapper = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${({ imageUrl }) => imageUrl});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const TextOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-bottom-right-radius: 8px;
  cursor: pointer;
`;

const ImageContainer = ({ imageUrl, onClick }) => (
  <ImageContainerWrapper imageUrl={imageUrl}>
    <TextOverlay onClick={onClick}>
      대만 <IoMdArrowDropdown />
    </TextOverlay>
  </ImageContainerWrapper>
);

export default ImageContainer;