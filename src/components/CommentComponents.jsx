// CommentComponents.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import defaultProfileImage from '../assets/user_profile.png'; 
import { useSelector } from 'react-redux'; 


const CommentComponents = ({ comments,userInfo, onCommentSubmit }) => {
  const [commentText, setCommentText] = useState("");


  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <>
      <CommentContainer>
        <CommentInput
          type="text"
          placeholder="댓글을 입력하세요"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <ReplyButton
          onClick={() => {
            onCommentSubmit(commentText); // 댓글 전송
            setCommentText(""); // 입력 필드 초기화
          }}
        >
          답글달기
        </ReplyButton>
      </CommentContainer>
      <CommentList>
        {comments.map((comment) => (
          <CommentItem key={comment.comment_id}>
            <ReplyProfileImage src={comment.user?.profile_photo || defaultProfileImage} alt="프로필 이미지" />
            <CommentContent>
              <CommentHeader>
                <CommentUser>{comment.user?.nickname || userInfo.nickname}</CommentUser>
              </CommentHeader>
              <CommentText>{comment.contents}</CommentText>
              <CommentFooter>
              <CommentTime>{formatDate(comment.comment_at)}</CommentTime>
           
            <Divider /> {/* 구분선을 타임 밑에 추가 */}
            </CommentFooter>
            </CommentContent>
          </CommentItem>
        ))}
      </CommentList>
    </>
  );
};
export default CommentComponents;




// 스타일 컴포넌트들
const CommentContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

const ReplyProfileImage = styled.img`
  width: 30px;
  height: 30px;
  margin-left: 40px;
  border-radius: 50%;
`;

const CommentInput = styled.input`
  width: 50%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-left: 16px;
`;

const ReplyButton = styled.button`
  background-color: #507DBC;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  margin-left: 10px;
  cursor: pointer;
`;

const CommentList = styled.div`
  margin-top: 20px;
`;

const CommentItem = styled.div`
  display: flex;
  /* flex-direction: column; */
  align-items: flex-start;
  margin-bottom: 10px;
`;

const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
`;

const CommentUser = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-right: 8px;
`;

const CommentText = styled.p`
  font-size: 14px;
  color: #555;
  margin: 4px 0 0 0;
`;

// 시간과 구분선을 포함하는 컨테이너
const CommentFooter = styled.div`
  /* display: flex; */
  flex-direction: column;
  align-items: flex-start;
`;

const CommentTime = styled.span`
  font-size: 12px;
  color: #777;
  margin-top: 4px 0 0 0;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  width: 80%; /* 원하는 너비로 조절 */
  display: inline-block; /* inline-block으로 설정하여 크기 조정 */
  margin-top: 4px;
  margin-left: 0; /* 시간을 기준으로 왼쪽 정렬 */
`;