import React from 'react';
import styled from 'styled-components';

const ReviewCard = ({ name, imageUrl }) => {
  return (
    <Card>
      <Image src={imageUrl} alt={name} />
      <Name>{name}</Name>
    </Card>
  );
};

export default ReviewCard;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Image = styled.img`
  width: 100px; /* 기존 값에서 약간 증가시킨 예 */
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
`;

const Name = styled.p`
  font-size: 14px;
  color: #333;
  margin: 0;
`;
