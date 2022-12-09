import React, { FC, useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import UserImage from 'components/UserImage';
import { User, UserType } from 'interfaces';
import { useSelector } from 'react-redux';
import { StateType } from 'stores/store';

type UserProp = {
  user: User;
  isActive?: boolean;
  onSwitch: (user: User) => void;
};

const UserChat: FC<UserProp> = ({ user, isActive = false, onSwitch }) => {
  const loggedUser = useSelector<StateType, User>(state => state.auth.user!);

  const { palette } = useTheme();
  const activeStyle = useMemo(
    () =>
      isActive
        ? { bgcolor: palette.neutral.light, transform: 'translateX(15px)' }
        : {},
    [isActive, palette]
  );

  return (
    <Card
      onClick={() => onSwitch(user)}
      sx={{
        backgroundImage: 'none',
        display: 'flex',
        p: '0.5rem',
        boxShadow: 'none',
        borderRadius: '0.5rem',
        transition: 'all 0.3s',
        '&:hover': { bgcolor: palette.neutral.light },
        ...activeStyle,
      }}
    >
      {user ? (
        <UserImage user={user} size='3rem' sx={{ mr: '1rem' }} />
      ) : (
        <Skeleton variant='circular'>
          <UserImage user={loggedUser} sx={{ mr: '1rem' }} />
        </Skeleton>
      )}
      <Box display='flex' alignItems='center'>
        {user ? (
          <Typography sx={{ color: palette.neutral.dark }}>
            {user.name}
          </Typography>
        ) : (
          <Skeleton width='3rem' />
        )}
      </Box>
    </Card>
  );
};

export default UserChat;
