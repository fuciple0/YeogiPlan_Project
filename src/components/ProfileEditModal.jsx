import { useState } from "react"
import { FaCamera } from 'react-icons/fa';
import styled from "styled-components";

const ProfileEditModal = ({ isOpen, onClose, onSave, initialProfileImage, initialNickname}) => {
    const [profileImage, setProfileImage] = useState(initialProfileImage)
    const [nickname, setNickname] = useState(initialNickname)

    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if(file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfileImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = () => {
        if(!nickname.trim()) {
            alert('닉네임을 입력하세요.')
            return
        }

        onSave({ profileImage, nickname })
        onClose()
    }

    if(!isOpen) return null
    
    return (
        <Overlay>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ProfileImageContainer onClick={() => document.getElementById('fileInput').click()}>
                        <ProfileImage src={profileImage} alt="프로필 이미지" />
                        <UploadIcon>
                            <FaCamera size={20} color="#555" />
                            <HiddenInput
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </UploadIcon>
                    </ProfileImageContainer>
                <NicknameInput type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="변경하고 싶은 닉네임을 입력하세요" />
                <ButtonContainer>
                    <CancelButton onClick={onClose}>취소</CancelButton>
                    <SaveButton onClick={handleSave}>적용</SaveButton>
                </ButtonContainer>
            </ModalContent>
        </Overlay>
    )
}

export default ProfileEditModal

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
  width: 90%;
  max-width: 480px;
  height: 360px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const ProfileImageContainer = styled.div`
  position: relative;
  cursor: pointer;
`

const ProfileImage = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
`

const UploadIcon = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid #d1d1d1;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
`;

const HiddenInput = styled.input`
    display: none;
`

const NicknameInput = styled.input`
  width: 64%;
  padding: 10px;
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  text-align: center;
  &:focus {
    outline: none;
    border-color: #507DBC;
  }

  /* placeholder 스타일 */
  &::placeholder {
    font-size: 14px;
  }
`

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    margin-top: 20px;
    width: 70%;
`

const CancelButton = styled.button`
    width: 30%;
    padding: 10px 0;
    font-size: 14px;
    color: #507DBC;
    background: none;
    border: 1px solid #507DBC;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #507DBC;
        color: white;
    }
`

const SaveButton = styled.button`
    width: 30%;
    padding: 10px 0;
    font-size: 14px;
    color: #507DBC;
    background: none;
    border: 1px solid #507DBC;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #507DBC;
        color: white;
    }
`