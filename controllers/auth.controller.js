import {
  STATUS_CODES,
  cookieAttributeForJwtToken,
  dbErrorCodes,
  userAuthRequiredFields
} from '../helpers/constants.js';
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
   * @returns the newly created user
   */
  static async signUpUser(req, res) {
    const { body: requestBody } = req;

    const allFieldsArePresent = isAvailable(requestBody, Object.values(userAuthRequiredFields));

    if (!allFieldsArePresent) return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'Some fields are missing');

    const { username, password } = requestBody;

    if (!validate.password(password)) return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'Please use a different password');

    try {
      const insertUserResult = await AuthService.signUpUser(username, password);

      return sendResponse(res, STATUS_CODES.SUCCESSFULLY_CREATED, 'The user signed up successfully', { id: insertUserResult.insertId, username });
    } catch (error) {
      if (error.code === dbErrorCodes.ER_DUP_ENTRY) delete error.sql;

      return sendResponse(
        res,
        error.code === dbErrorCodes.ER_DUP_ENTRY ? STATUS_CODES.BAD_REQUEST : error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
        error.code === dbErrorCodes.ER_DUP_ENTRY ? 'Username already exists' : error.message || 'Internal Server Error',
        [],
        error.response || error
      );
    }
  }

  /**
   * @description
   * the controller method to log in an existing user
   * @param {object} req the request object
   * @param {object} res the response object
   * @returns the information of the logged in user and the access token
   */
  static async logInUser(req, res) {
    const { body: requestBody } = req;

    const allFieldsArePresent = isAvailable(requestBody, Object.values(userAuthRequiredFields));

    if (!allFieldsArePresent) return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'Some fields are missing');

    const { username, password } = requestBody;

    try {
      const { user, token: access_token } = await AuthService.logInUser(username, password);

      saveCookie(res, cookieAttributeForJwtToken, access_token);

      return sendResponse(res, STATUS_CODES.OK, 'User logged in successfully', { userId: user.id, username: user.username });
    } catch (error) {
      return sendResponse(
        res,
        error.message === 'Incorrect username'
        || error.message === 'Incorrect password'
          ? STATUS_CODES.BAD_REQUEST
          : error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
        error.message || 'Internal Server Error',
        [],
        error.response || error
      );
    }
  }

  /**
   * @description
   * the controller method to log out a user
   * @param {object} req the request object
   * @param {object} res the response object
   */
  static logOutUser(req, res) {
    if (req.cookies[`${cookieAttributeForJwtToken}`]) {
      res.clearCookie(cookieAttributeForJwtToken);

      return sendResponse(res, STATUS_CODES.OK, 'User logged out successfully');
    }
    return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'You need to log in first');
  }
}
