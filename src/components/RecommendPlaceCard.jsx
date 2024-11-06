import React from "react";
import styled from "styled-components";

const RecommendPlaceCard = ({ imageUrl, name, location }) => {
    return (
        <CircleCard>
            <CircleImage src={imageUrl} alt={name} />
            <Title>{name}</Title>
            <Subtitle>{location}</Subtitle>
        </CircleCard>
    )
}

export default RecommendPlaceCard;

const CircleCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 120px;
`

const CircleImage = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
`

const Title = styled.div`
    font-size: 16px;
    font-weight: bold;
    margin-top: 8px;
`

const Subtitle = styled.div`
    font-size: 14px;
    color: #888;
    margin-top: 4px;
`

