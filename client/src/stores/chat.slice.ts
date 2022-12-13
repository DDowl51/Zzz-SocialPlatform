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
      ].chats.reduce(
        (acc, c) =>
          c.from === action.payload.userId && c.status === 'unread'
            ? acc + 1
            : acc,
        0
      );
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
      ].chats.reduce(
        (acc, c) =>
          c.from === action.payload.userId && c.status === 'unread'
            ? acc + 1
            : acc,
        0
      );
    },
    setFetched(state, action) {
      state[action.payload.userId].fetched = true;
    },
    setRead(state, action) {
      state[action.payload.userId].unreadCount = 0;
      state[action.payload.userId].chats = state[
        action.payload.userId
      ].chats.map(c => {
        if (c.from === action.payload.userId) {
          return { ...c, status: 'read' };
        } else {
          return c;
        }
      });
    },
    setMyRead(state, action) {
      state[action.payload.userId].chats = state[
        action.payload.userId
      ].chats.map(c => {
        if (c.to === action.payload.userId) {
          return { ...c, status: 'read' };
        } else {
          return c;
        }
      });
    },
    clearChat(state) {
      for (const key in state) {
        state[key] = { unreadCount: 0, chats: [], fetched: false };
      }
    },
  },
});

export default chatSlice;
export const chatActions = chatSlice.actions;
