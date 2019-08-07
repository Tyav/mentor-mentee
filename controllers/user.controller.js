const httpStatus = require('http-status');
const User = require('../models/user.model');
const sendResponse = require('../helpers/response');

/**
 * Load user and append to req.
 */
exports.load = async (req, res, next, id) => {
  try {
    // Load user object from quarystring Id
    return res.json(
      sendResponse(httpStatus.NOT_FOUND, 'No such user exists!', null, null)
    );
  } catch (error) {
    next(error);
  }
};

exports.getUsers = (req, res) => {
  return res.json(sendResponse(200, 'testing', null, null));
};


exports.createScheduleMock = async (req, res) => {
  try {
    const shcedule = new Schedule(req.body);
    const result = await shcedule.save();
    if (!result) {
      return res.json(
        sendResponse(
          httpStatus.INTERNAL_SERVER_ERROR,
          'An error occured submiting schedule'
        )
      );
    }
    return res.json(sendResponse(httpStatus.OK, 'Request submitted'));
  } catch {
    return res.json(sendResponse(httpStatus.NOT_FOUND, 'Something went wrong'));
  }
};

exports.bookSlot = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({
      _id: req.params.scheduleID,
      slots: { $gte: 0 }
    });
    if (!schedule) {
      return res.json(sendResponse(httpStatus.NOT_FOUND, 'Schedule not found'));
    }
    if (schedule.slots < 1) {
      return res.json(
        sendResponse(
          httpStatus.NOT_FOUND,
          'There are no slots available for this schedule'
        )
      );
    }
    const requestMade = await Request.findOne({
      scheduleId: schedule._id,
      menteeId: req.body.menteeId
    });
    if (requestMade) {
      return res.json(
        sendResponse(httpStatus.NOT_FOUND, 'request already made')
      );
    }
    const request = new Request({
      scheduleId: req.params.scheduleID,
      menteeId: req.body.menteeId
    });
    const requestResult = await request.save();
    if (!requestResult) {
      return res.json(
        sendResponse(httpStatus.NOT_FOUND, 'the request was not submitted')
      );
    }
    return res.json(sendResponse(httpStatus.OK, 'Request submitted'));
  } catch {
    return res.json(
      sendResponse(
        httpStatus.INTERNAL_SERVER_ERROR,
        'something went wrong while submitting request'
      )
    );
  }
};
