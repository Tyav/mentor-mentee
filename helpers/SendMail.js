const nodemailer = require('nodemailer');

const sendMail = (email, message) => {
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

module.exports = sendMail;
