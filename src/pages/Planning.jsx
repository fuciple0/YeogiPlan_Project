import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import MapLoader from '../components/Planning/MapLoader';

const Planning = () => {
    const tripPlan = useSelector((state) => state.tripPlan.planData);
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        const fetchPlaces = async () => {
            if (tripPlan && tripPlan.trip_plan_id) {
                try {
                    const response = await fetch(`http://192.168.50.34:3001/api/trip_plan/${tripPlan.trip_plan_id}/detail`);
                    
                    if (!response.ok) throw new Error("데이터를 불러오는 중 오류 발생");

                    const data = await response.json();
                    console.log(data)
                    setPlaces(data);
                } catch (error) {
                    console.error("장소 데이터를 불러오는 중 오류 발생:", error);
                }
            }
        };

        fetchPlaces();
    }, [tripPlan]);

    return (
        <PlanningContainer>
            {/* 장소 목록 표시 영역 */}
            <PlacesListContainer>
                {places.length > 0 ? (
                    <PlacesList>
                        {places.map((place, index) => (
                            <PlaceItem key={index}>
                                <img src={place.photo} alt={place.place_name} />
                                <div>
                                    <h4>{place.place_name}</h4>
                                    <p>{place.memo}</p>
                                </div>
                            </PlaceItem>
                        ))}
                    </PlacesList>
                ) : (
                    <p>선택한 장소가 없습니다</p>
                )}
            </PlacesListContainer>

            {/* 지도 로더 */}
            <MapContainer>
                <MapLoader />
            </MapContainer>
        </PlanningContainer>
    );
};

export default Planning;

const PlanningContainer = styled.div`
    display: flex;
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    flex-direction: row; /* 가로 배치 */
`;

const PlacesListContainer = styled.div`
    flex: 1;
    margin-right: 20px; /* 지도와 간격을 주기 위해 오른쪽 마진 추가 */
`;

const MapContainer = styled.div`
    flex: 1;
    display: flex;
    min-width: 300px; /* 지도 크기를 제한하여 적절하게 표시 */
`;

const PlacesList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const PlaceItem = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    img {
        width: 60px;
        height: 60px;
        border-radius: 8px;
    }

    h4 {
        margin: 0;
    }

    p {
        margin: 0;
        color: #666;
    }
`;
