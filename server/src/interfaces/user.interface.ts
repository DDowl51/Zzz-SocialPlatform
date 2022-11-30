import mongoose from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  passwordChangedAt: Date;
  picturePath: string;
  friends: mongoose.Types.ObjectId[];
  location: string;
  occupation: string;
  profileVisitor: mongoose.Types.ObjectId[];
  impressions: number;
}

export interface IUserMethods {
  comparePassword: (password: string) => Promise<boolean>;
  passwordChangedAfter: (date: Date) => boolean;
}
