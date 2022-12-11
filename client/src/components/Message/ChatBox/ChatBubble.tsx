import { Box, Card, Typography, useTheme } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import CheckIcon from '@mui/icons-material/Check';
import UserImage from 'components/UserImage';
import { User } from 'interfaces';
import { FC } from 'react';

type ChatBubbleProp = {
  user: User;
  targetUser: User;
  message: string;
  isRead?: boolean;
  isSender?: boolean;
};

const ChatBubble: FC<ChatBubbleProp> = ({
  user,
  targetUser,
  message,
  isSender = false,
  isRead = false,
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
          {isRead ? (
            <CheckIcon
              sx={{
                alignSelf: 'end',
                fontSize: '0.75rem',
                color: palette.neutral.medium,
              }}
            />
          ) : (
            <KeyboardReturnIcon
              sx={{ alignSelf: 'end', fontSize: '0.75rem' }}
            />
          )}

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
