import React from 'react';
import styled from 'styled-components';

const RecommendList = ({ places }) => {
    console.log('Received places:', places);

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
                    <PlaceTitle>{place.name}</PlaceTitle>
                    <PlaceInfo>
                        {place.rating && (
                            <PlaceRating>
                                ⭐ {place.rating.toFixed(1)}
                            </PlaceRating>
                        )}
                        <PlaceDescription>{place.address}</PlaceDescription>


                    </PlaceInfo>
                </PlaceCard>
            ))}
        </ListContainer>
    );
};

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 500px;
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
    border: 1px solid #ccc;
    border-radius: 6px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    padding: 10px;
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-4px);
    }
`;

const PlaceImage = styled.img`
    width: 20%;
    height: 150px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 10px;
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
    font-size: 14px;
    margin-bottom: 6px;
`;

const PlaceDescription = styled.p`
    font-size: 14px;
    color: #777;
    margin: 0;
    line-height: 1.5;
`;

const OpenStatus = styled.span`
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    background-color: ${props => props.isOpen ? '#e6f4ea' : '#fce8e6'};
    color: ${props => props.isOpen ? '#137333' : '#c5221f'};
`;

export default RecommendList;