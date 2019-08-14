const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const ScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true
  },
  time: {
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date,
      required: true
    },
  },
  slots: {
    type: Number,
    required: true,
    default: 5
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
  mentor: {
    type: mongoose.Types.ObjectId,
    ref : 'User'
  }
}, {timestamps: true});


/**
 * Schema methods
 */
ScheduleSchema.methods = {

}

/**
 * Schema statics
 */

ScheduleSchema.statics = {
  async getOpenSchedules () {
    const schedule = await this.find({isClosed: false})
      .populate({path:'mentor', select: 'name avatar bio skills'})
      .exec();
    return schedule;

  },
  async get(id) {
    const schedule = await this.findById(id)
      .populate({path:'mentor', select: 'name avatar bio skills'})
      .exec()
    if (schedule) return schedule
    throw new APIError({
      message: 'Sorry, this schedule is not open at the moment',
      status: httpStatus.BAD_REQUEST
    })
  },
  async getByUserId(mentor) {
    try {
      let schedule = await this.find({mentor})
      .exec();
      return schedule;      
    } catch (error) {
      throw new APIError({
        message: error.message,
        status: httpStatus.INTERNAL_SERVER_ERROR
      })
    }
  }

} 

module.exports = mongoose.model('Schedule', ScheduleSchema);
