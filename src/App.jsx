// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Planning from './pages/Planning';
import Talk from './pages/Talk';
import Mypage from './pages/Mypage';
import SingUp from './pages/SingUp';
import Login from './pages/Login'; // Login 컴포넌트 import
import { useDispatch } from 'react-redux';
import { setUser } from './store/userSlice';


// AppContainer: 페이지 전체를 감싸는 컨테이너로, 화면 높이를 채우기 위해 min-height를 설정합니다.
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: gray;
  max-width: 1200px;
  margin: auto;
`;

// MainContent: 본문 콘텐츠 영역으로, flex: 1을 사용하여 공간을 차지하게 하고, 푸터는 하단에 고정됩니다.
const MainContent = styled.main`
  background-color: white;
  flex: 1;
  padding: 10px;
`;

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
    if (userData) {
      dispatch(setUser(userData));
    }
  }, [dispatch]);


  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AppContainer>
          <Header />
          <MainContent>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/talk" element={<Talk />} />
              <Route path="/mypage" element={<Mypage />} />
              <Route path="/signup" element={<SingUp />} />
              <Route path="/login" element={<Login />} /> {/* 로그인 페이지 라우터 추가 */}
            </Routes>
          </MainContent>
          <Footer />
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
};

export default App;
