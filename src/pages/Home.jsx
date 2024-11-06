import React, { useState } from 'react';
import styled from 'styled-components';
import DestinationCard from '../components/DestinationCard';
import ReviewCard from '../components/RecommendPlaceCard';
import SearchBar from '../components/SearchBar';
import MainCarousel from '../components/MainCarousel';
import SearchModal from '../components/SearchModal';
import BestCardSlider from '../components/\bBestCardSlider';

// 이미지 import
import jejuImage from '../assets/home_img/jeju.png';
import seoulImage from '../assets/home_img/seoul.png';
import gyeongjuImage from '../assets/home_img/gyeongju.png';
import busanImage from '../assets/home_img/busan.png';
import incheonImage from '../assets/home_img/incheon.png';
import taipeiImage from '../assets/home_img/taipei.png';
import danangImage from '../assets/home_img/danang.png';
import tokyoImage from '../assets/home_img/tokyo.png';
import parisImage from '../assets/home_img/paris.png';
import spainImage from '../assets/home_img/spain.png';
import incheonAirport from '../assets/home_img/airport.jpg'
import hanlasan from '../assets/home_img/hanla.jpg'
import waterfall from '../assets/home_img/waterfall.jpg'
import chumsungdae from '../assets/home_img/tower.jpg'
import RecommendPlaceCard from '../components/RecommendPlaceCard';


const popularDestinations = [
  { name: '제주도', imageUrl: jejuImage },
  { name: '서울', imageUrl: seoulImage },
  { name: '경주', imageUrl: gyeongjuImage },
  { name: '부산', imageUrl: busanImage },
  { name: '인천', imageUrl: incheonImage },
  { name: '타이베이', imageUrl: taipeiImage },
  { name: '다낭', imageUrl: danangImage },
  { name: '도쿄', imageUrl: tokyoImage },
  { name: '파리', imageUrl: parisImage },
  { name: '스페인', imageUrl: spainImage },
];

const howAboutThis = [
  { name: '천지연폭포', imageUrl: waterfall, location: '제주 서귀포시'},
  { name: '인천공항', imageUrl: incheonAirport, location: '인천광역시' },
  { name: '한라산', imageUrl: hanlasan, location: '제주 서귀포시'},
  { name: '첨성대', imageUrl: chumsungdae, location: '경북 경주시' },
  { name: '천지연폭포', imageUrl: waterfall, location: '제주 서귀포시'},
];

const Home = () => {

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSearchBarClick = () => {
    setIsModalOpen(true)  // 모달 열기
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)  // 모달 닫기
  }

  return (
    <Container>
      <Section>
        <Slogan>여행을 꿈꾸는 순간,</Slogan>
        <SearchBar onClick={handleSearchBarClick} isReadOnly={true}/>
        <MainCarousel images={popularDestinations} />
      </Section>

      <SearchModal isOpen={isModalOpen} onClose={handleCloseModal}/>
      
      <Section>
        <Title>지금 뜨고 있는 여행지 🔥</Title>
        <Subtitle>BEST 10</Subtitle>
        <BestCardSlider items={popularDestinations} />
        {/* <Grid>
          {popularDestinations.map((destination, index) => (
            <DestinationCard
              key={index}
              name={destination.name}
              imageUrl={destination.imageUrl}
            />
          ))}
        </Grid> */}
      </Section>

      <Section>
        <SectionTitle>이런 곳은 어때요?</SectionTitle>
        <RecommendGrid>
          {howAboutThis.map((place, index) => (
            <RecommendPlaceCard key={index} imageUrl={howAboutThis.imageUrl} name={howAboutThis.name} location={howAboutThis.location} />
          ))}
        </RecommendGrid>
        
        {/* <ReviewGrid>
          {howAboutThis.map((review, index) => (
            <ReviewCard key={index} name={review.name} imageUrl={review.imageUrl} />
          ))}
        </ReviewGrid> */}
      </Section>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
`

const Section = styled.section`
  margin-bottom: 40px;
`

const Slogan = styled.h1`
  font-family: 'Paperlogy-8ExtraBold','Spoqa Han Sans', sans-serif;
  font-size: 32px;
  color: #507DBC;
`

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
`

const Subtitle = styled.p`
  font-size: 18px;
`

const RecommendGrid = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
`

// const Grid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(5, 1fr);
//   gap: 15px;

//   @media (max-width: 1200px) {
//     grid-template-columns: repeat(4, 1fr);
//   }

//   @media (max-width: 992px) {
//     grid-template-columns: repeat(3, 1fr);
//   }

//   @media (max-width: 768px) {
//     grid-template-columns: repeat(2, 1fr);
//   }

//   @media (max-width: 576px) {
//     grid-template-columns: repeat(2, 1fr);
//   }
// `;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
`

const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
