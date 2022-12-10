import React, { useEffect, useMemo, useContext } from 'react';
import { useSelector } from 'react-redux';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider, CssBaseline, PaletteMode } from '@mui/material';
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

const App = React.memo(() => {
  const mode = useSelector<StateType, PaletteMode>(state => state.global.mode);
  const token = useSelector<StateType, string>(state => state.auth.token);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const sseCtx = useContext(SseContext);

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
