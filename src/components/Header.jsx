import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.primaryColor || '#333'};
  padding: 10px 0;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 0 15px;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.linkColor || 'white'};
  text-decoration: none;
  font-size: 18px;

  &:hover {
    text-decoration: underline;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
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
    </HeaderContainer>
  );
};

export default Header;
