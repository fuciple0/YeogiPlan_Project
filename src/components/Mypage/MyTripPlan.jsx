// SharedTripStamps.js
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ModalForMyTrip from './ModalForMyTrip';

const formatDate = (dateString) => {
    return dateString.split('T')[0]; // '2024-11-12T15:00:00.000Z' -> '2024-11-12'
};

const SharedTripStamps = () => {
    const [tripPlans, setTripPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTripPlans = async () => {
        try {
            const response = await fetch(`http://15.164.142.129:3001/api/user/1/shared_trip_plans`);
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
        fetchTripPlans();
    }, []);



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
                <div key={tripPlan.trip_plan_id}>
                    <Title>{tripPlan.trip_plan_title}</Title>
                    <p>{formatDate(tripPlan.start_date)} ~ {formatDate(tripPlan.end_date)}</p>
                    <ScrollContainer>
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
                </div>
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
  position: relative;
`;

const StampContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding: 0.5rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
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
  animation: ${stampAppear} 0.3s ease-out;
`;

const StampContent = styled.div`
  width: 8rem;
  height: 8rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  transition: transform 0.2s;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

const CertifiedBackground = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.1;
  pointer-events: none;
  transform: rotate(-20deg);
  font-size: 1.5rem;
  font-weight: bold;
  color: #666;
`;

const StampBorder = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  border: 4px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
`;

const PlaceName = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  word-break: keep-all;
  line-height: 1.2;
  max-width: 5rem;
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
