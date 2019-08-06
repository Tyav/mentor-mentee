const httpStatus = require('http-status');
const User = require('../models/user.model');
const sendResponse = require('../helpers/response');
const nodemailer = require('nodemailer');

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

exports.sendMail = (email, message) => {
  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 25,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD
    }
  });
  let mailOptions = {
    to: email,
    from: 'passwordreset@mentordev.com',
    subject: 'Mentor Dev Password Reset',
    text: message
  };
  smtpTransport.sendMail(mailOptions, err => {
    if (err) {
      return new Error(err);
    }
  });
};
