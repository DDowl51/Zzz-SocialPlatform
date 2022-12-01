import React, {
  useCallback,
  PropsWithChildren,
  FC,
  useEffect,
  useState,
} from 'react';
import { PersonAddOutlined, PersonRemoveOutlined } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Typography,
  Chip,
  Skeleton,
  useTheme,
  Avatar,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import FlexBetween from './FlexBetween';
import { StateType } from 'stores/store';
import { User, UserType } from 'interfaces';
import { authActions } from 'stores/auth.slice';
import useHttp, { HandleFn } from 'hooks/useHttp';
import { friendActions } from 'stores/friend.slice';

type FriendProps = PropsWithChildren<{
  friendId: string;
  subtitle?: string;
}>;

const Friend: FC<FriendProps> = React.memo(({ friendId, subtitle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector<StateType, UserType>(state => state.auth.user);
  const token = useSelector<StateType, string>(state => state.auth.token);
  const localFriends = useSelector<StateType, User[]>(
    state => state.friend.friends
  );
  const userFriends = user?.friends || [];

  const [friendUser, setFriendUser] = useState<UserType>();

  const { palette } = useTheme();
  const primaryDark = palette.primary.dark;
  const primaryLight = palette.primary.light;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = userFriends.some(fId => fId === friendId);
  const isSelf = user?._id === friendId;

  const setUserFriends = useCallback<HandleFn<User>>(
    data => {
      dispatch(authActions.setUserFriends({ friends: data.friends }));
    },
    [dispatch]
  );

  const { error, makeRequest: handleFriend } = useHttp(
    `/api/users/friends/${friendId}`,
    setUserFriends,
    'patch'
  );

  const setFriendUserData = useCallback<HandleFn<User>>(
    data => {
      setFriendUser(data);
      dispatch(friendActions.addFriend({ friend: data }));
    },
    [dispatch]
  );

  const { makeRequest: getFriendUser, error: errorGetFriend } = useHttp(
    `/api/users/${friendId}`,
    setFriendUserData,
    'get'
  );

  useEffect(() => {
    const foundFriend = localFriends.find(lf => lf._id === friendId);
    if (foundFriend) {
      setFriendUser(foundFriend);
    } else {
      getFriendUser({});
    }
    if (error) throw error;
    if (errorGetFriend) throw errorGetFriend;
  }, [error, errorGetFriend, getFriendUser, friendId, localFriends]);

  const patchFriend = () => {
    handleFriend({ token });
  };

  return (
    <FlexBetween>
      <FlexBetween gap='1rem'>
        {friendUser ? (
          <Avatar
            src={`/assets/${friendUser.picturePath}`}
            alt={friendUser.name}
            sx={{ width: 55, height: 55 }}
          />
        ) : (
          <Skeleton variant='circular'>
            <Avatar src='' alt='' sx={{ width: 55, height: 55 }} />
          </Skeleton>
        )}

        <Box onClick={() => navigate(`/profile/${friendId}`)}>
          <Box display='flex' gap='0.5rem' alignItems='center'>
            {friendUser ? (
              <>
                <Typography
                  color={main}
                  variant='h5'
                  display='inline'
                  fontWeight='500'
                  sx={{
                    transition: 'all 0.3s',
                    '&:hover': {
                      color: palette.primary.main,
                      cursor: 'pointer',
                    },
                  }}
                >
                  {friendUser.name}
                </Typography>
                {isSelf && <Chip label='You' size='small' />}
              </>
            ) : (
              <Skeleton width={150} />
            )}
          </Box>
          {friendUser ? (
            <Typography color={medium} fontSize='0.75rem'>
              {subtitle || friendUser.location}
            </Typography>
          ) : (
            <Skeleton width={150} />
          )}
        </Box>
      </FlexBetween>
      {!isSelf && (
        <IconButton
          onClick={patchFriend}
          sx={{ bgcolor: primaryLight, p: '0.6rem' }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      )}
    </FlexBetween>
  );
});

export default Friend;
