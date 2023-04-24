/* eslint-disable import/no-extraneous-dependencies */
import bcrypt from 'bcrypt';

/**
 * @description
 * the following method is responsible for sending a response back to the client
 * @param {object} res the response object
 * @param {number} statusCode the http status code
 * @param {array} result the result object when the req is successful
 * @param {string} message the message to be sent to the client
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
 * @returns a boolean confirming the match
 */
export const isAvailable = (targetObj, requiredFieldsArr) => {
  const targetKeysArr = Object.keys(targetObj);

  const match = requiredFieldsArr.every((field) => targetKeysArr.includes(field));

  return match;
};

/**
 * @description
 * the following method recieves the user's plaintext password and produces a hash of the same
 * @param {string} plainTextPassword the plaintext password of the user
 * @returns the hash value of the password
 */
export const getHashPassword = async (password) => {
  const salt = await bcrypt.genSalt();

  const hashPassword = await bcrypt.hash(password, salt);

  return hashPassword;
};
