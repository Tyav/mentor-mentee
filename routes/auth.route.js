const express = require('express');
const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');
const User = require('../models/user.model');
const PasswordReset = require('../models/passwordReset.model');
const { sendMail } = require('../controllers/user.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.post('/forgot', async (req, res, next) => {
  const user = await User.find({ email: req.body.email });
  if (!user.length) {
    res.json(
      sendResponse(httpStatus.NOT_FOUND, 'User not found', null, null, null)
    );
  }
  const passwordReset = new PasswordReset({
    userID: user[0]._id,
    email: req.body.email
  });
  const passwordResetResult = await passwordReset.save();
  if (!passwordResetResult || !passwordResetResult.email) {
    res.json(
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
  
  http://${req.headers.host}/reset/${passwordResetResult.resetPasswordToken}
  
  If you did not request this, please ignore this email and your password will remain unchanged`;

  sendMail(passwordResetResult.email, message);

  res.json(
    sendResponse(
      httpStatus.OK,
      'Successfully sent reset mail',
      null,
      null,
      null
    )
  );
});

module.exports = router;
