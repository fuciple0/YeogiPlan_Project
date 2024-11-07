// src/components/PostComponents.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCommentDots } from "react-icons/fa";
import CommentComponents from './CommentComponents';

const PostComponents = ({ posts, activePostIndex, onCommentIconClick, commentText, setCommentText, onCommentSubmit }) => (
  <PostsContainer>
    {posts.map((post, index) => (
      <PostWrapper key={index}>
        <PostTitle>{post.title}</PostTitle>
        <PostContent>{post.content}</PostContent>
        <TagContainer>
          {post.tags.map((tag, idx) => (
            <TagChipButton key={idx}>{tag}</TagChipButton>
          ))}
        </TagContainer>
        <PostDateTime>{getRelativeTime(post.createdAt)}</PostDateTime>

        <DividerContainer>
          <Divider />
          <CommentIconContainer onClick={() => onCommentIconClick(index)}>
            <CommentIcon />
            <CommentCount>{post.comments.length}</CommentCount>
          </CommentIconContainer>
        </DividerContainer>

        {/* 댓글 입력 및 목록 표시 */}
        {activePostIndex === index && (
          <CommentComponents
            comments={post.comments}
            commentText={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onSubmit={onCommentSubmit}
          />
        )}
      </PostWrapper>
    ))}
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
