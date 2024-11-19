// src/components/ChipButtons.jsx
import React from 'react';
import styled from 'styled-components';
import { FaPenToSquare } from "react-icons/fa6";



const ChipButtons = ({ onOpenModal,onSelectTag  }) => (
  <ChipContainer>
    < WriteChipButton onClick={onOpenModal}>
      <FaPenToSquare /> 글 작성하기
    </ WriteChipButton>
    <ChipButton onClick={() => onSelectTag(null)}>전체</ChipButton>
    <ChipButton onClick={() => onSelectTag('장소')}>장소</ChipButton>
      <ChipButton onClick={() => onSelectTag('질문')}>질문</ChipButton>
      <ChipButton onClick={() => onSelectTag('날씨')}>날씨</ChipButton>
  </ChipContainer>
);

export default ChipButtons;



const ChipContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 3px 0;
`;

const ChipButton = styled.button`
  display: flex;
  padding: 8px 16px;
  border: 1px solid #d3d3d3;
  align-items: center;
  border-radius: 16px;
  background-color: white;
  color: #333;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #507DBC;
    color: white;
    font-weight: bold;
  }

  svg {
    margin-right: 8px;
    font-size: 16px;
  }
`;

const WriteChipButton = styled.button`
  display: flex;
  padding: 8px 16px;
  border: 1px solid #d3d3d3;
  align-items: center;
  border-radius: 16px;
  background-color: #507DBC;
  color: white;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #507DBC;
    color: white;
    font-weight: bold;
  }

  svg {
    margin-right: 8px;
    font-size: 16px;
  }
`;