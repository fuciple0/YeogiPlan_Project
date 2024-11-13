import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import RecommendList from './RecommendList';
import { Skeleton } from '@mui/material';
import DateSelectModal from './DateSelectModal';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addTripData } from '../store/placeSlice';
import { useSelector } from 'react-redux';

const BestCardDetailRecommend = ({ item, onClose }) => {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]); // 선택된 장소 목록 상태 추가
  const [isDateSelectOpen, setIsDateSelectOpen] = useState(false); // 날짜 선택 모달 상태

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // userSlice에서 user_id 가져오기
  const userId = useSelector((state) => state.user.userInfo.userId);  

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const keywordResponse = await fetch(`http://43.201.36.203:3001/googleApi/keywordSearch?searchTerm=${item.name}`);
        const keywordData = await keywordResponse.json();

        if (keywordData.places && keywordData.places[0]) {
          const place = keywordData.places[0];
          setDescription(place.description || '정보를 가져올 수 없습니다.');

          const nearbyResponse = await fetch(`http://43.201.36.203:3001/googleApi/nearbySearch?searchTerm=${item.name}`);
          const data = await nearbyResponse.json();

          if (data && data.nearbyPlaces && Array.isArray(data.nearbyPlaces)) {
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

  // 일정 추가 버튼 클릭 시 일정 날짜 선택 모달을 여는 함수
  const handleAddSchedule = () => {
    setIsDateSelectOpen(true);
  };

  // 일정 날짜 선택 모달 닫기
  const handleDateSelectClose = () => {
    setIsDateSelectOpen(false);
  };

// DateSelectModal에서 날짜 선택 후 확인 버튼 클릭 시 처리 함수
const handleDateSelectConfirm = async (tripDataWithId) => {
  console.log("Received tripDataWithId:", tripDataWithId); // tripDataWithId 확인

  const tripPlanId = tripDataWithId.trip_plan_id;
  console.log("tripPlanId:", tripPlanId);

  // Redux에 tripData와 선택된 장소들 저장
  const updatedPlacesWithId = await Promise.all(
    selectedPlaces.map(async (place, index) => {
      try {
        const response = await fetch(`http://15.164.142.129:3001/api/trip_plan/${tripPlanId}/detail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId || 1,
            trip_day: 1,
            place_name: place.name,
            place_name_x: place.location.lat,
            place_name_y: place.location.lng,
            place_id: place.place_id,
            memo: null,
            memo_type: "love",
            order_no: index + 1,
            review_id: null,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          console.log("장소 저장 성공:", place.name);
          // 반환된 trip_plan_detail_id와 order_no를 place 객체에 추가
          return { 
            ...place, 
            order_no: result.data.order_no, 
            trip_plan_detail_id: result.data.trip_plan_detail_id, 
            location: { lat: place.location.lat, lng: place.location.lng }, // 경도, 위도 포함
          };
        } else {
          console.error("장소 저장 실패:", result.message || response.statusText);
          return null;
        }
      } catch (error) {
        console.error("장소 추가 중 오류 발생: ", error);
        return null;
      }
    })
  );

  // 성공적으로 저장된 장소만 Redux에 추가
  const successfulPlaces = updatedPlacesWithId.filter(place => place !== null);

  dispatch(addTripData({
    tripData: tripDataWithId,
    places: successfulPlaces, // Redux에 저장할 장소 목록에 trip_plan_detail_id가 포함된 상태로 전달
  }));

  console.log("모든 장소가 성공적으로 추가되었습니다.");
  navigate('/planning');
  setIsDateSelectOpen(false);
  onClose();
};


  return (
    <>
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <BestCard>
          <Image src={item.imageUrl} alt={item.name} />
          <Title>{item.name}</Title>
          <DescriptionContainer>
            <Description>{description}</Description>
          </DescriptionContainer>
        </BestCard>
        <RecommendTitle>추천 장소</RecommendTitle>
        {isLoading ? (
          <SkeletonList>
          {[...Array(2)].map((_, index) => (
              <SkeletonItem key={index}>
              <SkeletonImage>
                <Skeleton width="100%" height="100%" />
              </SkeletonImage>
              <SkeletonDetails>
                <Skeleton width="50%" height="20px" /> {/* 장소 이름 */}
                <Skeleton width="10%" height="20px" /> {/* 별점 */}
                <Skeleton width="60%" height="20px" /> {/* 주소 */}
              </SkeletonDetails>
            </SkeletonItem>
          ))}
        </SkeletonList>
        ) : (
          <RecommendListContainer>
            <RecommendList
              places={places}
              onSelectPlace={(updatedSelection) => setSelectedPlaces(updatedSelection)} // 장소 선택 시 업데이트 함수 전달
              selectedItems={selectedPlaces} // 선택된 장소 전달
            />
          </RecommendListContainer>
        )}
        <AddScheduleButton onClick={handleAddSchedule}>일정 생성하러 가기</AddScheduleButton>
      </ModalContent>
    </ModalOverlay>

      {/* DateSelectModal - 일정 날짜 선택 모달 */}
      {isDateSelectOpen && (
        <DateSelectModal
          open={isDateSelectOpen}
          onClose={handleDateSelectClose}
          selectedPlaces={selectedPlaces} // 선택된 장소 전달
          onConfirm={handleDateSelectConfirm} // 선택한 날짜 및 장소를 저장 후 Planning 페이지로 이동
          defaultTripData={{ // 여행제목과 목적지 기본 값 전달
            tripTitle: `${item.name} 여행`,
            destination: item.name,
          }}
        />
      )}
    </>
  );
};

export default BestCardDetailRecommend;

// 스타일링 컴포넌트
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 80%;
  max-width: 1100px;
  height: 90%; /* 높이를 최대한 사용 */
  min-height: 500px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);

    /* 모바일 대응 */
    @media (max-width: 768px) {
    width: 90%;
    height: 90%;
  }
`;

const BestCard = styled.section`
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  background-color: #fff;
  margin-bottom: 20px;
`;

const Image = styled.img`
  aspect-ratio: 2.23;
  object-fit: cover;
  width: 100%;
  border-radius: 8px 8px 0 0;
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 24px;
  margin: 15px;
`;

const DescriptionContainer = styled.div`
  padding: 12px 15px;
  max-height: 150px;
  overflow-y: auto; /* 스크롤 활성화 */

    /* 모바일 대응 */
    @media (max-width: 768px) {
    max-height: 200px;
  }
`;

const Description = styled.section`
  color: #333;
  font-size: 14px;
  line-height: 1.6;
`;

const RecommendTitle = styled.h1`
  font-weight: bold;
  font-size: 24px;
  margin: 8px 8px;
`;

const SkeletonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 0;
`;

const SkeletonItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const SkeletonImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
`;

const SkeletonDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-grow: 1;
`;

const RecommendListContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto; /* 스크롤 활성화 */
  max-height: 100%; /* 부모 요소의 높이를 최대한 사용 */
  padding-right: 10px; /* 스크롤바와 내용 사이의 여백 */

    /* 모바일 대응 */
    @media (max-width: 768px) {
    max-height: 300px;
  }
`;

const AddScheduleButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #507dbc;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3f5f8a;
  }
`;
