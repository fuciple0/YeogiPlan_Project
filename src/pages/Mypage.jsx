// src/pages/Mypage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // useNavigate 가져오기
import styled from 'styled-components';
import { logoutUser } from '../store/userSlice';
import default_profile from '../assets/user_profile.png';
import ProfileEditModal from '../components/MyPage/ProfileEditModal';
import SharedTripStamps from '../components/Mypage/MyTripPlan';
import { FaEdit, FaSignOutAlt } from 'react-icons/fa'; // edit과 logout 아이콘



const Mypage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate 훅 초기화
  const userProfile = useSelector((state) => state.user.userInfo); // Redux store에서 프로필 가져오기
  const [isModalOpen, setIsModalOpen] = useState(false);

  // userProfile을 기반으로 초기 프로필 상태 설정
  const [profile, setProfile] = useState({
    image: userProfile?.profile_photo || default_profile,
    nickname: userProfile?.nickname || '익명',
    email: userProfile?.email || '이메일 없음',
  });

  const [activeTab, setActiveTab] = useState('travelLog'); // 기본 탭 상태 설정

  useEffect(() => {
    setProfile({
      image: userProfile?.profile_photo || default_profile,
      nickname: userProfile?.nickname || '익명',
      email: userProfile?.email || '이메일 없음',
    });
  }, [userProfile]);

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
        <ProfileDetails>
          <Nickname>{profile.nickname}</Nickname>
          <Email>{profile.email}</Email>
          <EditProfileButton onClick={openModal}>
            <FaEdit /> 프로필 수정 &gt;
          </EditProfileButton>
          <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt /> 로그아웃
          </LogoutButton>
        </ProfileDetails>
        <ProfileImageWrapper>
          <ProfileImage src={profile.image} alt="프로필 이미지" />
        </ProfileImageWrapper>
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
          <TravelLogContent>
            <SharedTripStamps></SharedTripStamps>

          </TravelLogContent>
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
  display: flex;
  justify-content: space-between; /* 좌우 배치 */
  align-items: center; /* 세로 가운데 정렬 */
  width: 100%;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column; /* 화면이 좁아지면 세로 정렬 */
    align-items: center; /* 가운데 정렬 */
  }
`;


const ProfileDetails = styled.div`
  margin-left: 20px; /* 왼쪽 여백 추가 */
  display: flex;
  flex-direction: column;
  gap: 1px; /* 각 요소 간의 일정한 간격을 제공 */
  width: 60%; /* 전체 폭에 맞게 */

  @media (max-width: 768px) {
    margin-left: 0; /* 세로 정렬 시 여백 제거 */
    width: 100%; /* 화면에 맞게 폭 조정 */
    text-align: center; /* 가운데 정렬 */
  }
`;

const ProfileImageWrapper = styled.div`
  width: 35%; /* 이미지 영역 크기 */
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  margin-right: 20px; /* 오른쪽 여백 추가 */

  @media (max-width: 768px) {
    justify-content: center; /* 세로 정렬 시 가운데 배치 */
    margin-right: 0; /* 여백 제거 */
    width: 100%; /* 폭 조정 */
  }
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff; /* 테두리 추가 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 */

  @media (max-width: 768px) {
    width: 120px; /* 작은 화면에서 크기 줄이기 */
    height: 120px;
  }

  @media (max-width: 480px) {
    width: 100px; /* 더 작은 화면에서는 더 줄이기 */
    height: 100px;
  }
`;

const Nickname = styled.p`
  font-size: 30px;  /* 적당한 크기 */
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const Email = styled.p`
  font-size: 16px;
  color: #888;
  margin: 0;
`;



const EditProfileButton = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #507dbc;
  cursor: pointer;
  display: flex; /* 아이콘과 텍스트를 가로로 정렬 */
  align-items: center; /* 세로 정렬 */
  transition: color 0.3s;

  & > svg {
    margin-right: 8px; /* 아이콘과 텍스트 사이 간격 */
  }

  &:hover {
    color: #3d6fa1;
  }
`;

const LogoutButton = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #507dbc;
  cursor: pointer;
  display: inline-flex; /* 텍스트처럼 왼쪽 정렬 */
  align-items: center;
  margin-top: 5px; /* 간격 줄이기 */

  & > svg {
    margin-right: 8px; /* 아이콘과 텍스트 사이 간격 */
  }

  &:hover {
    color: #3d6fa1;
  }
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
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

  &:hover {
    background-color: #e0e0e0;
  }
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