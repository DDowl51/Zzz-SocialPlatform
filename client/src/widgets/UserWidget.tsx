import { FC, PropsWithChildren } from 'react';
import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from '@mui/icons-material';
import { Box, Typography, Divider, useTheme, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';

import { User } from 'interfaces/index';
import UserImage from 'components/UserImage';

type UserWidgetProps = PropsWithChildren<{
  user: User;
  loading?: boolean;
}>;

const UserWidget: FC<UserWidgetProps> = ({ user, loading = false }) => {
  const navigate = useNavigate();

  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  return (
    <WidgetWrapper>
      {/* First row */}
      <FlexBetween gap='0.5rem' pb='1.1rem'>
        <FlexBetween gap='1rem'>
          {!loading ? (
            <UserImage image={user.picturePath} />
          ) : (
            <Skeleton variant='circular'>
              <UserImage image={user.picturePath} />
            </Skeleton>
          )}
          <Box>
            <Typography
              onClick={() => navigate(`/profile/${user._id}`)}
              variant='h4'
              color={dark}
              fontWeight='500'
              sx={{
                transition: 'all 0.2s',
                '&:hover': {
                  color: palette.primary.main,
                  cursor: 'pointer',
                },
              }}
            >
              {!loading ? user.name : <Skeleton width={100} />}
            </Typography>
            <Typography color={main}>
              {!loading ? (
                `${user.friends.length} friends`
              ) : (
                <Skeleton width={100} />
              )}
            </Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* Second row */}
      <Box p='1rem 0'>
        <Box display='flex' alignItems='center' gap='1rem' mb='0.5rem'>
          <LocationOnOutlined fontSize='large' sx={{ color: main }} />
          <Typography color={main}>
            {!loading ? user.location : <Skeleton width={100} />}
          </Typography>
        </Box>
        <Box display='flex' alignItems='center' gap='1rem' mb='0.5rem'>
          <WorkOutlineOutlined fontSize='large' sx={{ color: main }} />
          <Typography color={main}>
            {!loading ? user.occupation : <Skeleton width={100} />}
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Third row */}
      <Box p='1rem 0'>
        <FlexBetween mb='0.5rem'>
          {!loading ? (
            <>
              <Typography color={main}>Who's viewed your profile</Typography>
              <Typography color={medium} fontWeight='500'>
                {user.profileVisitor.length}
              </Typography>
            </>
          ) : (
            <Skeleton width='100%' />
          )}
        </FlexBetween>
        <FlexBetween mb='0.5rem'>
          {!loading ? (
            <>
              <Typography color={main}>Likes of your posts</Typography>
              <Typography color={medium} fontWeight='500'>
                {user.impressions}
              </Typography>
            </>
          ) : (
            <Skeleton width='100%' />
          )}
        </FlexBetween>
      </Box>

      <Divider />

      {/* Forth row */}
      <Box p='1rem 0'>
        <Typography fontSize='1rem' color={dark} fontWeight='500' mb='1rem'>
          Social Profiles
        </Typography>
        <FlexBetween gap='1rem' mb='0.5rem'>
          <FlexBetween gap='1rem'>
            <img src='../assets/twitter.png' alt='twitter' />
            <Box>
              <Typography color={main} fontWeight='500'>
                Twitter
              </Typography>
              <Typography color={medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>
        <FlexBetween gap='1rem' mb='0.5rem'>
          <FlexBetween gap='1rem'>
            <img src='../assets/linkedin.png' alt='linkedin' />
            <Box>
              <Typography color={main} fontWeight='500'>
                LinkedIn
              </Typography>
              <Typography color={medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
