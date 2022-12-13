import { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AttachFileOutlined,
  ImageOutlined,
  MicOutlined,
} from '@mui/icons-material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PauseIcon from '@mui/icons-material/Pause';
import CloseIcon from '@mui/icons-material/Close';
import { useReactMediaRecorder } from 'react-media-recorder';
import { LoadingButton } from '@mui/lab';
import {
  Typography,
  Divider,
  InputBase,
  IconButton,
  useTheme,
  Box,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Image from 'components/Image';

import WidgetWrapper from 'components/WidgetWrapper';
import { StateType } from 'stores/store';
import { UserType } from 'interfaces/index';
import useHttp, { HandleFn } from 'hooks/useHttp';
import { postActions } from 'stores/post.slice';
import UserImage from 'components/UserImage';
import Tab from 'components/Tab';

const MyPostWidget = () => {
  const dispatch = useDispatch();

  const [inputMode, setInputMode] = useState('');

  const [hasImage, setHasImage] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [hasAudio, setHasAudio] = useState(false);
  const [audio, setAudio] = useState<File | null>(null);
  const [post, setPost] = useState('');

  const {
    status,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    mediaBlobUrl,
    error: errorRecord,
  } = useReactMediaRecorder({
    audio: true,
    video: false,
    // blobPropertyBag: { type: 'audio/aac' },
    mediaRecorderOptions: { mimeType: 'audio/wav' },
    onStop(blobUrl, blob) {
      setAudio(
        new File([blob], `${user._id}-${Date.now().toString(16)}-audio.wav`)
      );
      setHasAudio(true);
    },
  });

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

  const postHandler = () => {
    const formData = new FormData();
    formData.append('userId', user._id);
    formData.append('description', post);
    if (image) {
      formData.append('picture', image);
      formData.append('picturePath', image.name);
    }
    if (audio) {
      formData.append('audio', audio);
      formData.append('audioPath', audio.name);
    }

    makeRequest({ token, data: formData });
  };

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <WidgetWrapper>
      <FlexBetween gap='1.5rem'>
        <UserImage user={user} size='55px' />
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
      <Divider sx={{ margin: '1rem 0' }} />
      <Box
        width='100%'
        display='flex'
        justifyContent='end'
        alignItems='center'
        gap='0.25rem'
        mb='1rem'
      >
        <Box
          display='flex'
          sx={{ width: '100%', borderRadius: '0.5rem', overflow: 'hidden' }}
        >
          <Tab
            cancelOnClick
            centered
            isActive={inputMode === 'Image'}
            onSwitch={setInputMode}
            value='Image'
            icon={<ImageOutlined />}
          >
            Image
          </Tab>
          <Tab
            cancelOnClick
            centered
            isActive={inputMode === 'Attach'}
            onSwitch={setInputMode}
            value='Attach'
            icon={<AttachFileOutlined />}
          >
            Attach
          </Tab>
          <Tab
            cancelOnClick
            centered
            isActive={inputMode === 'Audio'}
            onSwitch={setInputMode}
            value='Audio'
            icon={<MicOutlined />}
          >
            Audio
          </Tab>
        </Box>
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
      </Box>

      {inputMode === 'Image' && (
        <>
          <Button variant='outlined' component='label'>
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
            <Typography>Select an image</Typography>
          </Button>
          {image && hasImage && (
            <Image
              onClick={() => {
                setImage(null);
                setHasImage(false);
              }}
              sx={{
                transition: 'all 0.3s',
                '&:hover': {
                  filter: 'brightness(0.8)',
                  cursor: 'pointer',
                },
              }}
              src={URL.createObjectURL(image)}
              alt={image.name}
            />
          )}
        </>
      )}
      {inputMode === 'Attach' && 'AttachMode'}
      {inputMode === 'Audio' && (
        <>
          {/* <Typography>{status}</Typography>
          <Typography>{errorRecord}</Typography> */}
          <ToggleButtonGroup>
            <ToggleButton
              value='start'
              onClick={() => {
                if (status === 'idle' || status === 'stopped') startRecording();
                else if (status === 'recording') pauseRecording();
                else if (status === 'paused') resumeRecording();
              }}
            >
              {status === 'recording' ? (
                <>
                  <PauseIcon />
                  <Typography>Pause</Typography>
                </>
              ) : (
                <>
                  <PlayArrowIcon />
                  <Typography>Start</Typography>
                </>
              )}
            </ToggleButton>
            <ToggleButton value='stop' onClick={stopRecording}>
              <>
                <StopIcon />
                <Typography>Stop</Typography>
              </>
            </ToggleButton>
          </ToggleButtonGroup>
          {audio && hasAudio && (
            <FlexBetween>
              <audio src={mediaBlobUrl} controls />
              <IconButton
                onClick={() => {
                  setAudio(null);
                  setHasAudio(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </FlexBetween>
          )}
        </>
      )}
    </WidgetWrapper>
  );
};

export default MyPostWidget;
