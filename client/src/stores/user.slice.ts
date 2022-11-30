import { createSlice } from '@reduxjs/toolkit';
import { UserType } from 'interfaces/index';

export interface UserState {
  user: UserType;
}

const initialState: UserState = {
  user: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
    },
    setFriends(state, action) {
      if (state.user) state.user.friends = action.payload.friends;
      else console.error('user friends non-existent');
    },
  },
});

export default userSlice;
export const userActions = userSlice.actions;
