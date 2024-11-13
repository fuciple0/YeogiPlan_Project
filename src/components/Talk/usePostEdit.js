import { useState } from 'react';
// import { updatePost } from '../postEditService'; // 수정 API 함수 가져오기

const usePostEdit = (setPosts) => {
  const [editingPostId, setEditingPostId] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedMessage, setUpdatedMessage] = useState('');

  // 수정 모드 활성화
  const handleEdit = (post) => {
    setEditingPostId(post.talk_id,userInfo.userId); // 수정 중인 게시글 ID 설정
    setUpdatedTitle(post.talk_title);
    setUpdatedMessage(post.talk_message);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditingPostId(null); // 수정 모드 종료
    setUpdatedTitle('');
    setUpdatedMessage('');
  };

  // 수정 저장
  const handleSaveEdit = async (talkId) => {
    const updatedData = {
      talk_title: updatedTitle,
      talk_message: updatedMessage,
    };

    try {
      const updatedPost = await updatePost(talkId, updatedData); // 수정 API 호출

      // 로컬 상태 업데이트
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.talk_id === talkId
            ? { ...post, ...updatedPost.data } // 서버에서 반환된 데이터로 업데이트
            : post
        )
      );

      handleCancelEdit(); // 수정 모드 종료
    } catch (error) {
      console.error('게시글 수정 중 오류 발생:', error);
    }
  };

  return {
    editingPostId,
    updatedTitle,
    updatedMessage,
    handleEdit,
    handleCancelEdit,
    handleSaveEdit,
    setUpdatedTitle,
    setUpdatedMessage,
  };
};

export default usePostEdit;
