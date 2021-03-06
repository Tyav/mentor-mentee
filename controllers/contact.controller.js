const { Joi } = require('celebrate');
const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');
const Contact = require('../models/contact.model');
const APIError = require('../helpers/APIError');

exports.load = async (req, res, next, id) => {
  try {
    let contact = await Contact.get(id);
    if (contact) {
      req.contact = contact;
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

exports.getUserContacts = async (req, res, next) => {
  try {
    let option = req.user.isMentor ? { mentor: req.sub } : { mentee: req.sub };
    let user = req.user.isMentor ? 'mentee' : 'mentor';
    const userContact = await Contact.getBy(option);
    let contacts = userContact.map(contact => {
      return contact.transform(user);
    });
    return res.json(sendResponse(httpStatus.OK, 'Success', contacts));
  } catch (error) {
    next(
      new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST
      })
    );
  }
};


exports.deleteContact = async (req, res, next) => {
  try {
    const contact = req.contact;
    const {mentee, mentor} = contact;
    req.contact.mentee = `${mentee._id}-${Date.now()}`;
    req.contact.mentor = `${mentor._id}-${Date.now()}`;
    contact.save();

    return res.json(sendResponse(httpStatus.OK, 'Success', contact));
  } catch (error) {
    next(
      new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST
      })
    );
  }
};

