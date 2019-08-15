const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const config = require('../config/env');
const User = require('../models/user.model');
const sendResponse = require('../helpers/response');
const ForgotPassword = require('../models/passwordReset.model');
const sendMail = require('../helpers/SendMail');
const messages = require('../helpers/mailMessage');
const TokenDecoder = require('../helpers/tokenDecoder');
const { forgotPassword } = require('../helpers/mailMessage');

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.getByEmail(req.body.email);
    if (!user) {
      return res.json(
        sendResponse(
          httpStatus.NOT_FOUND,
          'A link to reset your password has been sent to your email.'
        )
      );
    }
    await ForgotPassword.deleteMany({ email: user.email });
    const passwordReset = new ForgotPassword({
      email: user.email
    });
    await passwordReset.save();
    sendMail(
      passwordReset.email,
      'Mentor Dev Password Reset',
      messages.forgotPassword(passwordReset.token)
    );

    return res.json(
      sendResponse(
        httpStatus.OK,
        'A link to reset your password has been sent to your email.'
      )
    );
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const forgotPassword = await ForgotPassword.verify(req);
    await ForgotPassword.deleteMany({ email: forgotPassword.email });
    if (forgotPassword.exp < Date.now())
      return res.json(
        sendResponse(
          httpStatus.NOT_FOUND,
          'Password reset link is invalid or has expired'
        )
      );
    let user = await User.getByEmail(forgotPassword.email);
    user.password = req.body.password;
    await user.save();
    sendMail(
      user.email,
      'Mentor Dev Password Reset',
      messages.resetPassword(user.email)
    );
    return res.json(
      sendResponse(httpStatus.OK, 'Password was successfully changed')
    );
  } catch (error) {
    next(error);
  }
};

exports.validationLink = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json(sendResponse(httpStatus.NOT_FOUND, email));
    }
    const token = user.token();
    sendMail(
      email,
      'Mentor Dev, Verification',
      messages.verifyRegistration(token)
    );
    return res.json(sendResponse(httpStatus.NOT_FOUND, email));
  } catch (error) {
    next(error);
  }
};
exports.verify = async (req, res, next) => {
  if (req.user.isVerified) {
    //if user is already verified return an error
    return res.json(
      sendResponse(httpStatus.BAD_REQUEST, 'The link has expired')
    );
  }
  const user = req.user;
  user.isVerified = true;
  await user.save();
  const token = user.token();
  return res.json(
    sendResponse(httpStatus.OK, 'Verified', user.transform(), null, token)
  );
};
