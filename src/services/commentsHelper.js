import { updateCommentCount } from '../store/postsSlice';

// 댓글 가져오기 함수
export const fetchComments = async (talk_id, setCommentsData) => {
    try {
      const response = await fetch(`http://15.164.142.129:3001/api/talk_board/${talk_id}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const responseData = await response.json();
        setCommentsData((prevData) => ({
          ...prevData,
          [talk_id]: responseData.data || [],
        }));
      } else {
        console.error("댓글 목록을 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  
  // 댓글 작성 함수
  export const handleCommentSubmit = async (talk_id, commentText, userInfo) => {
    if (!commentText.trim()) return;
  
    try {
      const response = await fetch(`http://15.164.142.129:3001/api/talk_board/${talk_id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userInfo.userId,
          contents: commentText,
          parent_id: null,
        }),
     } );
  
    
        if (response.ok) {
          dispatch(updateCommentCount({ talk_id, increment: 1 })); // Redux 상태에서 댓글 수 업데이트
      } else {
        console.error('댓글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };
  
  // 댓글 아이콘 클릭 시 댓글 목록 표시
  export const handleCommentIconClick = (talk_id, activePost, setActivePost, fetchComments) => {
    setActivePost((prev) => (prev === talk_id ? null : talk_id)); // 이미 열려 있으면 닫기
    if (activePost !== talk_id) fetchComments(talk_id); // 댓글 목록 가져오기
  };
  