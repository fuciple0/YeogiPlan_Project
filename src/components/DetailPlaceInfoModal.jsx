// src/components/DetailPlaceInfoModal.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';
import ReviewForm from './ReviewForm';

const DetailPlaceInfoModal = ({ isOpen, onClose, place }) => {

    const [ rating, setRating ] = useState(0)
    const [ hoveredRating, setHoveredRating ] = useState(0);  // 임시로 별점을 저장하는 상태
    const [ showReviewForm, setShowReviewForm ] = useState(false)

    if (!isOpen || !place) return null;

    const handleRatingClick = (rate) => {
        setRating(rate)
        setShowReviewForm(true)
    }

    const handleReviewSubmit = (reviewText, selectedImages) => {
        console.log('Review Submitted: ', reviewText, selectedImages)
        setShowReviewForm(false)  // 리뷰 작성 완료 시 리뷰작성폼 숨기기
        setRating(0)
    }

    const handleReviewCancel = () => {
        setShowReviewForm(false) // 취소 시 리뷰작성폼 숨기기
        setRating(0)
    }

    return (
        <Overlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
            <TopSection>
            <ImageContainer>
                <PlaceImage src={place.imageUrl} alt={place.name} />
            </ImageContainer>
            <InfoContainer>
                <PlaceName>{place.name}</PlaceName>
                <PlaceDescription>
                {place.description || "제주도에 위치한 남한에서 가장 높은 산이자, 대한민국의 가장 높은 국립공원"}
                </PlaceDescription>
                <Rating>
                <FaStar color="#FFC978" /> 4.8
                </Rating>
                <Details>
                <DetailItem><strong>주소 :</strong> 제주 서귀포시 토평동 산15-1</DetailItem>
                <DetailItem><strong>운영시간 :</strong> 오전 8시 ~ 오후 6시</DetailItem>
                <DetailItem><strong>전화번호 :</strong> 064-713-9950</DetailItem>
                <DetailItem><strong>휴무일 :</strong> 연중무휴</DetailItem>
                </Details>
            </InfoContainer>
            </TopSection>
            <BottomSection>
            <ReviewTitle>리뷰</ReviewTitle>
            <StarContainer>
                {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon 
                    key={star} 
                    selected={star <= (hoveredRating || rating)} 
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}  // 별점에 마우스 올리면 임시 상태 업데이트
                    onMouseLeave={() => setHoveredRating(0)}  // 마우스 나가면 임시 상태 초기화
                    >
                    <FaStar />
                </StarIcon>
                ))}
            </StarContainer>
            {!showReviewForm && (
                <ReviewMessage>별점을 남겨주세요!</ReviewMessage>
            )}
            <ReviewFormContainer show={showReviewForm}>
                {showReviewForm && (
                    <ReviewForm onSubmit={handleReviewSubmit} onCancel={handleReviewCancel} />
                )}
            </ReviewFormContainer>
            </BottomSection>
        </ModalContent>
        </Overlay>
    );
    };

export default DetailPlaceInfoModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 70%;
  height: 80%;
  min-height: 500px; /* 최소 높이를 500px로 설정하여 작아도 이 높이 이하로 줄어들지 않도록 */
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  overflow-y: auto; /* 스크롤 활성화 */
`

const TopSection = styled.div`
  display: flex;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  flex: 1.5;
  height: 280px;
  margin-right: 20px;
`

const PlaceImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`

const InfoContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
`

const PlaceName = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`

const PlaceDescription = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
`

const Rating = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #FFC978;
  margin-bottom: 16px;
`

const Details = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
`

const DetailItem = styled.div`
  margin-bottom: 4px;
  & > strong {
    font-weight: bold;
    color: #333;
  }
`

const BottomSection = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 20px;
  text-align: center;
`

const ReviewTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`

const StarContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`

const StarIcon = styled.div`
  cursor: pointer;
  color: ${({ selected }) => (selected ? '#FFC978' : '#ddd')};
  font-size: 32px;
  transition: color 0.2s;

  &:hover {
    color: #FFC978;
  }
`

const ReviewMessage = styled.p`
  text-align: center;
  color: #666;
  font-size: 14px;
`

const ReviewFormContainer = styled.div`
  opacity: ${({ show }) => (show ? 1 : 0)};
  max-height: ${({ show }) => (show ? '500px' : '0px')}; /* 높이 조정으로 부드러운 애니메이션 효과 */
  overflow: hidden;
  transition: opacity 0.3s ease, max-height 0.3s ease; /* 애니메이션 속성 */
  margin-top: ${({ show }) => (show ? '10px' : '0px')};
`