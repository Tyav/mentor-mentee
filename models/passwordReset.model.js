const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const encodeToken = require('../helpers/tokenEncoder');
const tokenDecoder = require('../helpers/tokenDecoder')

const PasswordResetSchema = new mongoose.Schema({
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

PasswordResetSchema.pre('save', function (next){
  const forgotPassword = this;
  forgotPassword.token = EncodeToken(forgotPassword.email);
  next();
});

PasswordResetSchema.statics = {
  /**
   *
   * @param {String} email
   * @returns {Promise<PasswordResetSchema, APIError>}
   */
  async verify (req) {
    const { email } = tokenDecoder(req)
    let user = this.findOne({
      email,
      resetPasswordToken: token,
    }).exec();
    return user;
  },
};

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
