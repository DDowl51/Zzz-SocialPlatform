import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import LoadingSpinner from 'components/LoadingSpinner';
import WidgetWrapper from 'components/WidgetWrapper';
import useHttp, { HandleFn } from 'hooks/useHttp';
import { Post } from 'interfaces';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostWidget from 'widgets/PostWidget';

const PostPage = () => {
  const { postId } = useParams();
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

  const { palette } = useTheme();

  const [post, setPost] = useState<Post>();

  const handlePost = useCallback<HandleFn<Post>>(
    data => setPost(data),
    [setPost]
  );
  const {
    loading,
    error,
    makeRequest: fetchPost,
  } = useHttp(`/api/posts/${postId}`, handlePost, 'get');

  useEffect(() => {
    if (error) throw error;
  }, [error]);
  useEffect(() => {
    if (!post && !error) fetchPost({});
  }, [fetchPost, post, error]);

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
        flexBasis={isNonMobileScreens ? '48%' : undefined}
        mt={isNonMobileScreens ? undefined : '2rem'}
      >
        {loading || !post ? (
          <WidgetWrapper sx={{ '&:not(:first-of-type)': { m: '2rem 0' } }}>
            <LoadingSpinner />
          </WidgetWrapper>
        ) : (
          <PostWidget post={post} commentMode={true} />
        )}
      </Box>
    </Box>
  );
};

export default PostPage;
