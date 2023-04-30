import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtExpiry } from './constants.js';

/**
 * @description
 * the following method is responsible for sending a response back to the client
 * @param {object} res the response object
 * @param {number} statusCode the http status code
 * @param {string} message the message to be sent to the client
 * @param {array} result the result object when the req is successful
 * @param {object} error the error object to be sent to the client, when exists
 */
export const sendResponse = (res, statusCode, message, result = [], error = {}) => {
  res.status(statusCode).json({
    statusCode,
    message,
    data: result,
    error,
  });
};

export const validate = {
  /**
   * @description
   * takes the user's plaintext password
   * and checks whether the password contains:
   * 1. at least 5 characters
   * 2. at least 1 upper case letter
   * 3. at least 1 lower case letter
   * 4. at least 1 number or special character
   * @param {string} str the plaintext password of the user
   * @returns {boolean} either true or false based on the check
   */
  password: (str) => {
    const regex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

    return str.length >= 5 && regex.test(str);
  },
};

/**
 * @description
 * the following method receives a targetObject of which keys are to be checked
 * with the corresponding array of required fields
 * @param {object} targetObject object of which keys are to be checked
 * @param {array} requiredFieldsArray array of fields to be checked in the targetObject
 * @param {boolean} checkForAll the boolean to indicate whether all fields from requiredFieldsArr should be present in targetObj
 * @returns a boolean confirming the match
 */
export const isAvailable = (targetObj, requiredFieldsArr, checkForAll = true) => {
  const targetKeysArr = Object.keys(targetObj);

  let match;
  if (checkForAll) match = requiredFieldsArr.every((field) => targetKeysArr.includes(field));
  else match = requiredFieldsArr.some((field) => targetKeysArr.includes(field));

  return match;
};

/**
 * @description
 * the following method recieves the user's plaintext password and produces a hash of the same
 * @param {string} password the plaintext password of the user
 * @returns the hash value of the password
 */
export const getHashPassword = async (password) => {
  const salt = await bcrypt.genSalt();

  const hashPassword = await bcrypt.hash(password, salt);

  return hashPassword;
};

/**
 * @description
 * the following method receive's user's password from log in request and the password saved in the database
 * and then verifies both of them
 * @param {string} plainTextPassword the password entered by the user during log in
 * @param {string} hashPassword the password extracted from the database
 * @returns a boolean confirming the password verification
 */
export const verifyUserPassword = async (plainTextPassword, hashPassword) => {
  const validation = await bcrypt.compare(plainTextPassword, hashPassword);

  return validation;
};

/**
 * @description
 * the following method creates a jwt token using a payload of user id and username
 * @param {object} jwtPayload the jwt payload consisting of user id and username
 * @returns the jwt token
 */
export const getJwtToken = (jwtPayload) => jwt.sign(
  {
    userId: jwtPayload.userId,
    username: jwtPayload.username
  },
  process.env.JWT_SECRET,
  { expiresIn: jwtExpiry }
);

/**
 * @description
 * the following method creates a cookie and attaches it to the response object
 * @param {object} res the response to be sent back to the client
 * @param {string} key the key of the cookie to be created
 * @param {string} value the value of the cookie to be created
 */
export const saveCookie = (res, key, value) => res.cookie(key, value, { httpOnly: true, maxAge: jwtExpiry * 1000 });

/**
 * @description
 * the following method receives a jwt token and then verifies the same
 * @param {string} token the jwt token to be verified
 * @returns the decoded token, if verification is successful
 */
export const verifyJwtToken = (token) => {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  return decodedToken;
};
