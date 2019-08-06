const httpStatus = require('http-status');
const User = require('../models/user.model');
const sendResponse = require('../helpers/response');
const PasswordReset = require('../models/passwordReset.model');
const sendMail = require('../helpers/SendMail');
const TokenDecoder = require('../helpers/TokenDecoder');
const bcrypt = require('bcrypt');

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

exports.forgotPassword = async (req, res) => {
  const user = await User.getByEmail(req.body.email);
  if (!user) {
    return res.json(
      sendResponse(httpStatus.NOT_FOUND, 'User not found', null, null, null)
    );
  }
  const passwordReset = new PasswordReset({
    userID: user._id,
    email: req.body.email,
    isAdmin: user.isAdmin
  });
  const passwordResetResult = await passwordReset.save();
  if (!passwordResetResult || !passwordResetResult.email) {
    return res.json(
      sendResponse(
        httpStatus.NOT_FOUND,
        'something went wrong',
        null,
        null,
        null
      )
    );
  }
  const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.
  
  Please click on the following link, or paste this into your browser to complete the process:
  
  http://${req.headers.host}/api/v1/auth/reset/${
    passwordResetResult.resetPasswordToken
  }
  
  If you did not request this, please ignore this email and your password will remain unchanged`;

  sendMail(passwordResetResult.email, message);

  return res.json(
    sendResponse(
      httpStatus.OK,
      'Successfully sent reset mail',
      null,
      null,
      null
    )
  );
};

exports.resetPassword = async (req, res) => {
  const TokenData = TokenDecoder(req.params.token);

  const userResetDetails = await PasswordReset.getByEmailAndToken(
    TokenData.email,
    req.params.token
  );

  if (!userResetDetails) {
    return res.json(
      sendResponse(
        httpStatus.NOT_FOUND,
        'Password reset token is invalid or has expired',
        null,
        null,
        null
      )
    );
  }

  const newPassword = bcrypt.hashSync(req.body.password, 10);

  User.findOneAndUpdate(
    { email: TokenData.email },
    { $set: { password: newPassword } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.json(
          sendResponse(
            httpStatus.INTERNAL_SERVER_ERROR,
            'An error occured. Please try again later',
            null,
            null,
            null
          )
        );
      }

      const message = `Hello
      This is a confirmation that the password for your account ${
        TokenData.email
      } has just been changed`;

      sendMail(TokenData.email, message);
      return res.json(
        sendResponse(httpStatus.OK, 'Password has been changed', result)
      );
    }
  );
};
