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
      const { token, decodeToken } = tokenDecoder(req);
      if (!decodeToken) throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: 'Token may have expired',
      })
      const { email } = decodeToken;
      const forgotPassword = await this.findOne({
        email,
        token,
      }).exec();
      console.log(forgotPassword)
      if (forgotPassword) return forgotPassword;
      throw new Error('Password reset link is invalid or has expired');
  },
};

module.exports = mongoose.model('ForgotPassword', ForgotPasswordSchema);
