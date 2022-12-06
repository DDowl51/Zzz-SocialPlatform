import { FC, useState, useCallback, MouseEvent, useEffect } from 'react';
import {
  Box,
  Typography,
  Link,
  useTheme,
  Button,
  ButtonGroup,
  IconButton,
  Popover,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Comment, UserType } from 'interfaces';
import UserImage from 'components/UserImage';
import { useNavigate } from 'react-router-dom';
import { getDate } from 'utils/getDate';
import { LoadingButton } from '@mui/lab';
import useHttp from 'hooks/useHttp';
import { useSelector } from 'react-redux';
import { StateType } from 'stores/store';
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';

type CommentContentProp = {
  comment: Comment;
  onDelete: (comemntId: string) => void;
};

const CommentContent: FC<CommentContentProp> = ({ comment, onDelete }) => {
  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();
  const token = useSelector<StateType, string>(state => state.auth.token);
  const user = useSelector<StateType, UserType>(state => state.auth.user);
  const commentUser = comment.user;
  const isAuthor = commentUser._id === user?._id;

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
  const handleDeleteComment = useCallback(() => {
    onDelete(comment._id);
  }, [onDelete, comment._id]);

  const {
    loading,
    error,
    makeRequest: deleteCommentRequest,
  } = useHttp(`/api/comments/${comment._id}`, handleDeleteComment, 'delete');

  const handleDelete = () => {
    deleteCommentRequest({ token });
  };

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <Box sx={{ p: '0 0.5rem' }}>
      {/* <Friend friendId={user._id} subtitle={commentDate.toLocaleString()} /> */}
      {/* <Typography sx={{ color: main, pt: '0.1rem' }}>
        {commentDate.toLocaleString()}
      </Typography> */}
      <FlexBetween>
        <Box display='flex' gap='0.75rem'>
          <UserImage
            onClick={() => navigate(`/profile/${commentUser._id}`)}
            user={commentUser}
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
              href={`/profile/${commentUser._id}`}
              sx={{ textDecoration: 'none', color: palette.neutral.dark }}
            >
              <Typography
                variant='body2'
                display='inline'
                fontSize='0.9rem'
                sx={{ color: palette.primary.dark, pt: '0.3rem' }}
              >
                {`${commentUser.name}:`}
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
              {getDate(comment.createdAt)}
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
                <Typography>Are you sure to delete this comment?</Typography>
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
    </Box>
  );
};

export default CommentContent;
