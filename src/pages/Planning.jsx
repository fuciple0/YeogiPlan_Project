import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import styled from 'styled-components';
import InviteEmailModal from '../components/InviteEmailModal';
import AddPlacesModal from '../components/AddPlacesModal';
import { addPlace } from '../store/placeSlice';

const Planning = () => {
  const dispatch = useDispatch();
  
  // Redux에서 tripData와 selectedPlaces 가져오기
  const tripData = useSelector((state) => state.places.tripData);
  console.log("Planning 컴포넌트에서 불러온 tripData:", tripData);
  const selectedPlaces = useSelector((state) => state.places.selectedPlaces);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddPlacesModalOpen, setIsAddPlacesModalOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);

  // 여행 날짜 범위에 따른 DAY 배열 생성
  const generateDays = () => {
    if (!tripData.startDate || !tripData.endDate) return [];
    const start = dayjs(tripData.startDate);
    const end = dayjs(tripData.endDate);
    const days = [];

    for (let i = 0; start.add(i, 'day').isBefore(end) || start.add(i, 'day').isSame(end, 'day'); i++) {
      days.push(`DAY ${i + 1}`);
    }
    return days;
  };

  const days = generateDays();

  const handleInviteButtonClick = () => {
    setIsInviteModalOpen(true);
  };

  const handleInviteModalClose = () => {
    setIsInviteModalOpen(false);
  };

  const openAddPlacesModal = (dayIndex) => {
    setCurrentDay(dayIndex);
    setIsAddPlacesModalOpen(true);
  };

  const closeAddPlacesModal = () => {
    setIsAddPlacesModalOpen(false);
    setCurrentDay(null);
  };

  // 선택된 장소를 Redux와 데이터베이스에 저장하는 함수
  const handlePlaceAdd = async (newPlaces) => {
    const { trip_plan_id } = tripData; // 수정된 부분
    
    if (!trip_plan_id) {
        console.error("trip_plan_id가 정의되지 않았습니다.");
        return;
    }

    // Redux에 장소 추가
    newPlaces.forEach((place) => {
      dispatch(addPlace({ dayIndex: currentDay, newPlace: place }));
    });

    await Promise.all(
      newPlaces.map(async (place) => {
        try {
          const response = await fetch(`http://15.164.142.129:3001/api/trip_plan/${trip_plan_id}/detail`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              trip_day: currentDay + 1,
              place_name: place.place_name,
              place_location_x: place.place_location_x,
              place_location_y: place.place_location_y,
              place_id: place.place_id,
              memo: place.memo || "",
              memo_type: place.memo_type || "love",
            }),
          });

          if (response.ok) {
            console.log("장소 추가 성공:", place);
          } else {
            console.error("장소 추가 실패:", response.statusText);
          }
        } catch (error) {
          console.error("장소 추가 오류:", error);
        }
      })
    );

    closeAddPlacesModal();
  };

  // 데이터 로딩 상태 표시
  if (!tripData || !tripData.tripTitle || selectedPlaces.length === 0) {
    return <p>데이터를 불러오는 중...</p>;
  }  

  return (
    <Container>
      <TripInfo>
        <TripTitle>{tripData.tripTitle || '여행 제목'}</TripTitle>
        <TripDestination>{tripData.destination || '목적지 정보 없음'}</TripDestination>
        <TripDates>
          {dayjs(tripData.startDate).format('YYYY.MM.DD')} - {dayjs(tripData.endDate).format('MM.DD')}
        </TripDates>
        <InviteContainer>
          <InviteButton onClick={handleInviteButtonClick}>+ 일행초대</InviteButton>
        </InviteContainer>
      </TripInfo>

      {/* 각 DAY별 일정 목록 */}
      {days.map((day, dayIndex) => (
        <div key={dayIndex}>
          <h1>{day}</h1>
          <PlaceList>
            {(Array.isArray(selectedPlaces[dayIndex]) ? selectedPlaces[dayIndex] : []).map((place, index) => (
              <PlaceItem key={place.place_id}>
                <OrderNumber>{index + 1}</OrderNumber>
                <PlaceContent>
                  <PlaceTitle>{place.place_name} <EditIcon>✏️</EditIcon></PlaceTitle>
                </PlaceContent>
              </PlaceItem>
            ))}
          </PlaceList>
          <AddPlaceButton onClick={() => openAddPlacesModal(dayIndex)}>+ 장소 추가</AddPlaceButton>
        </div>
      ))}

      {isInviteModalOpen && (
        <InviteEmailModal open={isInviteModalOpen} onClose={handleInviteModalClose} />
      )}

      {isAddPlacesModalOpen && (
        <AddPlacesModal 
          isOpen={isAddPlacesModalOpen} 
          onClose={closeAddPlacesModal} 
          onConfirm={handlePlaceAdd} 
        />
      )}
    </Container>
  );
};

export default Planning;

// 스타일 컴포넌트는 그대로 유지
const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const TripInfo = styled.div`
  text-align: left;
  margin-bottom: 20px;
`;

const TripTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin: 0;
`;

const TripDestination = styled.div`
  font-size: 18px;
  color: #777;
  margin-top: 4px;
`;

const TripDates = styled.div`
  font-size: 16px;
  color: #555;
  margin-top: 8px;
`;

const InviteContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
`;

const InviteButton = styled.button`
  background-color: #507dbc;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #3f5f8a;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const AddPlaceButton = styled.button`
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #507dbc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3f5f8a;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const PlaceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PlaceItem = styled.div`
  display: flex;
  width: 300px;
  align-items: center;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const OrderNumber = styled.div`
  width: 24px;
  height: 24px;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  position: absolute;
  left: -40px;
`;

const PlaceContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
`;

const PlaceTitle = styled.div`
  font-weight: bold;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EditIcon = styled.span`
  font-size: 14px;
  color: #aaa;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;