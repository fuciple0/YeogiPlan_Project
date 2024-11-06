import React from 'react';
import styled from 'styled-components';

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
  height: 200px;
  margin-bottom: 20px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 16px;

  &.cancel {
    background-color: #f0f0f0;
    color: #333;
  }

  &.confirm {
    background-color: #007bff;
    color: white;
  }
`;

const TalkModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>글 작성하기</ModalTitle>
        <p>제목</p>
        <Input type="text" placeholder="제목을 입력하세요" />
        <TextArea placeholder="100자 이내로 입력하세요" />
        <ModalButtons>
          <Button className="cancel" onClick={onClose}>취소</Button>
          <Button className="confirm" onClick={onClose}>확인</Button>
        </ModalButtons>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TalkModal;
