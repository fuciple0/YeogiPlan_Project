// SharedTripStamps.js
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import ModalForMyTrip from './ModalForMyTrip';
import { useSelector } from 'react-redux';

const formatDate = (dateString) => {
  return dateString.split('T')[0]; // '2024-11-12T15:00:00.000Z' -> '2024-11-12'
};

const SharedTripStamps = () => {
  const [tripPlans, setTripPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userId } = useSelector((state) => state.user.userInfo);
  const token = useSelector((state) => state.user.token);


  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startX.current = e.clientX;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const distance = e.clientX - startX.current;
    containerRef.current.scrollLeft = scrollLeft.current - distance;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const fetchTripPlans = async () => {
    if (!userId || !token) {
      setError('Authentication required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://15.164.142.129:3001/api/user/${userId}/shared_trip_plans`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching trip plans');
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setTripPlans(data.data);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchTripPlans();
    }
  }, [userId, token]);

  const handleStampClick = (place) => {
    // place_name을 place.name으로 변경하거나 새로운 key로 설정
    const updatedPlace = {
      ...place,
      name: place.place_name // place_name을 name으로 설정

    };
    console.log('Selected Place in SharedTripStamps:', updatedPlace); // 콘솔 로그 추가

    setSelectedPlace(updatedPlace);  // 모달에 전달할 place 객체
    setIsModalOpen(true); // 모달 열기

  };


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlace(null);
  };

  if (isLoading) {
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{`Error: ${error}`}</ErrorMessage>;
  }


  return (
    <Container>
      {tripPlans.map((tripPlan) => (
        <TripPlanCard key={tripPlan.trip_plan_id}>
          <CardTitle>{tripPlan.trip_plan_title}</CardTitle>
          <Carddate>{formatDate(tripPlan.start_date)} ~ {formatDate(tripPlan.end_date)}</Carddate>
          <ScrollContainer
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <StampContainer>
              {tripPlan.details.map((detail, index) => (
                <StampItem key={index}>
                  <StampContent onClick={() => handleStampClick(detail)}>
                    <CertifiedBackground>Certified</CertifiedBackground>
                    <StampBorder>
                      <PlaceName>{detail.place_name}</PlaceName>
                    </StampBorder>
                  </StampContent>
                </StampItem>
              ))}
            </StampContainer>
          </ScrollContainer>
        </TripPlanCard>
      ))}
      <ModalForMyTrip
        isOpen={isModalOpen}
        onClose={closeModal}
        place={selectedPlace}
      />
    </Container>
  );
};

export default SharedTripStamps;

const stampAppear = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8) rotate(-10deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
`;

const ScrollContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none; /* 스크롤바 숨기기 */
  }
`;

const StampContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
`;



const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;

  ${props => props.$direction === 'left' ? 'left: 0;' : 'right: 0;'}

  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`;

const StampItem = styled.div`
  flex-shrink: 0;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.05); /* 아이템 hover 시 크기 변화 */
  }
`;
const StampContent = styled.div`
  width: 8rem;
  height: 8rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 10%;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

const CertifiedBackground = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.2;
  pointer-events: none;
  transform: rotate(-25deg);
  font-size: 2rem;
  font-weight: bold;
  color: #777;  /* 기본 텍스트 색상 */

  /* 텍스트에 테두리 효과 추가 */
  -webkit-text-stroke: 1px #ffffff;  /* 테두리 색상 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);  /* 테두리의 뚜렷한 느낌을 위해 그림자 추가 */

  /* 색 반전 효과 */
  filter: invert(1);  /* 색상 반전 (모든 색상 반전) */
`;

const StampBorder = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  border: 2px solid #ccc;
  border-radius: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
`;

const PlaceName = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c5c9d ;
  text-align: center;
  word-break: keep-all;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ff6b6b;
`;


const TripPlanCard = styled.div`
  background: linear-gradient(135deg, #2c5c9d, #8ebfd7, #4a6b9a); /* 3가지 색상 그라디언트 */
  border-radius: 20px; /* 둥근 모서리 */
box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 */
padding: 20px 30px;
margin: 20px auto;
width: 100%;
max-width: 900px;
transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease; /* 애니메이션 추가 */

&:hover {
  transform: translateY(-10px); /* hover 시 카드가 살짝 떠오르는 효과 */
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2); /* hover 시 그림자 강조 */
  background: linear-gradient(135deg, #8ebfd7, #4a6b9a, #2c5c9d); /* hover 시 그라디언트 방향 변경 */
}

&:active {
  transform: scale(0.98); /* 클릭 시 살짝 작아지는 효과 */
}
`;

const Carddate = styled.p`
  font-size: 1.2rem;
  color: #b0c6d1;
  margin-bottom: 15px;
  font-weight: bold;
`;

const CardTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color:  #ffffff  ;
  margin-bottom: 10px;
`;