import React, { useState } from 'react';
import styled from 'styled-components';
import defaultProfileImage from '../assets/user_profile.png'; 

const CommentComponents = ({ comments, userInfo, onCommentSubmit }) => {
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState(""); // 대댓글 입력 필드
  const [replyTo, setReplyTo] = useState(null); // 대댓글을 작성 중인 comment_id

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

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

  const handleReplySubmit = (parent_id) => {
    if (replyText.trim()) {
      onCommentSubmit(replyText, parent_id); // 대댓글 전송
      setReplyText(""); // 입력 필드 초기화
      setReplyTo(null); // 대댓글 입력창 닫기
    }
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
          댓글 작성
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
                  <ReplyButton2 onClick={() => setReplyTo(comment.comment_id)}>
                    답글
                  </ReplyButton2>
                </CommentFooter>

                {/* 대댓글 입력창 */}
                {replyTo === comment.comment_id && (
                  <ReplyInputContainer>
                    <ReplyInput
                      type="text"
                      placeholder="답글을 입력하세요"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <SubmitReplyButton onClick={() => handleReplySubmit(comment.comment_id)}>
                      작성
                    </SubmitReplyButton>
                  </ReplyInputContainer>
                )}
              </CommentContent>
            </CommentItem>

            {/* 대댓글 렌더링 */}
            {comments
              .filter((comment) => comment.parent_id === comment.comment_id)
              .map((reply) => (
                <CommentItem key={comment.comment_id} style={{ marginLeft: '40px' }}>
                  <ReplyProfileImage profilePhoto={reply.user?.profile_photo || defaultProfileImage} alt="프로필 이미지" />
                  <CommentContent>
                    <CommentHeader>
                      <CommentUser>{comment.nickname }</CommentUser>
                    </CommentHeader>
                    <CommentText>{reply.contents}</CommentText>
                    <CommentFooter>
                      <CommentTime>{formatDate(reply.comment_at)}</CommentTime>
                    </CommentFooter>
                  </CommentContent>
                </CommentItem>
              ))}
          </>
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

const ReplyButton2 = styled.button`
  /* background-color: #507DBC; */
  color: #111010;
  border: none;
  padding: 6px 12px;
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

const ReplyInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  margin-left: 40px;
`;

const ReplyInput = styled.input`
  flex: 1;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SubmitReplyButton = styled.button`
  background-color: #507dbc;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  margin-left: 8px;
  cursor: pointer;
`;