const httpStatus = require('http-status');
const User = require('../models/user.model');
const sendResponse = require('../helpers/response');
const Schedule = require('../models/scheduleMock.model');
const Request = require('../models/request.model');
const { Joi } = require('celebrate');
const APIError = require('../helpers/APIError');

/**
 * Load user and append to req.
 */
exports.load = async (req, res, next, id) => {
  try {
    let user = await User.get(id);
    if (user && !user.deleted) {
      req.user = user;
      return next();
    }
    return res.json(sendResponse(httpStatus.NOT_FOUND, 'No such user exists!', null, null));
  } catch (error) {
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { email } = req.body;

    //check if user exists
    let userExist = await User.getByEmail(email);
    if (userExist) {
      return res.json(
        sendResponse(httpStatus.BAD_REQUEST, 'Bad Request', null, {
          msg: 'Email already in use!',
        })
      );
    }

    //create User instance
    const user = new User(req.body);

    await user.save();
    const payload = user.transform();
    const token = await user.token();

    res.json(sendResponse(httpStatus.OK, 'Signup successful', payload, null, token));
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res) => res.json(sendResponse(200, 'testing', await req.user.transform(), null));

exports.updateAvatar = async (req, res) => {
  try {
    let user = req.user;
    let avatar = req.file ? req.file.location : user.avatar; //assign imageUrl to avatar
    user.avatar = avatar;
    await user.save();
    // Delete previous avatar file to seve space
    if (req.oldAvatar) {
      var params = {
        Bucket: req.s3.Bucket,
        Key: req.oldAvatar,
      };

      req.s3.deleteObject(params, function(err, data) {});
    }
    res.json(sendResponse(httpStatus.OK,'Upload Successful', user.transform(), null, null));
  } catch (error) {
    next(error);
  }

};

exports.updateProfile = async (req, res) => {
  const { error, value } = Joi.validate(req.body, updateUserValidation);
  if (error) {
  }
}

exports.createScheduleMock = async (req, res) => {
  try {
    const shcedule = new Schedule(req.body);
    const result = await shcedule.save();
    if (!result) {
      return res.json(sendResponse(httpStatus.INTERNAL_SERVER_ERROR, 'An error occured submiting schedule'));
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
      menteeId: req.body.menteeId,
    });
    if (requestMade) {
      return res.json(sendResponse(httpStatus.NOT_FOUND, 'request already made'));
    }
    const schedule = await Schedule.findOne({
      _id: req.params.scheduleID,
    });
    if (!schedule) {
      return res.json(sendResponse(httpStatus.NOT_FOUND, 'Schedule not found'));
    }

    const request = new Request({
      scheduleId: req.params.scheduleID,
      menteeId: req.body.menteeId,
    });
    const requestResult = await request.save();
    if (!requestResult) {
      return res.json(sendResponse(httpStatus.NOT_FOUND, 'the request was not submitted'));
    }
    return res.json(sendResponse(httpStatus.OK, 'Request submitted'));
  } catch {
    return res.json(sendResponse(httpStatus.INTERNAL_SERVER_ERROR, 'something went wrong while submitting request'));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.loginAndGenerateToken(req.body);
    return res.json(sendResponse(200, 'Successfully logged in', user.transform(), null, accessToken));
  } catch (error) {
    next(error);
  }
};
