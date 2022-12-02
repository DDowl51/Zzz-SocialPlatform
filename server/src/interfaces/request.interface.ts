import { Request } from 'express';

interface ILoggedBody {
  userId: string;
}

export interface ILoggedRequest extends Request {
  body: ILoggedBody;
}

interface ILoginBody extends ILoggedBody {
  name?: string;
  email?: string;
  password?: string;
  occupation?: string;
  location?: string;
  picturePath?: string;
}

export interface ILoginRequest extends Request {
  body: ILoginBody;
}

interface ICreatePostBody extends ILoggedBody {
  description: string;
  picturePath?: string;
}

export interface ICreatePostRequest extends Request {
  body: ICreatePostBody;
}

interface ICommentBody extends ILoggedBody {
  content: string;
}

export interface ICommentRequest extends Request {
  body: ICommentBody;
}
