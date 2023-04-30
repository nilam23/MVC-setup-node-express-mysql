// different http status codes to be used as part of the response
export const STATUS_CODES = {
  OK: 200,
  SUCCESSFULLY_CREATED: 201,
  REDIRECT: 302,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

// the mandatory fields during user auth
export const userAuthRequiredFields = {
  USERNAME: 'username',
  PASSWORD: 'password'
};

// the mandatory fields to create a blog for a user
export const blogCreationRequiredFields = {
  USER_ID: 'userId',
  TITLE: 'title',
  DESCRIPTION: 'description'
};

// blog fields that can be updated
export const possibleBlogUpdateFields = {
  TITLE: 'title',
  DESCRIPTION: 'description'
};

// user fields that can be updated
export const userUpdateFields = {
  USERNAME: 'username'
};

// db error codes for error handling
export const dbErrorCodes = {
  ER_DUP_ENTRY: 'ER_DUP_ENTRY'
};

// jwt expiry
export const jwtExpiry = 1 * 60 * 60;

// attribute for the cookie to be created to save the jwt token
export const cookieAttributeForJwtToken = 'jwt_token';
