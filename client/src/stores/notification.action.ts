import { ThunkAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { notificationActions } from './notification.slice';
import { StateType } from './store';

export const fetchNote =
  (): ThunkAction<Promise<void>, StateType, unknown, any> =>
  async (dispatch, getState) => {
    const token = getState().auth.token;
    const { data } = await axios.get('/api/notifications', {
      headers: { authorization: `Bearer ${token}` },
    });
    dispatch(notificationActions.setAllNotes({ notifications: data }));
  };

export const markNoteRead =
  (id: string): ThunkAction<Promise<void>, StateType, unknown, any> =>
  async (dispatch, getState) => {
    const token = getState().auth.token;
    const { data } = await axios.patch(
      `/api/notifications/${id}`,
      {},
      { headers: { authorization: `Bearer ${token}` } }
    );
    dispatch(notificationActions.setNote({ notification: data }));
  };

export const markAllNotesRead =
  (): ThunkAction<Promise<void>, StateType, unknown, any> =>
  async (dispatch, getState) => {
    const token = getState().auth.token;
    const { data } = await axios.patch(
      `/api/notifications`,
      {},
      { headers: { authorization: `Bearer ${token}` } }
    );
    dispatch(notificationActions.setAllNotes({ notifications: data }));
  };
