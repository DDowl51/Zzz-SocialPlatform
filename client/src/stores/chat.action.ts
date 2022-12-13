import { ThunkAction } from '@reduxjs/toolkit';
import { StateType } from './store';
import { chatActions } from 'stores/chat.slice';
import axios from 'axios';
import friendSlice from './friend.slice';

export const messageRead =
  (userId: string): ThunkAction<Promise<void>, StateType, {}, any> =>
  async (dispatch, getState) => {
    const token = getState().auth.token;
    dispatch(chatActions.setRead({ userId }));
    await axios.patch(
      `/api/chats/${userId}`,
      {},
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
  };

export const fetchAllMessages =
  (friends: string[]): ThunkAction<Promise<void>, StateType, {}, any> =>
  async (dispatch, getState) => {
    const token = getState().auth.token;
    friends.forEach(async userId => {
      const response = await axios.get(`/api/chats/${userId}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      const messages = response.data;
      dispatch(chatActions.setMessages({ userId, messages }));
    });
  };
