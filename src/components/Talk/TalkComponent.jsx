import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PostComponents from './PostComponents';
import styled from 'styled-components';
import { fetchPosts, addPost as apiAddPost, deletePost as apiDeletePost } from '../services/postApi';
import defaultProfileImage from '../assets/user_profile.png'; 


    // 게시글 작성
    const TalkComponent = ({ onAddPost }) => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1); // 현재 페이지 번호 상태
    const [limit] = useState(10); // 페이지당 게시글 수 상태
    const [pagination, setPagination] = useState({ totalPages: 1 }); // 페이지네이션 초기값 설정
    const userInfo = useSelector((state) => state.user.userInfo); // 리덕스에서 값 받아오기
  

     // 게시글 추가 함수
    const addPost = useCallback(
    async (title, content, tag) => {
      const newPost = await apiAddPost(title, content, tag, userInfo);
      if (newPost) {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      }
     },
    [userInfo]
  );

  // 페이지 로드 시 게시글 목록 불러오기
  useEffect(() => {
    const loadPosts = async () => {
      const { posts, pagination } = await fetchPosts(page, limit);
      const transformedPosts = posts.map((post) => ({
        ...post,
        tag: JSON.parse(post.tag || "[]"),
      }));
      setPosts(transformedPosts);
      setPagination(pagination);
    };
    loadPosts();
  }, [page, limit]);

  // `onAddPost` 콜백 설정
  useEffect(() => {
    if (onAddPost) onAddPost(addPost);
  }, [addPost, onAddPost]);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    const totalPages = pagination.totalPages || 1;
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };


// 게시글 목록 렌더링
   return (
    <>
      <PostComponents posts={posts} />
      {/* 페이지네이션 컨트롤 */}
      <PaginationContainer>
        <PaginationButton onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          이전
        </PaginationButton>
        <PageInfo>{page} / {pagination.totalPages || 1}</PageInfo>
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
  background-color: #507DBC; /* 버튼 배경색 */
  color: white; /* 글자색 */
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  margin: 0 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4a6fa5; /* 호버 시 배경색 */
    font-weight: bold;
  }

  &:disabled {
    background-color: #ccc; /* 비활성화 시 배경색 */
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