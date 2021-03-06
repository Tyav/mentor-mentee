const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');
const Request = require('../models/request.model');
const Schedule = require('../models/schedule.model');
const Contact = require('../models/contact.model');
const Idp = require('../models/idp.model');
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
    const { schedule: scheduleId, message, idp: idpId } = req.body;
    // check if schedule exist
    const schedule = await Schedule.get(scheduleId);
    //Check if IDP exist
    const idp = await Idp.get(idpId);
    // check if mentee has already requested
    const requested = await Request.getBy({
      mentee: req.sub,
      schedule: scheduleId,
      status: 'Approved',
    });
    if (requested.length > 0)
      throw new APIError({
        message: 'You have already requested for this slot',
        status: httpStatus.BAD_REQUEST,
      });
    // check if schedule is closed
    if (schedule.isClosed)
      throw new APIError({
        message: 'Sorry, this schedule is not open at the moment',
        status: httpStatus.BAD_REQUEST,
      });
    //Check if IDP is already tied to a request
    if (idp.isTied) {
      throw new APIError({
        message: 'This is IDP is already tied to a request',
        status: httpStatus.BAD_REQUEST,
      });
    }
    // if schedule is instant approval type
    if (schedule.isInstant) {
      let request = {};

      // get count of approved requests
      let requestCount = await Request.countDocuments({
        schedule: scheduleId,
        status: 'Approved',
      });
      // check if approved request has reached schedule slot size

      if (schedule.slots <= requestCount) {
        schedule.isClosed = true;
        await schedule.save();
        return res.json(
          sendResponse(
            httpStatus.NOT_MODIFIED,
            'Maximum approval reached or request is closed',
          ),
        );
      }
      // check if mentor and mentee have a contact
      let contacts = await Contact.getBy({
        mentee: request.mentee,
        mentor: schedule.mentor._id,
      });
      // get contact from array
      let [contact] = contacts;
      if (!contact) {
        // create contact if not existing
        // create mentee request
        idp.isTied = true;
        request = new Request({
          mentee: req.sub,
          schedule: scheduleId,
          idp: idpId,
          message,
          status: 'Approved',
        });
        await idp.save();
        await request.save(); // save request
        contact = new Contact({
          mentee: request.mentee,
          mentor: schedule.mentor._id,
          idp: idpId,
        });
        // messages = 'Contact created';
        contact.schedule = schedule._id.toHexString();
        await contact.save();
        requestCount++;
      }
      //if the req.query.status === approved... create or get a contact and save the request
      // message = 'Mentor is already on your schedule.';
      // increament request count

      //save the contact and the updated request...
      if (schedule.slots <= requestCount) {
        // check if request count is greater than schedule slot
        schedule.isClosed = true; // set schedule to closed
        await schedule.save();
      }
      return res.json(
        sendResponse(httpStatus.OK, 'Request successfully approved', request),
      );
    }

    const request = new Request({
      mentee: req.sub,
      schedule: scheduleId,
      idp: idpId,
      message,
    });
    idp.isTied = true;
    await request.save();
    await idp.save();
    res.json(
      sendResponse(httpStatus.OK, 'Request successfully submitted', request),
    );
  } catch (error) {
    next(
      new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST,
      }),
    );
  }
};

exports.getScheduleRequests = async (req, res, next) => {
  try {
    const schedule = req.schedule._id;
    let requests = [];
    // check if schedule is closed
    if (req.schedule.isClosed)
      return res.json(
        sendResponse(httpStatus.OK, 'The schedule is closed', requests),
      );
    requests = await Request.getBy({ schedule, status: 'Pending' });
    return res.json(sendResponse(httpStatus.OK, 'Success', requests));
  } catch (error) {
    next(
      new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST,
      }),
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
    let requests = await Request.getBy({ mentee, deleted: false });
    return res.json(sendResponse(httpStatus.OK, 'Success', requests));
  } catch (error) {
    next(
      new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST,
      }),
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

    if (
      (schedule.slots <= requestCount || schedule.isClosed) &&
      isApprovedQuery
    ) {
      schedule.isClosed = true;
      await schedule.save();
      return res.json(
        sendResponse(
          httpStatus.NOT_MODIFIED,
          'Maximum approval reached or request is closed',
        ),
      );
    }
    //if the req.query.status === approved... create or get a contact and save the request
    if (isApprovedQuery) {
      message = 'Mentor is already on your schedule.';
      let contacts = await Contact.getBy({
        mentee: request.mentee._id,
        mentor,
      });
      // get contact from array
      let [contact] = contacts;
      if (!contact) {
        contact = new Contact({
          mentee: request.mentee._id,
          mentor,
        });
        message = 'Contact created';
        contact.schedule = schedule._id.toHexString();
      } else {
        req.query.status = 'Rejected';
      }
      await contact.save();
      // increament request count
      requestCount++;
    }

    //save the contact and the updated request...
    request.status = req.query.status; //update the request object with a status of approved
    await request.save();

    if (schedule.slots <= requestCount) {
      schedule.isClosed = true;
      await schedule.save();
    }
    //console.log(request,'after approval')
    return res.json(sendResponse(httpStatus.OK, message, request));
  } catch (error) {
    next(error);
  }
};

exports.deleteRequest = async (req, res) => {
  const request = req.request;
  request.deleted = true;
  await request.save();
  const message = 'Request deleted';
  return res.json(sendResponse(httpStatus.OK, message));
};
