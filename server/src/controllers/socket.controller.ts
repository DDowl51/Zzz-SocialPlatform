import { Socket } from 'socket.io';
import { io } from '..';
import {
  ClientEventType,
  ServerEventType,
} from '../interfaces/socket.interface';
import User from '../models/user.model';

export const userIdSocketMap = new Map<string, Socket>();

export class UserSocket {
  private currentUserId: string;
  constructor(private socket: Socket) {
    this.currentUserId = '';
  }
  onSetUser = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
      this.socket.emit(ServerEventType.ERRORLOGOUT, 'User not found.');
      this.socket.disconnect();
      return;
    }

    if (userIdSocketMap.has(userId)) {
      // Disconnect previous connection
      userIdSocketMap.get(userId)?.emit(ServerEventType.FORCELOGOUT);
      userIdSocketMap.get(userId)?.disconnect();
    }

    userIdSocketMap.set(userId, this.socket);
    this.currentUserId = userId;
  };

  onMessage = async (message: string, to: string) => {
    // to: userId    const
    const user = await User.findById(to);
    if (!user) {
      this.socket.emit(ServerEventType.ERRORLOGOUT, 'Target user not found.');
      return;
    }
    if (!userIdSocketMap.has(to)) {
      return;
    }

    if (this.currentUserId) {
      userIdSocketMap
        .get(to)
        ?.emit(ServerEventType.RECIEVEDMESSAGE, message, this.currentUserId);
    }
  };
}
