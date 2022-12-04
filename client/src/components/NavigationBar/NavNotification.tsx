import { MouseEvent, useState } from 'react';
import { Box, IconButton, Popover } from '@mui/material';
import { Notifications } from '@mui/icons-material';

const NavNotification = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleClick}>
        <Notifications sx={{ fontSize: '25px' }} />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box>Notification goes here.</Box>
      </Popover>
    </>
  );
};

export default NavNotification;
