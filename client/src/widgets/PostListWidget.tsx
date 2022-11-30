import React, { useEffect, useCallback, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MoonLoader } from 'react-spinners';
import { Box } from '@mui/material';
import PostWidget from 'widgets/PostWidget';
import { StateType } from 'stores/store';
import { Post } from 'interfaces';
import useHttp, { HandleFn } from 'hooks/useHttp';
import { postActions } from 'stores/post.slice';
import WidgetWrapper from 'components/WidgetWrapper';

type PostListProps = {
  userId?: string;
  isProfile: boolean;
};

const PostListWidget: FC<PostListProps> = React.memo<PostListProps>(
  ({ userId, isProfile }) => {
    const dispatch = useDispatch();
    const posts = useSelector<StateType, Post[]>(state => state.post.posts);

    const handleAllPosts = useCallback<HandleFn<Post[]>>(
      posts => {
        dispatch(postActions.setPosts({ posts }));
      },
      [dispatch]
    );
    const { loading: loadingAll, makeRequest: getPosts } = useHttp(
      '/api/posts',
      handleAllPosts,
      'get'
    );

    const handleUserPosts = useCallback<HandleFn<Post[]>>(
      posts => {
        dispatch(postActions.setPosts({ posts }));
      },
      [dispatch]
    );
    const { loading: loadingProfile, makeRequest: getUserPosts } = useHttp(
      `/api/users/${userId}/posts`,
      handleUserPosts,
      'get'
    );

    const loading = loadingAll || loadingProfile;

    useEffect(() => {
      if (isProfile) getUserPosts({});
      else getPosts({});
    }, [getUserPosts, getPosts, isProfile]);

    return (
      <>
        {loading ? (
          <WidgetWrapper sx={{ '&:not(:first-of-type)': { m: '2rem 0' } }}>
            <Box
              display='flex'
              justifyContent='center'
              alignItems='center'
              p='2rem 0'
            >
              <MoonLoader />
            </Box>
          </WidgetWrapper>
        ) : (
          posts.map(post => <PostWidget key={post._id} post={post} />)
        )}
      </>
    );
  }
);

export default PostListWidget;
