const httpStatus = require('http-status');
const User = require('../models/user.model');
const sendResponse = require('../helpers/response');
const Schedule = require('../models/scheduleMock.model');
const Request = require('../models/request.model');
const { createUser } = require('../validations/user.validation');
const { Joi } = require('celebrate');


/**
 * Load user and append to req.
 */
exports.load = async (req, res, next, id) => {
  try {
    // Load user object from quarystring Id
    return res.json(
      sendResponse(httpStatus.NOT_FOUND, 'No such user exists!', null, null)
    );
  } catch (error) {
    next(error);
  }
};

exports.getUsers = (req, res) => {
  return res.json(sendResponse(200, 'testing', null, null));
};

exports.createScheduleMock = async (req, res) => {
  try {
    const shcedule = new Schedule(req.body);
    const result = await shcedule.save();
    if (!result) {
      return res.json(
        sendResponse(
          httpStatus.INTERNAL_SERVER_ERROR,
          'An error occured submiting schedule'
        )
      );
    }
    return res.json(sendResponse(httpStatus.OK, 'Request submitted'));
  } catch {
    return res.json(sendResponse(httpStatus.NOT_FOUND, 'Something went wrong'));
  }
};

exports.bookSlot = async (req, res) => {
  try {
    const requestMade = await Request.findOne({
      scheduleId: req.params.scheduleID,
      menteeId: req.body.menteeId
    });
    if (requestMade) {
      return res.json(
        sendResponse(httpStatus.NOT_FOUND, 'request already made')
      );
    }
    const schedule = await Schedule.findOne({
      _id: req.params.scheduleID
    });
    if (!schedule) {
      return res.json(sendResponse(httpStatus.NOT_FOUND, 'Schedule not found'));
    }

    const request = new Request({
      scheduleId: req.params.scheduleID,
      menteeId: req.body.menteeId
    });
    const requestResult = await request.save();
    if (!requestResult) {
      return res.json(
        sendResponse(httpStatus.NOT_FOUND, 'the request was not submitted')
      );
    }
    return res.json(sendResponse(httpStatus.OK, 'Request submitted'));
  } catch {
    return res.json(
      sendResponse(
        httpStatus.INTERNAL_SERVER_ERROR,
        'something went wrong while submitting request'
      )
    );
  }
};
exports.signup = async (req, res) => {
  const { error } = Joi.validate(req.body, createUser.body);
  if (error)
    return res.json(
      sendResponse(
        httpStatus.BAD_REQUEST,
        'Bad Request',
        null,
        error.details[0].message
      )
    );

  try {
    const { name, email, password, isMentor, isAdmin } = req.body;

    //check if user exists
    let user = await User.getByEmail(email);
    if (user) {
      return res.json(
        sendResponse(httpStatus.BAD_REQUEST, 'Bad Request', null, {
          msg: 'Email already in use!'
        })
      );
    }

    //create User instance
    user = new User({
      name,
      email,
      password,
      isMentor,
      isAdmin
    });

    await user.save();
    const payload = user.transform();
    const token = await user.generateToken();

    res.json(
      sendResponse(httpStatus.OK, 'Signup successful', payload, null, token)
    );
  } catch (error) {
    console.error('Error: ', error.message);
    res
      .status(500)
      .json(
        sendResponse(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Server Error',
          null,
          error
        )
      );
  }
};

