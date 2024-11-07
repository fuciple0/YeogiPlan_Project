// src/components/ChipButtons.jsx
import React from 'react';
import styled from 'styled-components';
import { FaPenToSquare } from "react-icons/fa6";



const ChipButtons = ({ onOpenModal }) => (
  <ChipContainer>
    <ChipButton onClick={onOpenModal}>
      <FaPenToSquare /> 글 작성하기
    </ChipButton>
    <ChipButton>장소</ChipButton>
    <ChipButton>질문</ChipButton>
    <ChipButton>날씨</ChipButton>
  </ChipContainer>
);

export default ChipButtons;



const ChipContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px 0;
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
