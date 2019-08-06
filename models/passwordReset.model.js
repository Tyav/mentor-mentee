const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const EncodeToken = require('../helpers/TokenEncoder');

const PasswordResetSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  email: { type: String, required: true },
  resetPasswordToken: { type: String },
  createdAt: { type: String, default: new Date() }
});

PasswordResetSchema.pre('save', function(next) {
  const user = this;

  user.resetPasswordToken = EncodeToken(user.userID, user.email, user.isAdmin);
  next();
});

PasswordResetSchema.statics = {
  /**
   *
   * @param {String} email
   * @returns {Promise<PasswordResetSchema, APIError>}
   */
  async getByEmail(email) {
    let user = this.findOne({ email }).exec();
    return user;
  }
};

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
