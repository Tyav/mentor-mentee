const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');
const ScheduleModel = require('../models/schedule.model');
const { createSchedule } = require('../validations/schedule.validation');
const { Joi } = require('celebrate');

exports.createSchedule = async (req, res, next) => {
  try {
    const { error } = Joi.validate(req.body, createSchedule.body);

    if (error) {
      console.log('there was an erro');
      return res.json(
        sendResponse(
          httpStatus.BAD_REQUEST,
          'Incorrect email or password',
          null,
          null
        )
      );
    }

    const { day, time, slots, isClosed, mentorId, mentees } = req.body;

    const schedule = new ScheduleModel({
      day: day,
      time: {
        from: time.from,
        to: time.to
      },
      slots: slots,
      isClosed: isClosed,
      mentorId: mentorId,
      mentees: mentees
    });

    await schedule.save();
    console.log('hy');
    return res.json(sendResponse(200, 'Schedule Created', schedule, null));
  } catch (error) {
    console.log(error.message);
  }
};

exports.getAllSchedules = async (req, res) => {
  try {
  } catch (error) {}
};
