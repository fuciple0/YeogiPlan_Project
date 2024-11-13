import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [], // 게시글 데이터
};
//댓글 추가/삭제와 같은 이벤트가 발생하면 이 액션이 호출
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload; // 게시글 데이터를 설정
    },
    updateCommentCount(state, action) {
      const { talk_id, increment } = action.payload;
      const post = state.posts.find((post) => post.talk_id === talk_id);
      if (post) {
        post.comment_count += increment; // 댓글 수 업데이트
      }
    },
  },
});

export const { setPosts, updateCommentCount } = postsSlice.actions;
export default postsSlice.reducer;
