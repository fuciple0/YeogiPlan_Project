// components/DestinationCard.jsx
import React from 'react';
import styled from 'styled-components';

const DestinationCard = ({ name, imageUrl }) => {
  return (
    <Card>
      <CardImage src={imageUrl} alt={name} />
      <CardName>{name}</CardName>
    </Card>
  );
};

export default DestinationCard;

const Card = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 10px;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const CardName = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.7);
`;
