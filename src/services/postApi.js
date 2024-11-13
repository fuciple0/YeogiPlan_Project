// postApi.js

// 게시글 목록 가져오기
export const fetchPosts = async (page, limit) => {
    try {
      const response = await fetch(`http://15.164.142.129:3001/api/talk_board?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("서버에서 가져온 게시글 데이터:", responseData);
        return {
          posts: responseData.data,
          pagination: responseData.pagination,
        };
      } else {
        console.error("게시글 목록을 가져오는 데 실패했습니다.");
        return { posts: [], pagination: { totalPages: 1 } };
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      return { posts: [], pagination: { totalPages: 1 } };
    }
  };
  
  // 게시글 작성
  export const addPost = async (title, content, tag, userInfo) => {
    console.log("addPost로 전달된 태그 데이터:", tag);
  
    const requestBody = {
      user_id: userInfo.userId,
      talk_title: title,
      talk_message: content,
      tag: tag?.length > 0 ? tag : null,
    };
  
    try {
      console.log("전송할 데이터:", requestBody);
      const response = await fetch('http://15.164.142.129:3001/api/talk_board', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        const newPost = {
          ...responseData.data,
          tag: JSON.parse(responseData.data.tag || "[]"),
          user: {
            nickname: userInfo.nickname,
            profile_photo: userInfo.profile_photo || null,
          },
        };
        console.log("새로운 게시글:", newPost);
        return newPost;
      } else {
        console.error("게시글 작성에 실패했습니다.");
        return null;
      }
    } catch (error) {
      console.error("Error adding post:", error);
      return null;
    }
  };


  // 게시글 수정
  export const updatePost = async (talkId, updatedData) => {
    try {
      const response = await fetch(`http://15.164.142.129:3001/api/talk_board/${talkId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error('게시글 수정에 실패했습니다.');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  };




  // 게시글 삭제
  export const deletePost = async (talk_id) => {
    try {
      const response = await fetch(`http://15.164.142.129:3001/api/talk_board/${talk_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        console.log("게시글이 삭제되었습니다.");
        return true;
      } else {
        console.error("게시글 삭제 실패");
        return false;
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      return false;
    }
  };
  