import { Chat } from '../models/chat.model';
import catchAsync from './error.controller';

// Protected
export const getUserChat = catchAsync(async (req, res, next) => {
  const userId = req.body.userId || req.params.userIdFromToken;
  const targetId = req.params.id;
  const chats = await Chat.find({
    $or: [
      { from: userId, to: targetId },
      { from: targetId, to: userId },
    ],
  }).sort('createdAt');

  res.status(200).json(chats);
});

export const createMessage = catchAsync(async (req, res, next) => {
  const userId = req.body.userId || req.params.userIdFromToken;
  const targetId = req.params.id;

  const newMessage = new Chat({
    from: userId,
    to: targetId,
    content: req.body.content,
    status: 'unread',
  });

  const savedMessage = await newMessage.save();

  res.status(201).json(savedMessage);
});

export const markMessageRead = catchAsync(async (req, res, next) => {
  const userId = req.body.userId || req.params.userIdFromToken;
  const targetId = req.params.id;
  const chats = await Chat.find({
    from: targetId,
    to: userId,
  });

  chats.forEach(async c => {
    c.status = 'read';
    await c.save();
  });

  res.status(200).json(chats);
});
