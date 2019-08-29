const httpStatus = require('http-status');
const User = require('../models/user.model');
const sendResponse = require('../helpers/response');
const updateUserValidation = require('../validations/user.validation').updateUser;
const Schedule = require('../models/schedule.model');
const Request = require('../models/request.model');
const { Joi } = require('celebrate');
const APIError = require('../helpers/APIError');
const message = require('../helpers/mailMessage');
const sendMail = require('../helpers/SendMail');
const escapeString = require('../helpers/escapeString');

/**
 * Load user and append to req.
 */
exports.load = async (req, res, next, id) => {
  try {
    let user = await User.get(id);
    if (user && !user.deleted && user.isVerified) {
      req.user = user;
      return next();
    }
    return res.json(sendResponse(httpStatus.NOT_FOUND, 'No such user exists!', null, null));
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    let users = await User.find({});
    users = [...users].map(user => user.transform());
    return res.json(sendResponse(httpStatus[200], 'Request for all users sucessful', users, null));
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
          msg: 'Email already in use!'
        })
      );
    }

    //create User instance
    const user = new User(req.body);

    await user.save();
    const token = await user.token();

    sendMail(user.email, 'Mentor Dev, Verification', message.verifyRegistration(token));

    res.json(sendResponse(httpStatus.OK, user.email));
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res) =>
  res.json(sendResponse(200, 'testing', await req.user.transform(), null));

exports.updateAvatar = async (req, res, next) => {
  try {
   
    let user = req.user;
    let avatar = req.file ? req.file.url : user.avatar; //assign imageUrl to avatar
    user.avatar = avatar;
    await user.save();
    // Delete previous avatar file to seve space
    if (req.oldAvatar) {
      const oldUrl = req.oldAvatar.split('.')[0];
      req.cloudinary.v2.api.delete_resources(oldUrl, function(error,result) {
        // Perform logic here with error or result
      });    

    }
    res.json(sendResponse(httpStatus.OK, 'Upload Successful', user.transform(), null, null));
  } catch (error) {
    next(error);
  }
};

//updates user's profile...
exports.updateProfile = async (req, res) => {
  try {
    const user = await req.user.update(req.body);
    res.json(sendResponse(httpStatus.OK, 'succesful', user.transform()));
  } catch (error) {
    res.json(sendResponse(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong'));
  }
};

exports.createScheduleMock = async (req, res) => {
  try {
    const shcedule = new Schedule(req.body);
    const result = await shcedule.save();
    if (!result) {
      return res.json(
        sendResponse(httpStatus.INTERNAL_SERVER_ERROR, 'An error occured submiting schedule')
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
      return res.json(sendResponse(httpStatus.NOT_FOUND, 'request already made'));
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
      return res.json(sendResponse(httpStatus.NOT_FOUND, 'the request was not submitted'));
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


exports.login = async (req, res, next) => {

  try {
    const { user, accessToken } = await User.loginAndGenerateToken(req.body);
    console.log(user,' iam the user')
    return res.json(
      sendResponse(200, 'Successfully logged in', user.transform(), null, accessToken)
    );
  } catch (error) {
    console.log(error)
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const results = await User.searchUsers(req.query.search);

    return res.json(sendResponse(httpStatus.OK, 'Users found', results));
  } catch (error) {
    next(error);
  }
};
exports.getCurrentUser = async (req, res, next) => {
  let user = req.user;
  try {
    if (!user) {
      return res.json(sendResponse(httpStatus.NOT_FOUND, 'No such user exists!', null, null));
    }
    return res.json(sendResponse(200, 'Successfully', user.transform(), null, null));
  } catch (error) {
    next(error);
  }
};
