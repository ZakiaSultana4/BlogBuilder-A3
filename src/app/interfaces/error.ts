// Define the error sources, which will contain path and message for each validation issue.
export type TErrorSources = {
  path: string | number;
  message: string;
}[];

// Define the generic error response type, including statusCode, message, errorSources, and optional stack trace.
export type TGenericErrorResponse = {
  success?: boolean; // Add success field to indicate success or failure.
  statusCode: number;
  message: string;
  error?: {
    details: TErrorSources; // Error details will be an array of validation issues.
  };
  stack?: string; // Optional stack field to capture the error stack.
};
