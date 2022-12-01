import React, { useEffect, useCallback, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostWidget from 'widgets/PostWidget';
import { StateType } from 'stores/store';
import { Post } from 'interfaces';
import useHttp, { HandleFn } from 'hooks/useHttp';
import { postActions } from 'stores/post.slice';
import WidgetWrapper from 'components/WidgetWrapper';
import LoadingSpinner from 'components/LoadingSpinner';

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
      if (isProfile) {
        getUserPosts({});
      } else getPosts({});
    }, [getUserPosts, getPosts, isProfile, userId]);

    return (
      <>
        {loading ? (
          <WidgetWrapper sx={{ '&:not(:first-of-type)': { m: '2rem 0' } }}>
            <LoadingSpinner />
          </WidgetWrapper>
        ) : (
          posts.map(post => <PostWidget key={post._id} post={post} />)
        )}
      </>
    );
  }
);

export default PostListWidget;
