import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';
import config from '../config';
import AuthError from '../errors/AuthError';
import httpStatus from 'http-status';
import { TErrorSources, TGenericErrorResponse } from '../interfaces/error';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong.',
    },
  ];

  // Handle different error types
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode || statusCode;
    message = simplifiedError?.message || message;
    errorSources = simplifiedError?.error?.details || errorSources;
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode || statusCode;
    message = simplifiedError?.message || message;
    errorSources = simplifiedError?.error?.details || errorSources;
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode || statusCode;
    message = simplifiedError?.message || message;
    errorSources = simplifiedError?.error?.details || errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode || statusCode;
    message = simplifiedError?.message || message;
    errorSources = simplifiedError?.error?.details || errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode || statusCode;
    message = err?.message || message;
    errorSources = [
      {
        path: '',
        message: err?.message || 'Unknown application error',
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message || 'Unknown error';
    errorSources = [
      {
        path: '',
        message: err?.message || 'Unknown error',
      },
    ];
  }

  // Handling specific authentication error response
  if (err instanceof AuthError) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      statusCode: err?.statusCode,
      message: err?.message,
    });
    return; // Explicitly return void
  }

  // Send the final error response, making sure errorSources is wrapped in `error.details`
  const response: TGenericErrorResponse = {
    success: false,
    statusCode,
    message,
    error: {
      details: errorSources, // Nest errorSources under error.details as per TGenericErrorResponse type
    },
    stack: config.node_env === 'development' ? err?.stack : undefined,
  };

  res.status(statusCode).json(response);
  return; // Explicitly return void
};

export default globalErrorHandler;
