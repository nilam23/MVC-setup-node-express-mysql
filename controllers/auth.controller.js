import { STATUS_CODES, dbErrorCodes, userAuthRequiredFields } from '../helpers/constants.js';
import { isAvailable, sendResponse, validate } from '../helpers/utils.js';
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
      return sendResponse(
        res,
        error.code === dbErrorCodes.ER_DUP_ENTRY ? STATUS_CODES.BAD_REQUEST : error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
        error.code === dbErrorCodes.ER_DUP_ENTRY ? 'Username already exists' : error.message || 'Internal Server Error',
        [],
        error.response || error
      );
    }
  }
}
