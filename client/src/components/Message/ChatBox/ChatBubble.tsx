import { Box, Card, Typography, useTheme } from '@mui/material';
import UserImage from 'components/UserImage';
import { User } from 'interfaces';
import React, { FC } from 'react';

type ChatBubbleProp = {
  user: User;
  targetUser: User;
  message: string;
  isSender?: boolean;
};

const ChatBubble: FC<ChatBubbleProp> = ({
  user,
  targetUser,
  message,
  isSender = false,
}) => {
  const { palette } = useTheme();
  return (
    <>
      {isSender ? (
        <Box
          display='flex'
          gap='0.75rem'
          justifyContent='end'
          position='relative'
          mb='0.5rem'
        >
          <Card>
            <Typography p='0.75rem' bgcolor={palette.background.paper}>
              {message}
            </Typography>
          </Card>
          <UserImage user={user} size='2.4rem' />
        </Box>
      ) : (
        <Box display='flex' gap='0.75rem' position='relative' mb='0.5rem'>
          <UserImage user={targetUser} size='2.4rem' />
          <Card>
            <Typography p='0.75rem' bgcolor={palette.primary.light}>
              {message}
            </Typography>
          </Card>
        </Box>
      )}
    </>
  );
};

export default ChatBubble;
