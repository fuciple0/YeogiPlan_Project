import React from 'react';
import styled from 'styled-components';
import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/userSlice';

const TalkModal = ({ isOpen, onClose ,onConfirm }) => {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]); // 선택된 태그 상태


   // Redux 상태에서 로그인 정보 가져오기
   const userInfo = useSelector((state) => state.user.userInfo);
   const token = useSelector((state) => state.user.token);
 

  const handleTagClick = (tag) => {
    setSelectedTags((prev) => 
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };


    const handleConfirm = () => {
    onConfirm(title, content,selectedTags); // 상위 컴포넌트에 제목과 내용을 전달
    setTitle(''); // 입력값 초기화
    setContent('');
    setSelectedTags([]);
    onClose(); // 모달 닫기
  };

 if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
       <TitleContainer>
        <ModalTitle>글 작성하기</ModalTitle>
        <ChipContainer>
        <ChipButton  active={selectedTags.includes("장소")}
              onClick={() => handleTagClick("장소")}>장소</ChipButton>
        <ChipButton  active={selectedTags.includes("질문")}
              onClick={() => handleTagClick("질문")} >질문</ChipButton>
        <ChipButton active={selectedTags.includes("날씨")}
              onClick={() => handleTagClick("날씨")}>날씨</ChipButton>
      </ChipContainer>
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
        {/* Redux에서 가져온 사용자 정보 화면에 표시 */}
        <UserInfoContainer>
          <p>로그인한 사용자 정보:</p>
          <p>유저번호: {userInfo?.userId || "로그인 정보 없음"}</p>
          <p>이메일: {userInfo?.email || "로그인 정보 없음"}</p>
          <p>닉네임: {userInfo?.nickname || "로그인 정보 없음"}</p>
          <p>토큰: {token || "토큰 없음"}</p>
        </UserInfoContainer>



        <Divider/>
        <ModalButtons>
          <Button className="cancel" onClick={onClose}>취소</Button>
          < VerticalLine/>
          <Button className="confirm" onClick={handleConfirm}>작성완료</Button>
        </ModalButtons>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TalkModal;

// 리덕스 테스트용 스타일
const UserInfoContainer = styled.div`
  margin: 20px 0;
  padding: 10px;
  background-color: #f7f7f7;
  border-radius: 8px;
  color: #333;
`;



const Divider = styled.div`
  height: 0.5px;
  background-color: #d3d3d3;
`;

const VerticalLine = styled.div`
  border-left: 1px solid #d3d3d3;
  height: 70px; /* 선의 높이 */
  margin: 0 10px ; /* 주변 요소와의 간격 */
`;


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
  display: flex;
  align-items: center;
  gap: 20px; /* 타이틀과 칩 버튼 사이의 간격 */
  margin-bottom: 10px;
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
    background-color: white;
    color: #333;
    font-weight: bold;
  }

  &.confirm {
    width: 50%;
    background-color: white;
    font-weight: bold;
    color: #507DBC;
  }

  &:hover {
  font-weight: bolder;
  background-color: #e6e9ee;
  }
`;

// Chip 버튼 스타일
const ChipContainer = styled.div`
  display: flex;
  gap: 10px; /* 칩 버튼 간의 간격 */
 
`;

const ChipButton = styled.button`
  display: flex;
  padding: 8px 16px;
  border: 1px solid #d3d3d3;
  align-items: center; /* 아이콘과 텍스트를 수평 정렬 */
  border-radius: 16px;
  background-color: ${({ active }) => (active ? "#507DBC" : "white")};
  color: ${({ active }) => (active ? "white" : "#333")};
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