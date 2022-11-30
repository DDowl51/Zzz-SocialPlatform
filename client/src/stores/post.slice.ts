import { createSlice } from '@reduxjs/toolkit';
import { Post } from 'interfaces/index';

export interface PostState {
  posts: Post[];
}

const initialState: PostState = {
  posts: [],
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload.posts;
    },
    setPost(state, action) {
      state.posts = state.posts.map(post =>
        post._id === action.payload.post._id ? action.payload.post : post
      );
    },
  },
});

export default postSlice;
export const postActions = postSlice.actions;
