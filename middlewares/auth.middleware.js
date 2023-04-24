/* eslint-disable import/no-extraneous-dependencies */
import jwt from 'jsonwebtoken';
import { STATUS_CODES, cookieAttributeForJwtToken } from '../helpers/constants.js';
import { sendResponse } from '../helpers/utils.js';

export const AuthMiddlewares = {};

/**
 * @description
 * the following middleware checks whether a user is currently logged in
 * and it is to be used in all private routes
 * @param {object} req the request object
 * @param {object} res the response object
 * @param {object} next the next middleware function in the application’s request-response cycle
 */
AuthMiddlewares.checkAuth = async (req, res, next) => {
  const token = req.cookies[`${cookieAttributeForJwtToken}`];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) return sendResponse(res, STATUS_CODES.UNAUTHORIZED, 'You are not authorized');

      res.locals.user = {
        id: decodedToken.userId,
        username: decodedToken.username
      };
      next();
    });
  } else return sendResponse(res, STATUS_CODES.UNAUTHORIZED, 'You are not authorized');
};
