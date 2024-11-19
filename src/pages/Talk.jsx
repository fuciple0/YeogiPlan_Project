// src/pages/Talk.jsx
import React, { useState } from 'react';
import ImageContainer from '../components/Talk/ImageContainer';
import TalkLocationModal from '../components/Talk/TalkLocationModal';
import TalkComponent from '../components/Talk/TalkComponent';
import tiwanImage from '../assets/talk_img/tiwan2.jpg';

const Talk = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]); // 초기 게시글 상태
  const [addPostFunc, setAddPostFunc] = useState(null); // `addPost`를 저장할 상태
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);



  const openLocationModal = () => setIsLocationModalOpen(true);
  const closeLocationModal = () => setIsLocationModalOpen(false);

  
//  `TalkComponent`에서 `addPost` 함수를 받아오는 함수
  const handleAddPostFunc = (addPost) => {
    console.log("addPostFunc 설정됨:", addPost);
    setAddPostFunc(() => addPost);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  const handleConfirm = (title, content, tag) => {
    console.log("addPostFunc 상태:", addPostFunc); // 확인 로그
    if (addPostFunc) {
      addPostFunc(title, content,tag);
      console.log("게시글 추가 완료");
      closeModal();
    }
  };

  
return (
    <>
      <ImageContainer imageUrl={tiwanImage} onClick={openLocationModal} />
      
    
         {/* `handleAddPostFunc`를 통해 `addPost`를 전달받기 */} 
       <TalkComponent onAddPost={handleAddPostFunc} />
       
       <TalkLocationModal isOpen={isLocationModalOpen} onClose={closeLocationModal} />
       

    </>
  );
};

export default Talk;