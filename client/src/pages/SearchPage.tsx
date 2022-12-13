import {
  FC,
  useEffect,
  useCallback,
  useMemo,
  PropsWithChildren,
  useState,
} from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArticleIcon from '@mui/icons-material/Article';
import { useParams } from 'react-router-dom';
import { Box, Card, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Post, User } from 'interfaces';
import useHttp, { HandleFn } from 'hooks/useHttp';
import LoadingSpinner from 'components/LoadingSpinner';
import WidgetWrapper from 'components/WidgetWrapper';
import PostWidget from 'widgets/PostWidget';
import Friend from 'components/Friend';
import Tab from 'components/Tab';

const SearchPage: FC = () => {
  const { pattern } = useParams();
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

  const { palette } = useTheme();

  const searchMode = useMemo(
    () => [
      { mode: 'Posts', icon: <ArticleIcon /> },
      { mode: 'Users', icon: <AccountCircleIcon /> },
    ],
    []
  );
  const [currentMode, setCurrentMode] = useState(searchMode[0].mode);

  const [posts, setPosts] = useState<Post[]>([]);
  const handlePost = useCallback<HandleFn<Post[]>>(data => setPosts(data), []);
  const {
    loading: loadingPosts,
    error: errorPosts,
    makeRequest: searchPosts,
  } = useHttp(`/api/posts/search/${pattern}`, handlePost, 'get');

  const [users, setUsers] = useState<User[]>([]);
  const handleUser = useCallback<HandleFn<User[]>>(data => setUsers(data), []);
  const {
    loading: loadingUsers,
    error: errorUsers,
    makeRequest: searchUsers,
  } = useHttp(`/api/users/search/${pattern}`, handleUser, 'get');

  useEffect(() => {
    if (errorPosts) throw errorPosts;
    if (errorUsers) throw errorUsers;
    if (currentMode === 'Posts') {
      searchPosts({});
    }
    if (currentMode === 'Users') {
      searchUsers({});
    }
  }, [errorPosts, errorUsers, currentMode, searchPosts, searchUsers]);

  const loading = loadingPosts || loadingUsers;

  return (
    <Box
      width='100%'
      mt={isNonMobileScreens ? '2rem' : '0'}
      p='2rem 6%'
      display={isNonMobileScreens ? 'flex' : 'block'}
      gap='2rem'
      justifyContent='center'
      alignItems='start'
    >
      <Box
        flexBasis={isNonMobileScreens ? '20%' : undefined}
        sx={{ borderRadius: '0.5rem', overflow: 'hidden' }}
      >
        <Box
          display='flex'
          flexDirection={isNonMobileScreens ? 'column' : 'row'}
        >
          {searchMode.map(mode => (
            <Tab
              key={mode.mode}
              isActive={mode.mode === currentMode}
              value={mode.mode}
              onSwitch={setCurrentMode}
              icon={mode.icon}
              sx={{ fontSize: '1rem', ml: '1rem' }}
              centered
            >
              {mode.mode}
            </Tab>
          ))}
        </Box>
      </Box>
      <Box
        flexBasis={isNonMobileScreens ? '48%' : undefined}
        mt={isNonMobileScreens ? undefined : '2rem'}
      >
        <>
          {loading ? (
            <WidgetWrapper sx={{ '&:not(:first-of-type)': { m: '2rem 0' } }}>
              <LoadingSpinner />
            </WidgetWrapper>
          ) : currentMode === 'Posts' ? (
            posts.map(post => <PostWidget key={post._id} post={post} />)
          ) : (
            <WidgetWrapper display='flex' flexDirection='column' gap='0.75rem'>
              {users.map(user => (
                <Friend key={user._id} friendId={user._id} />
              ))}
            </WidgetWrapper>
          )}
        </>
      </Box>
    </Box>
  );
};

export default SearchPage;
