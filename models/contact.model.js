const mongoose = require('mongoose');
const pick = require('ramda/src/pick');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

//holds the relationship between a mentors and a mentees id
const ContactSchema = new mongoose.Schema({
  mentee: {
    type: String,
    required: true,
    ref: 'User'
  },
  mentor: {
    type: String,
    required: true,
    ref: 'User'
  },
  schedule: {
    type: String,
    required: true,
    ref: 'Schedule'
  }
});

ContactSchema.methods = {
  transform(user) {
    let contact = pick(['mentor', 'mentee', 'schedule', 'id'], this);
    contact.contact = contact[user];
    delete contact.mentor;
    delete contact.mentee;
    return contact;
  }
};

ContactSchema.statics = {
  async get(id) {
    try {
      return await this.findById(id)
        .populate({
          path: 'mentor',
          select: '_id name email phone avatar skills isMentor'
        })
        .populate({
          path: 'mentee',
          select: '_id name email phone avatar skills isMentor'
        })
        .exec();
    } catch (error) {
      throw new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST
      });
    }
  },
  async getBy(option) {
    try {
      return await this.find(option)
        .populate({
          path: 'mentor',
          select: '_id name email phone avatar skills isMentor'
        })
        .populate({
          path: 'mentee',
          select: '_id name email phone avatar skills isMentor'
        })
        .populate({ path: 'schedule' });
    } catch (error) {
      throw new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST
      });
    }
  }
};

module.exports = mongoose.model('Contact', ContactSchema);
