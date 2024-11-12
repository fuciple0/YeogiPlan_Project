import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PostComponents from './PostComponents';
import styled from 'styled-components';
import defaultProfileImage from '../assets/user_profile.png'; 




// 게시글 목록 가져오기
const fetchPosts = async (page, limit) => {
  try {
    const response = await fetch(`http://15.164.142.129:3001/api/talk_board?page=${page}&limit=${limit}`,  {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("서버에서 가져온 게시글 데이터:", responseData); // 서버 응답 데이터 확인
       return {
        posts: responseData.data,
        pagination: responseData.pagination, // 페이지네이션 데이터 반환
      };
       // setPosts(responseData.data);
      // setPagination(responseData.pagination); // 페이지네이션 데이터 저장
    } else {
      console.error("게시글 목록을 가져오는 데 실패했습니다.");
    }
  } catch (error) {
    console.error("Error:", error);
    return { posts: [], pagination: {} };
  }
};


// 게시글 작성
  const TalkComponent = ({ onAddPost }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1); // 현재 페이지 번호 상태
  const [limit] = useState(10); // 페이지당 게시글 수 상태
  const [pagination, setPagination] = useState({}); // 페이지네이션 데이터 상태
  const userInfo = useSelector((state) => state.user.userInfo);

  const addPost = useCallback(async (title, content) => {
    const requestBody = {
      user_id: userInfo.userId,
      talk_title: title,
      talk_message: content,
      };

    try {
      console.log("전송할 데이터:", requestBody);
      const response = await fetch('http://15.164.142.129:3001/api/talk_board', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        const newPost = {
          ...responseData.data,
          user: {
            nickname: userInfo.nickname,
            profile_photo: userInfo.profile_photo || defaultProfileImage,
          },
        };
        console.log("새로운 게시글:", newPost);
        setPosts((prevPosts) => [newPost, ...prevPosts]);
        // fetchPosts(page, limit, setPosts, setPagination);
       } else {
        console.error("게시글 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [userInfo]);

  // 페이지 로드 시 게시글 목록 불러오기
  useEffect(() => {
    const loadPosts = async () => {
      const { posts, pagination } = await fetchPosts(page, limit);
      setPosts(posts);
      setPagination(pagination);
    };
    loadPosts();
  }, [page, limit]);

  useEffect(() => {
    if (onAddPost) onAddPost(addPost);
  }, [addPost, onAddPost]);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

 

  // PostComponents로 posts 데이터를 전달하여 렌더링
  return (
    <>
      {/* 게시글 목록 렌더링 */}
      <PostComponents posts={posts} />
      {/* 페이지네이션 컨트롤 */}
    <PaginationContainer>
      <PaginationButton onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
        이전
      </PaginationButton>
      <PageInfo>{page} / {pagination.totalPages}</PageInfo>
      <PaginationButton onClick={() => handlePageChange(page + 1)} disabled={page >= pagination.totalPages}>
        다음
      </PaginationButton>
    </PaginationContainer>
    </>
  );
};


export default TalkComponent;


// 페이지네이션 컨테이너 스타일
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  font-size: 16px;
`;

// 페이지네이션 버튼 스타일
const PaginationButton = styled.button`
  background-color: #507DBC; // 버튼 배경색
  color: white; // 글자색
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  margin: 0 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #507DBC; // 호버 시 배경색
    font-weight: bold;
  }

  &:disabled {
    background-color: #ccc; // 비활성화 시 배경색
    cursor: not-allowed;
  }
`;

// 현재 페이지와 전체 페이지 정보 스타일
const PageInfo = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 10px;

  


`;