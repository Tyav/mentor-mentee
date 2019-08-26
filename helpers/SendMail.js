const nodemailer = require('nodemailer');
const config = require('../config/env');

const sendMail = (email, subject, message) => {
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
    subject: subject,
    html: message
  };
  smtpTransport.sendMail(mailOptions, err => {
    if (err) {
      return new Error(err);
    }
  });
};

module.exports = sendMail;
