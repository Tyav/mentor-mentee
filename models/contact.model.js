const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

//holds the relationship between a mentors and a mentees id
const ContactSchema = new mongoose.Schema({
  menteeId: {
    type: String,
    required: true
  },
  mentorsId: {
    type: String,
    required: true
  },
  scheduleId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Contact', ContactSchema);
