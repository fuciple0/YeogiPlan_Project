// DeleteConfirmationModal.jsx
import React from 'react';
import styled from 'styled-components';

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalText>게시글을 삭제하시겠습니까?</ModalText>
        <ModalButtonContainer>
          <ModalButton onClick={onConfirm}>삭제</ModalButton>
          <ModalButton onClick={onCancel}>취소</ModalButton>
        </ModalButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

// 스타일 컴포넌트 정의
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
  background-color: white;
  padding: 20px;
  width: 20%; /* 모달 너비 확장 */
  height: 10%; /* 모달 높이를 콘텐츠에 따라 자동 조정 */
  border-radius: 8px;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column; /* 콘텐츠를 수직 정렬 */
  justify-content: center; /* 중앙 정렬 */
  align-items: center; /* 중앙 정렬 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 그림자 추가 */

  animation: slideUp 0.4s ease-out; /* 애니메이션 추가 */
  
  /* 애니메이션 */
  @keyframes slideUp {
    from {
      transform: translateY(100%); /* 화면 아래에서 시작 */
      opacity: 0;
    }
    to {
      transform: translateY(0); /* 원래 위치로 */
      opacity: 1;
    }
  }
`;


const ModalText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 40px; /* 버튼과 간격 조정 */
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: space-between; /* 버튼 간격 확보 */
  gap: 10px; /* 버튼 간격 */
  width: 100%; /* 버튼 컨테이너 너비 전체 */
  padding: 0 10px; /* 좌우 여백 추가 */
`;

const ModalButton = styled.button`
  padding: 12px 0; /* 높이만 설정 */
  width: 48%; /* 버튼 각각의 너비를 48%로 설정 (컨테이너 비율에 맞게) */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  background-color: #507DBC;
  color: white;
  text-align: center;

  &:first-of-type {
    background-color: #b5aeaf;
  }

  &:hover {
    opacity: 0.9;
  }
`;
export default DeleteConfirmationModal;
