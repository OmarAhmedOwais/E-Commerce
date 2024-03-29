import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Status } from '../interfaces/status/status.enum';
import ApiError from '../utils/ApiError';

export const globalErrorMiddleware = async (
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response> => {
  const isPredicted = err?.statusCode && err?.msg;
  const envExtra =
    process.env.NODE_ENV === 'prod'
      ? {
          prod: {
            name: err.name,
            message: err.message,
          },
        }
      : {
          dev: {
            name: err.name,
            message: err.message,
            stack: err.stack,
          },
        };
  if (!isPredicted) {
    if (
      err.name === 'JsonWebTokenError' ||
      err.message.includes('jwt expired')
    ) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: Status.ERROR,
        error_en: 'Please login again',
        error_ar: 'يرجى تسجيل الدخول مرة أخرى',
        ...envExtra,
      });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: Status.ERROR,
      error_en: err.message,
      error_ar: err.message,
      ...envExtra,
    });
  }
  return res.status(err.statusCode).json({
    status: Status.ERROR,
    error_en: err.msg.en,
    error_ar: err.msg.ar,
    ...envExtra,
  });
};
