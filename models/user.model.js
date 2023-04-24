import { Database } from '../config/db.config.js';

export class UserModel {
  /**
   * @description
   * the following methods fetches all blogs for a particular user
   * @param {number} userId the id of the user for whom the blogs need to be fetched
   * @returns the array of blogs for the user
   */
  static async getAllBlogs() {
    const query = 'SELECT * FROM blogs';

    const blogs = await Database.executeQuery(query);

    return blogs;
  }

  /**
   * @description
   * the following methods creates a blog for a particular user
   * @param {number} userId the id of the user for whom the blogs need to be fetched
   * @returns the result of an sql insertion operation
   */
  static async createBlog(title, description, userId) {
    const query = 'INSERT INTO blogs SET ?';
    const params = { userId, title, description };

    const result = await Database.executeQuery(query, params);

    return result;
  }
}
