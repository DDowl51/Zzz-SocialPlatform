import catchAsync, { AppError } from '../controllers/error.controller';
import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user.model';

export const protect: RequestHandler = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

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

  req.body.userId = jwtPayload.userId;
  req.params.userIdFromToken = jwtPayload.userId;

  next();
});
