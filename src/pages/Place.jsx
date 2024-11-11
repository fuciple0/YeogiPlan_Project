// src/pages/Place.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCamera, FaEye, FaEyeSlash } from 'react-icons/fa';
import default_profile from '../assets/user_profile.png';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';

const PlaceContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const ProfileContainer = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

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
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  width: 100%;
`;

const InputContainer = styled.div`
  width: 100%;
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  color: black;
  margin-left: 1rem;
  margin-bottom: 5px;
  margin-top: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  padding-right: 40px;
  font-size: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background-color: #f8f8f8;
  color: #333;
  outline: none;
`;

const EyeIcon = styled.div`
  position: absolute;
  top: 75%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: #d6340b;
  font-size: 12px;
  margin: 0px 0 0 0;
  text-align: left;
  width: 100%;
  padding-left: 1rem;
`;

const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  background-color: #507DBC;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 40px;
`;

const Place = () => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        profile_photo: null
    });
    const [profileImage, setProfileImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profile_photo: file });
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 비밀번호 확인
        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다. 다시 입력해주세요');
            return;
        }
        setError('');

        // FormData 생성 및 데이터 추가
        const formDataToSend = new FormData();
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('nickname', formData.nickname);
        formDataToSend.append('profile_photo', formData.profile_photo);

        try {
            const response = await fetch('http://15.164.142.129:3001/api/users/register', {
                method: 'POST',
                body: formDataToSend,
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                // Redux에 사용자 정보 저장
                dispatch(setUser({
                    userInfo: {
                        userId: data.userId,
                        email: formData.email,
                        nickname: formData.nickname,
                        profile_photo: data.profile_photo,
                        role: 'member'
                    },
                    token: data.token,
                    preferences: { theme: 'dark', language: 'ko' }
                }));

                setFormData({ email: '', password: '', confirmPassword: '', nickname: '', profile_photo: null });
                setProfileImage(null); // 프로필 이미지 초기화
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <PlaceContainer>
            <ProfileWrapper>
                <ProfileContainer onClick={() => document.getElementById('fileInput').click()}>
                    {profileImage ? (
                        <ProfileImage src={profileImage} alt="Profile" />
                    ) : (
                        <ProfileImage src={default_profile} alt="Default Profile" />
                    )}
                </ProfileContainer>
                <UploadIcon onClick={() => document.getElementById('fileInput').click()}>
                    <FaCamera size={20} color="#555" />
                </UploadIcon>
                <HiddenInput
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </ProfileWrapper>

            <Form onSubmit={handleSubmit}>
                <InputContainer>
                    <Label htmlFor="email">이메일</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="aaa@aaa.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </InputContainer>
                <InputContainer>
                    <Label htmlFor="password">비밀번호</Label>
                    <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="6자리 이상 입력해주세요"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <EyeIcon onClick={toggleShowPassword}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </EyeIcon>
                </InputContainer>
                <InputContainer>
                    <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="비밀번호 확인"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <EyeIcon onClick={toggleShowConfirmPassword}>
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </EyeIcon>
                </InputContainer>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <InputContainer>
                    <Label htmlFor="nickname">닉네임</Label>
                    <Input
                        type="text"
                        id="nickname"
                        name="nickname"
                        placeholder="닉네임을 입력해주세요"
                        value={formData.nickname}
                        onChange={handleChange}
                        required
                    />
                </InputContainer>
                <Button type="submit">회원가입</Button>
            </Form>
        </PlaceContainer>
    );
};

export default Place;
