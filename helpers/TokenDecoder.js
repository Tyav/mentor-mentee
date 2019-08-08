const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
module.exports = req => {
  const authorization = req.headers['authorization'];
  if (!authorization) {
    return res.json(
      sendResponse(
      httpStatus.UNAUTHORIZED,
      'Invalid User',
      null
    ));
  }
  return jwt.decode(authorization.split(' ')[1], jwtSecret);;
};