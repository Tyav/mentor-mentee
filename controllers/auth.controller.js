const httpStatus = require('http-status');
const User = require('../models/user.model');
const sendResponse = require('../helpers/response');
const PasswordReset = require('../models/passwordReset.model');
const sendMail = require('../helpers/SendMail');
const TokenDecoder = require('../helpers/tokenDecoder');
const bcrypt = require('bcrypt');
const { forgotPassword } = require('../helpers/mailMessage');

exports.forgotPassword = async (req, res) => {
  const user = await User.getByEmail(req.body.email);
  if (!user) {
    return res.json(
      sendResponse(httpStatus.NOT_FOUND, 'email success message')
    );
  }
  const passwordReset = new PasswordReset({
    userID: user._id,
    email: req.body.email,
    isAdmin: user.isAdmin
  });
  const passwordResetResult = await passwordReset.save();
  if (!passwordResetResult || !passwordResetResult.email) {
    return res.json(sendResponse(httpStatus.NOT_FOUND, 'something went wrong'));
  }

  const message = forgotPassword(
    req.headers.host,
    passwordResetResult.resetPasswordToken
  );

  sendMail(passwordResetResult.email, message);

  return res.json(sendResponse(httpStatus.OK, 'Successfully sent reset mail'));
};

exports.reset = async (req, res) => {
  res.json(
    sendResponse(
      httpStatus.NOT_FOUND,
      'There is no token attached to this request'
    )
  );
};

exports.resetPassword = async (req, res) => {
  try {
    const TokenData = TokenDecoder(req.query.token);
    if (!TokenData) {
      return res.json(
        sendResponse(
          httpStatus.NOT_FOUND,
          'There is not token attached to this request'
        )
      );
    }

    const userResetDetails = await PasswordReset.getByEmailAndToken(
      TokenData.email,
      req.params.token
    );

    if (!userResetDetails) {
      return res.json(
        sendResponse(
          httpStatus.NOT_FOUND,
          'Password reset token is invalid or has expired'
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
          sendResponse(httpStatus.OK, 'Password has been changed')
        );
      }
    );
  } catch {
    return res.json(
      sendResponse(httpStatus.NOT_FOUND, 'Token may have expired')
    );
  }
};
