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
import useHttp, { HandleFn } from 'hooks/useHttp';
import SocketContext from 'context/socket.context';

type ChatBoxProp = {
  activeTarget?: User;
  onSendMessage: (message: string, to: string) => void;
};

const ChatBox: FC<ChatBoxProp> = React.memo(
  ({ activeTarget, onSendMessage }) => {
    const dispatch = useDispatch();
    const [input, setInput] = React.useState('');
    const { palette } = useTheme();

    const chatBoxEl = useRef<HTMLDivElement | null>();

    const socketCtx = useContext(SocketContext);
    const socket = socketCtx.socket;
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const token = useSelector<StateType, string>(state => state.auth.token);
    const user = useSelector<StateType, UserType>(state => state.auth.user);
    const messages = useSelector<StateType, Chat[]>(
      state => state.chat[(activeTarget && activeTarget._id) || '']?.chats || []
    );
    const unreadCount = useSelector<StateType, number>(
      state =>
        state.chat[(activeTarget && activeTarget._id) || '']?.unreadCount || 0
    );
    const fetched = useSelector<StateType, boolean>(
      state =>
        state.chat[(activeTarget && activeTarget._id) || '']?.fetched || false
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
      };

      // Send message
      dispatch(
        chatActions.addMessage({ userId: activeTarget._id, message: chatObj })
      );
      sendMessage({ token, data: { content: chatObj.content } });
      onSendMessage(input, activeTarget._id);

      setInput('');
    };

    const setChatMessages = useCallback<HandleFn<Chat[]>>(
      data => {
        dispatch(
          chatActions.setMessages({ userId: activeTarget?._id, messages: data })
        );
        dispatch(chatActions.setFetched({ userId: activeTarget?._id }));
      },
      [dispatch, activeTarget]
    );

    const { makeRequest: fetchMessage } = useHttp(
      `/api/chats/${activeTarget?._id}`,
      setChatMessages,
      'get'
    );

    useEffect(() => {
      if (error) throw error;
      if (activeTarget && !fetched) {
        fetchMessage({ token });
      }
    }, [error, fetchMessage, activeTarget, fetched, token]);

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
          {messages.map((message, i) => (
            <ChatBubble
              key={message._id}
              targetUser={activeTarget}
              user={user!}
              message={message.content}
              isSender={message.from === user?._id}
            />
          ))}
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
