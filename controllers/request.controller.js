const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');
const Request = require('../models/request.model');
const Schedule = require('../models/schedule.model');
const APIError = require('../helpers/APIError');

exports.load = async (req, res, next, id) => {
  try {
    const request = await Request.get(id);
    if (request) {
      req.request = request;
      next();
    }
    return res.json(sendResponse(httpStatus.NOT_FOUND, 'Request not found'));
  } catch (error) {}
};
exports.create = async (req, res, next) => {
  try {
    let { schedule, message } = req.body;
    console.log(schedule)
    // check if schedule exist
    schedule = await Schedule.get(schedule);

    if (schedule.isClosed)
      throw new APIError({
        message: 'Sorry, this schedule is not open at the moment',
        status: httpStatus.BAD_REQUEST
      });
    const request = new Request({
      mentee: req.sub,
      schedule,
      message
    });
    await request.save();
    res.json(
      sendResponse(httpStatus.OK, 'Request successfully submitted', request)
    );
  } catch (error) {
    next(
      new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST
      })
    );
  }
};

exports.getScheduleResquests = async (req, res, next) => {
  try {
    const schedule = req.schedule._id;
    let requests = await Request.getBy({ schedule });
    return res.json(sendResponse(httpStatus.OK, 'Success', requests));
  } catch (error) {
    next(
      new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST
      })
    );
  }
};

exports.getUserRequests = async (req, res, next) => {
  try {
    const mentee = req.sub;
    let requests = await Request.getBy({ mentee });
    return res.json(sendResponse(httpStatus.OK, 'Success', requests));
  } catch (error) {
    next(
      new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST
      })
    );
  }
};

exports.approveRequests = async (req, res, next) => {
  console.log('i came here');
  console.log(req.body);
  res.send('hello boo i am reaching you live from update request');
};
