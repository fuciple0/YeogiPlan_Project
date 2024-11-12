import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { SiNaver } from 'react-icons/si';
import luggageImage from '../assets/luggage.png';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  padding: 40px 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Image = styled.img`
  width: 100px;
  height: auto;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const InputContainer = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-size: 12px;
  color: #333;
  margin-left: 8px;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  padding-right: 40px;
  font-size: 14px;
  border: 1px solid ${({ error }) => (error ? 'red' : '#e0e0e0')};
  border-radius: 5px;
  background-color: #f8f8f8;
  outline: none;
`;

const EyeIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  role: button;
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
  margin-top: 20px;
`;

const SocialLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
`;

const SocialButton = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
`;

const SignUpLink = styled.p`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 20px;
`;

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const Checkbox = styled.input`
  margin-right: 8px;
`;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const jsonBody = JSON.stringify(formData);

    try {
      const response = await fetch('http://15.164.142.129:3001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonBody,
      });

      const data = await response.json();

      if (response.ok) {
        // 사용자 정보 구성
        const userInfo = {
          userId: data.userId,
          email: formData.email,
          nickname: data.nickname,
          profile_photo: `http://15.164.142.129:3001/${data.user?.profile_photo}`,
          role: data.role || 'member',
        };

         // rememberMe 상태에 따라 로컬 또는 세션 스토리지에 저장
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem('accessToken', data.token);
          storage.setItem('userInfo', JSON.stringify(userInfo));

        // Redux에 사용자 정보와 토큰을 함께 저장
          dispatch(setUser({
            userInfo,
            token: data.token,
            preferences: { theme: 'dark', language: 'ko' }
          }));

        // 폼 상태 초기화
        setFormData({ email: '', password: '' });

        // 홈 페이지로 이동
        navigate('/');
        
      } else {
        setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <LoginContainer>
      <Image src={luggageImage} alt="여행 가방" />
      <Title>가장 쉬운 여행 계획,</Title>
      <Subtitle>여기플랜</Subtitle>
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <Label htmlFor="email">이메일</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="이메일을 입력하세요"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </InputContainer>
        <InputContainer>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="비밀번호를 입력하세요"
            value={formData.password}
            onChange={handleChange}
            error={!!error}
            required
          />
          <EyeIcon onClick={toggleShowPassword}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </EyeIcon>
        </InputContainer>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <RememberMeContainer>
          <Checkbox
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          로그인 유지하기
        </RememberMeContainer>

        <Button type="submit">로그인</Button>
      </Form>

      <SocialLoginContainer>
        <SocialButton><FcGoogle /></SocialButton>
        <SocialButton><SiNaver color="#03c75a" /></SocialButton>
        <SocialButton><RiKakaoTalkFill color="#fee500" /></SocialButton>
      </SocialLoginContainer>
      <SignUpLink>
        계정이 없으신가요? <a href="/signup" style={{ color: '#507DBC', textDecoration: 'none' }}>회원가입</a>
      </SignUpLink>
    </LoginContainer>
  );
};

export default Login;
