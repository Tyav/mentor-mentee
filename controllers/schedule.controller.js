const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');
const Schedule = require('../models/schedule.model');
const Request = require('../models/request.model');
const { createSchedule } = require('../validations/schedule.validation');
const { Joi } = require('celebrate');
const APIError = require('../helpers/APIError');

exports.load = async (req, res, next, id) => {
  try {
    let schedule = await Schedule.get(id);
    if (schedule) {
      req.schedule = schedule;
      return next();
    }
    return res.json(
      sendResponse(httpStatus.NOT_FOUND, 'Not found', null, {
        schedule: 'Not found'
      })
    );
  } catch (error) {
    next(error);
  }
};
exports.createSchedule = async (req, res, next) => {
  try {
    if (!req.user.isMentor) {
      throw new APIError({
        message: 'Unauthorized User',
        status: httpStatus.UNAUTHORIZED
      });
    }
    const { day, time, slots, isClosed } = req.body;

    const schedule = new Schedule({
      day,
      time: {
        from: time.from,
        to: time.to
      },
      slots,
      isClosed,
      mentor: req.sub
    });

    await schedule.save();

    return res.json(sendResponse(200, 'Schedule Created', schedule));
  } catch (error) {
    next(error);
  }
};

exports.getAllSchedules = async (req, res, next) => {
  try {
    const schedules = await Schedule.getOpenSchedules();
    return res.json(sendResponse(200, 'Success', schedules));
  } catch (error) {
    next(error);
  }
};

exports.getUserSchedules = async (req, res, next) => {
  try {
    //get all schedules for the given mentor
    const schedules = await Schedule.getByUserId(req.sub);

    return res.json(sendResponse(200, 'Success', schedules));
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { schedule } = req;
    if (req.sub !== schedule.mentor) throw new APIError({message: 'Unauthorized', statusCode: httpStatus.UNAUTHORIZED})
    const updated = schedule.update(req.body)
    return res.json(sendResponse(200, 'Success', updated));
  } catch (error) {
    next(error);
  }
};
