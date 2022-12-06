import { createSlice } from '@reduxjs/toolkit';
import { Notification } from 'interfaces';

export type NotificationState = {
  notifications: Notification[];
  unread: number;
};

const initialState: NotificationState = {
  notifications: [],
  unread: 0,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setAllNotes(state, action) {
      state.notifications = action.payload.notifications;
      state.unread = state.notifications.reduce(
        (acc, n) => (n.status === 'unread' ? acc + 1 : acc),
        0
      );
    },
    setNote(state, action) {
      state.notifications = state.notifications.filter(n => {
        if (n._id === action.payload.notification._id) {
          return action.payload.notification;
        }
        return n;
      });
      state.unread = state.notifications.reduce(
        (acc, n) => (n.status === 'unread' ? acc + 1 : acc),
        0
      );
    },
    removeNote(state, action) {
      state.notifications = state.notifications.filter(
        n => n._id !== action.payload.id
      );
      state.unread = state.notifications.reduce(
        (acc, n) => (n.status === 'unread' ? acc + 1 : acc),
        0
      );
    },
  },
});

export default notificationSlice;
export const notificationActions = notificationSlice.actions;
