import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, useMediaQuery } from '@mui/material';
import { UserType } from 'interfaces/index';
import { StateType } from 'stores/store';
import UserWidget from 'widgets/UserWidget';
import MyPostWidget from 'widgets/MyPostWidget';
import PostListWidget from 'widgets/PostListWidget';
import AdvertWidget from 'widgets/AdvertWidget';
import FriendListWidget from 'widgets/FriendListWidget';
import { userActions } from 'stores/user.slice';

const HomePage: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector<StateType, UserType>(state => state.auth.user);
  const userData = useSelector<StateType, UserType>(state => state.user.user);
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

  useEffect(() => {
    if (!user) navigate('/');
    // Clear user store each time to HomePage
    if (!userData) dispatch(userActions.setUser({ user: undefined }));
  }, [user, navigate, dispatch, userData]);

  if (!user) return null;

  return (
    <Box
      width='100%'
      p='2rem 6%'
      display={isNonMobileScreens ? 'flex' : 'block'}
      gap='0.5rem'
      justifyContent='space-between'
    >
      <Box
        flexBasis={isNonMobileScreens ? '26%' : undefined}
        // position={isNonMobileScreens ? 'fixed' : 'inherit'}
      >
        <UserWidget user={user} />
      </Box>
      <Box
        flexBasis={isNonMobileScreens ? '42%' : undefined}
        mt={isNonMobileScreens ? undefined : '2rem'}
      >
        <MyPostWidget />
        <PostListWidget isProfile={false} />
      </Box>
      {isNonMobileScreens && (
        <Box flexBasis={isNonMobileScreens ? '26%' : undefined}>
          <AdvertWidget />
          <Box m='2rem 0' />
          <FriendListWidget user={user} />
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
