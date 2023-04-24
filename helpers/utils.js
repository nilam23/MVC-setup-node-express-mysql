/**
 * @description
 * the following method is responsible for sending a response back to the client
 * @param {object} res the response object
 * @param {number} statusCode the http status code
 * @param {array} result the result object when the req is successful
 * @param {string} message the message to be sent to the client
 * @param {object} error the error object to be sent to the client, when exists
 */
export const sendResponse = (res, statusCode, message, result = [], error = []) => {
  res.status(statusCode).json({
    statusCode,
    message,
    data: result,
    error,
  });
};
