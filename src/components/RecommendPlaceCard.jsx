import React from "react";
import styled from "styled-components";

const RecommendPlaceCard = ({ imageUrl, name, location, onImageClick }) => {
    return (
        <CircleCard>
            <CircleImage src={imageUrl} alt={name} onClick={onImageClick} />
            <Title>{name}</Title>
            <Subtitle>{location}</Subtitle>
        </CircleCard>
    );
}

export default RecommendPlaceCard;

const CircleCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 120px;
    padding: 12px;
    background-color: #fff;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px); /* 위로 떠오르는 효과 */

    }
`;

const CircleImage = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.1); /* 이미지 크기 확대 효과 */



    }
`;

const Title = styled.div`
    font-size: 16px;
    font-weight: bold;
    margin-top: 8px;
    transition: color 0.3s ease;

    ${CircleCard}:hover & {
        color: #507dbc; /* 호버 시 타이틀 색상 변화 */
    }
`;

const Subtitle = styled.div`
    font-size: 14px;
    color: #888;
    margin-top: 4px;
    transition: color 0.3s ease;

    ${CircleCard}:hover & {
        color: #555; /* 호버 시 서브타이틀 색상 변화 */
    }
`;
