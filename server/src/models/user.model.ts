import mongoose, { Model, mongo } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { IUser, IUserMethods } from '../interfaces/user.interface';

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, 'Invalid email'],
    },
    password: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    passwordChangedAt: {
      type: Date,
      default: new Date(Date.now()),
    },
    picturePath: {
      type: String,
      default: '',
    },
    friends: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    location: String,
    occupation: String,
    profileVisitor: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    impressions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now());

  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.passwordChangedAfter = function (date) {
  return date.getTime() > this.passwordChangedAt.getTime() / 1000;
};

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
