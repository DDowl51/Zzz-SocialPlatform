import { createSlice } from '@reduxjs/toolkit';
import { UserType } from 'interfaces/index';

export interface AuthState {
  user: UserType;
  token: string;
}

const initialState: AuthState = {
  user: undefined,
  token: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state) {
      state.user = undefined;
      state.token = '';
    },
    setUserFriends(state, action) {
      if (state.user) state.user.friends = action.payload.friends;
    },
  },
});

export default authSlice;
export const authActions = authSlice.actions;
