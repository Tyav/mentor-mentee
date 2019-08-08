const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../config/env');

/**
 * UserPicture Schema
 */
const AvatarSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  userId: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'User',
    type: String,
    required: true,
    unique: true
  }
});

AvatarSchema.statics = {
  /**
   *
   * @param {String} id
   * @returns {Promise<AvatarSchema, APIError>}
   */
  async getByUserId(userId) {
    let avatar = this.findOne({
      userId
    }).exec();
    return avatar;
  }
};

/**
 * @typedef AvatarSchema
 */
module.exports = mongoose.model('Avatar', AvatarSchema);
