import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import logo from '../assets/logo.png';

const HeaderContainer = styled.header`
  background-color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  width: 100%;
  max-width: 150px;
  height: auto;
  margin-right: 10px;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.li`
  margin: 0 15px;
`;

const NavLink = styled(Link)`
  color: black;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    text-decoration: underline;
  }
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
`;

const LoginButton = styled(Link)`
  color: black;
  text-decoration: none;
  font-size: 18px;
  border: 1px solid black;
  padding: 5px 10px;
  border-radius: 5px;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const HamburgerMenu = styled.div`
  font-size: 24px;
  color: black;
  cursor: pointer;

  @media (min-width: 768px) {
    display: none;
  }
`;

const Header = () => {
  const { isLoggedIn, userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // 프로필 이미지 클릭 시 마이페이지로 이동
  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/mypage');
    }
  };

  return (
    <HeaderContainer>
      <LogoSection>
        <Logo src={logo} alt="logo" />
      </LogoSection>
      
      <nav>
        <NavList>
          <NavItem>
            <NavLink to="/">홈</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/planning">플래닝</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/talk">토크</NavLink>
          </NavItem>

          <NavItem>
   
          {isLoggedIn ? (
        <ProfileImage
          src={userInfo.profile_photo || '/default-profile.png'}
          alt="Profile"
          onClick={handleProfileClick} // 클릭 시 마이페이지로 이동
        />
      ) : (
        <LoginButton to="/login">로그인</LoginButton>
      )}


   
          </NavItem>


        </NavList>
      </nav>

      {/* 로그인 상태에 따른 표시 */}
      
      <HamburgerMenu>☰</HamburgerMenu>
    </HeaderContainer>
  );
};

export default Header;
