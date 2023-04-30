import {
  STATUS_CODES,
  cookieAttributeForJwtToken,
  dbErrorCodes,
  userAuthRequiredFields
} from '../helpers/constants.js';
import { AppError } from '../helpers/error.js';
import {
  isAvailable,
  saveCookie,
  sendResponse,
  validate
} from '../helpers/utils.js';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  /**
   * @description
   * the controller method to sign up a new user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the newly created user
   */
  static async signUpUser(req, res, next) {
    const { body: requestBody } = req;

    const allFieldsArePresent = isAvailable(requestBody, Object.values(userAuthRequiredFields));

    if (!allFieldsArePresent) return next(new AppError('Some fields are missing', STATUS_CODES.BAD_REQUEST));

    const { username, password } = requestBody;

    if (!validate.password(password)) return next(new AppError('Please use a different password', STATUS_CODES.BAD_REQUEST));

    try {
      const insertUserResult = await AuthService.signUpUser(username, password);

      return sendResponse(res, STATUS_CODES.SUCCESSFULLY_CREATED, 'The user signed up successfully', { id: insertUserResult.insertId, username });
    } catch (error) {
      if (error.code === dbErrorCodes.ER_DUP_ENTRY) delete error.sql; // avoiding the sql query to prevent showcasing sensitive information in the response

      return next(
        new AppError(
          error.code === dbErrorCodes.ER_DUP_ENTRY ? 'Username already exists' : error.message || 'Internal Server Error',
          error.code === dbErrorCodes.ER_DUP_ENTRY ? STATUS_CODES.BAD_REQUEST : error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }

  /**
   * @description
   * the controller method to log in an existing user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the information of the logged in user and the access token
   */
  static async logInUser(req, res, next) {
    const { body: requestBody } = req;

    const allFieldsArePresent = isAvailable(requestBody, Object.values(userAuthRequiredFields));

    if (!allFieldsArePresent) return next(new AppError('Some fields are missing', STATUS_CODES.BAD_REQUEST));

    const { username, password } = requestBody;

    try {
      const { user, token: access_token } = await AuthService.logInUser(username, password);

      saveCookie(res, cookieAttributeForJwtToken, access_token);

      return sendResponse(res, STATUS_CODES.OK, 'User logged in successfully', { userId: user.id, username: user.username });
    } catch (error) {
      next(
        new AppError(
          error.message || 'Internal Server Error',
          error.message === 'Incorrect username'
          || error.message === 'Incorrect password'
            ? STATUS_CODES.BAD_REQUEST
            : error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }

  /**
   * @description
   * the controller method to log out a user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   */
  static logOutUser(req, res, next) {
    if (req.cookies[`${cookieAttributeForJwtToken}`]) {
      res.clearCookie(cookieAttributeForJwtToken);

      return sendResponse(res, STATUS_CODES.OK, 'User logged out successfully');
    }

    return next(new AppError('You need to log in first', STATUS_CODES.BAD_REQUEST));
  }
}
