import React from 'react';
import styled from 'styled-components';
import DestinationCard from '../components/DestinationCard';
import ReviewCard from '../components/ReviewCard';
import SearchBar from '../components/SearchBar';

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
import MainCarousel from '../components/MainCarousel';


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

const bestReviews = [
  { name: '제주', imageUrl: jejuImage },
  { name: '서울', imageUrl: seoulImage },
  { name: '부산', imageUrl: busanImage },
  { name: '경주', imageUrl: gyeongjuImage },
  { name: '오사카', imageUrl: tokyoImage },
  { name: '다낭', imageUrl: danangImage },
];

const Home = () => {
  return (
    <Container>
      <Section>
        <Slogan>여행을 꿈꾸는 순간,</Slogan>
        <SearchBar />
        <MainCarousel images={popularDestinations} />
      </Section>
      <Section>
        <Title>인기급상승🔥</Title>
        <Subtitle>여행지 BEST 10</Subtitle>
        <Grid>
          {popularDestinations.map((destination, index) => (
            <DestinationCard
              key={index}
              name={destination.name}
              imageUrl={destination.imageUrl}
            />
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionTitle>베스트 리뷰</SectionTitle>
        <ReviewGrid>
          {bestReviews.map((review, index) => (
            <ReviewCard key={index} name={review.name} imageUrl={review.imageUrl} />
          ))}
        </ReviewGrid>
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
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const Slogan = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #507DBC;
`

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
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

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

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
