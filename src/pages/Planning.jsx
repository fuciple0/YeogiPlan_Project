import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import styled from 'styled-components';
import InviteEmailModal from '../components/InviteEmailModal';
import AddPlacesModal from '../components/AddPlacesModal';
import { updateTripData, addPlace } from '../store/placeSlice';
import EditTripModal from '../components/Planning/EditTripModal';
import MapComponent from '../components/Planning/MapComponent';
import { LoadScript } from '@react-google-maps/api'; // LoadScript를 import

const Planning = () => {
  const dispatch = useDispatch();

  const tripData = useSelector((state) => state.places.tripData);
  const selectedPlaces = useSelector((state) => state.places.selectedPlaces || []);
  const userId = useSelector((state) => state.user.userInfo.userId);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddPlacesModalOpen, setIsAddPlacesModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);

  useEffect(() => {
    // Redux 상태 출력 (디버깅용)
    if (selectedPlaces.length > 0) {
      console.log("Redux 상태 - selectedPlaces 확인:");
      selectedPlaces.forEach((dayPlaces, dayIndex) => {
        console.log(`Day ${dayIndex + 1}:`);
        dayPlaces?.forEach((place, placeIndex) => {
          console.log(`  장소 ${placeIndex + 1} - trip_plan_detail_id:`, place.trip_plan_detail_id);
          console.log(`  장소 정보:`, place);
        });
      });
    } else {
      console.log("selectedPlaces가 비어 있거나 정의되지 않았습니다.");
    }
  }, [selectedPlaces]);

  const handleInviteButtonClick = () => setIsInviteModalOpen(true);
  const handleInviteModalClose = () => setIsInviteModalOpen(false);
  const openAddPlacesModal = (dayIndex) => { setCurrentDay(dayIndex); setIsAddPlacesModalOpen(true); };
  const closeAddPlacesModal = () => { setIsAddPlacesModalOpen(false); setCurrentDay(null); };

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

 // 여행 제목, 시작 날짜, 종료 날짜 수정 핸들러
 const handleTripUpdate = async (updatedData) => {

  // 필수 필드들을 포함하여 서버가 요구하는 형식에 맞춰 업데이트
  const dataToUpdate = {
    trip_plan_title: updatedData.tripTitle,
    start_date: updatedData.startDate,
    end_date: updatedData.endDate,
    destination: tripData.destination || "",  // 기존 destination 사용
    route_shared: tripData.route_shared || "private"  // 기본값을 설정하거나, 필요에 따라 수정
  };

  try {
    const response = await fetch(`http://15.164.142.129:3001/api/trip_plan/${tripData.trip_plan_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToUpdate),
    });

    if (!response.ok) {
      throw new Error("여행 정보 업데이트 실패");
    }

    const result = await response.json();
    if (result.success) {
      // Redux 상태 업데이트
      dispatch(updateTripData(updatedData));
    }
  } catch (error) {
    console.error("여행 정보 업데이트 중 오류 발생:", error);
  }
};

  const handlePlaceAdd = async (newPlaces) => {
    const { trip_plan_id } = tripData;
    if (!trip_plan_id) {
      console.error("trip_plan_id가 정의되지 않았습니다.");
      return;
    }

    const currentOrderStart = selectedPlaces[currentDay]?.length || 0;

    const updatedPlacesWithId = await Promise.all(
      newPlaces.map(async (place, index) => {
        const order_no = currentOrderStart + index + 1;
        const tripDay = currentDay + 1;

        try {
          const response = await fetch(`http://15.164.142.129:3001/api/trip_plan/${trip_plan_id}/detail`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userId || 1,
              trip_day: tripDay,
              place_name: place.name,
              place_name_x: place.location.lat,
              place_name_y: place.location.lng,
              place_id: place.place_id,
              memo: null,
              memo_type: "love",
              order_no: order_no,
              review_id: null,
            }),
          });

          const result = await response.json();
          console.log("Server response:", result);

          if (response.ok && result.success) {
            return { ...place, order_no, trip_plan_detail_id: result.data.trip_plan_detail_id };
          } else {
            console.error("장소 추가 실패:", result.message || response.statusText);
            return null;
          }
        } catch (error) {
          console.error("장소 추가 중 오류 발생:", error);
          return null;
        }
      })
    );

    const successfulPlaces = updatedPlacesWithId.filter(place => place !== null);
    successfulPlaces.forEach((place) => {
      console.log("Redux에 추가할 장소 데이터:", place);
      dispatch(addPlace({ dayIndex: currentDay, newPlace: place }));
    });

    closeAddPlacesModal();
  };

  return (
    <Container>
      <LeftColumn>
        <TripInfo>
          <TripTitle>{tripData.tripTitle || '여행 제목'}</TripTitle>
          <TripDestination>{tripData.destination || '목적지 정보 없음'}</TripDestination>
          <TripDates>
            {dayjs(tripData.startDate).format('YYYY.MM.DD')} - {dayjs(tripData.endDate).format('MM.DD')}
          </TripDates>
          <ButtonContainer>
            <EditButton onClick={() => setIsEditModalOpen(true)}>수정</EditButton>
            <InviteButton onClick={handleInviteButtonClick}>+ 일행초대</InviteButton>
          </ButtonContainer>
        </TripInfo>

        {days.map((day, dayIndex) => (
          <div key={dayIndex}>
            <h2>{day}</h2>
            <PlaceList>
              {(selectedPlaces[dayIndex] || []).map((place, index) => (
                <PlaceContainer key={place.place_id}>
                  <OrderNumber>{place.order_no}</OrderNumber>
                  <PlaceItem>
                    <PlaceContent>{place.name}</PlaceContent>
                  </PlaceItem>
              </PlaceContainer>
              ))}
            </PlaceList>
            <AddPlaceButton onClick={() => openAddPlacesModal(dayIndex)}>+ 장소 추가</AddPlaceButton>
          </div>
        ))}
      </LeftColumn>

      <RightColumn>
        <MapWrapper>
          <MapComponent selectedPlaces={selectedPlaces}/>
        </MapWrapper>
      </RightColumn>

      <EditTripModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        tripData={tripData}
        onSave={handleTripUpdate}  // 수정 사항을 저장할 때 handleTripUpdate 함수 호출
      />
      {isInviteModalOpen && <InviteEmailModal open={isInviteModalOpen} onClose={handleInviteModalClose} />}
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

// 스타일 컴포넌트들

const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 60px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
  }  
`;

const LeftColumn = styled.div`
  flex: 0.6;
  padding-right: 20px;

  @media (max-width: 768px) {
    max-height: 50vh;
    overflow-y: auto;
    padding-right: 0;
    margin-bottom: 20px;
  }  
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
    height: 50vh;
  }  
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;

  @media (max-width: 768px) {
    height: 100%;
  }  
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
`;

const EditButton = styled.button`
  background-color: #ff9f00;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #e87a00;
  }
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

const PlaceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PlaceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PlaceItem = styled.div`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  min-height: 50px;
`;

const OrderNumber = styled.div`
  width: 20px;
  height: 20px;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const PlaceContent = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;