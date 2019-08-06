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
  },

  slot: {
    type: Number,
    description: 'The number of available slots'
  },
  isClosed: {
    type: Boolean,
    default: false,
    description:
      'compares the available slots with the array the number of mentees who have applied'
  },
  mentorId: {
    type: [
      {
        type: String
      }
    ]
  }
});



ScheduleSchema.methods = {
   isClosed = ()=> {return this.slot <= this.mentees.length}
}

console.log(scheduleSchema, 'hello');
