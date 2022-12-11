import { useMemo, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

type NotifyMessageProp = {
  isOpen: boolean;
};

const NotifyMessage = ({ isOpen = false }) => {
  const [popupOpen, setPopupOpen] = useState(true);

  const open = useMemo(() => isOpen, [isOpen]);
  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <Snackbar
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={popupOpen}
      onClose={closePopup}
      message='I love snacks'
    >
      <Alert severity='info' sx={{ width: '100%' }} onClose={closePopup}>
        This is a success message!
      </Alert>
    </Snackbar>
  );
};

export default NotifyMessage;
