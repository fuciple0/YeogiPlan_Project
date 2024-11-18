import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import logo from '../../assets/logo_img/logo.png';
import { loadUser, logoutUser } from '../../store/userSlice';

const HeaderContainer = styled.header`
  background-color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  height: 110px;
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
  cursor: pointer;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  align-items: center; /* 자식 요소를 수직 중앙 정렬 */
  /* justify-content: center; */
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    display: ${(props) => (props.isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 70px;
    right: 20px;
    background-color: white;
    border: 1px solid #e0e0e0;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
`;

const NavItem = styled.li`
  margin: 0 15px;
  @media (max-width: 768px) {
    margin: 10px 0;
  }
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
  display: flex;
  align-items: center; /* 자식 요소를 수직 중앙 정렬 */
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

const LogoutButton = styled.button`
  color: black;
  font-size: 18px;
  border: 1px solid black;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;


const HamburgerMenu = styled.div`
  font-size: 24px;
  color: black;
  cursor: pointer;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  const { isLoggedIn, userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 햄버거 메뉴 클릭 시 메뉴 열기/닫기
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


// 컴포넌트가 처음 로드될 때 세션/로컬 스토리지에서 로그인 정보 불러오기
  useEffect(() => {
  dispatch(loadUser());
}, [dispatch]);


  // 프로필 이미지 클릭 시 마이페이지로 이동
  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/mypage');
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    // Redux 상태 초기화 및 로컬/세션 스토리지에서 로그인 정보 삭제
    dispatch(logoutUser());
    navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
  };

  return (
    <HeaderContainer>
      <LogoSection>
        <Link to="/">
          <Logo src={logo} alt="logo" />
        </Link>
      </LogoSection>
      
      <nav>
        <NavList isOpen={isMenuOpen}>
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
              <>
                <ProfileImage
                  src={userInfo.profile_photo || '/default-profile.png'}
                  alt="Profile"
                  onClick={handleProfileClick} // 클릭 시 마이페이지로 이동
                />
                {/* <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton> */}
              </>
            ) : (
              <LoginButton to="/login">로그인</LoginButton>
            )}
          </NavItem>
        </NavList>
      </nav>

      {/* 로그인 상태에 따른 표시 */}
      
      {/* 햄버거 메뉴 버튼 */}
      <HamburgerMenu onClick={toggleMenu}>
        ☰
      </HamburgerMenu>
    </HeaderContainer>
  );
};

export default Header;
