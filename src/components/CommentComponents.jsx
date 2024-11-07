//댓글 입력 필드와 댓글 목록을 관리하는 컴포넌트

import React from 'react';
import styled from 'styled-components';
import { CgProfile } from "react-icons/cg";



const CommentComponents = ({ comments, commentText, onChange, onSubmit }) => (
  <>
    <CommentContainer>
      <ReplyProfileImage>
        <CgProfile />
      </ReplyProfileImage>
      <CommentInput
        type="text"
        placeholder="댓글을 입력하세요"
        value={commentText}
        onChange={onChange}
      />
      <ReplyButton onClick={onSubmit}>답글달기</ReplyButton>
    </CommentContainer>
    <CommentList>
      {comments.map((comment, i) => (
         <div key={i}>
        <CommentItem key={i}>
          <ReplyProfileImage>{comment.profile}</ReplyProfileImage>
          <CommentText>{comment.text}</CommentText>
        </CommentItem>
         {i === comments.length - 1 && <Divider />} {/* 마지막 댓글 아래 구분선 */}
         </div>
      ))}
    </CommentList>
  </>
);

export default CommentComponents;


const CommentContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 3px;
`;

const CommentInput = styled.input`
  width: 50%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-left: 16px;
`;

const ReplyButton = styled.button`
  margin-left: 10px;
  padding: 8px 12px;
  background-color: #507DBC;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const CommentList = styled.div`
  margin-top: 10px;
`;

const CommentItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const CommentText = styled.p`
  margin: 0;
  margin-left: 16px;
  font-size: 14px;
  color: #333;
`;

const ReplyProfileImage = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  border-radius: 50%;
  margin-left: 30px;
  justify-content: center;
  align-items: center;
  border: 1px solid #d3d3d3;

  svg {
    font-size: 25px;
    color: #888;
  }
`;

const Divider = styled.div`
  height: 2px;
  background-color: #d3d3d3;
  margin: 10px 0;
`;