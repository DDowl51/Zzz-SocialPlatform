import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider, CssBaseline, PaletteMode } from '@mui/material';
import { themeSettings } from 'theme';
import { Routes, Route } from 'react-router-dom';
import { EventSourcePolyfill } from 'event-source-polyfill';
import HomePage from 'pages/HomePage';
import LoginPage from 'pages/LoginPage';
import ProfilePage from 'pages/ProfilePage';
import Layout from 'layouts/Layout';
import LoginForm from 'components/LoginForm';
import RegisterForm from 'components/RegisterForm';
import { StateType } from 'stores/store';
import { UserType } from 'interfaces';
import useHttp from 'hooks/useHttp';

let init = false;
let sse: EventSourcePolyfill | null;
const App = React.memo(() => {
  const mode = useSelector<StateType, PaletteMode>(state => state.global.mode);
  const token = useSelector<StateType, string>(state => state.auth.token);
  const user = useSelector<StateType, UserType>(state => state.auth.user);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  const { makeRequest: emitSseClosure } = useHttp(
    '/api/sse',
    useCallback(() => {}, []),
    'delete'
  );

  useEffect(() => {
    if (token) {
      sse = new EventSourcePolyfill('/api/sse', {
        headers: { authorization: `Bearer ${token}` },
      });
    }
    if (sse && !init) {
      sse.addEventListener('message', event => console.log(event.data));
    }
  }, [token, emitSseClosure]);

  useEffect(() => {
    return () => {
      if (token && sse) {
        console.log('close connection');
        sse.close();
        emitSseClosure({ token });
      }
    };
  }, [emitSseClosure, token]);

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
            <Route path='/profile/:userId' element={<ProfilePage />} />
          </Routes>
        </Layout>
      </div>
    </ThemeProvider>
  );
});

export default App;
