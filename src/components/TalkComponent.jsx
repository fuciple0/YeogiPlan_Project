import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PostComponents from './PostComponents';
import styled from 'styled-components';
import defaultProfileImage from '../assets/user_profile.png'; 




// 게시글 목록 가져오기
const fetchPosts = async (page, limit) => {
  try {
    const response = await fetch('http://192.168.50.34:3001/api/talk_board', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("서버에서 가져온 게시글 데이터:", responseData); // 서버 응답 데이터 확인

      setPosts(responseData.data);
    } else {
      console.error("게시글 목록을 가져오는 데 실패했습니다.");
      return { posts: [], pagination: { totalPages: 1 } };
    }
  } catch (error) {
    console.error("Error:", error);
  }
};


const TalkComponent = ({ onAddPost }) => {
  const [posts, setPosts] = useState([]);
  const userInfo = useSelector((state) => state.user.userInfo);

  const addPost = useCallback(async (title, content) => {
    const requestBody = {
      user_id: userInfo.userId,
      talk_title: title,
      talk_message: content,
      
    };

    try {
      console.log("Post 데이터:", post);
      console.log("전송할 데이터:", requestBody);
      const response = await fetch('http://192.168.50.34:3001/api/talk_board', {
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

  useEffect(() => {
    fetchPosts(setPosts);
  }, []);


  useEffect(() => {
    if (onAddPost) onAddPost(addPost);
  }, [addPost, onAddPost]);

 







  // PostComponents로 posts 데이터를 전달하여 렌더링
  return (
    <PostComponents posts={posts} />
  );
};


export default TalkComponent;
