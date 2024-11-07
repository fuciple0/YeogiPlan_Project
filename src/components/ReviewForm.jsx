import React, { useState } from 'react';
import styled from 'styled-components';
import { TbPhotoPlus } from "react-icons/tb";


const ReviewForm = ({ onSubmit, onCancel }) => {
    const [reviewText, setReviewText] = useState('')
    const [selectedImages, setSelectedImages] = useState([])
    const [isTyping, setIsTyping] = useState(false); // 사용자가 입력을 시작했는지 여부

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const images = files.map(file => URL.createObjectURL(file))
        setSelectedImages(prevImages => [...prevImages, ...images])
    }

    const handleSubmit = () => {
        onSubmit(reviewText, selectedImages)
        setReviewText('')
        setSelectedImages([])
        setIsTyping(false) // 제출 후 isTyping을 다시 false로 초기화
    }

    const handleTextChange = (e) => {
        setReviewText(e.target.value)
        setIsTyping(e.target.value.length > 0); // 텍스트가 입력되면 isTyping을 true로 설정
    }

    return (
        <FormContainer>
            <Dropdown>
                <option>2024년 무슨무슨 여행</option>
                {/* 동적으로 드롭다운 항목이 추가될 예정 */}
            </Dropdown>

            <TextAreaContainer>
                {!isTyping && (
                    <>
                        <PlaceholderTextTop>* 직접 경험한 솔직한 리뷰를 남겨주세요.</PlaceholderTextTop>
                        <PlaceholderTextBottom>* 사진은 최대 몇장 첨부할 수 있습니다</PlaceholderTextBottom>
                    </>
                )}
                <TextArea 
                    value={reviewText} 
                    onChange={handleTextChange} 
                />
            </TextAreaContainer>

            <ImageUploadContainer>
                {selectedImages.length === 0 && (
                    <ImageUploadButton onClick={() => document.getElementById('imageInput').click()}>
                        <TbPhotoPlus size={24}/>
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
                    {selectedImages.map((src, index) => (
                        <ImagePreview key={index} src={src} alt={`Uploaded ${index + 1}`} />
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
`

const ImageUploadContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  ma
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
