import { io, Socket } from 'socket.io-client';
import { createContext, FC, PropsWithChildren, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { StateType } from 'stores/store';

type SocketContextType = {
  socket: Socket | null;
};
const initValue = {
  socket: null,
};

export const SocketContext = createContext<SocketContextType>(initValue);

export const SocketContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const token = useSelector<StateType, string>(state => state.auth.token);
  const socket = useMemo(() => io({ auth: { token } }), [token]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
