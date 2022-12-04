import e, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { MongooseError } from 'mongoose';

type InternalError = JsonWebTokenError | MongooseError;

type ErrorHandler = {
  [name: string]: (error: InternalError, res: Response) => void;
};

export class AppError extends Error {
  public status: string;
  public isOperational: boolean;
  constructor(public message: string, public statusCode = 500) {
    super();
    this.status = statusCode.toString().startsWith('5') ? 'error' : 'fail';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const internalErrorHandler = (
  statusCode: number,
  error: InternalError,
  res: Response
) => {
  res.status(statusCode).json({
    status: 'fail',
    stack: error.stack,
    message: error.message,
  });
};

const mongooseErrorHandler: ErrorHandler = {
  ValidationError: internalErrorHandler.bind(null, 400),
  JsonWebTokenError: internalErrorHandler.bind(null, 401),
  MongoServerError: internalErrorHandler.bind(null, 400),
  CastError: internalErrorHandler.bind(null, 400),
  TypeError: internalErrorHandler.bind(null, 400),
  Error: internalErrorHandler.bind(null, 400),
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: error.status,
      stack: error.stack,
      message: error.message,
    });
  } else if ((error as InternalError).name) {
    // Class validation workaround
    // console.log(error);
    return internalErrorHandler(400, error, res);
    // return mongooseErrorHandler[error.name](error, res);
  }

  res.status(500).json({
    status: 'error',
    stack: error.stack,
    error: error,
  });
};

const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
