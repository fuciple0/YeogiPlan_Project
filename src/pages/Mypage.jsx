// src/pages/Mypage.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // useNavigate 가져오기
import styled from 'styled-components';
import { logoutUser } from '../store/userSlice';
import default_profile from '../assets/user_profile.png';
import ProfileEditModal from '../components/ProfileEditModal';

const Mypage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate 훅 초기화
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    image: default_profile,
    nickname: '익명',
  });

  const [activeTab, setActiveTab] = useState('travelLog'); // 기본 탭 상태 설정

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const saveProfile = ({ profileImage, nickname }) => {
    setProfile({
      image: profileImage,
      nickname,
    });
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/'); // 홈 경로로 이동
  };



  return (
    <MypageContainer>
      <ProfileSection>
        <ProfileImage src={profile.image} alt="프로필 이미지" />
        <Nickname>{profile.nickname}</Nickname>
        <EditProfileButton onClick={openModal}>프로필 수정</EditProfileButton>
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton> {/* 로그아웃 버튼 추가 */}
      </ProfileSection>

      <Tabs>
        <Tab isActive={activeTab === 'travelLog'} onClick={() => setActiveTab('travelLog')}>
          <TabLabel>나의 여행기록</TabLabel>
        </Tab>
        <Tab isActive={activeTab === 'review'} onClick={() => setActiveTab('review')}>
          <TabLabel>내 리뷰 관리</TabLabel>
        </Tab>
      </Tabs>

      <Content>
        {activeTab === 'travelLog' ? (
          <TravelLogContent>여행 기록을 보여줄 영역입니다.</TravelLogContent>
        ) : (
          <ReviewContent>작성한 리뷰를 보여줄 영역입니다.</ReviewContent>
        )}
      </Content>

      <ProfileEditModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={saveProfile} 
        initialProfileImage={profile.image}
        initialNickname={profile.nickname} 
      />
    </MypageContainer>
  );
};

export default Mypage;

// 스타일 정의
const MypageContainer = styled.div`
  padding: 20px;
  width: 80%;
  margin: 0 auto;
`;

const ProfileSection = styled.div`
  text-align: center;
  position: relative;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 64px;
`;

const Nickname = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const EditProfileButton = styled.button`
  position: absolute;
  font-size: 14px;
  top: 0;
  right: 0;
  color: #507DBC;
  background: none;
  border: 1px solid #507DBC;
  border-radius: 20px;
  padding: 8px 15px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #507DBC;
    color: white;
    font-weight: bold;
  }
`;

const LogoutButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 14px;
  color: #507DBC;
  border: 1px solid #507DBC;
  border-radius: 20px;
  background: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #507DBC;
    color: white;
    font-weight: bold;
  }
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
  border-top: 1px solid #f0f0f0;
`;

const Tab = styled.button`
  flex: 1;
  padding: 15px 0;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background-color: ${({ isActive }) => (isActive ? 'transparent' : '#f0f0f0')};
  border-bottom: ${({ isActive }) => (isActive ? 'none' : '.3px solid #ddd')};
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
  color: ${({ isActive }) => (isActive ? '#333' : '#8d8d8d')};

  ${({ isActive }) =>
    !isActive &&
    `
      &:hover {
        background-color: #e0e0e0;
      }
    `}
`;

const TabLabel = styled.span`
  margin-right: 5px;
`;

const Content = styled.div`
  margin-top: 20px;
`;

const TravelLogContent = styled.div`
  /* 여행 기록 콘텐츠 스타일 */
`;

const ReviewContent = styled.div`
  /* 리뷰 관리 콘텐츠 스타일 */
`;
