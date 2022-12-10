import React, { FC } from 'react';
import { Avatar, SxProps, Badge } from '@mui/material';
import { User } from 'interfaces';
import StyledBadge from './StyledBadge';

type UserImageProps = {
  user: User;
  size?: string;
  sx?: SxProps;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const UserImage: FC<UserImageProps> = ({
  user,
  size = '60px',
  sx,
  onClick,
}) => {
  return (
    <Avatar
      onClick={onClick}
      src={`/assets/${user.picturePath}`}
      alt={user.name}
      sx={{ ...sx, width: size, height: size }}
    />
  );
};

export default UserImage;
