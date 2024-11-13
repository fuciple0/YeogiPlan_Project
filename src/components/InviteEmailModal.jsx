// InviteEmailModal.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Dialog, TextField, Button, Avatar } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

const InviteEmailModal = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [invites, setInvites] = useState([]);

  const handleAddInvite = () => {
    if (email && invites.length < 5) {
      setInvites([...invites, { name: '상대방 닉네임', email }]);
      setEmail('');
    }
  };

    // 빈 자리 계산
    const emptySlots = 5 - invites.length;

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <ModalContent>
        <Header>
          <EmailIcon fontSize="large" />
          이메일로 초대하기
        </Header>
        <InputContainer>
          <StyledTextField
            placeholder="이메일을 입력해주세요"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <StyledButton onClick={handleAddInvite} disabled={!email}>
            초대하기
          </StyledButton>
        </InputContainer>
        <InfoTextContainer>
          <InfoText>*일행은 최대 5명까지 초대할 수 있습니다</InfoText>
        </InfoTextContainer>
        <InviteList>
            {/* 초대된 일행들 */}
            {invites.map((invitee, index) => (
                <InviteItem key={index}>
                    <Avatar src="" alt="프로필 이미지" />
                    <InviteName>{invitee.name}</InviteName>
                </InviteItem>
            ))}
            {/* 모달 크기를 고정하기 위한 보이지 않는 빈 자리들 */}
            {Array.from({ length: emptySlots }).map((_, index) => (
                <InvisibleInviteItem key={`empty-${index}`} />
            ))}
        </InviteList>
      </ModalContent>
    </StyledDialog>
  );
};

export default InviteEmailModal;

// Styled Components
const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    padding: 20px;
    border-radius: 12px;
    /* 모달의 최대 높이 설정 (5명 기준 높이) */
    max-height: 600px;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const StyledTextField = styled(TextField)`
  flex: 1;
`;

const StyledButton = styled(Button)`
  background-color: #507dbc;
  color: white;
  &:hover {
    background-color: #507dbc;
    color: white;
  }
`;

const InfoTextContainer = styled.div`
  width: 100%;
  text-align: left; /* 왼쪽 정렬을 적용하기 위해 상위 컨테이너를 추가 */
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  color: #507dbc;
  margin-top: 8px;
  margin-left: 8px;
`;

const InviteList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  width: 100%;
/* 고정된 높이 설정 */
min-height: 300px; /* 필요에 따라 조절 */
`;

const InviteItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InviteName = styled.div`
  font-size: 1rem;
`;

/* 보이지 않는 빈 자리 */
const InvisibleInviteItem = styled(InviteItem)`
  visibility: hidden;
`;

