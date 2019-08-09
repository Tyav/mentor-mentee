const jwt = require('jwt-simple');
const httpStatus = require("http-status");
const User = require('../models/user.model');
const { jwtSecret } = require('../config/env');
const sendResponse = require('../helpers/response');
const tokendecoder = require('../helpers/TokenDecoder')

module.exports = async (req, res, next) => {
  try {
    // const authorization = req.headers['authorization'];
    // if (!authorization) {
    //   return res.json(
    //     sendResponse(
    //     httpStatus.UNAUTHORIZED,
    //     'Invalid User',
    //     null
    //   ));
    // }
    // let token = authorization.split(' ')[1]
    // return {token , decodeToken: jwt.decode(token, jwtSecret)}
    const { decodeToken } = tokendecoder(req, res)
    const {sub} = decodeToken
    // let { sub } = jwt.decode(token, jwtSecret)
    const user = await User.get(sub);
    if (user) {
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
