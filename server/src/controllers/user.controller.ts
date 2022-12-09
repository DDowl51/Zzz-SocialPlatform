import ApiFeature, { QueryObject } from '../utils/apiFeatures';
import { ILoginRequest, ILoggedRequest } from '../interfaces/request.interface';
import User from '../models/user.model';
import catchAsync, { AppError } from './error.controller';

//* Protected
export const getAllUsers = catchAsync(async (req, res) => {
  const queryString = req.params as QueryObject;

  const usersQuery = new ApiFeature(
    User.find().select('-password'),
    queryString
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await usersQuery.query;

  res.json(users);
});

export const getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id).select('-password');
  if (!user) return next(new AppError('User not found.', 404));

  res.json(user);
});

export const getUserFriends = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id)
    .select('-password')
    .populate('friends', '-password');
  if (!user) return next(new AppError('User not found.', 404));
  res.json(user.friends);
});

export const register = catchAsync(async (req, res) => {
  const { name, email, password, location, occupation, picturePath } = req.body;

  const newUser = new User({
    name,
    email,
    password,
    location,
    occupation,
    picturePath,
  });

  await newUser.save();

  newUser.password = '';

  res.status(201).json(newUser);
});

//* Protected
export const updateProfile = catchAsync(
  async (req: ILoginRequest, res, next) => {
    const userId = req.body.userId || req.params.userIdFromToken;

    const user = await User.findById(userId);

    console.log(req.body);

    if (!user) return next(new AppError('User not found.', 404));

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.occupation = req.body.occupation || user.occupation;
    user.location = req.body.location || user.location;
    user.picturePath = req.body.picturePath || user.picturePath;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    updatedUser.password = '';

    res.status(200).json(updatedUser);
  }
);

//* Protected
// Add friend to user, or if already is friend, remove it
export const handleFriend = catchAsync(
  async (req: ILoggedRequest, res, next) => {
    const user = await User.findById(req.body.userId).select('-password');
    const friendId = req.params.friendId;
    const friend = await User.findById(friendId).select('-password');

    if (!friend || !user) return next(new AppError('User not found.', 404));

    // If user is already friend to friendId
    if (user.friends.includes(friend._id)) {
      // Remove it
      user.friends = user.friends.filter(fId => fId.toString() !== friendId);
      friend.friends = friend.friends.filter(
        fId => fId.toString() !== user._id.toString()
      );
    } else {
      // add friend
      user.friends.push(friend._id);
      friend.friends.push(user._id);
    }

    const savedUser = await user.save();
    await friend.save();

    res.json(savedUser);
  }
);
