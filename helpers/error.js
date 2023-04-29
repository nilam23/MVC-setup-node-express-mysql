import { STATUS_CODES } from './constants.js';
import { sendResponse } from './utils.js';

export class AppError extends Error {
  constructor(message, statusCode, error) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.response = error || {};

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * @description
 * the following method is a centralized way to handle application errors
 * @param {object} error the error object to be handled
 * @param {object} req the request object
 * @param {object} res the response object
 */
export const handleError = (error, req, res) => {
  const statusCode = error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
  delete error?.statusCode;

  sendResponse(
    res,
    statusCode,
    error.message || 'Internal Server Error',
    [],
    error
  );
};
