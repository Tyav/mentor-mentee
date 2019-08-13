const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');
const Request = require('../models/request.model');
const Schedule = require('../models/schedule.model');
const APIError = require('../helpers/APIError');


exports.load = async (req, res, next, id) => {
  try {
    const request = await Request.get(id)
    if (request) {
      req.request = request;
      next()
    }
    return res.json(sendResponse(httpStatus.NOT_FOUND, 'Request not found'))
  } catch (error) {
    
  }
}
exports.create = async (req, res, next) => {
  try {
    const { scheduleId, message } = req.body;
    // check if schedule exist
    const schedule = await Schedule.get(scheduleId);
    if (schedule.isClosed)
      throw new APIError({
        message: 'Sorry, this schedule is not open at the moment',
        status: httpStatus.BAD_REQUEST,
      });
    const request = new Request({
      mentee: req.sub,
      schedule: scheduleId,
      message,
    });
    await request.save();
    res.json(sendResponse(httpStatus.OK, 'Request successfully submitted', request));
  } catch (error) {
    next(
      new APIError({
        message: error.message,
        status: httpStatus.BAD_GATEWAY,
      })
    );
  }
};

exports.getAll = async (req, res, next) => {
  
}