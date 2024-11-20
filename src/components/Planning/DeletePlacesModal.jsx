import React from 'react';
import styled from 'styled-components';

const DeletePlacesModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <ModalBackground>
      <ModalContainer>
        <h2>이 장소를 삭제하시겠습니까?</h2>
        <ButtonContainer>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <ConfirmButton onClick={onConfirm}>삭제</ConfirmButton>
        </ButtonContainer>
      </ModalContainer>
    </ModalBackground>
  );
};

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 36px;
  }

  button {
    margin: 0 10px;
    padding: 10px 10px;
    cursor: pointer;
    border-radius: 5px;
    border: none;
    transition: transform 0.2s;  // 부드러운 크기 변화
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  background-color: #ccc;
  width: 20%;

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
  width: 20%;

  &:hover {
    transform: scale(1.05);  // 크기 살짝 확대
  }

  &:active {
    transform: scale(0.98);  /* 클릭 효과로 버튼 크기 살짝 줄어들기 */
  }
`;

export default DeletePlacesModal;
