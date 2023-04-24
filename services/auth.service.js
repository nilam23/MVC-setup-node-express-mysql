import { getHashPassword } from '../helpers/utils.js';
import { AuthModel } from '../models/auth.model.js';

export const AuthService = {};

/**
 * @description
 * the service method to sign up a new user
 * @param {string} username the username of the user to be created
 * @param {string} password the plaintext password of the user to be created
 * @returns the newly created user
 */
AuthService.signUpUser = async (username, password) => {
  const hashPassword = await getHashPassword(password);

  const user = await AuthModel.createUser(username, hashPassword);

  return user;
};
