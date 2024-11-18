
import React, { useState, useEffect  } from 'react'
import styled from 'styled-components'
import { FaStar, FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa'
import defaultProfileImage from '../../assets/user_profile.png'; 
import DetailPlaceInfoModal from './DetailPlaceInfoModal';
import ReviewForm from './ReviewForm';


// 리뷰 데이터 가져오기 함수
const fetchPlaceReviews = async (place_id) => {
  try {
    const response = await fetch(`http://15.164.142.129:3001/api/reviews/place/${place_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('서버에서 가져온 리뷰 데이터:', data);
      return data || [];
    } else {
      console.error('리뷰 조회에 실패했습니다.');
      return [];
    }
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};


// 리뷰 목록 컴포넌트
const ReviewList = ({ placeId }) => {
  const [reviews, setReviews] = useState([]);

  // 리뷰 데이터 불러오기
  useEffect(() => {
    const loadReviews = async () => {
      if (placeId) {
        const data = await fetchPlaceReviews(placeId);
        setReviews(data);
      }
    };
    loadReviews();
  }, [placeId]);

  // 새로운 리뷰 추가 핸들러
const handleReviewSubmit = (newReview) => {
  setReviews((prevReviews) => [newReview, ...prevReviews]); // 새 리뷰를 기존 리뷰의 앞에 추가
};



  return (
    <ReviewContainer>
      {/* 리뷰 작성 컴포넌트 */}
      {/* <ReviewForm placeId={placeId} onSubmit={handleReviewSubmit} /> */}
      {reviews.length > 0 ? (
      reviews.map((review) => (
        <ReviewItem key={review.review_id}>
            <ProfileSection>
              <ProfileImage
                src={review.profile_photo ? `http://15.164.142.129:3001/${review.profile_photo}` : defaultProfileImage}
                alt="프로필 이미지"
              />
              <NickAndRating>
                <Nickname>{review.nickname}</Nickname>
                <Rating>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color={i < review.rating ? '#FFC978' : '#ddd'} />
                  ))}
                </Rating>
              </NickAndRating>
            </ProfileSection>
            <ReviewText>{review.comment}</ReviewText>
            {review.photo_urls && review.photo_urls.length > 0 && (
              <ImageContainer>
                {review.photo_urls.map((photo, index) => (
                  <ReviewImage
                    key={index}
                    src={`http://15.164.142.129:3001/${photo}`}
                    alt={`리뷰 이미지 ${index + 1}`}
                  />
                ))}
              </ImageContainer>
            )}
            <UsefulButton initialCount={review.likes_count} />
          </ReviewItem>
        ))
      ) : (
        <NoReviews>리뷰가 없습니다.</NoReviews>
      )}
    </ReviewContainer>
  );
};

// 좋아요. 버튼 컴포넌트
const UsefulButton = ({ initialCount }) => {
  const [isUseful, setIsUseful] = useState(false);
  const [usefulCount, setUsefulCount] = useState(initialCount);

  const toggleUseful = () => {
    setIsUseful(!isUseful);
    setUsefulCount((prevCount) => (isUseful ? prevCount - 1 : prevCount + 1));
  };

  return (
    <Button onClick={toggleUseful}>
      {isUseful ? <FaThumbsUp color="#507DBC" /> : <FaRegThumbsUp color="#666" />}
      <UsefulText>{usefulCount}명에게 유용해요!</UsefulText>
    </Button>
  );
};
export default ReviewList;


const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  max-height: 300px; /* 별점 밑으로 스크롤되도록 높이 설정 */
  overflow-y: auto;
`

const ReviewItem = styled.div`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`

const NickAndRating = styled.div`
  display: flex;
  flex-direction: column;
`

const Nickname = styled.p`
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  color: #333;
  text-align: left;
`

const Rating = styled.div`
  display: flex;
`

const ReviewText = styled.p`
  margin: 8px 0;
  color: #333;
  text-align: left;
`

const ImageContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  margin-bottom: 8px;
`

const ReviewImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
`
const Button = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  margin-top: 8px;
  padding: 6px;
`

const UsefulText = styled.span`
  margin-left: 6px;
  font-size: 14px;
  color: #666;
`

const NoReviews = styled.p`
  text-align: center;
  color: #999;
  font-size: 16px;
  margin-top: 20px;
`;