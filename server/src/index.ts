import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import sourceMapSupport from 'source-map-support';
import multer from 'multer';
import { createSession, createChannel } from 'better-sse';

import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import postRouter from './routes/post.route';
import commentRouter from './routes/comment.route';
import sseRouter from './routes/sse.route';
import mongoose from 'mongoose';
import { errorHandler } from './controllers/error.controller';
import { register, updateProfile } from './controllers/user.controller';
import { createPost } from './controllers/post.controller';
import { protect } from './middlewares/auth.middle';

sourceMapSupport.install();
dotenv.config();

const app = express();

// Configurations
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: false }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

// File storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets');
  },
  filename: (req, file, cb) => {
    // 解决中文乱码
    cb(null, Buffer.from(file.originalname, 'latin1').toString());
  },
});
const upload = multer({ storage });

// Routes with files
app.post('/api/auth/register', upload.single('picture'), register);
app.post('/api/posts', upload.single('picture'), protect, createPost);
app.patch(
  '/api/users/update',
  protect,
  upload.single('picture'),
  updateProfile
);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/sse', sseRouter);

app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URL!, { dbName: 'OldWave' }, () => {
  console.log('Mongo DB connected');
});

const PORT = process.env.SERVER_PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
