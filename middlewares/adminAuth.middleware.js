let APIError = require('../helpers/APIError');
let httpStatus = require('http-status');

module.exports = (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw new APIError({
        massage: 'Unauthorized',
        status: httpStatus.UNAUTHORIZED
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};
