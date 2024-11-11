
import React, { useState } from 'react'
import styled from 'styled-components'
import { FaStar, FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa'

const ReviewList = ({ reviews }) => {
    return (
        <ReviewContainer>
            {reviews.map((review, index) => (
                <ReviewItem key={index}>
                    <ProfileSection>
                        <ProfileImage src={review.profileImage} alt="프로필 이미지" />
                        <NickAndRating>
                            <Nickname>{review.nickname}</Nickname>
                            <Rating>
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} color={i < review.rating ? '#FFC978' : '#ddd'} />
                            ))}
                            </Rating>
                        </NickAndRating>
                    </ProfileSection>
                    <ReviewText>{review.text}</ReviewText>
                    {review.images.length > 0 && (
                        <ImageContainer>
                            {review.images.map((src, i) => (
                                <ReviewImage key={i} src={src} alt={`Review ${i + 1}`} />
                            ))}
                        </ImageContainer>
                    )}
                    <UsefulButton review={review} />
                </ReviewItem>
            ))}
        </ReviewContainer>
    )
}

const UsefulButton = () => {
    const [isUseful, setIsUseful] = useState(false)
    const [usefulCount, setUsefulCount] = useState(0)

    const toggleUseful = () => {
        setIsUseful(!isUseful)
        setUsefulCount(prevCount => isUseful ? prevCount - 1 : prevCount + 1); // 상태에 따라 증가/감소
    }

    return (
        <Button onClick={toggleUseful}>
            {isUseful ? <FaThumbsUp color='#507DBC' /> : <FaRegThumbsUp color='#666' />}
            <UsefulText>{usefulCount}명에게 유용해요!</UsefulText>
        </Button>
    )
}

export default ReviewList

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
