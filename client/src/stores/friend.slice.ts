import { createSlice } from '@reduxjs/toolkit';
import { User } from 'interfaces/index';

export interface FriendState {
  friends: User[];
}

const initialState: FriendState = {
  friends: [],
};

const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    setFriends(state, action) {
      state.friends = action.payload.friends;
    },
    addFriend(state, action) {
      if (!state.friends.some(f => f._id === action.payload.friend._id))
        state.friends = [...state.friends, action.payload.friend];
    },
  },
});

export default friendSlice;
export const friendActions = friendSlice.actions;
