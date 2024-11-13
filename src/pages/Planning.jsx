import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import styled from 'styled-components';
import InviteEmailModal from '../components/InviteEmailModal';
import AddPlacesModal from '../components/AddPlacesModal';
import { updateTripData, addPlace, fetchSharedTripPlans, setCurrentTripId, fetchTripDetails } from '../store/placeSlice';
import EditTripModal from '../components/Planning/EditTripModal';
import MapComponent from '../components/Planning/MapComponent';

const Planning = () => {
  const dispatch = useDispatch();

  // Redux에서 필요한 상태 가져오기
  const tripData = useSelector((state) => state.places.tripData);
  const selectedPlaces = useSelector((state) => state.places.selectedPlaces || []);
  const userId = useSelector((state) => state.user.userInfo.userId);
  const tripList = useSelector((state) => state.places.tripList);
  const currentTripId = useSelector((state) => state.places.currentTripId);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddPlacesModalOpen, setIsAddPlacesModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 사용자 ID를 기반으로 여행 목록 불러오기
  useEffect(() => {
    if (userId) {
      dispatch(fetchSharedTripPlans(userId));
    }
  }, [userId, dispatch]);

  // tripList가 업데이트된 후에만 setCurrentTripId를 호출
  useEffect(() => {
    if (tripList.length > 0 && currentTripId === null) {
      // tripList가 존재하고 currentTripId가 비어있다면 초기 tripList의 첫 번째 여행 ID로 설정
      dispatch(setCurrentTripId(tripList[0].trip_plan_id));
    }
  }, [tripList, currentTripId, dispatch]);
  
  useEffect(() => {
    console.log("현재 선택된 여행 ID:", currentTripId);  // currentTripId 로그 확인
    console.log("tripList:", tripList);  // tripList 로그 확인
  
    if (currentTripId && tripList.length > 0) {
      const selectedTrip = tripList.find(trip => trip.trip_plan_id === parseInt(currentTripId, 10));
      console.log("selectedTrip:", selectedTrip);  // selectedTrip 확인
  
      if (selectedTrip) {
        const { start_date, end_date, trip_plan_title, destination, route_shared } = selectedTrip;
        const dayCount = dayjs(end_date).diff(dayjs(start_date), 'day') + 1;
  
        dispatch(updateTripData({
          startDate: start_date,
          endDate: end_date,
          tripTitle: trip_plan_title,
          destination,
          route_shared,
          dayCount,
        }));
      } else {
        console.warn("선택된 여행을 찾을 수 없습니다.");
      }
    }
  }, [currentTripId, tripList, dispatch]);
  

  // currentTripId가 변경될 때 세부 일정 불러오기
  useEffect(() => {
    if (currentTripId) {
      setIsLoading(true);
      dispatch(fetchTripDetails(currentTripId))
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  }, [currentTripId, dispatch]);

  // 여행 선택 핸들러
  const handleTripSelect = (event) => {
    const tripId = event.target.value;
    dispatch(setCurrentTripId(tripId));
  };

  // 여행 정보 수정 후 Redux 상태에 저장
  const handleSaveTripData = (updatedData) => {
    // Redux에 수정된 여행 데이터를 저장
    dispatch(updateTripData(updatedData));
    setIsEditModalOpen(false);
  };

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

  const formatDate = (dateString) => {
    return dayjs(dateString).format('YYYY-MM-DD');  // 기본적으로 로컬 시간대 기준으로 표시
  };

  return (
    <Container>
      <TripSelector>
        <label>여행 선택: </label>
        <select defaultValue={currentTripId || ""} onChange={handleTripSelect}>
          <option value="" disabled>여행을 선택하세요</option>
          {tripList.map((trip) => (
            <option key={trip.trip_plan_id} value={trip.trip_plan_id}>
              {trip.trip_plan_title} ({formatDate(trip.start_date)} - {formatDate(trip.end_date)})
            </option>
          ))}
        </select>
      </TripSelector>

      <ContentWrapper>
        <LeftColumn>
          <TripInfo>
            <TripTitle>{tripData.tripTitle || '여행 제목'}</TripTitle>
            <TripDestination>{tripData.destination || '목적지 정보 없음'}</TripDestination>
            <TripDates>
              {tripData.startDate ? dayjs(tripData.startDate).format('YYYY.MM.DD') : ''} - {tripData.endDate ? dayjs(tripData.endDate).format('MM.DD') : ''}
            </TripDates>
            <ButtonContainer>
              <EditButton onClick={() => setIsEditModalOpen(true)}>수정</EditButton>
              <InviteButton onClick={handleInviteButtonClick}>+ 일행초대</InviteButton>
            </ButtonContainer>
          </TripInfo>

          {generateDays().map((day, dayIndex) => (
            <div key={dayIndex}>
              <h2>{day}</h2>
              <PlaceList>
                {selectedPlaces
                  .filter((place) => place.trip_day === dayIndex + 1)
                  .map((place) => (
                    <PlaceContainer key={place.trip_plan_detail_id}>
                      <OrderNumber>{place.order_no}</OrderNumber>
                      <PlaceItem>
                        <PlaceContent>{place.place_name}</PlaceContent>
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
      </ContentWrapper>

      <EditTripModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        tripData={tripData}
        onSave={handleSaveTripData}
      />
      {isInviteModalOpen && <InviteEmailModal open={isInviteModalOpen} onClose={handleInviteModalClose} />}
      {isAddPlacesModalOpen && (
        <AddPlacesModal 
          isOpen={isAddPlacesModalOpen} 
          onClose={closeAddPlacesModal} 
          onConfirm={() => {}}
        />
      )}
    </Container>
  );
};

export default Planning;

// 스타일 컴포넌트들

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 60px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
  }  
`;

const TripSelector = styled.div`
  margin-bottom: 20px;
  label {
    margin-right: 10px;
  }
  select {
    padding: 5px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column; /* 모바일에서는 세로 배치 */
  }
`

const LeftColumn = styled.div`
  flex: 0.6;
  padding-right: 20px;
  overflow-y: auto;
  height: 60vh;

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
  height: 60vh; /* LeftColumn과 같은 높이 */

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
  margin-top: 40px;
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
  max-height: 55vh;  /* 높이를 설정하여 스크롤 가능 */
  overflow-y: auto;  /* 스크롤 활성화 */

  /* 모바일 화면에서 max-height 조정 */
  @media (max-width: 768px) {
    max-height: 30vh;
  }
`;

const PlaceItem = styled.div`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  min-height: 50px;
  display: flex;  /* flex 설정으로 항목들이 겹치지 않게 조정 */
  align-items: center;
  justify-content: space-between;
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
