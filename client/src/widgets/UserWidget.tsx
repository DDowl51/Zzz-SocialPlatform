import { FC, useState, useCallback } from 'react';

import { User } from 'interfaces/index';
import UserEdit from 'components/UserEdit';
import UserInfo from 'components/UserInfo';

type UserWidgetProps = {
  user: User;
  loading?: boolean;
};

const UserWidget: FC<UserWidgetProps> = ({ user, loading = false }) => {
  const [isEditting, setIsEditting] = useState(false);

  const switchEdit = useCallback(() => {
    setIsEditting(prev => !prev);
  }, []);

  return (
    <>
      {isEditting ? (
        <UserEdit onSwitch={switchEdit} user={user} />
      ) : (
        <UserInfo onSwitch={switchEdit} user={user} />
      )}
    </>
  );
};

export default UserWidget;
