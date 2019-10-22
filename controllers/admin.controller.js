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

exports.createAdmin = async (req, res, next) => {
  try {

    const { email } = req.body;
    let isSuper = req.user.isSuper? req.body.isSuper : false;
    //check if user exists
    let userExist = await User.getByEmail(email);
    
    if (userExist) {
      //make user an admin if the user already exist
      userExist.isAdmin = true;
      userExist.isSuper = isSuper;
      await userExist.save();
      return res.json(
        sendResponse(httpStatus.OK, 'Existing User has been made an admin', userExist)
      );
    }

    //create User instance
    const admin = new User(req.body);
    admin.isSuper = isSuper;
    admin.isVerified = true;

    await admin.save();
    const token = await admin.token();

    sendMail(
      admin.email,
      'Your admin account has sucessfully been created',
      message.createAdmin(admin,req.body.password)
    );

    res.json(sendResponse(httpStatus.OK, admin.email));
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.loginAndGenerateToken(req.body);
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
