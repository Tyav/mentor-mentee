const nodemailer = require('nodemailer');
const config = require('../config/env')

const sendMail = (email, message) => {
  const smtpTransport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD
    }
  });
  let mailOptions = {
    to: email,
    from: config.mentordev_email,
    subject: 'Mentor Dev Password Reset',
    text: message
  };
  smtpTransport.sendMail(mailOptions, err => {
    if (err) {
      return new Error(err);
    }
  });
};

module.exports = sendMail;
