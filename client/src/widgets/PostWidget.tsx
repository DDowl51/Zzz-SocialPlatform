import React, { useState, FC, useCallback } from 'react';
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from '@mui/icons-material';
import { IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import FlexBetween from '../components/FlexBetween';
import WidgetWrapper from '../components/WidgetWrapper';
import Friend from '../components/Friend';
import { Post, UserType } from 'interfaces';
import { StateType } from 'stores/store';
import useHttp, { HandleFn } from 'hooks/useHttp';
import { postActions } from 'stores/post.slice';
import CommentComponent from 'components/Comment/CommentComponent';

type PostProp = {
  post: Post;
};

const PostWidget: FC<PostProp> = ({ post }) => {
  const [isComment, setIsComment] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector<StateType, string>(state => state.auth.token);
  const user = useSelector<StateType, UserType>(state => state.auth.user);
  const loggedInUserId = user?._id || '';

  const [isLiked, setIsLiked] = useState(Boolean(post.likes[loggedInUserId]));

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const handleData = useCallback<HandleFn<Post>>(
    data => {
      dispatch(postActions.setPost({ post: data }));
    },
    [dispatch]
  );

  const { makeRequest } = useHttp(
    `/api/posts/${post._id}/like`,
    handleData,
    'patch'
  );

  const handleLike = () => {
    setIsLiked(prev => !prev);
    makeRequest({ token });
  };

  return (
    <WidgetWrapper sx={{ '&:not(:first-of-type)': { m: '2rem 0' } }}>
      <Friend
        friendId={post.user._id}
        subtitle={new Date(post.user.createdAt).toLocaleString()}
      />
      <Typography color={main} sx={{ mt: '1rem' }}>
        {post.description}
      </Typography>
      {post.picturePath && (
        <img
          width='100%'
          height='auto'
          src={`/assets/${post.picturePath}`}
          alt='post'
          style={{ borderRadius: '0.75rem', marginTop: '0.75rem' }}
        />
      )}
      <FlexBetween mt='0.25rem'>
        <FlexBetween gap='1rem'>
          <FlexBetween>
            <IconButton onClick={handleLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{post.likesCount}</Typography>
          </FlexBetween>

          <FlexBetween gap='0.3rem'>
            <IconButton onClick={() => setIsComment(prev => !prev)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{post.commentsCount}</Typography>
          </FlexBetween>
        </FlexBetween>

        <Tooltip title='Not implemented yet'>
          <IconButton>
            <ShareOutlined />
          </IconButton>
        </Tooltip>
      </FlexBetween>

      {isComment && <CommentComponent from={post} />}
    </WidgetWrapper>
  );
};

export default PostWidget;
