// src/components/ReviewForm.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { TbPhotoPlus } from "react-icons/tb";
import { useSelector } from 'react-redux';

const ReviewForm = ({ onSubmit, onCancel, selectedTripPlan = [], placeId, placeName, rating }) => {
  const [reviewText, setReviewText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const userInfo = useSelector((state) => state.user.userInfo); // Redux에서 userInfo 불러오기

  // 이미지 변경 시 이벤트 핸들러
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files).slice(0, 10); // 최대 10개 파일 제한
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

   // 리뷰 제출 핸들러
   const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("trip_plan_title", selectedTripPlan[0]?.title || "여행 제목 없음");
    formData.append("place_id", placeId);
    formData.append("place_name", placeName);
    formData.append("rating", rating);
    formData.append("comment", reviewText);
    formData.append("user_id", userInfo.userId);

     // 이미지를 FormData에 추가
  selectedImages.slice(0, 10).forEach((image) => {
    formData.append("photo_urls", image);
  });

  try {
    const response = await fetch('http://15.164.142.129:3001/api/reviews', {
      method: 'POST',
      body: formData, // FormData 객체 전송
    });

    if (response.status === 201) {
      const result = await response.json();
      console.log("리뷰 작성 성공:", result);

      // 초기화 작업
      setReviewText('');
      setSelectedImages([]);
      setIsTyping(false);

      // 부모 컴포넌트로 작성된 리뷰 데이터 전달
      onSubmit(result); // 리뷰 작성 성공 후 부모에 전달
    } else {
      const errorText = await response.text();
      console.error("리뷰 작성 실패:", errorText);
    }
  } catch (error) {
    console.error("리뷰 작성 중 오류:", error);
  }
};

  // 텍스트 변경 핸들러
  const handleTextChange = (e) => {
    setReviewText(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  return (
    <FormContainer>
      <Dropdown>
        <option value="">여행 제목을 선택하세요</option>
        {selectedTripPlan.map((plan, index) => (
          <option key={index} value={plan.title}>{plan.title}</option>
        ))}
      </Dropdown>

      <TextAreaContainer>
        {!isTyping && (
          <>
            <PlaceholderTextTop>* 직접 경험한 솔직한 리뷰를 남겨주세요.</PlaceholderTextTop>
            <PlaceholderTextBottom>* 사진은 최대 10장 첨부할 수 있습니다</PlaceholderTextBottom>
          </>
        )}
        <TextArea value={reviewText} onChange={handleTextChange} />
      </TextAreaContainer>

      <ImageUploadContainer>
        {selectedImages.length === 0 && (
          <ImageUploadButton onClick={() => document.getElementById('imageInput').click()}>
            <TbPhotoPlus size={24} />
          </ImageUploadButton>
        )}
        <ImageInput
          id="imageInput"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <ImagePreviewContainer>
          {selectedImages.slice(0, 10).map((image, index) => (
            <ImagePreview key={index} src={URL.createObjectURL(image)} alt={`Uploaded ${index + 1}`} />
          ))}
        </ImagePreviewContainer>
      </ImageUploadContainer>

      <ButtonContainer>
        <CancelButton onClick={onCancel}>취소</CancelButton>
        <SubmitButton onClick={handleSubmit}>작성완료</SubmitButton>
      </ButtonContainer>
    </FormContainer>
  );
};

export default ReviewForm;


const FormContainer = styled.div`
  margin-top: 20px;
`

const Dropdown = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  outline: none;
`

const ImageUploadContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
`

const ImageUploadButton = styled.div`
  width: 80px;
  height: 80px;
  background-color: #f0f0f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const ImageInput = styled.input`
  display: none;
`

const ImagePreviewContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-left: 16px;
`

const ImagePreview = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
`

const TextAreaContainer = styled.div`
  position: relative;
  width: 100%;
  margin-top: 8px;
`

const PlaceholderText = styled.div`
  position: absolute;
  left: 8px;
  font-size: 14px;
  color: #ccc;
  pointer-events: none; /* 클릭 이벤트가 TextArea에 전달되도록 */
`

const PlaceholderTextTop = styled(PlaceholderText)`
  top: 8px; /* 첫 번째 줄 */
`

const PlaceholderTextBottom = styled(PlaceholderText)`
  top: 28px; /* 두 번째 줄 */
`

const TextArea = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 8px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  resize: none;
  outline: none;
  background: transparent; /* 배경을 투명하게 설정하여 PlaceholderText와 겹침 */
  color: #333;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`

const CancelButton = styled.button`
  width: 48%;
  padding: 10px;
  border: 1px solid #333;
  border-radius: 5px;
  background-color: white;
  color: #333;
  cursor: pointer;
`

const SubmitButton = styled.button`
  width: 48%;
  padding: 10px;
  background: #507DBC;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`