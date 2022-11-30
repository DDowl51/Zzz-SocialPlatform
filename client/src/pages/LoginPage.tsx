import { useEffect } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { StateType } from 'stores/store';
import { UserType } from 'interfaces/index';

const LoginPage = () => {
  const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');
  const navigate = useNavigate();
  const user = useSelector<StateType, UserType>(state => state.auth.user);
  const location = useLocation();

  const { palette } = useTheme();

  // Navigate to HomePage if logged in
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/login');
    }

    if (user) {
      navigate('/home');
    }
  }, [user, navigate, location]);

  return (
    <Box
      width={isNonMobileScreen ? '50%' : '93%'}
      bgcolor={palette.background.paper}
      p='2rem'
      m='2rem auto'
      borderRadius='1.5rem'
    >
      <Typography fontWeight='500' variant='h5' sx={{ mb: '1.5rem' }}>
        Welcome to Zzz, you can say whatever you want here.
      </Typography>

      {/* Form */}
      <Outlet />
    </Box>
  );
};

export default LoginPage;
