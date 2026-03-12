export const errorHandler = (statusCode, message, errors = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (errors) {
    error.errors = errors;
  }
  error.isOperational = true;
  return error;
};
