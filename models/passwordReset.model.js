const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const encodeToken = require('../helpers/tokenEncoder');
const tokenDecoder = require('../helpers/tokenDecoder')

const ForgotPasswordSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true 
  },
  token: { 
    type: String 
  },
  exp : {
    type: Date,
    default: Date.now() + 300000  // 5 Hours span
  }
}, {timestamps: true});

ForgotPasswordSchema.pre('save', function (next){
  const forgotPassword = this;
  forgotPassword.token = encodeToken(forgotPassword.email);
  next();
});

ForgotPasswordSchema.statics = {
  /**
   *
   * @param {String} email
   * @returns {Promise<PasswordResetSchema, APIError>}
   */
  async verify (req) {
    const { token, decodeToken } = tokenDecoder(req)
    const { email } = decodeToken
    const forgotPassword = this.findOne({
      email,
      token,
    }).exec();
    return forgotPassword;
  },
};

module.exports = mongoose.model('ForgotPassword', ForgotPasswordSchema);
