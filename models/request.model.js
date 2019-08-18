const mongoose = require('mongoose');
const APIError = require('../helpers/APIError');
const httpStatus = require('http-status');

const RequestSchema = new mongoose.Schema({
  mentee: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  schedule: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Schedule'
  },
  message: {
    type: String,
    maxlength: 250
  },
  response: {
    type: String,
    maxlength: 250
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected','Cancelled'],
    default: 'Pending',
  },
});

RequestSchema.methods = {};

RequestSchema.statics = {
  async get(id) {
    try {
      return await this.findById(id)
        .populate({ path: 'mentee', select: '_id name avatar skills isMentor' })
        .populate({ path: 'schedule', select: '_id day time mentor' })
        .exec();
    } catch (error) {
      throw new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST
      });
    }
  },
  async getBy(option) {
    console.log('option', option);
    try {
      return await this.find(option)
        .populate({ path: 'mentee', select: '_id name avatar skills isMentor' })
        .populate({ path: 'schedule', select: '_id day time mentor' })
        .exec();
    } catch (error) {}
  }
};

module.exports = mongoose.model('Request', RequestSchema);
