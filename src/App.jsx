// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Planning from './pages/Planning';
import Talk from './pages/Talk';
import Mypage from './pages/Mypage';
import Place from './pages/Place';
import List from './pages/List';


const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/talk" element={<Talk />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/place" element={<Place />} />
          <Route path="/list" element={<List />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
