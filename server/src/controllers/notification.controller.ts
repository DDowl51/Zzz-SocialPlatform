import Notification from '../models/notification.model';
import User from '../models/user.model';
import catchAsync, { AppError } from './error.controller';

// Protected
export const getUserNotification = catchAsync(async (req, res, next) => {
  const userId = req.body.userId || req.params.userIdFromToken;

  const notifications = await Notification.find({
    to: userId,
    status: 'unread',
  })
    .populate('from', 'name picturePath')
    .sort('-createdAt');

  res.json(notifications);
});

export const markAllNotificationsRead = catchAsync(async (req, res, next) => {
  const userId = req.body.userId || req.params.userIdFromToken;

  const notifications = await Notification.find({
    to: userId,
    status: 'unread',
  })
    .populate('from', 'name picturePath')
    .sort('-createdAt');

  notifications.forEach(async n => {
    n.status = 'read';
    await n.save();
  });

  res.json(notifications);
});

export const markOneNotificationRead = catchAsync(async (req, res, next) => {
  const { nId } = req.params;

  const notification = await Notification.findById(nId);

  if (!notification) return next(new AppError('Notification not found', 404));

  notification.status = 'read';

  await notification.save();

  res.json(notification);
});
