import { FC, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, useMediaQuery } from '@mui/material';
import { User, UserType } from 'interfaces';
import { StateType } from 'stores/store';
import UserWidget from 'widgets/UserWidget';
import PostListWidget from 'widgets/PostListWidget';
import FriendListWidget from 'widgets/FriendListWidget';
import useHttp, { HandleFn } from 'hooks/useHttp';
import { userActions } from 'stores/user.slice';

const ProfilePage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();
  const user = useSelector<StateType, UserType>(state => state.user.user);
  const loggedIn = useSelector<StateType, UserType>(state => state.auth.user);
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

  const setUserData = useCallback<HandleFn<User>>(
    data => {
      dispatch(userActions.setUser({ user: data }));
    },
    [dispatch]
  );

  const { loading, error, makeRequest, controller } = useHttp(
    `/api/users/${userId}`,
    setUserData,
    'get'
  );

  useEffect(() => {
    if (error) throw error;
    if (!loggedIn) navigate('/login');
    if (!user || user._id !== userId) {
      makeRequest({});
    }

    return () => {
      controller.abort();
    };
  }, [error, makeRequest, loggedIn, navigate, user, userId, controller]);

  if (!user) return null;

  return (
    <Box
      width='100%'
      p='2rem 6%'
      display={isNonMobileScreens ? 'flex' : 'block'}
      gap='2rem'
      justifyContent='center'
    >
      <Box flexBasis={isNonMobileScreens ? '26%' : undefined}>
        <UserWidget user={user} loading={loading} />
        <Box m='2rem 0' />
        <FriendListWidget user={user} />
      </Box>
      <Box
        flexBasis={isNonMobileScreens ? '42%' : undefined}
        mt={isNonMobileScreens ? undefined : '2rem'}
      >
        <PostListWidget isProfile={true} userId={user._id} />
      </Box>
    </Box>
  );
};

export default ProfilePage;
