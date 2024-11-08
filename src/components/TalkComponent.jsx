import React, { useState, useEffect, useCallback } from 'react';
import PostComponents from './PostComponents';
import { useSelector } from 'react-redux';
import defaultProfileImage from '../assets/user_profile.png';

const TalkComponent = ({ onAddPost }) => {
  const [posts, setPosts] = useState([]);
  const userInfo = useSelector(state => state.user.userInfo);

  // 게시글 목록 가져오기
  const fetchPosts = async () => {
    try {
      const response = await fetch('http://192.168.50.34:3001/api/talk_board');
      if (response.ok) {
        const responseData = await response.json();
        const formattedPosts = responseData.data.map(post => ({
          ...post,
          nickname: post.user?.nickname || '익명',
          profile_photo: post.user?.profile_photo
            ? `http://192.168.50.34:3001/api/user/${post.user.profile_photo.replace(/\\/g, '/')}`
            : defaultProfileImage,
        }));
        setPosts(formattedPosts);
      } else {
        console.error('게시글 목록을 가져오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // 게시글 추가 함수 (useCallback 사용)
  const addPost = useCallback(async (title, content) => {
    const requestBody = {
      user_id: userInfo.userId,
      talk_title: title,
      talk_message: content,
    };

    try {
      console.log("전송할 데이터:", requestBody);
      const response = await fetch('http://192.168.50.34:3001/api/talk_board', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const responseData = await response.json();
        const newPost = {
          ...responseData.data,
          user: {
            nickname: userInfo.nickname, 
            profile_photo: userInfo.profile_photo
          },
        };
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      } else {
        console.error("게시글 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [userInfo]);

  // `onAddPost` prop으로 `addPost`를 전달
  useEffect(() => {
    if (onAddPost) onAddPost(addPost);
  }, [addPost, onAddPost]); // `onAddPost`가 변경될 때만 실행됨

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostComponents posts={posts} />
  );
};

export default TalkComponent;
