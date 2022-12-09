import { Socket } from 'socket.io';
import { userIdSocketMap, UserSocket } from '../controllers/socket.controller';
import { ClientEventType } from '../interfaces/socket.interface';
import User from '../models/user.model';

export const onConnection = (socket: Socket) => {
  console.log('A user connected');
  const userSocket = new UserSocket(socket);
  socket.on(ClientEventType.SETNAME, userSocket.onSetUser);
  socket.on(ClientEventType.MESSAGE, userSocket.onMessage);
};
