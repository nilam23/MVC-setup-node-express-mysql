import { STATUS_CODES, blogCreationRequiredFields, possibleBlogUpdateFields } from '../helpers/constants.js';
import { isAvailable, sendResponse } from '../helpers/utils.js';
import { UserModel } from '../models/user.model.js';

export class UserController {
  /**
   * @description
   * the controller method to fetch all blogs for a particular user
   * @param {object} req the request object
   * @param {object} res the response object
   * @returns the array of blogs for the user
   */
  static async getAllBlogs(req, res) {
    try {
      const blogs = await UserModel.getAllBlogs();

      return sendResponse(res, STATUS_CODES.OK, 'All blogs fetched successfully', blogs);
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

  /**
   * @description
   * the controller method to create a blog for a particular user
   * @param {object} req the request object
   * @param {object} res the response object
   * @returns the created blog for the user
   */
  static async createBlog(req, res) {
    const { body: requestBody } = req;
    requestBody.userId = res.locals.user.id;

    const allFieldsArePresent = isAvailable(requestBody, Object.values(blogCreationRequiredFields));

    if (!allFieldsArePresent) return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'Some fields are missing');

    const { title, description, userId } = requestBody;
    try {
      const blogCreateResult = await UserModel.createBlog(title, description, userId);

      return sendResponse(res, STATUS_CODES.SUCCESSFULLY_CREATED, 'Blog created successfully', {
        id: blogCreateResult.insertId,
        title,
        description,
        userId
      });
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

  /**
   * @description
   * the controller method to fetch the blog corresponding to a blog id
   * @param {object} req the request object
   * @param {object} res the response object
   * @returns the blog fetched from the database
   */
  static async getBlogById(req, res) {
    const blogId = req.params.id;

    try {
      const blog = await UserModel.getBlogById(blogId);

      if (!blog) return sendResponse(res, STATUS_CODES.OK, `Blog with id ${blogId} not found`);

      return sendResponse(res, STATUS_CODES.OK, `Blog with id ${blogId} fetched successfully`, blog);
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

  /**
   * @description
   * the controller method to update some attributes of a blog corresponding to an id
   * @param {object} req the request object
   * @param {object} res the response object
   */
  static async updateBlog(req, res) {
    const { body: requestBody } = req;

    const fieldsToBeUpdatedExist = isAvailable(requestBody, Object.values(possibleBlogUpdateFields), false);

    if (!fieldsToBeUpdatedExist) return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'Fields to be updated does not exist');

    const blogId = req.params.id;

    try {
      const blogToBeUpdated = await UserModel.getBlogById(blogId);

      if (!blogToBeUpdated) return sendResponse(res, STATUS_CODES.OK, `Blog with id ${blogId} not found`);

      if (blogToBeUpdated.userId !== res.locals.user.id) return sendResponse(res, STATUS_CODES.UNAUTHORIZED, 'You are not authorized');

      const updateBlogResult = await UserModel.updateBlog(requestBody, blogId);

      if (updateBlogResult.affectedRows) return sendResponse(res, STATUS_CODES.OK, `Blog with id ${blogId} updated successfully`);
      return sendResponse(res, STATUS_CODES.BAD_REQUEST, `Blog with id ${blogId} could not be updated`);
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
