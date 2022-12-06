import { MouseEvent, useState, useCallback, useEffect } from 'react';
import {
  Box,
  IconButton,
  Popover,
  Badge,
  useTheme,
  Typography,
  Button,
  useMediaQuery,
} from '@mui/material';
import { Notifications } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from 'stores/store';
import { Notification } from 'interfaces';
import useHttp, { HandleFn } from 'hooks/useHttp';
import NotificatioComponent from 'components/NotificationComponent';
import { notificationActions } from 'stores/notification.slice';
import { markAllNotesRead } from 'stores/notification.action';

const NavNotification = () => {
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');
  const { palette } = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const token = useSelector<StateType, string>(state => state.auth.token);
  const notifications = useSelector<StateType, Notification[]>(
    state => state.notification.notifications
  );
  const dispatch = useDispatch<any>();
  const unreadNote = useSelector<StateType, number>(
    state => state.notification.unread
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Fetch notifications from server
  const handleNotifications = useCallback<HandleFn<Notification[]>>(
    data => {
      console.log(data);

      dispatch(notificationActions.setAllNotes({ notifications: data }));
    },
    [dispatch]
  );

  const { error, makeRequest: fetchNote } = useHttp(
    '/api/notifications',
    handleNotifications,
    'get'
  );

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    fetchNote({ token });
  }, [fetchNote, token]);

  return (
    <>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={unreadNote} color='primary' variant='dot'>
          <Notifications sx={{ fontSize: '25px' }} />
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: isNonMobileScreens ? 'top' : 'center',
          horizontal: isNonMobileScreens ? 'center' : 'right',
        }}
      >
        <Box m='0.5rem 1rem 1rem 1rem' sx={{ borderRadius: '1rem' }}>
          <Box display='flex' justifyContent='end' alignItems='center'>
            <Button
              size='small'
              variant='outlined'
              sx={{
                color: palette.neutral.dark,
                borderRadius: '8px',
                borderColor: palette.neutral.dark,
                p: '0.1rem 0.5rem',
              }}
              onClick={() => {
                dispatch(markAllNotesRead());
              }}
            >
              <Typography fontSize='0.25rem'>Mark all read</Typography>
            </Button>
          </Box>
          {notifications.length === 0 ? (
            <Typography p='1rem'>No notifications yet...</Typography>
          ) : (
            notifications.map(n => (
              <NotificatioComponent key={n._id} notification={n} />
            ))
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NavNotification;
