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
      return next();
    }
    return res.json(sendResponse(httpStatus.NOT_FOUND, 'Request not found'));
  } catch (error) {}
};
exports.create = async (req, res, next) => {
  try {
    const { scheduleId, message } = req.body;
    // check if schedule exist
    const schedule = await Schedule.get(scheduleId);
    if (schedule.isClosed)
      throw new APIError({
        message: 'Sorry, this schedule is not open at the moment',
        status: httpStatus.BAD_REQUEST
      });
    const request = new Request({
      mentee: req.sub,
      schedule: scheduleId,
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
  console.log(req.params,'par')
  try {
    //retrieves the request with the given id from the database....
    let request = await Request.get(req.params.id)
    
    request.status = req.query.status

    request.save();
    console.log(request)
  } catch (error) {
    
  }
  // i want to update a request, 
  // now the goal is to scan through the request data base and fetch data from the back end.
  //when if the request exist i set the data = to the incoming request.satus
  //and save it back if it doesn't exist request not found....

  res.send({mess:'hello boo i am reaching you live from update request', query: req.query});
};
