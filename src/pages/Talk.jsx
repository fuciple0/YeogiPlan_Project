// src/pages/Talk.jsx
import React from 'react';
import styled from 'styled-components';
import { useState } from 'react';

// 이미지 import
import tiwanImage from '../assets/talk_img/tiwan.jpg';
import { FaPenToSquare } from "react-icons/fa6"; // 글작성 칩버튼 안에 아이콘
import { FaCommentDots } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io"; // 아래 화살표
import { CgProfile } from "react-icons/cg"; // 프로필
import TalkModal from '../components/TalkModal'; // 글쓰기 Modal 컴포넌트 임포트
import TalkLocationModal from '../components/TalkLocationModal';  // 나라 선택 모달 임포트


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


const Talk = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]); // 게시글 상태
  const [showCommentInput, setShowCommentInput] = useState(false); // 댓글 입력 필드 표시 상태
  const [commentText, setCommentText] = useState(""); // 댓글 텍스트 상태
  const [activePostIndex, setActivePostIndex] = useState(null); // 현재 댓글 입력 중인 게시글의 인덱스


  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false); // LocationModal 상태
  const [selectedLocation, setSelectedLocation] = useState(""); // 선택한 지역 저장

  const openModal = () => setIsModalOpen(true);  // 글쓰기모달 열기
  const closeModal = () => setIsModalOpen(false); // 글쓰기모달 닫기

  const openLocationModal = () => setIsLocationModalOpen(true); // LocationModal 열기
  const closeLocationModal = () => setIsLocationModalOpen(false); // LocationModal 닫기


  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    closeLocationModal(); // 나라 선택 후 모달 닫기
  };


const addPost = (title, content) => {
    setPosts([...posts, { title, content , comments: [] }]); // 새로운 게시글 추가
  };


  const handleCommentIconClick = (index) => {
    setActivePostIndex(index); // 댓글 입력 대상 게시글 인덱스 설정
    setShowCommentInput(!showCommentInput); // 댓글 입력 필드 표시 상태 토글
  };

  const onCommentSubmit = (index) => {
    if (commentText.trim() ) {
      const updatedPosts = [...posts];
      const newComment = { text: commentText, profile: <CgProfile /> }; // 댓글 텍스트와 프로필 아이콘 포함
      updatedPosts[index].comments.push(newComment);
      setPosts(updatedPosts); // 댓글 추가 후 상태 업데이트
      setCommentText(""); // 입력 필드 초기화
      setShowCommentInput(false); // 입력 필드 숨김
    }
  };


  return (
    <>
     {/* 이미지 컨테이너 내부에 텍스트 오버레이를 추가 */}
     <ImageContainer>
      <TextOverlay onClick={openLocationModal} >
     대만 <IoMdArrowDropdown icon={ IoMdArrowDropdown } /></TextOverlay>
   </ImageContainer>

{/* Chip 버튼을 이미지 아래에 추가 */}
<ChipContainer>
        <ChipButton onClick={openModal}>
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


    {/* 등록된 게시글을 TravelInfo 아래에 표시 */}
      <PostsContainer>
        {posts.map((post, index) => (
          <Post key={index}>
            <PostTitle>{post.title}</PostTitle>
            <PostContent>{post.content}</PostContent>
        
     
      {/* DividerContainer에 구분선과 아이콘 추가 */}
      <DividerContainer>
        <Divider /> {/* 구분선 */}
        <CommentIconContainer>
        <CommentIcon onClick={handleCommentIconClick} /> {/* 구분선 끝에 댓글 추가 아이콘 */}
        <CommentCount>{post.comments.length}</CommentCount> {/* 댓글 수 표시 */}
        </CommentIconContainer>
      </DividerContainer>

        {/* 댓글 입력 필드 */}
        {showCommentInput && (
           <CommentContainer>
              <ReplyProfileImage>
             <CgProfile />  
          </ReplyProfileImage>
                <CommentInput
                  type="text"
                  placeholder="댓글을 입력하세요"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onCommentSubmit(index);
                  }}
                />
               
                <ReplyButton onClick={() => onCommentSubmit(index)}>답글달기</ReplyButton>
                </CommentContainer>
              )}



             
            {/* 댓글 목록 표시 */}
              <CommentList>
                {post.comments.map((comment, i) => (
                  <CommentItem key={i}>
                    <ReplyProfileImage>{comment.profile}</ReplyProfileImage> {/* 저장된 프로필 이미지 */}
                    <CommentText>{comment.text}</CommentText>
                  </CommentItem>
                ))}
              </CommentList>
              
              </Post> 
        ))} 
       </PostsContainer>


       {/* 글작성 모달 컴포넌트 호출 */}
       <TalkModal isOpen={isModalOpen} onClose={closeModal} onConfirm={addPost} />


      {/* 지역 선택 모달 */}
      <TalkLocationModal
        isOpen={isLocationModalOpen}
        onClose={closeLocationModal}
        onSelect={handleLocationSelect} // 지역 선택 시 호출할 콜백 함수
      />

    </>
  );
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
margin-right: 10px; /* 프로필 이미지와 댓글 입력창 사이 간격 */
border: 1px solid #d3d3d3; /* 프로필 이미지 테두리 */

svg {
    font-size: 32px;
    color: #888;
  }
`;

const ReplyProfileImage = styled.div`
width: 40px;
height: 40px;
display: flex;
border-radius: 50%;
justify-content: center;
align-items: center;
object-fit: cover;
margin-left: 20px;
margin-right: 10px; /* 프로필 이미지와 댓글 입력창 사이 간격 */
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
 height: 1px;
 background-color: #d3d3d3;
`;

// const Divider = styled.div`
// width: 100%;
// height: 1px;
// background-color: #d3d3d3; /* 연한 회색 */
// margin: 20px 0; /* 위, 아래 여백 */
// `;

const PostsContainer = styled.div`
  margin-top: 20px;
`;

const Post = styled.div`
  padding: 10px;
  margin-top: 10px;
  border-radius: 8px;
  background-color: white;
`;

const PostTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #333;
`;

const PostContent = styled.p`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #666;
  font-size: 16px;
`;

const CommentIconContainer = styled.div`
  position: absolute;
  top: -25px; /* 구분선 위로 위치 */
  right: 30px; /* 오른쪽 정렬 */
  display: flex;
  align-items: center;
`;

const CommentIcon = styled(FaCommentDots)`
  position: absolute;
  right: 13px; /* 오른쪽 정렬 */
  font-size: 18px;
  color: #d3d3d3;
  cursor: pointer;
`;

const CommentCount = styled.span`
  margin-left: 2px;
  right: 0px;
  font-size: 14px;
  color: #d3d3d3;
`;

// Divider와 아이콘을 감싸는 컨테이너
const DividerContainer = styled.div`
  position: relative; /* 아이콘 위치를 위한 기준 위치 */
  margin: 20px 0;
`;


// 댓글 입력 필드와 버튼을 감싸는 컨테이너
const CommentContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;


// 댓글 입력 필드
const CommentInput = styled.input`
  width: 50%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;



// 답글달기 버튼
const ReplyButton = styled.button`
  margin-left: 10px;
  padding: 8px 12px;
  background-color: #507DBC;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #507DBC;
  }
`;

const CommentItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const CommentList = styled.div`
  margin-top: 10px;
`;

const CommentText = styled.p`
  margin: 0;
  margin-left: 10px;
  font-size: 14px;
  color: #333;
`;
export default Talk;
