import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import RecommendPlaceCard from './RecommendPlaceCard';
import RecommendList from './RecommendList'; // RecomendList 컴포넌트를 가져옴



//베스트 도시 수정하려면 더미데이터로 가세요
//이름과 사진은 더미데이터로 불러옵니다.


const BestCardDetailRecommend = ({ item, onClose }) => {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        // 1. 키워드 검색으로 장소 정보를 가져옵니다
        const keywordResponse = await fetch(`http://43.201.36.203:3001/googleApi/keywordSearch?searchTerm=${item.name}`);
        const keywordData = await keywordResponse.json();

        if (keywordData.places && keywordData.places[0]) {
          const place = keywordData.places[0];
          setDescription(place.description || '정보를 가져올 수 없습니다.');

          // 2. 동일한 장소명으로 주변 검색을 수행합니다
          const nearbyResponse = await fetch(
            `http://43.201.36.203:3001/googleApi/nearbySearch?searchTerm=${item.name}`
          );
          const data = await nearbyResponse.json();

          if (data && data.nearbyPlaces && Array.isArray(data.nearbyPlaces)) {
            // 현재 장소를 제외한 다른 장소들만 필터링
            const filteredPlaces = data.nearbyPlaces.filter(p => p.name !== item.name);
            setPlaces(filteredPlaces);
          }
        }
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
        setDescription('정보를 가져올 수 없습니다.');
        setPlaces([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDescription();
  }, [item]);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <BestCard>
          <Image src={item.imageUrl} alt={item.name} />
          <Title>{item.name}</Title>
          <Description>{description}</Description>
        </BestCard>
        <RecommendTitle>추천장소</RecommendTitle>
        <div>다른 컴포넌트 붙일예정</div>
        {isLoading ? (
          <LoadingText>추천 장소를 불러오는 중...</LoadingText>
        ) : (
          <RecommendList places={places} />
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

const LoadingText = styled.p`
  text-align: center;
  color: #666;
  padding: 20px;
`;

export default BestCardDetailRecommend;

// 스타일링 컴포넌트
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 80%; /* 화면 너비의 90%로 설정 */
  max-width: 1100px; /* 최대 너비를 800px로 설정 */
  height: 80%;
  min-height: 500px; /* 최소 높이를 500px로 설정 */
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  overflow-y: auto; /* 스크롤 활성화 */
`;

const Image = styled.img`
  aspect-ratio: 2.23;
  object-fit: cover;
  width: 100%;
  border-radius: 2px;
`;

const Title = styled.h1`
  font-family: Spoqa Han Sans Neo, sans-serif;
  font-weight: 500;
  font-size: 24px;
  margin-top: 15px;
  margin-left: 15px;
  font-weight: bold;
`;

const Description = styled.section`
  font-family: Paperlogy, sans-serif;
  color: #333;
  margin: 15px;
  font-size: 16px;
  line-height: 1.6;
`;

const RecommendTitle = styled.h1`
  font-family: Spoqa Han Sans Neo, sans-serif;
  font-weight: 500;
  font-size: 24px;
  margin: 35px;
  font-weight: bold;
`;

const BestCard = styled.section`
  border: 1px solid #ddd; /* 카드 테두리 */
  border-radius: 2px; /* 둥근 모서리 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  overflow: hidden;
  width: 100%; /* 카드의 기본 너비 */
  max-width: 100%; /* 최대 너비 설정 */
  background-color: #fff; /* 카드 배경색 */
`;