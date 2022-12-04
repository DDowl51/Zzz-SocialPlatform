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
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import FlexBetween from './FlexBetween';
import { StateType } from 'stores/store';
import { User, UserType } from 'interfaces';
import { authActions } from 'stores/auth.slice';
import useHttp, { HandleFn } from 'hooks/useHttp';
import { friendActions } from 'stores/friend.slice';
import UserImage from 'components/UserImage';
import FriendAddBadge from './FriendAddBadge';

type FriendProps = PropsWithChildren<{
  friendId: string;
  subtitle?: string;
}>;

const Friend: FC<FriendProps> = React.memo(({ friendId, subtitle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector<StateType, UserType>(state => state.auth.user);
  const localFriends = useSelector<StateType, User[]>(
    state => state.friend.friends
  );

  const [friendUser, setFriendUser] = useState<UserType>();

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isSelf = user?._id === friendId;

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
  }, [getFriendUser, friendId, localFriends]);

  useEffect(() => {
    if (errorGetFriend) throw errorGetFriend;
  }, [errorGetFriend]);

  return (
    <FlexBetween>
      <FlexBetween gap='1rem'>
        {friendUser ? (
          <UserImage user={friendUser} size='55px' />
        ) : (
          <Skeleton variant='circular'>
            <UserImage user={user!} size='55px' />
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
      {friendUser && <FriendAddBadge friend={friendUser} />}
    </FlexBetween>
  );
});

export default Friend;
