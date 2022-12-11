import { FC, PropsWithChildren, useMemo } from 'react';
import {
  IconButton,
  Button,
  Badge,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Logout,
  Help,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { globalActions } from 'stores/global.slice';
import FlexBetween from 'components/FlexBetween';
import { StateType } from 'stores/store';
import { authActions } from 'stores/auth.slice';
import { UserType } from 'interfaces/index';
import NavNotification from './NavNotification';
import { useNavigate } from 'react-router-dom';
import { ChatState } from 'stores/chat.slice';
import { logoutAction } from 'stores/auth.action';

interface NavItemProps {
  isMobile?: boolean;
}

const NavItem: FC<PropsWithChildren<NavItemProps>> = ({ isMobile }) => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const user = useSelector<StateType, UserType | undefined>(
    state => state.auth.user
  );

  const chatObj = useSelector<StateType, ChatState>(state => state.chat);

  const hasUnread = useMemo(
    () => Object.values(chatObj).reduce((acc, c) => acc + c.unreadCount, 0),
    [chatObj]
  );

  const theme = useTheme();
  const { palette } = theme;
  const dark = theme.palette.neutral.dark;

  const username = (user && user.name) || 'Anonymous';

  return (
    <FlexBetween
      gap={isMobile ? '3rem' : '2rem'}
      display='flex'
      flexDirection={isMobile ? 'column' : 'row'}
    >
      <IconButton onClick={() => dispatch(globalActions.switchMode())}>
        {theme.palette.mode === 'dark' ? (
          <LightMode sx={{ fontSize: '25px', color: dark }} />
        ) : (
          <DarkMode sx={{ fontSize: '25px' }} />
        )}
      </IconButton>
      <IconButton onClick={() => navigate('/message')}>
        <Badge badgeContent={hasUnread} color='primary' variant='dot'>
          <Message sx={{ fontSize: '25px' }} />{' '}
        </Badge>
      </IconButton>
      <NavNotification />
      <Tooltip title='Not implemented yet'>
        <IconButton>
          <Help sx={{ fontSize: '25px' }} />
        </IconButton>
      </Tooltip>
      <Button
        sx={{ color: palette.primary.dark }}
        onClick={() => dispatch(logoutAction)}
      >
        <Typography pr='0.5rem'>{username}</Typography>
        <Logout sx={{ fontSize: '25px' }} />
      </Button>
    </FlexBetween>
  );
};

export default NavItem;
