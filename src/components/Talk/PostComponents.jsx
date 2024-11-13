// PostComponents.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaRegCommentDots } from "react-icons/fa";
import { useSelector } from 'react-redux';
import CommentComponents from './CommentComponents';
import defaultProfileImage from '../../assets/user_profile.png';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { fetchComments, handleCommentSubmit, handleCommentIconClick } from '../../services/commentsHelper';
import { updatePost } from '../../services/postApi';
import usePostEdit from './usePostEdit'; 

  
  const PostComponents = ({ posts = [] }) => {
  const [activePost, setActivePost] = useState(null);
  const [commentsData, setCommentsData] = useState({});
  const [currentPosts, setCurrentPosts] = useState(posts);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const userInfo = useSelector((state) => state.user.userInfo);
  // const {
  //   editingPostId,
  //   updatedTitle,
  //   updatedMessage,
  //   handleEdit,
  //   handleCancelEdit,
  //   handleSaveEdit,
  //   setUpdatedTitle,
  //   setUpdatedMessage,
  // } = usePostEdit(setPosts);

  


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
      <img src={imageURL} alt="프로필 이미지" style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }} />
    );
  };

 // 게시글 삭제 확인
 const handleDeleteConfirm = async () => {
    if (selectedPostId) {
      const isDeleted = await deletePost(selectedPostId);
      if (isDeleted) {
        setCurrentPosts(currentPosts.filter((post) => post.talk_id !== selectedPostId));
      }
      closeDeleteModal();
    }
  };

  // 게시글 삭제 모달
   const openDeleteModal = (talk_id) => {
    setSelectedPostId(talk_id);
    setIsDeleteModalOpen(true);

  };

  const closeDeleteModal = () => {
    setSelectedPostId(null);
    setIsDeleteModalOpen(false);
  };



  return (
    <PostsContainer>
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <PostWrapper key={post.talk_id}>
            {/* 작성자 정보 */}
            <AuthorContainer>
              <ProfileImage profilePhoto={post.profile_photo} />
              <Nickname>{post.nickname || "익명"}</Nickname>
                {/* 게시글 작성자와 로그인 사용자 ID가 동일할 때만 삭제 버튼 표시 */}
                {userInfo.userId === post.user_id && (
                <DeleteButton onClick={() => openDeleteModal(post.talk_id)}>삭제</DeleteButton>
              )}
            </AuthorContainer>

            
               {/* 선택된 태그 표시 */}
              {post.tag && post.tag.length > 0 && (
            <ChipContainer>
              {post.tag.map((tag,index) => (
                <ChipButton key={index} active>
                  {tag}
                </ChipButton>
              ))}
            </ChipContainer>)}

              {/* 게시글 작성 날짜 및 시간 */}
            <PostDateTime>{formatDate(post.talk_at)}</PostDateTime> {/* 날짜 및 시간 표시 */}

            
           {/* 댓글 아이콘 및 댓글 수 */}
            <DividerContainer>
              <Divider />
              <CommentIconContainer
                onClick={() =>
                  handleCommentIconClick(post.talk_id, activePost, setActivePost, (id) =>
                    fetchComments(id, setCommentsData)
                  )} >
                <FaRegCommentDots />
                <CommentCount>{commentsData[post.talk_id]?.length || 0}</CommentCount>
              </CommentIconContainer>
            </DividerContainer>

          {/* 댓글 입력 및 목록 표시 */}
          {activePost === post.talk_id && (
              <CommentComponents
                comments={commentsData[post.talk_id] || []}
                userInfo={userInfo} // userInfo를 전달
                onCommentSubmit={(commentText) =>
                  handleCommentSubmit(post.talk_id, commentText, userInfo, (id) =>
                    fetchComments(id, setCommentsData)
                  )
                }
              />
            )}
          </PostWrapper>
        ))
      ) : (
        <p>게시글이 없습니다.</p>
      )}

     {/* 삭제 확인 모달 */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteModal}
      />
</PostsContainer>
  );
};

export default PostComponents;

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
  /* justify-content: space-between;  */
`;

const DeleteButton = styled.button`
  background-color: #cdc4c4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: auto;
`;


// const ProfileImage = styled.img`
//   width: 40px;
//   height: 40px;
//   border-radius: 50%;
//   margin-right: 10px;
// `;

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
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

const EditTextarea = styled.textarea`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  resize: none;
`;

const EditActions = styled.div`
  display: flex;
  gap: 8px;
`;

const EditButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  background-color: #ccc;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;