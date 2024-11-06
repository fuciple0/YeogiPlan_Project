import React from 'react';
import styled from 'styled-components';
import { useState } from 'react';



const TalkModal = ({ isOpen, onClose ,onConfirm }) => {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');


    const handleConfirm = () => {
    onConfirm(title, content); // 상위 컴포넌트에 제목과 내용을 전달
    setTitle(''); // 입력값 초기화
    setContent('');
    onClose(); // 모달 닫기
  };

 if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
       <TitleContainer>
        <ModalTitle>글 작성하기</ModalTitle>
        {/* Chip 버튼을 이미지 아래에 추가 */}
        {/* <ChipContainer>
        <ChipButton>장소</ChipButton>
        <ChipButton>질문</ChipButton>
        <ChipButton>날씨</ChipButton>
      </ChipContainer> */}
      </TitleContainer>
      
        <Input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextArea
          placeholder="내용을 입력하세요(100자 이내)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <ModalButtons>
          <Button className="cancel" onClick={onClose}>취소</Button>
          <Button className="confirm" onClick={handleConfirm}>확인</Button>
        </ModalButtons>
      </ModalContent>
    </ModalOverlay>
  );
};


// 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 600px;
  height: 500px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
`;
const TitleContainer = styled.div`
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  height: 250px;
  margin-bottom: 20px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  margin-top: 8px;
  height: 55px; /* 버튼 높이 설정 */
  font-size: 16px;

  &.cancel {
    width: 50%;
    background-color: #f0f0f0;
    color: #333;
  }

  &.confirm {
    width: 50%;
    background-color: #507DBC;
    color: white;
  }

  &:hover {
  font-weight: bold;
  }
`;

// Chip 버튼 스타일
const ChipContainer = styled.div`
  display: flex;
  gap: 10px; /* 칩 버튼 간의 간격 */
  padding: 10px 0;
`;

const ChipButton = styled.button`
  display: flex;
  padding: 8px 16px;
  border: 1px solid #d3d3d3;
  align-items: center; /* 아이콘과 텍스트를 수평 정렬 */
  border-radius: 16px;
  background-color: white;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #507DBC;
    color: white;
    font-weight: bold;
  }

  &:active {
    background-color: #507DBC; /* 클릭 시 파란색 */
    color: white; /* 클릭 시 글씨 색상 변경 */
    font-weight: bold;
  }

    /* 아이콘 스타일 */
  svg {
    margin-right: 8px; /* 텍스트와 아이콘 사이 간격 */
    font-size: 16px;
  }
  `;




export default TalkModal;
