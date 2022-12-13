import { Typography, useTheme, Box, Skeleton } from '@mui/material';
import Friend from 'components/Friend';
import WidgetWrapper from 'components/WidgetWrapper';
import useHttp, { HandleFn } from 'hooks/useHttp';
import { User } from 'interfaces';
import { FC, useEffect, useCallback, useState } from 'react';

type FriendListProps = {
  user: User;
  loading?: boolean;
};

const FriendListWidget: FC<FriendListProps> = ({ user, loading = false }) => {
  const { palette } = useTheme();
  const friends = user.friends;

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant='h5'
        fontWeight='500'
        sx={{ mb: '1.5rem' }}
      >
        Friend List
      </Typography>
      <Box display='flex' flexDirection='column' gap='1.5rem'>
        {loading ? (
          <Skeleton />
        ) : (
          friends.length !== 0 &&
          friends.map(friend => <Friend key={friend} friendId={friend} />)
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
