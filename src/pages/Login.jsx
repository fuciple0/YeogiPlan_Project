// src/pages/Login.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  background-color: #507DBC; /* 버튼 색상 변경 */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
`;

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const toggleShowPassword = () => setShowPassword(!showPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setError('');
        
        // FormData 생성 및 데이터 추가
        const formDataToSend = new FormData();
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
    
        // 서버로 전송할 데이터 확인 로그 출력
        console.log("FormData to send:");
        for (const [key, value] of formDataToSend.entries()) {
            console.log(`${key}:`, value);
        }
    
        try {
            const response = await fetch('http://192.168.50.34:3001/api/users/login', {
                method: 'POST',
                body: formDataToSend,
            });
    
            const data = await response.json();
            if (response.ok) {
                alert('로그인 성공');
                setFormData({ email: '', password: '' });
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
                        placeholder="비밀번호를 입력해주세요"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <EyeIcon onClick={toggleShowPassword}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </EyeIcon>
                </InputContainer>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <Button type="submit">로그인</Button>
            </Form>
        </LoginContainer>
    );
};

export default Login;