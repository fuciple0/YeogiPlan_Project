import React, { useState } from 'react';
import styled from 'styled-components';
import { FaStar, FaCheck, FaPlus } from "react-icons/fa";

const RecommendList = ({ places, onSelectPlace }) => {
    const [selectedItems, setSelectedItems] = useState([]);

    const toggleSelectItem = (place) => {
        setSelectedItems((prevSelectedItems) => {
            // place_id를 기준으로 이미 선택된 항목인지 확인
            const isSelected = prevSelectedItems.includes(place.place_id);
            const updatedSelection = isSelected
                ? prevSelectedItems.filter((id) => id !== place.place_id) // 이미 선택된 항목이면 제거
                : [...prevSelectedItems, place.place_id]; // 선택되지 않은 항목이면 place_id 추가

            // 부모 컴포넌트에 업데이트된 선택 목록 전달 (선택된 장소 객체를 전달하기 위해 filter 사용)
            if (onSelectPlace) {
                onSelectPlace(places.filter((p) => updatedSelection.includes(p.place_id)));
            }

            return updatedSelection;
        });
    };

    if (!Array.isArray(places) || places.length === 0) {
        return <NoPlaces>추천 장소가 없습니다.</NoPlaces>;
    }

    return (
        <ListContainer>
            {places.map((place, index) => (
                <PlaceCard key={place.place_id || index}>
                    {place.photo && (
                        <PlaceImage
                            src={place.photo}
                            alt={place.name}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    )}
                    <PlaceDetails>
                        <PlaceTitle>{place.name}</PlaceTitle>
                        <PlaceInfo>
                            {place.rating && (
                                <PlaceRating>
                                    <FaStar color="#ffb535" size={16} />
                                    <span>{place.rating.toFixed(1)}</span>
                                </PlaceRating>
                            )}
                            <PlaceDescription>{place.address}</PlaceDescription>
                        </PlaceInfo>
                    </PlaceDetails>
                    <AddIcon onClick={() => toggleSelectItem(place)}>
                        {selectedItems.includes(place.place_id) ? (
                            <FaCheck size={24} color="#507DBC" />
                        ) : (
                            <FaPlus size={24} color="#333" />
                        )}
                    </AddIcon>
                </PlaceCard>
            ))}
        </ListContainer>
    );
};

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 100%;
    overflow-y: auto;
    padding: 15px;
`;

const NoPlaces = styled.p`
    text-align: center;
    color: #777;
    padding: 20px;
    font-size: 16px;
`;

const PlaceCard = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    padding: 10px;
    transition: transform 0.2s ease;
    cursor: pointer;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const PlaceImage = styled.img`
    width: 20%;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 15px;
`;

const PlaceDetails = styled.div`
    flex-grow: 1;
`;

const PlaceTitle = styled.h3`
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin: 0 0 8px;
`;

const PlaceInfo = styled.div`
    font-size: 14px;
    color: #555;
`;

const PlaceRating = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-bottom: 6px;
    gap: 4px;
`;

const PlaceDescription = styled.p`
    font-size: 14px;
    color: #777;
    margin: 0;
    line-height: 1.5;
`;

const AddIcon = styled.div`
    color: #007aff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    cursor: pointer;
`;

export default RecommendList;
