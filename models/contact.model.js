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
  mentors: {
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

module.exports = mongoose.model('Contact', ContactSchema);
