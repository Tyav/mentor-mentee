const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');
const ScheduleModel = require('../models/schedule.model');
console.log(ScheduleModel, 'hello rukee');
const { Joi } = require('celebrate');

// i would not be encoding anything, imported ht

exports.createPost = async (req, res) => {
  try {
    // const {error}

    const { day, time, slot, isClosed, mentorId, mentees } = req.body;
    console.log(req.body, ' hello');
  } catch (error) {
    next(error);
  }
};
