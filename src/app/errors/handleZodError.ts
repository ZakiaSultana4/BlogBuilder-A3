import { ZodError, ZodIssue } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interfaces/error';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  // Map the ZodError issues to your custom error format.
  const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  const statusCode = 400;

  return {
    success: false, // Indicate the request was not successful.
    statusCode,
    message: 'Validation error', // Custom message for validation failure.
    error: {
      details: errorSources, // Provide the array of error details.
    },
    stack: err.stack, // Optionally include the error stack for debugging purposes.
  };
};

export default handleZodError;
