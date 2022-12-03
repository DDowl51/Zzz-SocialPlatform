import React, { useState } from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Tooltip,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
} from '@mui/material';
import { Search, Menu, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FlexBetween from './FlexBetween';
import { useSelector } from 'react-redux';
import { StateType } from 'stores/store';
import NavItem from './NavItem';

const NavigationBar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

  const navigate = useNavigate();

  const user = useSelector<StateType>(state => state.auth.user);

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const background = theme.palette.background.default;
  const primaryDark = theme.palette.primary.dark;
  const alt = theme.palette.background.paper;

  if (!user)
    return (
      <Box
        width='100%'
        bgcolor={`rgba(${theme.palette.background.paper}, 0.99)`}
        sx={{ backdropFilter: 'blur(6px)' }}
        p='1rem 6%'
        textAlign='center'
        component='nav'
      >
        <Typography fontWeight='bold' fontSize='32px' color='primary'>
          Zzz
        </Typography>
      </Box>
    );

  return (
    <FlexBetween
      padding='1rem 6%'
      bgcolor={`rgba(${alt}, 0.99)`}
      position='fixed'
      width='100%'
      zIndex='1000'
      sx={{ backdropFilter: 'blur(6px)' }}
    >
      <FlexBetween gap='1.75rem'>
        <Typography
          fontWeight='bold'
          fontSize='clamp(1rem, 2rem, 2.25rem)'
          color='primary'
          onClick={() => navigate('/')}
          sx={{
            transition: 'color 0.2s',
            '&:hover': {
              color: primaryDark,
              cursor: 'pointer',
            },
          }}
        >
          Zzz
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween
            bgcolor={neutralLight}
            borderRadius='9px'
            gap='3rem'
            p='0.1rem 1.5rem'
          >
            <InputBase placeholder='Search...' />
            <Tooltip title='Not implemented yet'>
              <IconButton>
                <Search />
              </IconButton>
            </Tooltip>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* Desktop Navbar */}
      {isNonMobileScreens ? (
        <NavItem />
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(prev => !prev)}
          sx={{ zIndex: 1500 }}
        >
          <Menu />
        </IconButton>
      )}

      {/* Mobile Nav */}
      {!isNonMobileScreens && (
        <Slide direction='left' in={isMobileMenuToggled}>
          <Box
            position='fixed'
            right='0'
            top='0'
            pt='5rem'
            height='100vh'
            zIndex='1000'
            maxWidth='25rem'
            minWidth='15rem'
            bgcolor={background}
          >
            {/* Menu */}
            <NavItem isMobile />
          </Box>
        </Slide>
      )}
    </FlexBetween>
  );
};

export default NavigationBar;
