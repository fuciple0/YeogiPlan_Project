// src/pages/Talk.jsx
import React from 'react';
import styled from 'styled-components';

// 이미지 import
import tiwanImage from '../assets/talk_img/tiwan.jpg';
import { FaPenToSquare } from "react-icons/fa6"; // 글작성 칩버튼 안에 아이콘
import { GiTalk } from "react-icons/gi"; // 댓글 표시
import { IoMdArrowDropdown } from "react-icons/io"; // 아래 화살표
import { CgProfile } from "react-icons/cg"; // 프로필


const popularDestinations = [
  { name: '대만', imageUrl: tiwanImage },
  ]

// 사용자 프로필 데이터 예시
const userProfile = {
  nickname: '사용자 닉네임',
  profileImage: 'profileImageURL경로',  // 실제 프로필 이미지 경로를 추가
  location: '대만 타이베이',
  travelDates: '2023-11-01 ~ 2023-11-10'
};


const TalkContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.primaryColor};
`;


// 이미지 컨테이너 스타일
const ImageContainer = styled.div`
  width: 100%;
  height: 200px; /* 이미지 높이 조정 */
  background-image: url(${popularDestinations[0].imageUrl}); /* 첫 번째 이미지 사용 */
  background-size: cover;
  background-position: center;
   position: relative; /* 자식 요소 배치를 위해 relative 설정 */
`;

// 이미지 안에 텍스트
const TextOverlay = styled.div`
  position: absolute;
  top: 0; /* 이미지 안에서 텍스트를 중앙에 배치 */
  left: 0;
  color: white; /* 텍스트 색상 */
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  background-color: rgba(0, 0, 0, 0.5); /* 배경에 반투명 처리를 추가해 가독성 향상 */
  padding: 10px 20px;
  border-bottom-right-radius: 8px;
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


// 사용자 프로필 컨테이너 스타일
const ProfileContainer = styled.div`
display: flex;
align-items: center;
gap: 10px;
margin-top: 20px;
`;

const ProfileImage = styled.div`
width: 50px;
height: 50px;
display: flex;
border-radius: 50%;
justify-content: center;
align-items: center;
object-fit: cover;
border: 1px solid #d3d3d3; /* 프로필 이미지 테두리 */

svg {
    font-size: 32px;
    color: #888;
  }
`;



const Nickname = styled.div`
  font-size: 15px;
  font-weight: bold;
  color: #333;
`;


const TravelInfo = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;

 
// 구분선 스타일
const Divider = styled.div`
width: 100%;
height: 1px;
background-color: #d3d3d3; /* 연한 회색 */
margin: 20px 0; /* 위, 아래 여백 */
`;





const Talk = () => {
  return (
    <>
     {/* 이미지 컨테이너 내부에 텍스트 오버레이를 추가 */}
     <ImageContainer>
      <TextOverlay>
     대만 <IoMdArrowDropdown icon={ IoMdArrowDropdown }/></TextOverlay>
   </ImageContainer>

{/* Chip 버튼을 이미지 아래에 추가 */}
<ChipContainer>
        <ChipButton>
        <FaPenToSquare icon={ FaPenToSquare } /> 글 작성하기</ChipButton>
        <ChipButton>장소</ChipButton>
        <ChipButton>질문</ChipButton>
        <ChipButton>날씨</ChipButton>
      </ChipContainer>

        {/* 사용자 프로필 및 닉네임 표시 영역 */}
        <ProfileContainer>
        <ProfileImage>
        <CgProfile />  
          </ProfileImage>
          <div>
        <Nickname>{userProfile.nickname}</Nickname>
        <TravelInfo>{userProfile.travelDates} {userProfile.location}</TravelInfo> {/* 여행 정보 */}
        
        </div>
      </ProfileContainer>


      <Divider />

{/* <TalkContainer>
      <Title>토크 페이지</Title>
      <p>여기에 토크 관련 내용을 추가하세요.</p>
    </TalkContainer> */}
    </>
  );
};

export default Talk;
