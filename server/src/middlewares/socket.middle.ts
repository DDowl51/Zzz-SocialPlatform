import jwt, { JwtPayload } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { io } from '..';
import { AppError } from '../controllers/error.controller';
import User from '../models/user.model';

export const socketProtect = async (
  socket: Socket,
  next: (err?: any) => void
) => {
  console.log(socket.handshake.auth.token);

  const token = socket.handshake.auth.token;

  if (!token) return next(new AppError('Access Denied', 401));

  const jwtPayload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

  const user = await User.findById(jwtPayload.userId);

  if (!user) return next(new AppError('User not found.', 400));

  if (!user.passwordChangedAfter(new Date(jwtPayload.iat!)))
    return next(
      new AppError(
        'Password changed since last login, please login again.',
        400
      )
    );

  next();
};
