import { FC } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Comment } from 'interfaces';
import Friend from './Friend';

type CommentContentProp = {
  comment: Comment;
};

const CommentContent: FC<CommentContentProp> = ({ comment }) => {
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const user = comment.user;
  const commentDate = new Date(comment.createdAt);

  return (
    <Box sx={{ p: '0 0.5rem' }}>
      <Friend friendId={user._id} subtitle={commentDate.toLocaleString()} />
      {/* <Typography sx={{ color: main, pt: '0.1rem' }}>
        {commentDate.toLocaleString()}
      </Typography> */}
      <Typography sx={{ color: main, pt: '0.3rem' }}>
        {comment.content}
      </Typography>
    </Box>
  );
};

export default CommentContent;
