import React, { useState,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { deleteComment } from '../../services/commentsHelper';
import defaultProfileImage from '../../assets/user_profile.png'; 

const CommentComponents = ({  comments, userInfo, onCommentSubmit,onDeleteComment  }) => {
  const [commentText, setCommentText] = useState("");

  
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
        > 댓글 작성
        </ReplyButton>
      </CommentContainer>
      
      <CommentList>
        {comments.map((comment) => (
          <>
            {/* 원 댓글 */}
            <CommentItem key={comment.comment_id}>
              <ReplyProfileImage profilePhoto={comment.profile_photo} />
              <CommentContent>
                <CommentHeader>
                  <CommentUser>{comment.nickname}</CommentUser>
                </CommentHeader>
                <CommentText>{comment.contents}</CommentText>
                <CommentFooter>
                <CommentTime>{formatDate(comment.comment_at)}</CommentTime>
                 {/* 삭제 버튼 */}
                 {userInfo?.userId === comment.user_id && (
                  <DeleteButton
                    onClick={() => {
                      if (window.confirm("댓글을 삭제하시겠습니까?")) {
                        onDeleteComment(comment.comment_id);
                      }
                    }}
                  >
                    삭제
                  </DeleteButton>
                 )}
                </CommentFooter>
              </CommentContent>
            </CommentItem>
            </>
        ))}
      </CommentList>
    </>
  );
};
export default CommentComponents;


const ReplyProfileImage = ({ profilePhoto }) => {
  const imageURL = profilePhoto 
    ? `http://15.164.142.129:3001/${profilePhoto.replace(/\\/g, "/")}` 
    : defaultProfileImage;

  return (
    <img 
      src={imageURL} 
      alt="댓글 프로필 이미지" 
      style={{ width: 30, height: 30, borderRadius: '50%', marginLeft: 40 }} 
    />
  );
};

  
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




// 스타일 컴포넌트들
const CommentContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
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

  const DeleteButton = styled.button`
  background-color: #c0b3b4; /* 빨간색 배경 */
  color: white; /* 텍스트 색상 */
  border: none; /* 테두리 제거 */
  border-radius: 4px; /* 약간의 둥근 모서리 */
  padding: 4px 8px; /* 내부 여백 */
  margin-left: 10px;
  font-size: 12px; /* 글자 크기 */
  cursor: pointer; /* 클릭 가능한 커서 */
  transition: background-color 0.3s ease; /* 호버 효과 전환 */

  &:hover {
    background-color: #4e4a4b; /* 호버 시 더 어두운 빨간색 */
  }

  &:active {
    background-color: #5c5657; /* 클릭 시 더 어두운 빨간색 */
  }
`;