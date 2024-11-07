// src/pages/Talk.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

import ImageContainer from '../components/ImageContainer';
import ProfileContainer from '../components/ProfileContainer';
import ChipButtons from '../components/ChipButtons';
import PostComponents from '../components/PostComponents';
import CommentComponents from '../components/CommentComponents';
import TalkModal from '../components/TalkModal';
import TalkLocationModal from '../components/TalkLocationModal';

// 이미지 import
import tiwanImage from '../assets/talk_img/tiwan.jpg';
import { CgProfile } from "react-icons/cg"; // 프로필 아이콘

// 사용자 프로필 데이터 예시
const userProfile = {
  nickname: '사용자 닉네임',
  profileImage: 'profileImageURL경로',  // 실제 프로필 이미지 경로를 추가
  location: '대만 타이베이',
  travelDates: '2023-11-01 ~ 2023-11-10'
};

const Talk = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]); // 게시글 상태
  const [commentText, setCommentText] = useState(""); // 댓글 텍스트 상태
  const [activePostIndex, setActivePostIndex] = useState(null); // 현재 댓글 입력 중인 게시글의 인덱스

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false); // LocationModal 상태
  const [selectedLocation, setSelectedLocation] = useState(""); // 선택한 지역 저장

  const openModal = () => setIsModalOpen(true);  // 글쓰기모달 열기
  const closeModal = () => setIsModalOpen(false); // 글쓰기모달 닫기

  const openLocationModal = () => setIsLocationModalOpen(true); // LocationModal 열기
  const closeLocationModal = () => setIsLocationModalOpen(false); // LocationModal 닫기



  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    closeLocationModal(); // 나라 선택 후 모달 닫기
  };

  const addPost = (title, content, tags) => {
    const now = new Date(); // 현재 날짜와 시간
    const newPost = { title, content, tags, comments: [], createdAt: now,}; // 새로운 게시글 추가
    setPosts((prev) => [...prev, newPost]);
  };

  const handleCommentIconClick = (index) => {
    setActivePostIndex(index === activePostIndex ? null : index); // 댓글 입력 대상 게시글 인덱스 설정
  };

  const onCommentSubmit = () => {
    if (commentText.trim()) {
      const updatedPosts = [...posts];
      const newComment = { text: commentText, profile: <CgProfile /> }; // 댓글 텍스트와 프로필 아이콘 포함
      updatedPosts[activePostIndex].comments.push(newComment); // 현재 게시글의 댓글 목록에 추가
      setPosts(updatedPosts); // 게시글 상태 업데이트
      setCommentText(""); // 댓글 입력 필드 초기화
    }
  };

  return (
    <>
      {/* 이미지 컨테이너 */}
      <ImageContainer
        imageUrl={tiwanImage}
        onClick={openLocationModal}
      />

      {/* Chip 버튼 */}
      <ChipButtons onOpenModal={openModal} />

      {/* 사용자 프로필 */}
      <ProfileContainer
        nickname={userProfile.nickname}
        travelDates={userProfile.travelDates}
        location={userProfile.location}
      />

      {/* 게시글 리스트 */}
      <PostComponents
        posts={posts}
        activePostIndex={activePostIndex}
        onCommentIconClick={handleCommentIconClick}
        commentText={commentText}
        setCommentText={setCommentText}
        onCommentSubmit={onCommentSubmit}
      />


      {/* 글작성 모달 */}
      <TalkModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={addPost}
      />

      {/* 지역 선택 모달 */}
      <TalkLocationModal
        isOpen={isLocationModalOpen}
        onClose={closeLocationModal}
        onSelect={handleLocationSelect}
      />
    </>
  );
};

export default Talk;
