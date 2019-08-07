const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const ScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    description: 'The day the schedule was created',
    required: true
  },
  time: {
    from: {
      type: Date,
      description: 'The time at which his schedule opens'
    },
    to: {
      type: Date,
      description: 'The time at which the schedule ends'
    }
    // required: true
  },

  slot: {
    type: Number,
    description: 'The number of available slots'
  },
  isClosed: {
    type: Boolean,
    default: false,
    // set: v => {
      
    //   return this.slot <= this.mentees.length;
    // },
    description:
      'compares the available slots with the array the number of mentees who have applied'
  },
  mentorId: {
    type: String,
    description: 'holds the mentors id'
  },
  mentees: {
    type: [
      {
        type: String
      }
    ]
  }
});


module.exports = mongoose.model('Schedule', ScheduleSchema);
