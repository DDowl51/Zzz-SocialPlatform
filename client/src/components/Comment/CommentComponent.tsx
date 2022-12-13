import React, { FC, useState, useCallback, useEffect } from 'react';
import { Box, Divider, InputBase, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import FlexBetween from '../FlexBetween';
import { Comment, Post, User } from 'interfaces';
import useHttp, { HandleFn } from 'hooks/useHttp';
import { postActions } from 'stores/post.slice';
import { StateType } from 'stores/store';
import LoadingSpinner from '../LoadingSpinner';
import CommentContent from './CommentContent';
import { Stack } from '@mui/system';
import UserImage from '../UserImage';

type CommentProp = {
  from: Post;
};

const CommentComponent: FC<CommentProp> = ({ from: post }) => {
  const [commentContent, setCommentContent] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const user = useSelector<StateType, User>(state => state.auth.user!);
  const token = useSelector<StateType, string>(state => state.auth.token);
  const dispatch = useDispatch();

  const { palette } = useTheme();

  const fetchCommentsHandler = useCallback<HandleFn<Comment[]>>(data => {
    setComments(data);
  }, []);
  const {
    loading: loadingComments,
    error: errorComments,
    makeRequest: fetchComments,
    controller: fetchController,
  } = useHttp(`/api/posts/${post._id}/comments`, fetchCommentsHandler, 'get');

  const deleteCommentHandler = useCallback((commentId: string) => {
    setComments(prev => prev.filter(c => c._id !== commentId));
  }, []);

  const newCommentHandler = useCallback<HandleFn<Post>>(
    data => {
      dispatch(postActions.setPost({ post: data }));
      fetchComments({});
    },
    [dispatch, fetchComments]
  );
  const {
    loading,
    error,
    makeRequest: postComment,
  } = useHttp(`/api/posts/${post._id}/comments`, newCommentHandler, 'post');

  const postCommentHandler = useCallback(() => {
    postComment({ token, data: { content: commentContent } });
    setCommentContent('');
  }, [postComment, commentContent, token]);

  useEffect(() => {
    if (error) throw error;
    if (errorComments) throw errorComments;
    if (post.commentsCount) {
      fetchComments({});
    }
  }, [error, errorComments, fetchComments, fetchController, post]);

  return (
    <Box mt='0.5rem'>
      <Stack
        spacing={2}
        // 这样可能更好看?
        // maxHeight='30rem'
        // sx={{ overflowY: 'scroll' }}
      >
        {loadingComments ? (
          <LoadingSpinner size='30px' />
        ) : (
          comments.map(comment => (
            <CommentContent
              key={comment._id}
              comment={comment}
              onDelete={deleteCommentHandler}
            />
          ))
        )}
      </Stack>
      {/* Comment posting place */}
      {user && (
        <FlexBetween p='1rem' gap='1.5rem'>
          <UserImage user={user} size='40px' />
          <InputBase
            placeholder="What's on your mind..."
            onChange={e => setCommentContent(e.target.value)}
            value={commentContent}
            sx={{
              width: '100%',
              bgcolor: palette.neutral.light,
              borderRadius: '2rem',
              padding: '0.5rem 1rem',
            }}
          />
          <LoadingButton
            loading={loading || loadingComments}
            disabled={!commentContent}
            onClick={postCommentHandler}
            sx={{
              color: palette.background.paper,
              bgcolor: palette.primary.main,
              borderRadius: '3rem',
              '&:hover': {
                color: palette.primary.main,
              },
            }}
          >
            Comment
          </LoadingButton>
        </FlexBetween>
      )}
    </Box>
  );
};

export default CommentComponent;
