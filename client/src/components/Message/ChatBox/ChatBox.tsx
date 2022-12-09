import React, { FC, useCallback, useEffect, useRef } from 'react';
import {
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  useTheme,
} from '@mui/material';
import ChatBubble from './ChatBubble';
import { useSelector, useDispatch } from 'react-redux';
import { StateType } from 'stores/store';
import { Chat, User, UserType } from 'interfaces';
import FlexBetween from 'components/FlexBetween';
import { chatActions } from 'stores/chat.slice';
import useHttp, { HandleFn } from 'hooks/useHttp';

type ChatBoxProp = {
  activeTarget?: User;
  onSendMessage: (message: string, to: string) => void;
};

const ChatBox: FC<ChatBoxProp> = ({ activeTarget, onSendMessage }) => {
  const dispatch = useDispatch();
  const [input, setInput] = React.useState('');
  const { palette } = useTheme();

  const chatBoxEl = useRef<HTMLDivElement | null>();

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
    setInput(event.target.value);
  };

  const handleData = useCallback(() => {}, []);
  const {
    loading,
    error,
    makeRequest: sendMessage,
  } = useHttp(`/api/chats/${activeTarget?._id}`, handleData, 'post');

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

  const {
    loading: loadingMessages,
    error: errorMessages,
    makeRequest: fetchMessage,
  } = useHttp(`/api/chats/${activeTarget?._id}`, setChatMessages, 'get');

  useEffect(() => {
    if (error) throw error;
    if (activeTarget && !fetched) {
      fetchMessage({ token });
    }
  }, [error, fetchMessage, activeTarget, fetched, token]);

  useEffect(() => {
    chatBoxEl.current?.scrollTo(0, chatBoxEl.current.scrollHeight);
  }, [messages]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
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
      <Typography
        p='1rem'
        fontSize='1.2rem'
        borderBottom={`2px solid ${palette.neutral.light}`}
      >
        {activeTarget.name}
      </Typography>

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
          onKeyPress={handleKeyPress}
          fullWidth
        />
        <Button variant='contained' color='primary' onClick={handleSendMessage}>
          Send
        </Button>
      </FlexBetween>
    </Paper>
  );
};

export default ChatBox;
