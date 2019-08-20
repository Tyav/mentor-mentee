const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');
const Request = require('../models/request.model');
const Schedule = require('../models/schedule.model');
const Contact = require('../models/contact.model');
const APIError = require('../helpers/APIError');

exports.load = async (req, res, next, id) => {
  try {
    const request = await Request.get(id);
    if (request) {
      req.request = request;
      return next();
    }
    return res.json(sendResponse(httpStatus.NOT_FOUND, 'Request not found'));
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { schedule: scheduleId, message } = req.body;
    // check if schedule exist
    const schedule = await Schedule.get(scheduleId);
    // check if mentee has already requested
    const requested = await Request.getBy({
      mentee: req.sub,
      schedule: scheduleId,
    });
    if (requested.length > 0)
      throw new APIError({
        message: 'You have already requested for this slot',
        status: httpStatus.BAD_REQUEST,
      });

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
        status: httpStatus.BAD_REQUEST,
      })
    );
  }
};

exports.getScheduleResquests = async (req, res, next) => {
  try {
    const schedule = req.schedule._id;
    let requests = [];
    // check if schedule is closed
    if (req.schedule.isClosed) return res.json(sendResponse(httpStatus.OK, 'The schedul is closed', requests));
    requests = await Request.getBy({ schedule });
    return res.json(sendResponse(httpStatus.OK, 'Success', requests));
  } catch (error) {
    next(
      new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST,
      })
    );
  }
};

exports.getUserRequests = async (req, res, next) => {
  try {
    if (req.user.isMentor) {
      throw new APIError({
        message: 'Not allowed',
        status: httpStatus.BAD_REQUEST,
      });
    }

    const mentee = req.sub;
    let requests = await Request.getBy({ mentee });
    return res.json(sendResponse(httpStatus.OK, 'Success', requests));
  } catch (error) {
    next(
      new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST,
      })
    );
  }
};

exports.approveRequests = async (req, res, next) => {
  try {
    //retrieves the request with the given id from the database....
    let request = req.request;
    let isApprovedQuery = req.query.status === 'Approved';
    let message = 'Success';
    const { mentor, id = _id } = request.schedule;

    // get schedule to check if schedule is closed
    const schedule = await Schedule.get(id);

    // get count of approved requests
    let requestCount = await Request.countDocuments({
      schedule: id,
      status: 'Approved',
    });
    // check if approved request has reached schedule slot size

    if ((schedule.slots <= requestCount || schedule.isClosed) && isApprovedQuery) {
      schedule.isClosed = true;
      await schedule.save();
      return res.json(sendResponse(httpStatus.NOT_MODIFIED, 'Maximum approval reached or request is closed'));
    }
    //if the req.query.status === approved... create or get a contact and save the request
    if (isApprovedQuery) {
      message = 'Request has already been approved';
      let contacts = await Contact.getBy({
        mentee: request.mentee._id,
        mentor,
      });
      // get contact from array
      let [contact] = contacts;
      if (!contact) { // check if a contact have been created, if not create one
        contact = new Contact({
          mentee: request.mentee._id,
          mentor,
          schedule: [schedule._id],
        });
        message = 'Contact created';
        requestCount++;
      } else { // if contact have been created, check if contact has schedule
        let schedules = [...contact.schedule]; 
        let scheduleResult = schedules.filter(schedul => { 
          // get ids of schedule into array
          return schedul._id.toHexString() == schedule._id.toHexString();
        }); 
        // if id exist, don't push schedule id into array
        if (!scheduleResult.length) { 
          contact.schedule.push(schedule._id.toHexString());
          message = 'Request Approved';
          // increament request count
          requestCount++;
        }
      }
      await contact.save();
    }
    //save the contact and the updated request...
    request.status = req.query.status; //update the request object with a status of approved
    await request.save();

    if (schedule.slots <= requestCount) {// check if schedule slot is less than approved requestCount
      schedule.isClosed = true; // close the schedule
      await schedule.save();
    }
    return res.json(sendResponse(httpStatus.OK, message, request));
  } catch (error) {
    next(error);
  }
};
