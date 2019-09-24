const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const { jwtSecret } = require('../config/env');
const APIError = require('./APIError');
const sendResponse = require('./response');
module.exports = req => {
  const authorization = req.headers['authorization'];
  if (!authorization) {
    throw new APIError({ message: 'Unauthorized', status: httpStatus.UNAUTHORIZED });
  }
  let token = authorization.split(' ')[1];
  return { token, decodeToken: jwt.decode(token, jwtSecret) };
};
