const jwt = require('jwt-simple');
const httpStatus = require('http-status');
const User = require('../models/user.model');
const { jwtSecret } = require('../config/env');
const sendResponse = require('../helpers/response');
const tokendecoder = require('../helpers/tokensDecoder');
const APIError = require('../helpers/APIError')

module.exports = async (req, res, next) => {
  try {
    const { decodeToken } = tokendecoder(req, res);
    if (!decodeToken) throw new APIError({status: httpStatus.BAD_REQUEST, message: 'Token may have expired'})
    const { sub } = decodeToken;
    const user = await User.get(sub);
    if (user) {
      req.sub = sub;
      req.user = user;
      return next();
    }

    return res.json(sendResponse(httpStatus.UNAUTHORIZED, 'Unapproved User', null));
  } catch (error) {
    next(error);
  }
};
