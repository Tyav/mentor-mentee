const User = require('../models/user.model');
const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');
const updateUserValidation = require('../validations/user.validation')
  .updateUser;
const Schedule = require('../models/schedule.model');
const Request = require('../models/request.model');
const { Joi } = require('celebrate');
const APIError = require('../helpers/APIError');
const message = require('../helpers/mailMessage');
const sendMail = require('../helpers/SendMail');
const escapeString = require('../helpers/escapeString');

exports.signup = async (req, res, next) => {
  try {
    const { email } = req.body;
    //check if user exists
    let adminExist = await User.getByEmail(email);
    if (adminExist) {
      return res.json(
        sendResponse(httpStatus.BAD_REQUEST, 'Bad Request', null, {
          msg: 'Email already in use!'
        })
      );
    }

    //create User instance
    const admin = new User(req.body);
    admin.isVerified = true;

    await admin.save();
    const token = await admin.token();

    sendMail(
      admin.email,
      'Mentor Dev, Verification',
      message.verifyRegistration(token)
    );

    res.json(sendResponse(httpStatus.OK, admin.email));
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.loginAndGenerateToken(req.body);
    console.log(user, ' iam the user');
    return res.json(
      sendResponse(
        200,
        'Successfully logged in',
        user.transform(),
        null,
        accessToken
      )
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};
