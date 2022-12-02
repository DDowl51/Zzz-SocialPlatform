import React, { PropsWithChildren, FC } from 'react';
import { Avatar } from '@mui/material';
import { User } from 'interfaces';

type UserImageProps = PropsWithChildren<{ user: User; size?: string }>;

const UserImage: FC<UserImageProps> = ({ user, size = '60px' }) => {
  return (
    <Avatar
      src={`/assets/${user.picturePath}`}
      alt={user.name}
      sx={{ width: size, height: size }}
    />
  );
};

export default UserImage;
