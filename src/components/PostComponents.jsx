// PostComponents.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaRegCommentDots } from "react-icons/fa";
import { useSelector } from 'react-redux';
import CommentComponents from './CommentComponents';
import defaultProfileImage from '../assets/user_profile.png'; 



const PostComponents = ({ posts = [] }) => {
  const [activePost, setActivePost] = useState(null);
  const [commentsData, setCommentsData] = useState({});
  const userInfo = useSelector((state) => state.user.userInfo);


  const ProfileImage = ({ profilePhoto }) => {
    // profilePhoto가 null이나 undefined가 아니면 replace를 사용하여 경로 수정
    const imageURL = profilePhoto 
      ? `http://15.164.142.129:3001/${profilePhoto.replace(/\\/g, "/")}` 
      : defaultProfileImage;
      return (
      <img 
        src={imageURL} 
        alt="프로필 이미지" 
        style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }} 
      />
    );
  };


  // 댓글 아이콘 클릭 시 해당 게시글의 댓글 입력창 및 목록 표시
  const handleCommentIconClick = (talk_id) => {
    setActivePost((prev) => (prev === talk_id ? null : talk_id)); // 이미 열려 있으면 닫기
    if (activePost !== talk_id) fetchComments(talk_id); // 댓글 목록 가져오기
  };


    const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  
  // 댓글 작성 함수
  const handleCommentSubmit = async (talk_id, commentText) => {
    if (!commentText.trim()) return;
    try {
      // 전송하려는 데이터를 콘솔에 출력
      console.log("전송 데이터:", {
      user_id: userInfo.userId,
      contents: commentText,
      parent_id: null,
    });
       const response = await fetch(`http://15.164.142.129:3001/api/talk_board/${talk_id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userInfo.userId, 
          contents: commentText,
          parent_id: null,
        }),
      });

      if (response.ok) {
        console.log("댓글 작성 성공");
        fetchComments(talk_id); // 댓글 작성 후 최신 댓글 목록 가져오기
      } else {
        console.error("댓글 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  // 특정 게시글의 댓글 목록 가져오기
  const fetchComments = async (talk_id) => {
    try {
        const response = await fetch(`http://15.164.142.129:3001/api/talk_board/${talk_id}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
       if (response.ok) {
        const responseData = await response.json();
        setCommentsData((prevData) => ({
          ...prevData,
          [talk_id]: responseData.data || [],
        }));
      } else {
        console.error("댓글 목록을 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
            </AuthorContainer>

            {/* 게시글 제목과 내용 */}
            <PostTitle>{post.talk_title}</PostTitle>
            <PostContent>{post.talk_message}</PostContent>
            

            {/* 게시글 작성 날짜 및 시간 */}
            <PostDateTime>{formatDate(post.talk_at)}</PostDateTime> {/* 날짜 및 시간 표시 */}

            {/* 댓글 아이콘 및 댓글 수 */}
            <DividerContainer>
              <Divider />
              <CommentIconContainer onClick={() => handleCommentIconClick(post.talk_id)}>
                <FaRegCommentDots />
                <CommentCount>{commentsData[post.talk_id]?.length || 0}</CommentCount>
              </CommentIconContainer>
            </DividerContainer>

            {/* 댓글 입력 및 목록 표시 */}
            {activePost === post.talk_id && (
              <CommentComponents
                comments={commentsData[post.talk_id] || []}
                userInfo={userInfo} // userInfo를 전달
                onCommentSubmit={(commentText) => handleCommentSubmit(post.talk_id, commentText)}
              />
            )}
          </PostWrapper>
        ))
      ) : (
        <p>게시글이 없습니다.</p>
      )}
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
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const Nickname = styled.span`
  font-weight: bold;
`;

const PostTitle = styled.h3`
 margin-left: 20px;
  /* margin: 10px 0; */
`;

const PostContent = styled.p`
 margin-left: 20px;
  /* margin: 10px 0; */
`;

const PostDateTime = styled.span`
  display: block;
  font-size: 12px;
  color: #777;
  margin-top: 5px;
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