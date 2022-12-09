import {
  FC,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useContext,
} from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, useMediaQuery } from '@mui/material';
import { UserType, User, ServerEventType, ClientEventType } from 'interfaces';
import { StateType } from 'stores/store';

import { ArrowBack } from '@mui/icons-material';
import UserList from 'components/Message/UserList/UserList';
import ChatBox from 'components/Message/ChatBox/ChatBox';
import useHttp, { HandleFn } from 'hooks/useHttp';
import { chatActions } from 'stores/chat.slice';

const MessagePage: FC = () => {
  const navigate = useNavigate();
  const user = useSelector<StateType, UserType>(state => state.auth.user);
  const [currentChatTarget, setCurrentChatTarget] = useState<UserType>();
  const [friends, setFriends] = useState<User[]>([]);
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');
  const dispatch = useDispatch();

  const token = useSelector<StateType, string>(state => state.auth.token);
  //* Should move to the message page, which token is garanteed not to be null
  const socket = useMemo(() => io({ auth: { token } }), [token]);

  useEffect(() => {
    if (user) {
      socket.emit(ClientEventType.SETNAME, user._id);
      socket.on(
        ServerEventType.RECIEVEDMESSAGE,
        (message: string, from: string) => {
          dispatch(
            chatActions.addMessage({
              userId: from,
              message: {
                content: message,
                from,
                to: user._id,
                status: 'unread',
                _id: Math.random().toString(),
              },
            })
          );
        }
      );
    }
  }, [socket, user, dispatch]);

  const onSendMessage = useCallback(
    (message: string, to: string) => {
      socket.emit(ClientEventType.MESSAGE, message, to);
    },
    [socket]
  );

  const handleFriendsData = useCallback<HandleFn<User[]>>(data => {
    setFriends(data);
  }, []);
  const { error, makeRequest: fetchFriends } = useHttp(
    `/api/users/${user?._id}/friends`,
    handleFriendsData,
    'get'
  );

  useEffect(() => {
    if (friends.length === 0) fetchFriends({});
    if (!user) navigate('/login');
    if (error) throw error;
  }, [user, navigate, friends, error, fetchFriends]);

  return (
    <>
      <IconButton
        sx={{ ml: isNonMobileScreens ? '12rem' : '2rem', mt: '1rem' }}
      >
        <ArrowBack />
      </IconButton>
      <Box
        width='100%'
        p='2rem 6%'
        display={isNonMobileScreens ? 'flex' : 'block'}
        gap='2rem'
        justifyContent='center'
      >
        <Box flexBasis={isNonMobileScreens ? '18%' : undefined}>
          <UserList
            friends={friends}
            activeUser={currentChatTarget}
            onSwitch={user => setCurrentChatTarget(user)}
          />
          <Box m='2rem 0' />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? '42%' : undefined}
          mt={isNonMobileScreens ? undefined : '2rem'}
        >
          <ChatBox
            onSendMessage={onSendMessage}
            activeTarget={currentChatTarget}
          />
        </Box>
      </Box>
    </>
  );
};

export default MessagePage;
