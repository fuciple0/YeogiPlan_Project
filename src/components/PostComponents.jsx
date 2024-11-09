// src/components/PostComponents.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCommentDots } from "react-icons/fa";
import CommentComponents from './CommentComponents';
import defaultProfileImage from '../assets/user_profile.png'; 


const PostComponents = ({ posts =[], activePostIndex, onCommentIconClick, commentText, setCommentText, onCommentSubmit }) => (
  <PostsContainer>
    {posts && posts.length > 0 ? (
      posts.map((post, index) => (
        <PostWrapper key={post.talk_id}>
          
          {/* 작성자 정보 */}
          <AuthorContainer>
            <ProfileImage src={post.profile_photo || defaultProfileImage} alt="프로필 이미지" />
            <Nickname>{post.nickname || "익명"}</Nickname>
          </AuthorContainer>

          {/* 게시글 제목과 내용 */}

          <PostTitle>{post.talk_title}</PostTitle>
          <PostContent>{post.talk_message}</PostContent>

          {/* 태그 표시 */}
          <TagContainer>
            {post.tags && post.tags.map((tag, idx) => (
              <TagChipButton key={tag + idx}>{tag}</TagChipButton>
            ))}
          </TagContainer>

          {/* 게시 시간 */}
          <PostDateTime>{getRelativeTime(post.createdAt)}</PostDateTime>

          {/* 댓글 아이콘 및 댓글 수 */}
          <DividerContainer>
            <Divider />
            <CommentIconContainer onClick={() => onCommentIconClick(index)}>
              <CommentIcon />
              <CommentCount>{post.comments?.length || 0}</CommentCount>
            </CommentIconContainer>
          </DividerContainer>

          {/* 댓글 입력 및 목록 표시 */}
          {activePostIndex === index && (
            <CommentComponents
              comments={post.comments || []}
              commentText={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onSubmit={onCommentSubmit}
            />
          )}
        </PostWrapper>
      ))
    ) : (
      <p>게시글이 없습니다.</p>
    )}
  </PostsContainer>
);

// 상대 시간 계산 함수
const getRelativeTime = (timestamp) => {
  const now = new Date();
  const diff = Math.floor((now - timestamp) / 1000); // 초 단위 차이 계산
  
  if (diff < 60) return `${diff}초 전`;
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
};
export default PostComponents;




const PostsContainer = styled.div`
  margin-top: 20px;
`;

const PostWrapper = styled.div`
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
  color: #666;
  font-size: 16px;
`;

const DividerContainer = styled.div`
  position: relative;
  margin: 20px 0;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #d3d3d3;
`;

const CommentIconContainer = styled.div`
  position: absolute;
  top: -25px;
  right: 30px;
  display: flex;
  align-items: center;
`;

const CommentIcon = styled(FaCommentDots)`
  font-size: 18px;
  color: #d3d3d3;
  cursor: pointer;
`;

const CommentCount = styled.span`
  margin-left: 5px;
  font-size: 14px;
  color: #d3d3d3;
`;

const TagContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

// 스타일 정의
const PostDateTime = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 20px;
`;

const TagChipButton = styled.button`
  display: flex;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  border: 1px solid #d3d3d3;
  background-color:white;
  `;


const AuthorContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const Nickname = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;
