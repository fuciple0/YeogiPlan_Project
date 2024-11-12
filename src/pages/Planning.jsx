import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import styled from 'styled-components';
import InviteEmailModal from '../components/InviteEmailModal';
import AddPlacesModal from '../components/AddPlacesModal';
import { updateTripData, addPlace, updatePlaceOrder } from '../store/placeSlice';
import EditTripModal from '../components/Planning/EditTripModal';

// dnd-kit 관련 컴포넌트 및 훅
import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import MapComponent from '../components/Planning/MapComponent';


const Planning = () => {
  const dispatch = useDispatch();
  
  // Redux에서 tripData와 selectedPlaces 가져오기
  const tripData = useSelector((state) => state.places.tripData);
  const selectedPlaces = useSelector((state) => state.places.selectedPlaces);

  // userSlice에서 user_id 가져오기
  const userId = useSelector((state) => state.user.userInfo.userId);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddPlacesModalOpen, setIsAddPlacesModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [currentDay, setCurrentDay] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 상태

  // tripData로부터 여행 정보 상태 관리
  const [title, setTitle] = useState(tripData.tripTitle || '');
  const [destination, setDestination] = useState(tripData.destination || '');
  const [startDate, setStartDate] = useState(tripData.startDate);
  const [endDate, setEndDate] = useState(tripData.endDate);
  
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

  const handleSaveTripData = async (updatedData) => {
    const { trip_plan_id, route_shared } = tripData;
    const { tripTitle, startDate, endDate } = updatedData; // updatedData에서 값 가져오기

    console.log("수정할 trip data:", {
      trip_plan_title: tripTitle,
      destination: tripData.destination,
      start_date: startDate,
      end_date: endDate,
      route_shared: route_shared,
    });

    try {
      const response = await fetch(`http://15.164.142.129:3001/api/trip_plan/${trip_plan_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_plan_title: tripTitle,
          destination: tripData.destination,
          start_date: startDate,
          end_date: endDate,
          route_shared,
        }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        dispatch(updateTripData(result.data));
        setTitle(result.data.trip_plan_title);
        setStartDate(result.data.start_date);
        setEndDate(result.data.end_date);

        console.log("업데이트된 tripTitle:", result.data.trip_plan_title);
        console.log("업데이트된 startDate:", result.data.start_date);
        console.log("업데이트된 endDate:", result.data.end_date);

      } else {
        console.error("여행 일정 수정 실패: ", result.message || "Unknown error");
      }
    } catch (error) {
      console.error("여행 일정 수정 중 오류 발생: ", error);
    }
    setIsEditModalOpen(false);
  };

  const handlePlaceAdd = async (newPlaces) => {
    const { trip_plan_id } = tripData;
  
    if (!trip_plan_id) {
      console.error("trip_plan_id가 정의되지 않았습니다.");
      return;
    }
  
    // 현재 dayIndex에 있는 장소 수 확인
    const currentOrderStart = selectedPlaces[currentDay]?.length || 0;
  
    // 선택된 장소를 Redux 상태에 추가
    newPlaces.forEach((place, index) => {
      const order_no = currentOrderStart + index + 1; // 기존 장소 수에 새로운 인덱스를 더해 order_no 설정
      dispatch(addPlace({ dayIndex: currentDay, newPlace: { ...place, order_no } }));
    });
  
    // 서버에 장소 추가 요청을 보냄
    await Promise.all(
      newPlaces.map(async (place, index) => {
        const order_no = currentOrderStart + index + 1; // DB 저장을 위한 order_no 설정
        const tripDay = currentDay + 1; // trip_day는 DAY가 1부터 시작하므로 currentDay + 1로 설정
  
        console.log("장소 추가 시도:", {
          trip_day: tripDay,
          place_name: place.name,
          order_no: order_no,
        });
  
        try {
          const response = await fetch(`http://15.164.142.129:3001/api/trip_plan/${trip_plan_id}/detail`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userId,
              trip_day: tripDay, // currentDay + 1 값을 사용하여 trip_day 설정
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
          console.log("서버 응답 결과:", result);
  
          if (!response.ok || !result.success) {
            console.error("장소 추가 실패:", result.message || response.statusText);
          } else {
            console.log("장소 추가 성공:", place.name);
          }
        } catch (error) {
          console.error("장소 추가 중 오류 발생:", error);
        }
      })
    );
  
    closeAddPlacesModal();
  };

  // MouseSensor와 TouchSensor를 설정하여 모바일 터치 이벤트와 데스크톱 클릭 이벤트를 모두 지원
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5, // 드래그를 시작하기 전에 일정 거리 이동 필요 (모바일에서 의도치 않은 드래그 방지)
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250, // 모바일에서는 드래그가 시작되기 전에 짧은 딜레이를 줌 (길게 눌러야 이동 시작)
      tolerance: 10, // 터치 허용 범위 설정 (10px)
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);  

  // 드래그 종료 시 실행되는 함수
  const handleDragEnd = async (event) => {
    const { active, over } = event;
  
    if (!over || active.id === over.id) return;
  
    const activeId = active.id;
    const overId = over.id;

    // dayIndex 찾기 (DAY 구분)
    const dayIndex = days.findIndex((day) => day.includes(activeId.split('-')[0]));
  
    const oldIndex = selectedPlaces[dayIndex].findIndex(item => item.place_id === activeId);
    const newIndex = selectedPlaces[dayIndex].findIndex(item => item.place_id === overId);
  
    if (oldIndex !== -1 && newIndex !== -1) {
      // 순서 변경된 상태 임시 적용
      const updatedPlaces = arrayMove(selectedPlaces[dayIndex], oldIndex, newIndex);
      console.log("Updated Places Array:", updatedPlaces); // 디버깅용

      // Redux 상태 업데이트      
      dispatch(updatePlaceOrder({ dayIndex, updatedPlaces }));
  
      // 데이터베이스 업데이트
      try {
        await Promise.all(
          updatedPlaces.map(async (place, index) => {
            const response = await fetch(`http://15.164.142.129:3001/api/trip_plan/${tripData.trip_plan_id}/detail/${place.trip_plan_detail_id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_no: index + 1,
                trip_day: dayIndex + 1,
                place_name: place.name,
                place_name_x: place.location.lat,
                place_name_y: place.location.lng,
                place_id: place.place_id,
                memo: place.memo,
                memo_type: place.memo_type,
                review_id: place.review_id,
              }),
            });
            
            if (!response.ok) {
              throw new Error("서버 업데이트 실패");
            }
          })
        );
      } catch (error) {
        console.error("순서 업데이트 중 오류 발생:", error);
  
        // 서버 오류 시 원래 순서로 롤백
        const originalPlaces = arrayMove(updatedPlaces, newIndex, oldIndex); // 기존 순서로 롤백
        dispatch(updatePlaceOrder({ dayIndex, originalPlaces }));
      }
    }
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
            <InviteButton onClick={() => setIsInviteModalOpen(true)}>+ 일행초대</InviteButton>
          </ButtonContainer>
        </TripInfo>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} autoScroll={false} sensors={sensors}>
          {days.map((day, dayIndex) => (
            <div key={dayIndex}>
              <h2>{day}</h2>
              <SortableContext items={selectedPlaces[dayIndex]?.map((place) => place.place_id) || []} strategy={verticalListSortingStrategy}>
                <PlaceList>
                  {(selectedPlaces[dayIndex] || []).map((place) => (
                    <SortableItem key={place.place_id} place={place} />
                  ))}
                </PlaceList>
              </SortableContext>
              <AddPlaceButton onClick={() => openAddPlacesModal(dayIndex)}>+ 장소 추가</AddPlaceButton>
            </div>
          ))}
        </DndContext>
      </LeftColumn>

      <RightColumn>
        <MapWrapper>
            <MapComponent />
        </MapWrapper>
      </RightColumn>

      {/* Modals */}
      <EditTripModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        tripData={{ tripTitle: title, startDate, endDate }}
        onSave={handleSaveTripData}
      />
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

const SortableItem = ({ place }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: place.place_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <PlaceItem ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <OrderNumber>{place.order_no}</OrderNumber>
      <PlaceContent>
        <PlaceTitle>{place.name}</PlaceTitle>
      </PlaceContent>
    </PlaceItem>
  );
};

export default Planning;

const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 60px;
  border: 1px solid black;

  // 모바일 화면일 때 flex 방향을 column으로 설정하여 세로로 배치
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
  }  
`;

const LeftColumn = styled.div`
  flex: 1;
  padding-right: 20px;

  // 모바일 화면에서 고정 높이와 스크롤 설정
  @media (max-width: 768px) {
    max-height: 50vh; // 화면의 50%만큼 높이 설정
    overflow-y: auto; // 스크롤 가능하게 설정
    padding-right: 0; // 모바일에서는 오른쪽 여백 제거
    margin-bottom: 20px; // 지도와 여백 추가
  }  
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  // 모바일 화면에서는 지도 섹션이 하단에 오도록 설정
  @media (max-width: 768px) {
    width: 100%;
    height: 50vh; // 화면의 나머지 50% 차지
  }  
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;

  // 모바일 화면에서 지도가 세로로 배치되고 적절한 높이로 표시되도록 설정
  @media (max-width: 768px) {
    height: 100%; // 모바일에서는 주어진 높이를 모두 사용
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
  padding: 8px 12px; /* EditButton과 동일하게 설정 */
  border: none;
  border-radius: 20px;
  font-size: 14px; /* EditButton과 동일하게 설정 */
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
  min-height: 100px; /* 추가 */
`;

const PlaceItem = styled.div`
  display: flex;
  width: 100%; /* 넓이를 100%로 지정 */
  align-items: center;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  min-height: 50px; /* 추가 */
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
  position: absolute;
  left: -32px;
`;

const PlaceContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const PlaceTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MoveButton = styled.button`
  background-color: #00b5e2;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;


const DeleteButton = styled.button`
  background-color: red;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
`;