
import React from 'react';
import styled from 'styled-components';
import logoFly from '../../assets/talk_img/logo_fly.png';



const TalkLocationModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalWrapper>
        <LogoContainer>
        <ModalTitle>여행 지역 선택</ModalTitle>
        <LogoImage src={logoFly} alt="Logo" />
        </LogoContainer>
        </ModalWrapper>
         <Divider/>
        <ButtonContainer>
        <OptionButton onClick={() => onSelect("해외")}>해외</OptionButton>
        <OptionButton onClick={() => onSelect("국내")}>국내</OptionButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TalkLocationModal;


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
  width: 400px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 그림자 효과 */
  position: relative;
  z-index: 1000;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  color: #333;
  margin: 0; 
  text-align: center;
  
`;
const LogoContainer = styled.div`
  display: flex;
  align-items: center; /* 수직 가운데 정렬 */
  justify-content: center;
  margin-bottom: 8px;
  
`;
const LogoImage = styled.img`
  width: 32px; /* 로고 이미지 크기 */
  height: 32px;
  margin-right: 8px; /* 제목과 로고 사이의 간격 */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top : 50px;
  margin-bottom : 50px;
  flex-wrap: wrap; /* 버튼을 여러 줄로 배치 */
  gap: 10px; /* 버튼 간격 */
`;

const OptionButton = styled.button`
  width: 100px; /* 너비와 높이를 같게 설정 */
  height: 100px; /* 정사각형 버튼 */
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #BBD1EA;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  &:hover {
    background-color: #507DBC;
    color: white;
  }
`;
// 구분선 스타일
const Divider = styled.div`
height: 1px;
background-color: #d3d3d3;
`;

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%; /* 필요한 경우 높이를 100%로 설정 */
`;
