import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import catchAsync, { AppError } from './error.controller';

const signToken = (userId: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!);

  return token;
};

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  const user = await User.findOne({ email });

  if (!user) return next(new AppError('User not found.', 404));

  if (!(await user.comparePassword(password)))
    return next(new AppError('Incorrect email or password', 400));

  user.password = '';
  res.json({ user, token: signToken(user._id.toString()) });
});
