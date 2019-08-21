const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');
const Schedule = require('../models/schedule.model');
const Request = require('../models/request.model');
const Contact = require('../models/contact.model')
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
  //FOR MENTEE...
  try {
    let schedules = [];
    const contact = await Contact.getBy({ mentor: req.user._id, mentee: req.sub });
    if (contact.length) {
      // check if mentor and mentee have a contact, mentee should not request if already a contact
      return res.json(sendResponse(200, 'Success', schedules));
    }
    // check if mentor and mentee have a contact, mentee should not request if already a contact
    schedules = await Schedule.getOpenSchedules(req.user._id);
    return res.json(sendResponse(200, 'Success', schedules));
  } catch (error) {
    next(error);
  }
};

exports.getUserSchedules = async (req, res, next) => {
  try {
    if (!req.user.isMentor) {
      throw new APIError({ message: 'Unauthorized', status: httpStatus.UNAUTHORIZED });
    }
    const schedules = await Schedule.getByUserId(req.sub);

    return res.json(sendResponse(200, 'Success', schedules));
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { schedule } = req;
    if (req.sub !== schedule.mentor._id.toString())
      throw new APIError({ message: 'Unauthorized', statusCode: httpStatus.UNAUTHORIZED });
    const updated = await schedule.update(req.body);
    updated.save();
    return res.json(sendResponse(200, 'Success', updated));
  } catch (error) {
    next(error);
  }
};

exports.getAllSchedulesRequests = async (req, res, next) => {
  const { scheduleIds } = req.query;

  const formatQuery = scheduleIds.split(',').reduce((acc, item) => {
    acc.push({ ['schedule']: item });
    return acc;
  }, []);

  try {
    if (!req.user.isMentor) {
      throw new APIError({ message: 'Unauthorized', status: httpStatus.UNAUTHORIZED });
    }

    const requests = await Request.getBy({ $or: formatQuery });
    return res.json(sendResponse(200, 'Success', requests));
  } catch (error) {
    next(error);
  }
};
