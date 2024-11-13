// src/components/ProfileContainer.jsx
import React from 'react';
import styled from 'styled-components';
import { CgProfile } from "react-icons/cg";

const ProfileContainerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const ProfileImage = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  border: 1px solid #d3d3d3;

  svg {
    font-size: 32px;
    color: #888;
  }
`;

const Nickname = styled.div`
  font-size: 15px;
  font-weight: bold;
  color: #333;
`;

const TravelInfo = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;

const ProfileContainer = ({ nickname, travelDates, location }) => (
  <ProfileContainerWrapper>
    <ProfileImage>
      <CgProfile />
    </ProfileImage>
    <div>
      <Nickname>{nickname}</Nickname>
      <TravelInfo>{`${travelDates} ${location}`}</TravelInfo>
    </div>
  </ProfileContainerWrapper>
);

export default ProfileContainer;
