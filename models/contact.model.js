const mongoose = require('mongoose');
const pick = require('ramda/src/pick');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

//holds the relationship between a mentors and a mentees id
const ContactSchema = new mongoose.Schema({
  mentee: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  mentor: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
  },
  idp: {
    type: mongoose.Types.ObjectId,
    ref: 'Idp',
  },
});

ContactSchema.methods = {
  transform(user) {
    let contact = pick(['mentor', 'mentee', 'schedule', 'id'], this);
    contact.contact = contact[user];
    delete contact.mentor;
    delete contact.mentee;
    return contact;
  },
};

ContactSchema.statics = {
  async get(id) {
    try {
      return await this.findById(id)
        .populate({
          path: 'mentor',
          select: '_id name email phone avatar skills isMentor',
        })
        .populate({
          path: 'mentee',
          select: '_id name email phone avatar skills isMentor',
        })
        .populate({ path: 'schedule' })
        .exec();
    } catch (error) {
      throw new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST,
      });
    }
  },
  async getBy(option) {
    try {
      return await this.find(option)
        .populate({
          path: 'mentor',
          select: '_id name email phone avatar skills isMentor',
        })
        .populate({
          path: 'mentee',
          select: '_id name email phone avatar skills isMentor',
        })
        .populate({ path: 'schedule' })
        .exec();
    } catch (error) {
      throw new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST,
      });
    }
  },
};

module.exports = mongoose.model('Contact', ContactSchema);
