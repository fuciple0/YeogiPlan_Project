import React from 'react';
import styled from 'styled-components';

const EditPost = ({ post, onCancel }) => {
  const [updatedTitle, setUpdatedTitle] = React.useState(post.talk_title);
  const [updatedMessage, setUpdatedMessage] = React.useState(post.talk_message);

  const handleSave = () => {
    console.log('저장:', updatedTitle, updatedMessage);
    onCancel();
  };

  return (
    <EditContainer>
      <EditInput
        type="text"
        value={updatedTitle}
        onChange={(e) => setUpdatedTitle(e.target.value)}
        placeholder="제목 수정"
      />
      <EditTextarea
        value={updatedMessage}
        onChange={(e) => setUpdatedMessage(e.target.value)}
        placeholder="내용 수정"
      />
      <EditActions>
        <EditButton onClick={handleSave}>저장</EditButton>
        <CancelButton onClick={onCancel}>취소</CancelButton>
      </EditActions>
    </EditContainer>
  );
};

export default EditPost;

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EditInput = styled.input`
  padding: 8px;
  border: none;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
`;

const EditTextarea = styled.textarea`
  padding: 8px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  resize: none;
`;

const EditActions = styled.div`
  display: flex;
  gap: 8px;
`;

const EditButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  background-color: #ccc;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
