const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');
const Schedule = require('../models/schedule.model');
const { createSchedule } = require('../validations/schedule.validation');
const { Joi } = require('celebrate');

exports.createSchedule = async (req, res, next) => {
  try {
    const { day, time, slots, isClosed} = req.body;
    const schedule = new Schedule({
      day,
      time: {
        from: time.from,
        to: time.to
      },
      slots,
      isClosed,
      mentor : req.sub
    });

    await schedule.save();

    return res.json(sendResponse(200, 'Schedule Created', schedule, null));
  } catch (error) {
    next(error)
  }
};

exports.getAllSchedules = async (req, res, next) => {
  try {
    const schedules = await Schedule.getOpenSchedules()
    return res.json(sendResponse(200, 'Success', schedules, null))
  } catch (error) {
    next(error)
  }
};
