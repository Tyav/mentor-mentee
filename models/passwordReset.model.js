const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const PasswordResetSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  email: { type: String, required: true },
  resetPasswordToken: { type: String },
  createdAt: { type: String, default: new Date() }
});

PasswordResetSchema.pre('save', function(next) {
  const user = this;

  jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: 60 * 2 },
    (err, token) => {
      if (err) {
        return next(err);
      }
      user.resetPasswordToken = token;
      next();
    }
  );
});

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
