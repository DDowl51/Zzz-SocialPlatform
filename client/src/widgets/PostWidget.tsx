import React, { useState, FC, useCallback, MouseEvent, useEffect } from 'react';
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from '@mui/icons-material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Link,
  Box,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
  Popover,
  ButtonGroup,
  Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import FlexBetween from '../components/FlexBetween';
import WidgetWrapper from '../components/WidgetWrapper';
import { Post, UserType } from 'interfaces';
import { StateType } from 'stores/store';
import useHttp, { HandleFn } from 'hooks/useHttp';
import { postActions } from 'stores/post.slice';
import CommentComponent from '../components/Comment/CommentComponent';
import UserImage from 'components/UserImage';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';

type PostProp = {
  post: Post;
};

const PostWidget: FC<PostProp> = ({ post }) => {
  const navigate = useNavigate();
  const [isComment, setIsComment] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector<StateType, string>(state => state.auth.token);
  const user = useSelector<StateType, UserType>(state => state.auth.user);
  const loggedInUserId = user?._id || '';

  const [isLiked, setIsLiked] = useState(Boolean(post.likes[loggedInUserId]));
  const postDate = new Date(post.createdAt).toLocaleString();
  const isAuthor = loggedInUserId === post.user._id;

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

  // Delete post popover
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  // Delete post request
  const handleDeletePost = useCallback(() => {
    dispatch(postActions.deletePost({ postId: post._id }));
  }, [dispatch, post]);

  const {
    loading,
    error,
    makeRequest: deletePostRequest,
  } = useHttp(`/api/posts/${post._id}`, handleDeletePost, 'delete');

  const handleDelete = () => {
    console.log(token);

    deletePostRequest({ token });
  };

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <WidgetWrapper sx={{ '&:not(:first-of-type)': { m: '2rem 0' } }}>
      {/* <Friend
        friendId={post.user._id}
        subtitle={new Date(post.user.createdAt).toLocaleString()}
      /> */}
      <FlexBetween>
        <Box display='flex' gap='0.75rem'>
          <UserImage
            onClick={() => navigate(`/profile/${post.user._id}`)}
            user={post.user}
            size='2.4rem'
            sx={{
              mt: '0.2rem',
              transition: 'all 0.2s',
              '&:hover': { filter: 'brightness(0.8)', cursor: 'pointer' },
            }}
          />
          <Box mt='0.2rem'>
            <Link
              display='inline'
              height='auto'
              href={`/profile/${post.user._id}`}
              sx={{ textDecoration: 'none', color: palette.neutral.dark }}
            >
              <Typography
                variant='body2'
                display='inline'
                fontSize='0.9rem'
                sx={{ color: palette.primary.dark, pt: '0.3rem' }}
              >
                {post.user.name}
              </Typography>
            </Link>
            <Typography color={palette.neutral.main} fontSize='0.75rem'>
              {postDate}
            </Typography>
          </Box>
        </Box>
        {isAuthor && (
          <>
            <IconButton onClick={handleClick} sx={{ position: 'relative' }}>
              <DeleteOutlineIcon />
            </IconButton>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Box p='1rem' borderRadius='8px'>
                <Typography>Are you sure to delete this post?</Typography>
                <ButtonGroup
                  size='small'
                  sx={{ display: 'flex', justifyContent: 'end' }}
                >
                  <Button onClick={handleClose}>Cancel</Button>
                  <LoadingButton
                    loading={loading}
                    onClick={handleDelete}
                    sx={{
                      color: palette.neutral.light,
                      bgcolor: palette.primary.main,
                      '&:hover': {
                        color: palette.primary.main,
                      },
                    }}
                  >
                    Confirm
                  </LoadingButton>
                </ButtonGroup>
              </Box>
            </Popover>
          </>
        )}
      </FlexBetween>
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
