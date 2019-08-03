const httpStatus = require("http-status");
const User = require("../models/user.model");
const sendResponse = require("../helpers/response");

/**
 * Load user and append to req.
 */
exports.load = async (req, res, next, id) => {
  try {
    // Load user object from quarystring Id
    return res.json(sendResponse(
      httpStatus.NOT_FOUND,
      "No such user exists!",
      null,
      null
    ))
  } catch (error) {
    next(error);
  }
}; 

exports.getUsers = (req, res) => {
  return res.json(sendResponse(200,'testing', null, null))
}

