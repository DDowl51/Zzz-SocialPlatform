import { FC, useCallback, useEffect, useState, useContext } from 'react';
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
import SocketContext from 'context/socket.context';
import { fetchAllMessages, messageRead } from 'stores/chat.action';

const MessagePage: FC = () => {
  const navigate = useNavigate();
  const user = useSelector<StateType, UserType>(state => state.auth.user);
  const [currentChatTarget, setCurrentChatTarget] = useState<UserType>();
  const [friends, setFriends] = useState<{ isOnline: boolean; info: User }[]>(
    []
  );
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');
  const dispatch = useDispatch<any>();

  const socketCtx = useContext(SocketContext);
  const socket = socketCtx.socket;

  useEffect(() => {
    if (user && socket) {
      socket.on(ServerEventType.SENDONLINE, (onlineFriends: string[]) => {
        setFriends(prev => {
          const newFriends = prev.map(f => {
            if (onlineFriends.includes(f.info._id)) {
              return {
                isOnline: true,
                info: f.info,
              };
            } else {
              return f;
            }
          });

          return newFriends;
        });
      });
      socket.on(ServerEventType.INFORMFRIENDONLINE, friendId => {
        setFriends(prev => {
          const newFriends = prev.map(f => {
            if (f.info._id === friendId) {
              return { isOnline: true, info: f.info };
            } else {
              return f;
            }
          });

          return newFriends;
        });
      });
      socket.on(ServerEventType.USEROFFLINE, friendId => {
        setFriends(prev => {
          const newFriends = prev.map(f => {
            if (f.info._id === friendId) {
              return { isOnline: false, info: f.info };
            } else {
              return f;
            }
          });

          return newFriends;
        });
      });
    }
  }, [socket, user, dispatch]);

  const onSendMessage = useCallback(
    (message: string, to: string) => {
      if (socket) socket.emit(ClientEventType.MESSAGE, message, to);
    },
    [socket]
  );

  const handleFriendsData = useCallback<HandleFn<User[]>>(data => {
    const friendsData = data.map((d, i) => ({
      isOnline: false,
      info: data[i],
    }));
    setFriends(friendsData);
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
  }, [user, navigate, friends, error, fetchFriends, dispatch]);

  if (!isNonMobileScreens) {
    return (
      <>
        <Box mt='1rem'></Box>
        {currentChatTarget ? (
          <ChatBox
            onBack={() => setCurrentChatTarget(undefined)}
            onSendMessage={onSendMessage}
            activeTarget={currentChatTarget}
          />
        ) : (
          <UserList
            friends={friends}
            activeUser={currentChatTarget}
            onSwitch={user => {
              setCurrentChatTarget(user);
              dispatch(messageRead(user._id));
              socket?.emit(ClientEventType.MESSAGEREAD, user._id);
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <IconButton
        sx={{ ml: isNonMobileScreens ? '12rem' : '2rem', mt: '1rem' }}
        onClick={() => navigate(-1)}
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
            onSwitch={user => {
              setCurrentChatTarget(user);
              dispatch(messageRead(user._id));
              socket?.emit(ClientEventType.MESSAGEREAD, user._id);
            }}
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
