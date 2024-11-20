import React from 'react';
import styled from 'styled-components';

const DeleteTripModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null; // 모달이 열려있지 않으면 렌더링하지 않음

  return (
    <ModalBackdrop>
      <ModalContainer>
        <ModalHeader>
          <h2>여행 일정 삭제하기</h2>
        </ModalHeader>
        <ModalBody>
          <p>정말로 이 여행 일정을 삭제하시겠습니까?</p>
        </ModalBody>
        <ModalFooter>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <ConfirmButton onClick={onConfirm}>삭제</ConfirmButton>
        </ModalFooter>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default DeleteTripModal;

// 스타일 컴포넌트들
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBody = styled.div`
  margin: 16px 0;
  text-align: center;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;

  button {
    margin: 10px 20px;
    padding: 10px 10px;
    transition: transform 0.2s;  // 부드러운 크기 변화
    cursor: pointer;
  }
`;

const CancelButton = styled.button`
  background-color: #ddd;
  border: none;
  width: 20%;
  border-radius: 5px;

  &:hover {
    transform: scale(1.05);  // 크기 살짝 확대
  }

  &:active {
    transform: scale(0.98);  /* 클릭 효과로 버튼 크기 살짝 줄어들기 */
  }
`;

const ConfirmButton = styled.button`
  background-color: #507dbc;
  color: white;
  border: none;
  border-radius: 5px;
  width: 20%;

  &:hover {
    transform: scale(1.05);  // 크기 살짝 확대
  }

  &:active {
    transform: scale(0.98);  /* 클릭 효과로 버튼 크기 살짝 줄어들기 */
  }
`;