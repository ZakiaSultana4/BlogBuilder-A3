import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interfaces/error';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = Object.values(err.errors).map((val) => {
    // Type guard for ValidatorError
    if (val instanceof mongoose.Error.ValidatorError) {
      return {
        path: val.path,
        message: val.message,
      };
    }

    // Type guard for CastError
    if (val instanceof mongoose.Error.CastError) {
      return {
        path: val.path, // Explicitly access the 'path' property from CastError
        message: `Invalid value for ${val.path}`, // Customize message for CastError
      };
    }

    // Fallback for unknown errors
    return {
      path: '',
      message: 'Unknown validation error',
    };
  });

  const statusCode = 400; // Bad Request for validation error

  return {
    statusCode,
    message: 'Validation error', // Clear message indicating the error type
    error: {
      details: errorSources, // Place the errorSources inside the details field
    },
  };
};

export default handleValidationError;
