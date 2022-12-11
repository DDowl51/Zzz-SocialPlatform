import React, { useEffect, useMemo, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTheme } from '@mui/material/styles';
import {
  ThemeProvider,
  CssBaseline,
  PaletteMode,
  Snackbar,
  Alert,
} from '@mui/material';
import { themeSettings } from 'theme';
import { Routes, Route } from 'react-router-dom';

import HomePage from 'pages/HomePage';
import LoginPage from 'pages/LoginPage';
import ProfilePage from 'pages/ProfilePage';
import Layout from 'layouts/Layout';
import LoginForm from 'components/LoginForm';
import RegisterForm from 'components/RegisterForm';
import { StateType } from 'stores/store';
import SseContext from 'context/sse.context';

import MessagePage from 'pages/MessagePage';
import SocketContext from 'context/socket.context';
import { ClientEventType, ServerEventType, UserType } from 'interfaces';
import { chatActions } from 'stores/chat.slice';
import { fetchAllMessages } from 'stores/chat.action';

let init = false;
const App = React.memo(() => {
  const mode = useSelector<StateType, PaletteMode>(state => state.global.mode);
  const token = useSelector<StateType, string>(state => state.auth.token);
  const user = useSelector<StateType, UserType>(state => state.auth.user);
  const dispatch = useDispatch<any>();
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const sseCtx = useContext(SseContext);

  const socketCtx = useContext(SocketContext);
  const socket = socketCtx.socket;
  useEffect(() => {
    if (!init) {
      dispatch(fetchAllMessages(user?.friends || []));
      init = true;
    }
    if (user && socket) {
      socket.emit(ClientEventType.SETNAME, user._id);
      socket.on(ServerEventType.NAMESET, () => {
        socket.emit(ClientEventType.GETONLINE);
        socket.emit(ClientEventType.USERONLINE);
      });
      socket.on(ServerEventType.MESSAGEREAD, from => {
        dispatch(chatActions.setMyRead({ userId: from }));
      });
      socket.on(
        ServerEventType.RECIEVEDMESSAGE,
        (message: string, from: string) => {
          dispatch(
            chatActions.addMessage({
              userId: from,
              message: {
                content: message,
                from,
                to: user._id,
                status: 'unread',
                _id: `${Date.now()}-${user._id}-${Math.random()}`,
              },
            })
          );

          //* Show notification bar if not in message page
        }
      );
    }
    return () => {
      if (socket) {
        socket.emit(ClientEventType.DISCONNECT);
      }
      init = false;
    };
  }, [socket, user, dispatch]);

  //* Before page unload, close sse connection
  useEffect(() => {
    if (token) {
      sseCtx.connect();
    }
    return () => {
      if (token && sseCtx.sse) {
        sseCtx.disconnect();
      }
    };
  }, [sseCtx, token]);

  return (
    <ThemeProvider theme={theme}>
      <div className='app'>
        <CssBaseline />
        <Layout>
          <Routes>
            <Route path='/' element={<LoginPage />}>
              <Route path='login' element={<LoginForm />} />
              <Route path='register' element={<RegisterForm />} />
            </Route>
            <Route path='/home' element={<HomePage />} />
            <Route path='/message' element={<MessagePage />} />
            <Route path='/profile/:userId' element={<ProfilePage />} />
          </Routes>
        </Layout>
      </div>
    </ThemeProvider>
  );
});

export default App;
