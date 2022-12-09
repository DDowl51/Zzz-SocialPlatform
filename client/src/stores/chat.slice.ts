import { createSlice } from '@reduxjs/toolkit';
import { Chat } from 'interfaces';

export interface ChatState {
  [userId: string]: {
    unreadCount: number;
    chats: Chat[];
    fetched: boolean;
  };
}

const initialState: ChatState = {};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages(state, action) {
      if (!state[action.payload.userId]) {
        state[action.payload.userId] = {
          chats: [],
          unreadCount: 0,
          fetched: false,
        };
      }
      state[action.payload.userId].chats = action.payload.messages;
      state[action.payload.userId].unreadCount = state[
        action.payload.userId
      ].chats.reduce((acc, c) => (c.status === 'unread' ? acc + 1 : acc), 0);
    },
    addMessage(state, action) {
      if (!state[action.payload.userId]) {
        state[action.payload.userId] = {
          chats: [],
          unreadCount: 0,
          fetched: false,
        };
      }
      state[action.payload.userId].chats.push(action.payload.message);
      state[action.payload.userId].unreadCount = state[
        action.payload.userId
      ].chats.reduce((acc, c) => (c.status === 'unread' ? acc + 1 : acc), 0);
    },
    setFetched(state, action) {
      state[action.payload.userId].fetched = true;
    },
  },
});

export default chatSlice;
export const chatActions = chatSlice.actions;
