import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/logo.png';

const HeaderContainer = styled.header`
  //background-color: blue;
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
  max-width: 150px; /* 로고가 너무 커지지 않도록 최대 너비 설정 */
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
    display: none; /* 모바일에서는 숨김 */
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

const HamburgerMenu = styled.div`
  font-size: 24px;
  color: black;
  cursor: pointer;

  @media (min-width: 768px) {
    display: none; /* 데스크탑에서는 숨김 */
  }
`;

const Header = () => {
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
            <NavLink to="/mypage">마이페이지</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/place">장소</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/list">리스트</NavLink>
          </NavItem>
        </NavList>
      </nav>

      <HamburgerMenu>☰</HamburgerMenu>
    </HeaderContainer>
  );
};

export default Header;
