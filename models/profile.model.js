const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../config/env');

/**
 * UserPicture Schema
 */
const UserPictureSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  }
});

UserPictureSchema.statics = {
  /**
   *
   * @param {String} id
   * @returns {Promise<UserPictureSchema, APIError>}
   */
  async getByUserId(userId) {
    let profileData = this.findOne({
      userId
    }).exec();
    return profileData;
  }
};

/**
 * @typedef UserPictureSchema
 */
module.exports = mongoose.model('UserPicture', UserPictureSchema);
