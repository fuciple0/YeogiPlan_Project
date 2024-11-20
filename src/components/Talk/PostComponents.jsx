import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import ChipButtons from './ChipButtons';
import PostCard from './PostCard';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import TalkComponent from './TalkComponent'
import TalkModal from './TalkModal'; // TalkModal 컴포넌트
import { deletePost } from '../../services/postApi';
import usePostEdit from '../../store/usePostEdit';

const PostComponents = ({ posts, setPosts, addPostFunc}) => {
  const [currentPosts, setCurrentPosts] = useState(posts);
  const [selectedTag, setSelectedTag] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const userInfo = useSelector((state) => state.user.userInfo);

  const { editingPostId, updatedTitle, updatedMessage, handleEdit, handleCancelEdit, handleSaveEdit, setUpdatedTitle, setUpdatedMessage } 
  = usePostEdit(setPosts, userInfo);

  // 태그별 게시글 보기
  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    if (!tag) {
      setCurrentPosts(posts);
      return;
    }
    const filteredPosts = posts.filter((post) => {
      const tags = Array.isArray(post.tag) ? post.tag : post.tag.split(',');
      return tags.includes(tag);
    });
    setCurrentPosts(filteredPosts);
  };

   // 글 작성 모달 열기/닫기
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);



  const handleConfirm = async (title, content, tag) => {
    console.log("handleConfirm 호출됨");
    console.log("현재 addPostFunc 상태:", addPostFunc);
  
    if (addPostFunc) {
      try {
        console.log("addPostFunc 호출 시작");
        const newPost = await addPostFunc(title, content, tag);
        console.log("addPostFunc 호출 완료:", newPost);
  
        if (newPost) {
          console.log("게시글 추가 성공:", newPost);
          setModalOpen(false); // 모달 닫기
        }
      } catch (error) {
        console.error("게시글 추가 실패:", error);
      }
    } else {
      console.error("addPostFunc가 설정되지 않았습니다!");
    }
  };



   useEffect(() => {
    console.log("PostComponents에서 addPostFunc 상태 확인:", addPostFunc);
  }, [addPostFunc]);

    useEffect(() => {
    if (!selectedTag) {
      setCurrentPosts(posts);
    }
  }, [posts, selectedTag]);

  
  // 글 삭제 모달
  const openDeleteModal = (postId) => {
    setSelectedPostId(postId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPostId(null);
  };



  const handleDeleteConfirm = async () => {
    if (selectedPostId) {
      try {
        const isDeleted = await deletePost(selectedPostId);
        if (isDeleted) {
          setCurrentPosts((prev) => prev.filter((post) => post.talk_id !== selectedPostId));
          closeDeleteModal();
        }
      } catch (error) {
        console.error('삭제 중 오류 발생:', error);
      }
    }
  };


  return (
    <PostsContainer> 
       <TalkModal isOpen={isModalOpen} onClose={handleCloseModal} onConfirm={handleConfirm} />
       <ChipButtons onOpenModal={handleOpenModal} onSelectTag={handleTagSelect} />
     
         {currentPosts.map((post) => (
        <PostCard
          key={post.talk_id}
          post={post}
          userInfo={userInfo}
          editingPostId={editingPostId}
          updatedTitle={updatedTitle}
          updatedMessage={updatedMessage}
          handleEdit={handleEdit}
          handleCancelEdit={handleCancelEdit}
          handleSaveEdit={handleSaveEdit}
          setUpdatedTitle={setUpdatedTitle}
          setUpdatedMessage={setUpdatedMessage}
          openDeleteModal={openDeleteModal}
        />
      ))}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={closeDeleteModal}
        />
      )}
    </PostsContainer>
  );
};

export default PostComponents;

const PostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
  padding: 20px;
`;
