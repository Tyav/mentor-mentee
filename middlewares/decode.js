const jwt = require('jwt-simple');
const httpStatus = require("http-status");
const User = require('../models/user.model');
const { jwtSecret } = require('../config/env');
const sendResponse = require('../helpers/response');

module.exports = async (req, res, next) => {
  try {
    const user = await User.get(sub);
    if (user.isApproved) {
      req.sub = sub;
      req.user = user;
      return next();
    }

    return res.json(
      sendResponse(
        httpStatus.UNAUTHORIZED,
        'Unapproved User',
        null
      ));
  } catch (error) {
    next(error)
  }
}
