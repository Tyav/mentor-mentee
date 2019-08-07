const message = {
  forgotPassword: (host, token) => {
    return `You are receiving this because you (or someone else) have requested the reset of the password for your account.
  
  Please click on the following link, or paste this into your browser to complete the process:
  
  http://${host}/api/v1/auth/reset?token=${token}
  
  If you did not request this, please ignore this email and your password will remain unchanged`;
  },
  resetPasswordSuccess: email => {
    return `Hello
      This is a confirmation that the password for your account ${email} has just been changed`;
  }
};

module.exports = message;
