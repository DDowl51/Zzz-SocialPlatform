import React, { FC } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Notification } from 'interfaces';
import UserImage from 'components/UserImage';
import { useNavigate } from 'react-router-dom';
import { getDate } from 'utils/getDate';

type NotificatioComponentProp = {
  notification: Notification;
};

const NotificatioComponent: FC<NotificatioComponentProp> = ({
  notification,
}) => {
  const { palette } = useTheme();
  const navigate = useNavigate();

  return (
    <Box key={notification._id} maxWidth='15rem' mt='0.5rem'>
      <Box display='flex' gap='0.5rem'>
        <UserImage user={notification.from} size='30px' />
        <Box
          sx={{
            color:
              notification.status === 'read'
                ? palette.neutral.medium
                : palette.neutral.dark,
          }}
        >
          <Typography
            onClick={() => navigate(`/profile/${notification.from._id}`)}
            variant='body2'
            fontSize='0.9rem'
            sx={{
              color: palette.primary.dark,
              textDecoration: 'none',
              '&:hover': {
                cursor: 'pointer',
              },
            }}
          >
            {notification.from.name}
          </Typography>
          <Typography variant='body2' fontSize='0.9rem'>{` ${
            notification.type === 'like' ? 'liked' : 'commented'
          } `}</Typography>
          <Typography
            onClick={() => navigate(`/post/${notification.targetPost}`)}
            variant='body2'
            fontSize='0.9rem'
            sx={{
              color: palette.primary.dark,
              textDecoration: 'none',
              '&:hover': {
                cursor: 'pointer',
              },
            }}
          >
            your post
          </Typography>
          <Typography
            lineHeight='1'
            p='0'
            variant='subtitle1'
            sx={{ color: palette.neutral.mediumMain }}
          >
            {getDate(notification.createdAt)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default NotificatioComponent;
