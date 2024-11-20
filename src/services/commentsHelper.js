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
          const newComment = await response.json(); // 서버에서 새 댓글 데이터를 가져옴
            // Redux 상태 업데이트
           dispatch(addComment({ talk_id, 
           comment: { ...newComment, nickname: userInfo.nickname } 
      }));
      dispatch(updateCommentCount({ talk_id, increment: 1 })); // 댓글 수 업데이트
      } else {
        console.error('댓글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

// 댓글 삭제 함수
export const deleteComment = async (talk_id, comment_id) => {
  try {
    const response = await fetch(
      `http://15.164.142.129:3001/api/talk_board/${talk_id}/comments/${comment_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      console.log("댓글 삭제 성공:", responseData);
      return responseData; // 삭제 성공 응답 반환
    } else {
      console.error("댓글 삭제 실패");
      return null;
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    return null;
  }
};
  



  
  // 댓글 아이콘 클릭 시 댓글 목록 표시
  export const handleCommentIconClick = (talk_id, activePost, setActivePost, fetchComments) => {
    setActivePost((prev) => (prev === talk_id ? null : talk_id)); // 이미 열려 있으면 닫기
    if (activePost !== talk_id) fetchComments(talk_id); // 댓글 목록 가져오기
  };
  