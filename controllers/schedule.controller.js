const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');
const ScheduleModel = require('../models/schedule.model');
const { Joi } = require('celebrate');

// i would not be encoding anything, imported ht

exports.createPost = async (req, res) => {
  try {
    const { day, time, slot, isClosed, mentorId, mentees } = req.body;

    const schedule = new ScheduleModel({
      day: day,
      time: {
        from: Date.now(),
        to: Date.now()
      },
      slot: slot,
      isClosed: isClosed,
      mentorId: mentorId,
      mentees: mentees
    });
    schedule.save();
    return res.json(sendResponse(200, 'Schedule Created', schedule, null))
  } catch (error) {
      console.log(error.message)
    next(error);
  }
};
