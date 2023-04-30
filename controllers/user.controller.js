import {
  STATUS_CODES,
  blogCreationRequiredFields,
  cookieAttributeForJwtToken,
  possibleBlogUpdateFields,
  userUpdateFields
} from '../helpers/constants.js';
import { AppError } from '../helpers/error.js';
import { isAvailable, sendResponse } from '../helpers/utils.js';
import { AuthModel } from '../models/auth.model.js';
import { UserModel } from '../models/user.model.js';

export class UserController {
  /**
   * @description
   * the controller method to fetch all blogs for a particular user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the array of blogs for the user
   */
  static async getAllBlogs(req, res, next) {
    try {
      const blogs = await UserModel.getAllBlogs();

      if (!blogs.length) return next(new AppError('No blog found', STATUS_CODES.NOT_FOUND));

      return sendResponse(res, STATUS_CODES.OK, 'All blogs fetched successfully', blogs);
    } catch (error) {
      return next(
        new AppError(
          error.message || 'Internal Server Error',
          error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }

  /**
   * @description
   * the controller method to create a blog for a particular user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the created blog for the user
   */
  static async createBlog(req, res, next) {
    const { body: requestBody } = req;
    requestBody.userId = res.locals.user.id;

    const allFieldsArePresent = isAvailable(requestBody, Object.values(blogCreationRequiredFields));

    if (!allFieldsArePresent) return next(new AppError('Some fields are missing', STATUS_CODES.BAD_REQUEST));

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
      return next(
        new AppError(
          error.message || 'Internal Server Error',
          error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }

  /**
   * @description
   * the controller method to fetch the blog corresponding to a blog id
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the blog fetched from the database
   */
  static async getBlogById(req, res, next) {
    const blogId = req.params.id;

    try {
      const blog = await UserModel.getBlogById(blogId);

      if (!blog) return next(new AppError(`Blog with id ${blogId} not found`, STATUS_CODES.NOT_FOUND));

      return sendResponse(res, STATUS_CODES.OK, `Blog with id ${blogId} fetched successfully`, blog);
    } catch (error) {
      return next(
        new AppError(
          error.message || 'Internal Server Error',
          error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }

  /**
   * @description
   * the controller method to update some attributes of a blog corresponding to an id
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   */
  static async updateBlog(req, res, next) {
    const { body: requestBody } = req;

    const fieldsToBeUpdatedExist = isAvailable(requestBody, Object.values(possibleBlogUpdateFields), false);

    if (!fieldsToBeUpdatedExist) return next(new AppError('Fields to be updated does not exist', STATUS_CODES.BAD_REQUEST));

    const blogId = req.params.id;

    try {
      const blogToBeUpdated = await UserModel.getBlogById(blogId);

      if (!blogToBeUpdated) return next(new AppError(`Blog with id ${blogId} not found`, STATUS_CODES.NOT_FOUND));

      if (blogToBeUpdated.userId !== res.locals.user.id) return next(new AppError('You are not authorized', STATUS_CODES.FORBIDDEN));

      const updateBlogResult = await UserModel.updateBlog(requestBody, blogId);

      if (updateBlogResult.affectedRows) return sendResponse(res, STATUS_CODES.OK, `Blog with id ${blogId} updated successfully`);
      return next(new AppError(`Blog with id ${blogId} could not be updated`, STATUS_CODES.BAD_REQUEST));
    } catch (error) {
      return next(
        new AppError(
          error.message || 'Internal Server Error',
          error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }

  /**
   * @description
   * the controller method to delete a blog corresponding to an id
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   */
  static async deleteBlog(req, res, next) {
    const blogId = req.params.id;

    try {
      const blogToBeDeleted = await UserModel.getBlogById(blogId);

      if (!blogToBeDeleted) return next(new AppError(`Blog with id ${blogId} not found`, STATUS_CODES.NOT_FOUND));

      if (blogToBeDeleted.userId !== res.locals.user.id) return next(new AppError('You are not authorized', STATUS_CODES.FORBIDDEN));

      const deleteBlogResult = await UserModel.deleteBlog(blogId);

      if (deleteBlogResult.affectedRows) return sendResponse(res, STATUS_CODES.OK, `Blog with id ${blogId} deleted successfully`);
      return next(new AppError(`Blog with id ${blogId} could not be deleted`, STATUS_CODES.BAD_REQUEST));
    } catch (error) {
      return next(
        new AppError(
          error.message || 'Internal Server Error',
          error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }

  /**
   * @description
   * the controller method to fetch a user corresponding to an id
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the user fetched from the database
   */
  static async getUserById(req, res, next) {
    const userId = req.params.id;

    try {
      const user = await AuthModel.findUserByAttribute('id', userId);

      if (!user) return next(new AppError(`User with id ${userId} does not exist`, STATUS_CODES.NOT_FOUND));

      if (user.id !== res.locals.user.id) return next(new AppError('You are not authorized', STATUS_CODES.FORBIDDEN));

      return sendResponse(res, STATUS_CODES.OK, `User with id ${userId} fetched successfully`, {
        id: user.id,
        username: user.username
      });
    } catch (error) {
      return next(
        new AppError(
          error.message || 'Internal Server Error',
          error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }

  /**
   * @description
   * the controller method to update some attributes of a user corresponding to an id
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   */
  static async updateUser(req, res, next) {
    const { body: requestBody } = req;

    const fieldsToBeUpdatedExist = isAvailable(requestBody, Object.values(userUpdateFields), false);

    if (!fieldsToBeUpdatedExist) return next(new AppError('Fields to be updated does not exist', STATUS_CODES.BAD_REQUEST));

    const userId = req.params.id;

    try {
      const user = await AuthModel.findUserByAttribute('id', userId);

      if (!user) return next(new AppError(`User with id ${userId} does not exist`, STATUS_CODES.NOT_FOUND));

      if (user.id !== res.locals.user.id) return next(new AppError('You are not authorized', STATUS_CODES.FORBIDDEN));

      const updateUserResult = await UserModel.updateUser(requestBody, userId);

      if (updateUserResult.affectedRows) return sendResponse(res, STATUS_CODES.OK, `User with id ${userId} updated successfully`);
      return next(new AppError(`User with id ${userId} could not be updated`, STATUS_CODES.BAD_REQUEST));
    } catch (error) {
      return next(
        new AppError(
          error.message || 'Internal Server Error',
          error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }

  /**
   * @description
   * the controller method to delete a user corresponding to an id
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   */
  static async deleteUser(req, res, next) {
    const userId = req.params.id;

    try {
      const user = await AuthModel.findUserByAttribute('id', userId);

      if (!user) return next(new AppError(`User with id ${userId} does not exist`, STATUS_CODES.NOT_FOUND));

      if (user.id !== res.locals.user.id) return next(new AppError('You are not authorized', STATUS_CODES.FORBIDDEN));

      const deleteUserResult = await UserModel.deleteUser(userId);

      if (deleteUserResult.affectedRows) {
        res.clearCookie(cookieAttributeForJwtToken); // on deleting the user, the auth token must be deleted from cookie as well
        return sendResponse(res, STATUS_CODES.OK, `User with id ${userId} deleted successfully`);
      }
      return next(new AppError(`User with id ${userId} could not be deleted`, STATUS_CODES.BAD_REQUEST));
    } catch (error) {
      return next(
        new AppError(
          error.message || 'Internal Server Error',
          error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }
}
