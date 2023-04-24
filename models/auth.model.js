import { Database } from '../config/db.config.js';

export class AuthModel {
  /**
   * @description
   * the following method creates and saves a new user into the database
   * @param {string} username the username of the user to be created
   * @param {string} password the hash password of the user to be created
   * @returns the newly created user, if all ok
   */
  static async createUser(username, password) {
    const query = 'INSERT INTO users SET ?';
    const params = { username, password };

    const result = await Database.executeQuery(query, params);

    return result;
  }
}
