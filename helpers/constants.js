// different http status codes to be used as part of the response
export const STATUS_CODES = {
  OK: 200,
  SUCCESSFULLY_CREATED: 201,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  UNAUTHORIZED: 403,
  REDIRECT: 302,
  TOO_MANY_REQUESTS: 429,
};

// the mandatory fields during user auth
export const userAuthRequiredFields = {
  USERNAME: 'username',
  PASSWORD: 'password'
};

// db error codes for error handling
export const dbErrorCodes = {
  ER_DUP_ENTRY: 'ER_DUP_ENTRY'
};

// jwt expiry
export const jwtExpiry = 1 * 60 * 60;
