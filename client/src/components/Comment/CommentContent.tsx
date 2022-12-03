import { FC } from 'react';
import { Box, Typography, Link, useTheme } from '@mui/material';
import { Comment } from 'interfaces';
import UserImage from 'components/UserImage';
import { useNavigate } from 'react-router-dom';

type CommentContentProp = {
  comment: Comment;
};

const CommentContent: FC<CommentContentProp> = ({ comment }) => {
  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();
  const user = comment.user;
  const commentDate = new Date(comment.createdAt).toLocaleString();

  return (
    <Box sx={{ p: '0 0.5rem' }}>
      {/* <Friend friendId={user._id} subtitle={commentDate.toLocaleString()} /> */}
      {/* <Typography sx={{ color: main, pt: '0.1rem' }}>
        {commentDate.toLocaleString()}
      </Typography> */}
      <Box display='flex' gap='0.75rem'>
        <UserImage
          onClick={() => navigate(`/profile/${user._id}`)}
          user={user}
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
            href={`/profile/${user._id}`}
            sx={{ textDecoration: 'none', color: palette.neutral.dark }}
          >
            <Typography
              variant='body2'
              display='inline'
              fontSize='0.9rem'
              sx={{ color: palette.primary.dark, pt: '0.3rem' }}
            >
              {`${user.name}:`}
            </Typography>
          </Link>
          <Typography
            variant='body2'
            fontSize='0.9rem'
            sx={{ color: palette.neutral.dark, pt: '0.3rem', pl: '0.3rem' }}
          >
            {comment.content}
          </Typography>
          <Typography color={palette.neutral.main} fontSize='0.75rem'>
            {commentDate}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CommentContent;
