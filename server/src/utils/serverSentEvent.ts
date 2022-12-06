import { Session } from 'better-sse/build/Session';
import { IUser, IUserMethods } from '../interfaces/user.interface';
import { Document, Types } from 'mongoose';

export const sessionUserMap: Map<string, Session> = new Map();

type FromType = Document<unknown, any, IUser> &
  IUser & {
    _id: Types.ObjectId;
  } & IUserMethods;

export const likePostNotification = (targetUserId: string, from: FromType) => {
  if (sessionUserMap.has(targetUserId)) {
    console.log(`sending notification to ${targetUserId}`);

    sessionUserMap
      .get(targetUserId)
      ?.push(`${from.name} liked your post!`, 'like-post');
  }
};

export const commentPostNotification = (
  targetUserId: string,
  from: FromType
) => {
  if (sessionUserMap.has(targetUserId)) {
    console.log(`sending notification to ${targetUserId}`);

    sessionUserMap
      .get(targetUserId)
      ?.push(`${from.name} commented your post!`, 'comment-post');
  }
};
