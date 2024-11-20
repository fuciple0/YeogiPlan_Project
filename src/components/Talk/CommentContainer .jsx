import React, { useState, useEffect } from "react";
import CommentComponents from "./CommentComponents";
import { fetchComments, deleteComment } from "../../services/commentsHelper";

const CommentContainer = ({ talkId, userInfo }) => {
  const [comments, setComments] = useState([]);

  // 댓글 로드
  useEffect(() => {
    const loadComments = async () => {
      const fetchedComments = await fetchComments(talkId);
      setComments(fetchedComments);
    };
    loadComments();
  }, [talkId]);

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId) => {
    const response = await deleteComment(talkId, commentId);
    if (response?.status === "success") {
      // 성공적으로 삭제된 경우 로컬 상태에서 삭제
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.comment_id !== commentId)
      );
    } else {
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  return (
    <CommentComponents
      comments={comments}
      userInfo={userInfo}
      onCommentSubmit={(handleCommentSubmit) => {
        // 댓글 작성 로직
        console.log("댓글 작성:", handleCommentSubmit);
      }}
      onDeleteComment={handleDeleteComment}
    />
  );
};

export default CommentContainer;
