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

  /**
   * @description
   * the following method fetches a user corresponding to a particular user attribute
   * @param {string} attribute the attribute for which the user is to be fetched
   * @param {any} value the value of the attribute
   * @returns the user, if exists
   */
  static async findUserByAttribute(attribute, value) {
    const query = `SELECT * FROM users WHERE ${attribute} = ?`;
    const params = [value];

    const result = await Database.executeQuery(query, params);

    return result[0];
  }
}
