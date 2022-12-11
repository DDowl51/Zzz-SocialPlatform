import { ThunkAction } from '@reduxjs/toolkit';
import { StateType } from './store';
import { authActions } from 'stores/auth.slice';
import axios from 'axios';
import { chatActions } from './chat.slice';

export const logoutAction: ThunkAction<
  Promise<void>,
  StateType,
  {},
  any
> = async (dispatch, getState) => {
  const token = getState().auth.token;
  dispatch(authActions.logout());
  await axios.delete('/api/sse', {
    headers: { authorization: `Bearer ${token}` },
  });
  dispatch(chatActions.clearChat());
};
