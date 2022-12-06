import catchAsync from '../controllers/error.controller';
import { createSession, createChannel } from 'better-sse';
import { Session } from 'better-sse/build/Session';
import { sessionUserMap } from '../utils/serverSentEvent';
import { RequestHandler } from 'express';

const channel = createChannel();

// After protect
export const sseConnect = catchAsync(async (req, res) => {
  const userId = req.body.userId || req.params.userIdFromToken;

  const session = await createSession(req, res);

  // console.log(`${userId} connected`);

  sessionUserMap.set(userId, session);

  session.push('hello');
});

// After protect
export const sseClose: RequestHandler = (req, res) => {
  const userId = req.body.userId || req.params.userIdFromToken;

  if (sessionUserMap.has(userId)) {
    console.log(`${userId} closed connection`);

    sessionUserMap.delete(userId);
  }

  res.json({ status: 'success' });
};
