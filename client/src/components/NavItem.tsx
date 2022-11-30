import { FC, PropsWithChildren, useEffect } from 'react';
import {
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { globalActions } from 'stores/global.slice';
import FlexBetween from 'components/FlexBetween';
import { StateType } from 'stores/store';
import { authActions } from 'stores/auth.slice';
import { UserType } from 'interfaces/index';
import { useNavigate } from 'react-router-dom';

interface NavItemProps {
  isMobile?: boolean;
}

export const NavItem: FC<PropsWithChildren<NavItemProps>> = ({ isMobile }) => {
  const dispatch = useDispatch();
  const user = useSelector<StateType, UserType | undefined>(
    state => state.auth.user
  );

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;

  const username = (user && user.name) || 'Anonymous';

  return (
    <FlexBetween
      gap={isMobile ? '3rem' : '2rem'}
      display='flex'
      flexDirection={isMobile ? 'column' : 'row'}
    >
      <IconButton onClick={() => dispatch(globalActions.switchMode())}>
        {theme.palette.mode === 'dark' ? (
          <LightMode sx={{ fontSize: '25px', color: dark }} />
        ) : (
          <DarkMode sx={{ fontSize: '25px' }} />
        )}
      </IconButton>
      <Tooltip title='Not implemented yet'>
        <IconButton>
          <Message sx={{ fontSize: '25px' }} />
        </IconButton>
      </Tooltip>
      <Tooltip title='Not implemented yet'>
        <IconButton>
          <Notifications sx={{ fontSize: '25px' }} />
        </IconButton>
      </Tooltip>
      <Tooltip title='Not implemented yet'>
        <IconButton>
          <Help sx={{ fontSize: '25px' }} />
        </IconButton>
      </Tooltip>
      <FormControl>
        <Select
          value={username}
          sx={{
            bgcolor: neutralLight,
            width: '150px',
            borderRadius: '0.25rem',
            p: '0.25rem 1rem',
            '& .MuiSvgIcon-root': {
              pr: '0.25rem',
              width: '3rem',
            },
            '& .MuiSelect-select:focus': {
              bgcolor: neutralLight,
            },
          }}
          input={<InputBase />}
        >
          <MenuItem value={username}>
            <Typography>{username}</Typography>
          </MenuItem>
          <MenuItem onClick={() => dispatch(authActions.logout())}>
            Logout
          </MenuItem>
        </Select>
      </FormControl>
    </FlexBetween>
  );
};
