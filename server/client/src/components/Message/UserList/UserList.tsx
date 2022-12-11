import WidgetWrapper from 'components/WidgetWrapper';
import { User, UserType } from 'interfaces';
import React, { FC } from 'react';
import UserChat from './UserChat';

type UserListProp = {
  friends: { isOnline: boolean; info: User }[];
  activeUser: UserType;
  onSwitch: (user: User) => void;
};

const UserList: FC<UserListProp> = ({ friends, activeUser, onSwitch }) => {
  return (
    <WidgetWrapper>
      {friends.map(f => (
        <UserChat
          key={f.info._id}
          user={f.info}
          isOnline={f.isOnline}
          isActive={f.info._id === activeUser?._id}
          onSwitch={onSwitch}
        />
      ))}
    </WidgetWrapper>
  );
};

export default UserList;
