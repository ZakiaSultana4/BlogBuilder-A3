import { TErrorSources, TGenericErrorResponse } from '../interfaces/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // Match the field name (e.g., 'email', 'username') that caused the duplicate error
  const match = err.message.match(/"([^"]*)"/);

  // Extract the field name (email, username, etc.)
  const extractedMessage = match ? match[1] : 'Field';

  const errorSources: TErrorSources = [
    {
      path: extractedMessage, // The field name where duplication occurred
      message: `${extractedMessage} already exists`, // Clear message indicating duplication
    },
  ];

  const statusCode = 400; // Bad request due to duplicate value

  return {
    success: false, // Indicating failure due to duplication
    statusCode,
    message: 'Duplicate Value Error', // Custom message for the duplicate error
    error: {
      details: errorSources, // Providing detailed error sources
    },
    stack: err.stack, // Optionally include stack trace
  };
};

export default handleDuplicateError;
