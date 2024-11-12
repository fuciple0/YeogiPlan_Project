import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import SearchBar from '../components/SearchBar';
import MainCarousel from '../components/MainCarousel';
import SearchModal from '../components/SearchModal';
import BestCardSlider from '../components/BestCardSlider';
import RecommendPlaceCard from '../components/RecommendPlaceCard';
import DetailPlaceInfoModal from '../components/DetailPlaceInfoModal';
import Planning from './Planning';
import { addTripData } from '../store/placeSlice'; // Redux 액션 임포트

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
import incheonAirport from '../assets/home_img/airport.jpg';
import hanlasan from '../assets/home_img/hanla.jpg';
import waterfall from '../assets/home_img/waterfall.jpg';
import chumsungdae from '../assets/home_img/tower.jpg';
import { useNavigate } from 'react-router-dom';

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

  { name: '천지연폭포', imageUrl: waterfall, location: '제주 서귀포시' },
  { name: '인천공항', imageUrl: incheonAirport, location: '인천광역시 중구' },
  { name: '한라산', imageUrl: hanlasan, location: '제주 서귀포시' },
  { name: '첨성대', imageUrl: chumsungdae, location: '경북 경주시' },
];

const Home = () => {
  const navigate = useNavigate(); // navigate 함수 사용
  const dispatch = useDispatch();
  const tripData = useSelector((state) => state.places.tripData);
  const selectedPlaces = useSelector((state) => state.places.selectedPlaces);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const handleSearchModalConfirm = (data) => {
    dispatch(addTripData({ tripData: data.tripData, places: data.places }));
    closeSearchModal();
    navigate("/planning"); // Planning 페이지로 이동
  };

  const openDetailModal = (place) => {
    setSelectedPlace(place);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPlace(null);
  };

  return (
    <Container>
      <Section>
        <Slogan>여행을 꿈꾸는 순간,</Slogan>
        <SearchBar onClick={openSearchModal} isReadOnly={true} />
        <MainCarousel images={popularDestinations} />
      </Section>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        onConfirm={handleSearchModalConfirm}
      />

      {/* {tripData && selectedPlaces.length > 0 && (
        <Planning tripData={tripData} initialPlaces={selectedPlaces} /> // Redux에서 데이터 전달
      )} */}

      <Section>
        <Title>지금 뜨고 있는 여행지 🔥</Title>
        <Subtitle>BEST 10</Subtitle>
        <BestCardSlider items={popularDestinations} />
      </Section>

      <Section>
        <Title>이런 곳은 어때요?</Title>
        <RecommendGrid>
          {howAboutThis.map((place, index) => (
            <RecommendPlaceCard
              key={index}
              imageUrl={place.imageUrl}
              name={place.name}
              location={place.location}
              onImageClick={() => openDetailModal(place)}
            />
          ))}
        </RecommendGrid>
      </Section>

      {isDetailModalOpen && selectedPlace && (
        <DetailPlaceInfoModal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          place={selectedPlace}
        />
      )}
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
  font-family: 'Paperlogy-8ExtraBold', 'Spoqa Han Sans', sans-serif;
  font-size: 32px;
  color: #507dbc;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
`;

const Subtitle = styled.h3`
  font-size: 18px;
`;

const RecommendGrid = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
`;