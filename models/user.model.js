import { Database } from '../config/db.config.js';

export class UserModelClass {
  /**
   * @description
   * the following methods fetches all blogs for a particular user
   * @param {number} userId the id of the user for whom the blogs need to be fetched
   * @returns the array of blogs for the user
   */
  static async getUserBlogs(userId) {
    const query = 'SELECT * FROM blogs WHERE userId = ?';
    const params = [userId];

    const blogs = await Database.executeQuery(query, params);

    return blogs;
  }
}
