const mongoose = require('mongoose');
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


ContactSchema.methods = {};

ContactSchema.statics = {
  async get(id) {
    try {
      return await this.findById(id)
        .populate({ path: 'mentor', select: '_id name email phone avatar skills isMentor' })
        .populate({ path: 'mentee', select: '_id name email phone avatar skills isMentor' })
        .exec();
    } catch (error) {
      throw new APIError({ message: error.message, status: httpStatus.BAD_REQUEST });
    }
  },
  async getBy(option) {
    try {
      return await this.find(option)
      .populate({ path: 'mentor', select: '_id name email phone avatar skills isMentor' })
      .populate({ path: 'mentee', select: '_id name email phone avatar skills isMentor' })
      .populate({path: 'schedule'})
      .exec();
    } catch (error) {}
  },
  transform(user){
    let contact = {...this};
    contact.contact = contact[user];
    delete contact.mentor;
    delete contact.mentee;
    return contact;
  }
};

module.exports = mongoose.model('Contact', ContactSchema);
