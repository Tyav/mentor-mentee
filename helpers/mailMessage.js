const config = require('../config/env');
const message = {
  forgotPassword: token => {
    return `You are receiving this because you (or someone else) have requested the reset of the password for your account.
  
  Please click on the following link, or paste this into your browser to complete the process:
  
  ${config.clientSideUrl}/reset-password?token=${token}
  
  If you did not request this, please ignore this email and your password will remain unchanged`;
  },
  resetPassword: email => {
    return `Hello
      This is a confirmation that the password for your account ${email} has just been changed`;
  },
  verifyRegistration: token => {
    return `Hello,
    Congrats on signing up for MentorDev! 
    In order to activate your account please follow the link below to verify your email address:
    ${config.clientSideUrl}/verify?token=${token}`;
  },
  createAdmin: (admin,password) => {
    return `
    <h3>ADMIN CREATION</h3>
    <p>Hi ${admin.name}, your admin account has been created. Below is your login password</p>
    <span><strong>Password:</strong> ${password}</span>
    `
  }
};

module.exports = message;
