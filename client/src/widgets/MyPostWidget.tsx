import { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Typography,
  Divider,
  InputBase,
  IconButton,
  Tooltip,
  useTheme,
  Avatar,
  useMediaQuery,
} from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Image from 'components/Image';

import WidgetWrapper from 'components/WidgetWrapper';
import { StateType } from 'stores/store';
import { UserType } from 'interfaces/index';
import useHttp, { HandleFn } from 'hooks/useHttp';
import { postActions } from 'stores/post.slice';

const MyPostWidget = () => {
  const dispatch = useDispatch();
  const [hasImage, setHasImage] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [post, setPost] = useState('');

  const user = useSelector<StateType, UserType>(state => state.auth.user)!;
  const token = useSelector<StateType, string>(state => state.auth.token);

  const handleData = useCallback<HandleFn>(
    data => {
      dispatch(postActions.setPosts({ posts: data }));

      // Reset input field after handled data
      setPost('');
      setHasImage(false);
      setImage(null);
    },

    [dispatch]
  );

  const { loading, error, makeRequest } = useHttp(
    '/api/posts',
    handleData,
    'post'
  );

  const { palette } = useTheme();
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const postHandler = () => {
    const formData = new FormData();
    formData.append('userId', user._id);
    formData.append('description', post);
    if (image) {
      formData.append('picture', image);
      formData.append('picturePath', image.name);
    }

    makeRequest({ token, data: formData });
  };

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <WidgetWrapper>
      <FlexBetween gap='1.5rem'>
        <Avatar
          src={`/assets/${user.picturePath}`}
          alt={user.name}
          sx={{ width: 55, height: 55 }}
        />
        <InputBase
          placeholder="What's on your mind..."
          onChange={e => setPost(e.target.value)}
          value={post}
          sx={{
            width: '100%',
            bgcolor: palette.neutral.light,
            borderRadius: '2rem',
            padding: '1rem 2rem',
          }}
        />
      </FlexBetween>

      <Divider sx={{ margin: '1.25rem 0' }} />

      {image && hasImage && (
        <Image src={URL.createObjectURL(image)} alt={image.name} />
      )}

      <FlexBetween sx={{ margin: '1.25rem 0' }}>
        <FlexBetween gap='0.25rem'>
          <IconButton
            aria-label='upload picture'
            component='label'
            sx={{ borderRadius: '1rem' }}
          >
            <input
              hidden
              accept='image/*'
              multiple={false}
              type='file'
              onChange={e => {
                if (e.target.files?.length) {
                  setImage(e.target.files![0]);
                  setHasImage(true);
                }
              }}
            />
            <ImageOutlined sx={{ color: mediumMain }} />
            <Typography color={mediumMain}>Image</Typography>
          </IconButton>
        </FlexBetween>

        {isNonMobileScreens ? (
          <>
            <FlexBetween gap='0.25rem'>
              <Tooltip title='Not implemented yet'>
                <IconButton
                  aria-label='clip picture'
                  component='label'
                  sx={{ borderRadius: '1rem' }}
                >
                  <GifBoxOutlined sx={{ color: mediumMain }} />
                  <Typography color={mediumMain}>Clip</Typography>
                </IconButton>
              </Tooltip>
            </FlexBetween>
            <FlexBetween gap='0.25rem'>
              <Tooltip title='Not implemented yet'>
                <IconButton
                  aria-label='attach picture'
                  component='label'
                  sx={{ borderRadius: '1rem' }}
                >
                  <AttachFileOutlined sx={{ color: mediumMain }} />
                  <Typography color={mediumMain}>Attach</Typography>
                </IconButton>
              </Tooltip>
            </FlexBetween>
            <FlexBetween gap='0.25rem'>
              <Tooltip title='Not implemented yet'>
                <IconButton
                  aria-label='audio picture'
                  component='label'
                  sx={{ borderRadius: '1rem' }}
                >
                  <MicOutlined sx={{ color: mediumMain }} />
                  <Typography color={mediumMain}>Audio</Typography>
                </IconButton>
              </Tooltip>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap='0.25rem'>
            <Tooltip title='Not implemented yet'>
              <IconButton>
                <MoreHorizOutlined
                  sx={{
                    color: mediumMain,
                    '&:hover': {
                      cursor: 'pointer',
                      color: medium,
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
          </FlexBetween>
        )}

        <LoadingButton
          loading={loading}
          disabled={!post}
          onClick={postHandler}
          sx={{
            color: palette.background.paper,
            bgcolor: palette.primary.main,
            borderRadius: '3rem',
            '&:hover': {
              color: palette.primary.main,
            },
          }}
        >
          Post
        </LoadingButton>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
