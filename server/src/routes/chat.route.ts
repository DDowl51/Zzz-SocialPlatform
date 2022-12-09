import express from 'express';
import {
  createMessage,
  getUserChat,
  markMessageRead,
} from '../controllers/chat.controller';
import { protect } from '../middlewares/auth.middle';

const router = express.Router();

router
  .route('/:id')
  .get(protect, getUserChat)
  .patch(protect, markMessageRead)
  .post(protect, createMessage);

export default router;
