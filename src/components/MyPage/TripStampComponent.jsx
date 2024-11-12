import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// 스타일 정의
const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const TripDay = styled.div`
  margin-bottom: 20px;
`;

const DayTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
`;

const PlaceCard = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
`;

const PlaceName = styled.p`
  font-weight: bold;
  color: #333;
`;

const PlaceAddress = styled.p`
  color: #555;
  font-size: 0.9rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #777;
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  font-size: 1.2rem;
`;

const SharedTripStamps = () => {
  const [tripDetails, setTripDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = '1'; // 예시 사용자 ID

  const fetchTripDetails = async () => {
    try {
      const response = await fetch(`http://15.164.142.129:3001/api/user/${userId}/trip_plan`);

      if (!response.ok) {
        throw new Error('여행 기록 조회 중 오류가 발생했습니다.');
      }

      const data = await response.json();

      // 응답에서 성공적인 데이터 확인
      if (data.success && Array.isArray(data.data)) {
        const sortedTripDetails = data.data
          .map((trip) => {
            // 여행 상세 데이터를 처리하며 start_date를 날짜 객체로 변환
            trip.details = trip.details.map((detail) => ({
              ...detail,
              start_date: new Date(trip.start_date), // start_date를 정확히 처리하는 부분
            }));
            return trip;
          })
          .sort((a, b) => b.start_date - a.start_date) // 최신 일정부터 정렬
          .slice(0, 5); // 최신 5개만 가져오기

        setTripDetails(sortedTripDetails);
      } else {
        throw new Error('잘못된 데이터 형식입니다.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, []);

  if (isLoading) {
    return <LoadingMessage>로딩 중...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{`에러: ${error}`}</ErrorMessage>;
  }

  if (!Array.isArray(tripDetails)) {
    return <ErrorMessage>잘못된 데이터 형식입니다.</ErrorMessage>;
  }

  // tripDetails의 각 여행을 날짜별로 그룹화
  const groupedTripDetails = tripDetails.reduce((acc, trip) => {
    trip.details.forEach((place) => {
      const day = place.trip_day || '기타'; // trip_day가 없을 경우 기타로 처리
      if (!acc[day]) acc[day] = [];
      acc[day].push(place);
    });
    return acc;
  }, {});

  return (
    <Container>
      {Object.entries(groupedTripDetails).map(([day, places]) => (
        <TripDay key={day}>
          <DayTitle>Day {day}</DayTitle>
          {places.map((place, index) => (
            <PlaceCard key={index}>
              <PlaceName>{place.name}</PlaceName>
              <PlaceAddress>{place.address}</PlaceAddress>
            </PlaceCard>
          ))}
        </TripDay>
      ))}
    </Container>
  );
};

export default SharedTripStamps;