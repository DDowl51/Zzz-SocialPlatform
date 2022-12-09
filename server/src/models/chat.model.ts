import mongoose from 'mongoose';
import { IChat } from '../interfaces/chat.interface';

const chatSchema = new mongoose.Schema<IChat>(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['read', 'unread'],
      default: 'unread',
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.model('Chat', chatSchema);
