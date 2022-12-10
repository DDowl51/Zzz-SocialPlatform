import React, { FC, useMemo } from 'react';
import { Box, Card, Skeleton, Typography, useTheme } from '@mui/material';
import UserImage from 'components/UserImage';
import { User } from 'interfaces';
import { useSelector } from 'react-redux';
import { StateType } from 'stores/store';
import StyledBadge from 'components/StyledBadge';

type UserProp = {
  user: User;
  isOnline?: boolean;
  isActive?: boolean;
  onSwitch: (user: User) => void;
};

const UserChat: FC<UserProp> = ({
  user,
  isActive = false,
  isOnline = false,
  onSwitch,
}) => {
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
        <StyledBadge
          overlap='circular'
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant={isOnline ? 'dot' : undefined}
        >
          <UserImage user={user} size='3rem' />{' '}
        </StyledBadge>
      ) : (
        <Skeleton variant='circular'>
          <UserImage user={loggedUser} />
        </Skeleton>
      )}
      <Box display='flex' alignItems='center'>
        {user ? (
          <Typography ml='1rem' sx={{ color: palette.neutral.dark }}>
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
