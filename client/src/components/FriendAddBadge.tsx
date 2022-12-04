import React, { FC, useCallback, useEffect } from 'react';
import { PersonRemoveOutlined, PersonAddOutlined } from '@mui/icons-material';
import { IconButton, useTheme } from '@mui/material';
import useHttp, { HandleFn } from 'hooks/useHttp';
import { User, UserType } from 'interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authActions } from 'stores/auth.slice';
import { StateType } from 'stores/store';

type FriendAddBadgeProp = {
  friend: User;
};

const FriendAddBadge: FC<FriendAddBadgeProp> = ({ friend }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector<StateType, string>(state => state.auth.token);
  const loggedUser = useSelector<StateType, UserType>(state => state.auth.user);
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;

  const isSelf = loggedUser?._id === friend._id;
  const isFriend = loggedUser?.friends.some(fId => fId === friend._id);

  const setUserFriends = useCallback<HandleFn<User>>(
    data => {
      dispatch(authActions.setUserFriends({ friends: data.friends }));
    },
    [dispatch]
  );
  const { error, makeRequest: handleFriend } = useHttp(
    `/api/users/friends/${friend._id}`,
    setUserFriends,
    'patch'
  );
  const patchFriend = () => {
    handleFriend({ token });
  };

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loggedUser) return null;

  return (
    <>
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
    </>
  );
};

export default FriendAddBadge;
