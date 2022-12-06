import express from 'express';
import {
  getUserNotification,
  markAllNotificationsRead,
  markOneNotificationRead,
} from '../controllers/notification.controller';
import { protect } from '../middlewares/auth.middle';

const router = express.Router();

router
  .route('/')
  .get(protect, getUserNotification)
  .patch(protect, markAllNotificationsRead);
router.route('/:nId').patch(protect, markOneNotificationRead);

export default router;
