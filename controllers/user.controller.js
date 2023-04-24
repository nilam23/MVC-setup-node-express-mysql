import { STATUS_CODES } from '../helpers/constants.js';
import { sendResponse } from '../helpers/utils.js';
import { UserModelClass } from '../models/user.model.js';

export class UserController {
  /**
   * @description
   * the controller method to fetch all blogs for a particular user
   * @param {object} req the request object
   * @param {object} res the response object
   * @returns the array of blogs for the user
   */
  static async getUserBlogs(req, res) {
    try {
      const userId = 1;
      const blogs = await UserModelClass.getUserBlogs(userId);

      return sendResponse(res, STATUS_CODES.OK, 'User blogs fetched successfully', blogs);
    } catch (error) {
      return sendResponse(
        res,
        error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
        error.message || 'Internal Server Error',
        [],
        error.response || error
      );
    }
  }
}
