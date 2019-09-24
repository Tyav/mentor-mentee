const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const encodeToken = require('../helpers/tokensEncoder');
const tokenDecoder = require('../helpers/tokensDecoder');

const ForgotPasswordSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    userId:{
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    token: {
      type: String,
    },
    exp: {
      type: Date,
      default: Date.now() + 300000, // 5 Hours span
    },
  },
  { timestamps: true },
);

ForgotPasswordSchema.pre('save', function(next, id) {
  console.log(id)
  const forgotPassword = this;
  forgotPassword.token = encodeToken(forgotPassword.email, forgotPassword._id);
  next();
});

ForgotPasswordSchema.statics = {
  /**
   *
   * @param {String} email
   * @returns {Promise<PasswordResetSchema, APIError>}
   */
  async verify(req) {
    try {
      const { token, decodeToken } = tokenDecoder(req);
      const { email } = decodeToken;
      const forgotPassword = await this.findOne({
        email,
        token,
      }).exec();
      if (forgotPassword) return forgotPassword;
      throw new Error('Password reset link is invalid or has expired');
    } catch (error) {
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  },
};

module.exports = mongoose.model('ForgotPassword', ForgotPasswordSchema);
