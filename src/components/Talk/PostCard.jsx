import React from 'react';
import styled from 'styled-components';
import CommentComponents from './CommentComponents';

import { fetchComments, handleCommentSubmit, handleCommentIconClick } from '../../services/commentsHelper';
import { FaRegCommentDots } from 'react-icons/fa';

const PostCard = ({
  post,
  userInfo,
  editingPostId,
  updatedTitle,
  updatedMessage,
  handleEdit,
  handleCancelEdit,
  handleSaveEdit,
  setUpdatedTitle,
  setUpdatedMessage,
  openDeleteModal,
}) => {
  const [activePost, setActivePost] = React.useState(null);
  const [commentsData, setCommentsData] = React.useState({});

  const handleCommentIconClick = (postId) => {
    if (activePost === postId) {
      setActivePost(null);
    } else {
      setActivePost(postId);
      fetchComments(postId, setCommentsData); // 댓글 불러오기
    }
  };


  const tags = Array.isArray(post.tag) ? post.tag : post.tag.split(',');

  return (
    <PostWrapper>
      <AuthorContainer>
        <ProfileImage profilePhoto={post.profile_photo}/>
        <Nickname>{post.nickname || '익명'}</Nickname>
           {/* 수정 및 삭제 버튼 */}
        {userInfo.userId === post.user_id && (
         <ButtonContainer>
        <DeleteButton onClick={() => openDeleteModal(post.talk_id)}>삭제</DeleteButton>
        <EditButton onClick={() => handleEdit(post)}>수정</EditButton>
      </ButtonContainer>
    )}
      </AuthorContainer>

      {editingPostId === post.talk_id ? (
        <EditContainer>
          <EditInput
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            placeholder="제목 수정"
          />
          <EditTextarea
            value={updatedMessage}
            onChange={(e) => setUpdatedMessage(e.target.value)}
            placeholder="내용 수정"
          />
          <EditActions>
            <EditButton onClick={() => handleSaveEdit(post.talk_id)}>저장</EditButton>
            <CancelButton onClick={handleCancelEdit}>취소</CancelButton>
          </EditActions>
        </EditContainer>
      ) : (
        <>
          <PostTitle>{post.talk_title}</PostTitle>
          
          <PostContent>{post.talk_message}</PostContent>
          <ChipContainer>
            {tags.map((tag, index) => (
              <ChipButton key={index}>{tag}</ChipButton>
            ))}
          </ChipContainer>
          <PostDateTime>{formatDate(post.talk_at)}</PostDateTime>

        {/* 댓글 아이콘 및 댓글 수 */}
        <DividerContainer>
          <Divider />
          <CommentIconContainer
            onClick={() =>
              handleCommentIconClick(
                post.talk_id,
                activePost,
                setActivePost,
                (id) => fetchComments(id, setCommentsData)
              )
            }
          >
            <FaRegCommentDots />
            <CommentCount>{post.comment_count || 0}</CommentCount>
          </CommentIconContainer>
        </DividerContainer>

        {/* 댓글 입력 및 목록 표시 */}
        {activePost === post.talk_id && (
          <CommentComponents
            comments={commentsData[post.talk_id] || []}
            userInfo={userInfo}
            onCommentSubmit={(commentText) =>
              handleCommentSubmit(
                post.talk_id,
                commentText,
                userInfo,
                (id) => fetchComments(id, setCommentsData)
              )
            }
          />
        )}
      </>
    )}

 
    </PostWrapper>
  );
};
export default PostCard;


const formatDate = (dateString) => {
    // "2024-11-12T14:05:52.000Z" 형태의 문자열에서 필요한 부분 추출
     const [datePart, timePart] = dateString.split("T");
     const [year, month, day] = datePart.split("-");
     let [hour, minute] = timePart.split(":");
     
     // 시간 형식을 12시간제로 변환하고 오전/오후 결정
     const period = hour >= 12 ? "오후" : "오전";
     hour = hour % 12 || 12; // 0시를 12시로 변환
     
     // 원하는 형식으로 문자열 조합 (초 제외)
     return `${year}. ${month}. ${day}. ${period} ${hour}:${minute}`;
   };
  


const ProfileImage = ({ profilePhoto }) => {
    // profilePhoto가 null이나 undefined가 아니면 replace를 사용하여 경로 수정
    const imageURL = profilePhoto
      ? `http://15.164.142.129:3001/${profilePhoto.replace(/\\/g, "/")}`
      : defaultProfileImage;
        return (
      <img src={imageURL} alt="프로필 이미지" 
      style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }} />
    );
  };
 

// 스타일 컴포넌트들
const PostsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostWrapper = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 10px;
`;

const AuthorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-left; /* 왼쪽 정렬 */
  gap: 8px; /* 버튼 간격 추가 */
`;

const DeleteButton = styled.button`
  background-color: #bebbbb; /* 빨간색 배경 */
  color: white; /* 흰색 텍스트 */
  border: none;
  border-radius: 4px;
  padding: 7px 12px;
  cursor: pointer;
  &:hover {
    background-color: #8a8787; /* 호버 효과 */
  }
`;
const EditButton = styled.button`
  background-color: #507DBC; /* 파란색 배경 */
  color: white; /* 흰색 텍스트 */
  border: none;
  border-radius: 4px;
  padding:  7px 12px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3; /* 호버 효과 */
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  gap: 8px; /* 버튼 간격 */
  margin-left: auto; /* 오른쪽 정렬 */
`;


const Nickname = styled.span`
  font-weight: bold;
`;

const PostTitle = styled.h3`
 margin-left: 20px;
`;

const PostContent = styled.p`
 margin-left: 20px;

`;

const PostDateTime = styled.span`
  display: block;
  font-size: 12px;
  color: #777;
  margin-top: 10px;
  margin-left: 20px;
`;


const DividerContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const Divider = styled.hr`
  flex: 1;
  border: none;
  border-top: 1px solid #eee;
`;

const CommentIconContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 8px;
`;

const CommentCount = styled.span`
  margin-left: 5px;
  font-size: 0.9em;
  color: #666;
`;


// 스타일 추가
const ChipContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-left: 18px;
  margin-top: 8px;
`;

const ChipButton = styled.span`
   display: flex;
  padding: 8px 16px;
  border: 1px solid #d3d3d3;
  align-items: center; /* 아이콘과 텍스트를 수평 정렬 */
  border-radius: 16px;
  background-color: ${({ active }) => (active ? "white" : "white")};
  color: ${({ active }) => (active ? "black" : "#333")};
  font-size: 14px;
  transition: background-color 0.3s;
`;

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EditInput = styled.input`
  padding: 8px;
  border: none;
  border-radius: 4px;
  outline: none; /* 포커스 시 외곽선 제거 */
  font-size: 14px;
`;

const EditTextarea = styled.textarea`
  padding: 8px;
  border: none; /* 테두리 제거 */
  border-radius: 4px;
  font-size: 14px;
  outline: none; /* 포커스 시 외곽선 제거 */
  resize: none;
`;

const EditActions = styled.div`
  display: flex;
  gap: 8px;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  background-color: #ccc;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #aaa;
  }
  `;