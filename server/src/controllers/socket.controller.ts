import { Socket } from 'socket.io';
import { io } from '..';
import {
  ClientEventType,
  ServerEventType,
} from '../interfaces/socket.interface';
import User from '../models/user.model';

export const userIdSocketMap = new Map<string, Socket>();
const onlineUsers: Set<string> = new Set();

export class UserSocket {
  private currentUserId: string;
  private onlineFriends: string[];

  constructor(private socket: Socket) {
    this.currentUserId = '';
    this.onlineFriends = [];
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

    onlineUsers.add(userId);
    userIdSocketMap.set(userId, this.socket);
    this.currentUserId = userId;
    this.socket.emit(ServerEventType.NAMESET);
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

  onGetOnline = async () => {
    if (!this.currentUserId) return;
    const user = await User.findById(this.currentUserId);
    if (!user) return;
    const friends = user.friends;
    if (!friends) return;
    this.onlineFriends = friends
      .map(uId => uId.toString())
      .filter(uId => userIdSocketMap.has(uId));

    this.socket.emit(ServerEventType.SENDONLINE, this.onlineFriends);
  };

  onInformFriends = () => {
    // 通知所有好友自己上线
    this.onlineFriends.forEach(fId => {
      if (userIdSocketMap.has(fId)) {
        userIdSocketMap
          .get(fId)
          ?.emit(ServerEventType.INFORMFRIENDONLINE, this.currentUserId);
      }
    });
  };

  onTyping = (targetId: string) => {
    if (userIdSocketMap.has(targetId)) {
      userIdSocketMap
        .get(targetId)
        ?.emit(ServerEventType.TYPING, this.currentUserId);
    }
  };

  onTypingEnd = (targetId: string) => {
    if (userIdSocketMap.has(targetId)) {
      userIdSocketMap
        .get(targetId)
        ?.emit(ServerEventType.TYPINGEND, this.currentUserId);
    }
  };

  onMessageRead = (targetId: string) => {
    if (userIdSocketMap.has(targetId)) {
      userIdSocketMap
        .get(targetId)
        ?.emit(ServerEventType.MESSAGEREAD, this.currentUserId);
    }
  };

  onDisconnect = () => {
    userIdSocketMap.delete(this.currentUserId);
    this.onlineFriends.forEach(f => {
      if (userIdSocketMap.has(f)) {
        userIdSocketMap
          .get(f)
          ?.emit(ServerEventType.USEROFFLINE, this.currentUserId);
      }
    });
  };
}
