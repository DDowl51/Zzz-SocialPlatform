import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  useTheme,
  Divider,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import ChatBubble from './ChatBubble';
import { useSelector, useDispatch } from 'react-redux';
import { StateType } from 'stores/store';
import {
  Chat,
  ClientEventType,
  ServerEventType,
  User,
  UserType,
} from 'interfaces';
import FlexBetween from 'components/FlexBetween';
import { chatActions } from 'stores/chat.slice';
import useHttp from 'hooks/useHttp';
import SocketContext from 'context/socket.context';
import { messageRead } from 'stores/chat.action';
import moment from 'moment';
import { ArrowBack } from '@mui/icons-material';

type ChatBoxProp = {
  activeTarget?: User;
  onBack?: () => void;
  onSendMessage: (message: string, to: string) => void;
};

const ChatBox: FC<ChatBoxProp> = React.memo(
  ({ activeTarget, onSendMessage, onBack = () => {} }) => {
    const dispatch = useDispatch<any>();
    const [input, setInput] = React.useState('');
    const { palette } = useTheme();
    const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

    const chatBoxEl = useRef<HTMLDivElement | null>();

    const socketCtx = useContext(SocketContext);
    const socket = socketCtx.socket;
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const token = useSelector<StateType, string>(state => state.auth.token);
    const user = useSelector<StateType, UserType>(state => state.auth.user);
    const messages = useSelector<StateType, Chat[]>(
      state => state.chat[(activeTarget && activeTarget._id) || '']?.chats || []
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      socket?.emit(ClientEventType.TYPING, activeTarget?._id);
      setInput(event.target.value);
    };

    const handleBlur = () => {
      socket?.emit(ClientEventType.TYPINGEND, activeTarget?._id);
    };

    const handleData = useCallback(() => {}, []);
    const { error, makeRequest: sendMessage } = useHttp(
      `/api/chats/${activeTarget?._id}`,
      handleData,
      'post'
    );

    const handleSendMessage = () => {
      if (!input) {
        return;
      }

      if (!user || !activeTarget) return;

      const chatObj = {
        _id: `${Date.now()}-${user._id}-${Math.random()}`,
        from: user._id,
        to: activeTarget._id,
        content: input,
        createdAt: new Date(Date.now()).toISOString(),
      };

      // Send message
      dispatch(
        chatActions.addMessage({ userId: activeTarget._id, message: chatObj })
      );
      sendMessage({ token, data: { content: chatObj.content } });
      onSendMessage(input, activeTarget._id);

      dispatch(messageRead(activeTarget._id));
      socket?.emit(ClientEventType.MESSAGEREAD, activeTarget._id);

      setInput('');
    };

    useEffect(() => {
      setInput('');
      setIsTyping(false);
    }, [activeTarget]);

    const activeId = activeTarget?._id;
    useEffect(() => {
      socket?.removeListener(ServerEventType.TYPING);
      socket?.removeListener(ServerEventType.TYPINGEND);
      if (!activeId) return;
      socket?.on(ServerEventType.TYPING, (from: string) => {
        if (from === activeId) {
          setIsTyping(true);
        }
      });
      socket?.on(ServerEventType.TYPINGEND, (from: string) => {
        if (from === activeId) {
          setIsTyping(false);
        }
      });
    }, [socket, activeId]);

    useEffect(() => {
      chatBoxEl.current?.scrollTo(0, chatBoxEl.current.scrollHeight);
    }, [messages]);

    const handleKeyPress = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        setIsTyping(false);
        handleSendMessage();
      }
    };

    if (!activeTarget) {
      return (
        <Paper
          sx={{
            minHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography
            textAlign='center'
            fontSize='1rem'
            sx={{ color: palette.neutral.main }}
            mt='2rem'
          >
            Select a friend to start chatting.
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper
        sx={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box p='1rem'>
          {!isNonMobileScreens && (
            <IconButton onClick={onBack}>
              <ArrowBack />
            </IconButton>
          )}
          <Typography fontSize='1.4rem' pr='1rem' variant='body2'>
            {activeTarget.name}
          </Typography>
          <Typography fontSize='1rem' variant='body2'>
            {isTyping ? 'Typing...' : ''}
          </Typography>
        </Box>

        <Divider />

        <Box
          p='1rem'
          maxHeight='60vh'
          minHeight='60vh'
          justifySelf='stretch'
          sx={{ overflowY: 'scroll' }}
          ref={chatBoxEl}
        >
          {messages.map((m, i, ms) => {
            return (
              <div key={m._id}>
                {i === 0 ? (
                  <Typography
                    fontSize='0.5rem'
                    sx={{ color: palette.neutral.dark }}
                    textAlign='center'
                  >
                    {new Date(m.createdAt).toLocaleString()}
                  </Typography>
                ) : (
                  moment(m.createdAt).diff(
                    moment(ms[i - 1].createdAt),
                    'minutes',
                    true
                  ) >= 20 && (
                    <Typography
                      fontSize='0.5rem'
                      sx={{ color: palette.neutral.dark }}
                      mt='1rem'
                      textAlign='center'
                    >
                      {new Date(m.createdAt).toLocaleString()}
                    </Typography>
                  )
                )}
                <ChatBubble
                  targetUser={activeTarget}
                  user={user!}
                  isRead={m.status === 'read'}
                  message={m.content}
                  isSender={m.from === user?._id}
                />
              </div>
            );
          })}
        </Box>
        <FlexBetween sx={{ justifySelf: 'end' }}>
          <TextField
            id='message'
            label='Message'
            value={input}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            fullWidth
          />
          <Button
            sx={{ height: '100%' }}
            variant='contained'
            color='primary'
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </FlexBetween>
      </Paper>
    );
  }
);

export default ChatBox;
