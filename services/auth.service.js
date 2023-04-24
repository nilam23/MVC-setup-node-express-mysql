import { getJwtToken, getHashPassword, verifyUserPassword } from '../helpers/utils.js';
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

/**
 * @description
 * the service method to log in an existing user
 * @param {string} username the username of the user
 * @param {string} password the plaintext password of the user
 * @returns the logged in user along with the access token
 */
AuthService.logInUser = async (username, password) => {
  const user = await AuthModel.findUserByAttribute('username', username);

  if (user) {
    const authCheck = await verifyUserPassword(password, user.password);

    if (authCheck) {
      const jwtPayload = {
        userId: user.id,
        username: user.username
      };

      const token = getJwtToken(jwtPayload);

      return { user, token };
    } throw Error('Incorrect password');
  } throw Error('Incorrect username');
};
